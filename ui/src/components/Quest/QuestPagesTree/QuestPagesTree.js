import {Component, Defaults, ValueProxy} from 'malanka';
import {hierarchy, tree} from 'd3-hierarchy';
import {forceSimulation, forceLink, forceCollide, forceX, forceY} from 'd3-force';

import template from './QuestPagesTree.hbs';
import styles from './QuestPagesTree.css';

const DISTANCE = 100;

function linkArc(d) {
    let dx = d.target.x - d.source.x;
    let dy = d.target.y - d.source.y;
    let dr = Math.sqrt(dx * dx + dy * dy);

    return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
}

@Defaults({
    styles,
    template,
    tagName: 'svg',
    events: {
        'click': 'onClick'
    },
    _simulation: forceSimulation()
        .force(
            'link',
            forceLink()
                .id(({data} = {}) => {
                    return data.getId();
                })
                .distance(DISTANCE)
        )
        .force('collision', forceCollide(DISTANCE / 2))
        .force('x-axis', forceX())
        .force('y-axis', forceY((node) => {
            return node.data.getDepth() * DISTANCE;
        }))
})
export class QuestPagesTree extends Component {
    onRender() {
        this._initSimulation();
        this.onActiveNodeChange();

        if (!this._firstRendered) {
            let pages = this.model.getPages();
            let fetchQuestPages = pages.channel('fetch');
            this.listenTo(fetchQuestPages, (page) => {
                let subPages = page.getSubPages();
                this.refreshSimulation([page, ...subPages]);
            });

            let changePageQuestState = this.questState.channel('change:page');
            this.listenTo(changePageQuestState, this.onActiveNodeChange.bind(this));

            let changeActionQuestState = this.questState.channel('change:action');
            this.listenTo(changeActionQuestState, this.onActiveNodeChange.bind(this));

            this._simulation.on('tick', this.simulationTick.bind(this));
        }

        this._firstRendered = true;
    }

    onClick({target} = {}) {
        let classList = target.classList;
        let id = target.getAttribute('id');

        if (id) {
            if (classList.contains(styles.node)) {
                let pages = this.model.getPages();
                let page = pages.get(id);

                if (page && !page.isFetched()) {
                    return page.fetch();
                } else {
                    return this.questState.exchange({page: id});
                }
            }

            if (classList.contains(styles.link)) {
                return this.questState.exchange({action: id});
            }
        }

        this.questState.exchange();
    }

    onActiveNodeChange() {
        let renderer = this.getRenderer();

        for (let className of [styles.node, styles.link]) {
            let elements = this.element.getElementsByClassName(className);
            for (let element of elements) {
                renderer.setAttribute(element, 'filter', null);
            }
        }

        let id = this.questState.getPage() || this.questState.getAction();
        if (id) {
            let nodeElement = this.element.getElementById(id);
            if (nodeElement) {
                renderer.setAttribute(nodeElement, 'filter', 'url(#glow)');
            }
        }
    }

    _setSize({minX, minY, width, height} = {}) {
        this.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
        this.setAttribute('width', width);
        this.setAttribute('height', height);
    }

    _initSimulation() {
        let pages = this.model.getPages();
        this.refreshSimulation(pages, {reset: true});
    }

    refreshSimulation(pages = [], {reset = false} = {}) {
        let renderer = this.getRenderer();


        let nodes = this.addNodes(pages, {reset});
        let nodesContainer = this.element.getElementById('nodes-container');

        if (reset) {
            renderer.clear(nodesContainer);
        }

        for (let {data} of nodes) {
            let nodeElement = renderer.createElement('circle');
            renderer.setAttribute(nodeElement, 'id', data.getId());
            renderer.setAttribute(nodeElement, 'r', 10);
            renderer.setAttribute(nodeElement, 'class', styles.node);

            renderer.append(nodesContainer, nodeElement);
        }


        let links = this.addLinks(pages, {reset});
        let linksContainer = this.element.getElementById('links-container');

        if (reset) {
            renderer.clear(linksContainer);
        }

        for (let {data} of links) {
            let linkElement = renderer.createElement('path');
            renderer.setAttribute(linkElement, 'id', data.getId());
            renderer.setAttribute(linkElement, 'marker-end', 'url(#arrow)');
            renderer.setAttribute(linkElement, 'class', styles.link);

            renderer.append(linksContainer, linkElement);
        }

        this.simulationTick();
    }

    simulationTick() {
        let renderer = this.getRenderer();

        let nodes = this._simulation.nodes() || [];
        for (let node of nodes) {
            let nodeElement = this.element.getElementById(node.data.getId());

            if (nodeElement) {
                renderer.setAttribute(nodeElement, 'transform', `translate(${node.x}, ${node.y})`);
                renderer.setAttribute(
                    nodeElement,
                    'class',
                    [
                        styles.node,
                        node.data.isFetched() ? styles.expanded : undefined,

                    ].filter(Boolean).join(' ')
                );
            }
        }

        let links = this._simulation.force('link').links() || [];
        for (let link of links) {
            let linkElement = this.element.getElementById(link.data.getId());
            if (linkElement) {
                renderer.setAttribute(linkElement, 'd', linkArc(link));
            }
        }

        let nodesX = nodes.map((node) => node.x);
        let nodesY = nodes.map((node) => node.y);

        let minX = Math.min(...nodesX);
        let maxX = Math.max(...nodesX);
        let minY = Math.min(...nodesY);
        let maxY = Math.max(...nodesY);

        let delta = Math.abs(minX);
        this._setSize({
            minX: minX - DISTANCE,
            minY: minY - DISTANCE,
            width: maxX + delta + DISTANCE * 2,
            height: maxY + DISTANCE * 2
        });
    }

    addNodes(pages = [], {reset = false} = {}) {
        let simulationNodes = this._simulation.nodes();
        let nodes = pages
            .map((page) => {
                let node = simulationNodes.find((node) => node.data === page);

                if (!node) {
                    return {
                        data: page,
                        y: page.getDepth() * DISTANCE,
                        x: 0
                    };
                }
            })
            .filter(Boolean);

        this._simulation.nodes([
            ...(!reset ? simulationNodes : []),
            ...nodes
        ]);

        return nodes;
    }

    addLinks(pages = [], {reset = false} = {}) {
        let nodes = this._simulation.nodes() || [];

        let links = pages.reduce((aggregator, page) => {
            let actions = page.getActions();

            if (actions && actions.length) {
                return [...aggregator, ...actions.map((action) => {
                    let from = action.getFrom();
                    let to = action.getTo();

                    let source = nodes.find((node) => node.data === from);
                    let target = nodes.find((node) => node.data === to);

                    return {
                        data: action,
                        source,
                        target
                    };
                })];
            }

            return aggregator;
        }, []);

        let link = this._simulation.force('link');
        link.links([
            ...(!reset ? link.links() : []),
            ...links
        ]);

        return links;
    }

    loadFirstPage() {
        let firstPage = this.model.getFirstPage();

        if (firstPage) {
            return firstPage.fetch().then(() => {
                let pages = firstPage.getSubPages();
                return Promise.all(pages.map((page) => {
                    return page.fetch();
                }));
            });
        }

        return Promise.resolve();
    }
}
