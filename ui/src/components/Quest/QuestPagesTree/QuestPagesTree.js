import {Component, Defaults} from 'malanka';
import {forceSimulation, forceLink, forceCollide, forceX, forceY} from 'd3-force';

import {QuestPage} from '../../../models/QuestPage';

import template from './QuestPagesTree.hbs';
import styles from './QuestPagesTree.css';

const DISTANCE = 100;
const RADIUS = 10;

function linkArc(d) {
    let dx = d.target.x - d.source.x;
    let dy = d.target.y - d.source.y;
    let dr = Math.sqrt(dx * dx + dy * dy);

    return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
}

function isQuestPageId(id) {
    return id.indexOf('-') === -1;
}

@Defaults({
    styles,
    template,
    tagName: 'svg',
    events: {
        mousemove: 'onMousemove',
        mousedown: 'onMousedown',
        mouseup: 'onMouseup'
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
        .force(
            'collision',
            forceCollide(DISTANCE / 2)
        )
        // .force(
        //     'x-axis',
        //     forceX()
        // )
        .force(
            'y-axis',
            forceY((node) => {
                return node.data.getDepth() * DISTANCE;
            }).strength(1)
        )
        .stop(),
    _size: {
        minX: 0, minY: 0, width: 0, height: 0
    },
    _connection: {
        source: null, target: null, link: null
    }
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
                this._simulation.restart();
            });

            let changePageQuestState = this.questState.channel('change:page');
            this.listenTo(changePageQuestState, this.onActiveNodeChange.bind(this));

            let changeActionQuestState = this.questState.channel('change:action');
            this.listenTo(changeActionQuestState, this.onActiveNodeChange.bind(this));

            this._simulation.on('tick', this.simulationTick.bind(this));
        }

        this._simulation.restart();

        this._firstRendered = true;
    }

    destroy() {
        this._simulation.stop();
        super.destroy();
    }

    onMousedown(event = {}) {
        let {target, offsetX, offsetY} = event;
        let id = target.getAttribute('id');

        if (!id) {
            return this.questState.exchange();
        }

        if (!isQuestPageId(id)) {
            this._connection.source = {id};
            return;
        }

        let renderer = this.getRenderer();

        this._connection.link = renderer.createElement('path');
        renderer.setAttribute(this._connection.link, 'class', styles.link);

        let tempContainer = this.element.getElementById('temp-container');
        renderer.append(tempContainer, this._connection.link);

        this._connection.source = {
            x: offsetX + this._size.minX,
            y: offsetY + this._size.minY,
            id
        };

        event.stopPropagation();
    }

    onMousemove({offsetX, offsetY} = {}) {
        if (this._connection.source) {
            this._connection.target = {
                x: offsetX + this._size.minX,
                y: offsetY + this._size.minY
            };

            if (this._connection.link) {
                let renderer = this.getRenderer();
                renderer.setAttribute(this._connection.link, 'd', linkArc(this._connection));
            }
        }
    }

    onMouseup(event = {}) {
        let {source, target, link} = this._connection;
        this._connection = {};

        if (link) {
            let renderer = this.getRenderer();
            let tempContainer = this.element.getElementById('temp-container');
            renderer.clear(tempContainer);
        }

        if (source) {
            let id = event.target.getAttribute('id');
            if (id && source.id === id) {
                return this.setActiveNode(id);
            }

            if (!id || isQuestPageId(id)) {
                let promises = []

                let sourcePage = this.model.extractQuestPage(source.id);

                if (!sourcePage.isFetched()) {
                    promises.push(sourcePage.fetch());
                }

                let targetPage = this.model.extractQuestPage(id);
                if (!targetPage) {
                    targetPage = this.model.createQuestPage({
                        depth: sourcePage.getDepth() + 1
                    });
                    promises.push(targetPage.save());
                }

                return Promise.all(promises).then(() => {
                    let actions = sourcePage.getActions();
                    actions.add({_from: sourcePage, to: targetPage});

                    this.refreshSimulation([sourcePage, targetPage]);
                    this._simulation.restart();

                    return sourcePage.save();
                });
            }
        }
    }

    setActiveNode(id) {
        let isQuestPage = isQuestPageId(id);

        if (isQuestPage) {
            let page = this.model.extractQuestPage(id);

            if (page && !page.isFetched()) {
                return page.fetch();
            } else {
                return this.questState.exchange({page: id});
            }
        }

        if (!isQuestPage) {
            return this.questState.exchange({action: id});
        }
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

    _setSize(size = {}) {
        let {minX, minY, width, height} = size;

        this.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
        this.setAttribute('width', width);
        this.setAttribute('height', height);

        this._size = size;
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
            renderer.setAttribute(nodeElement, 'r', RADIUS);
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

                if (reset) {
                    return node;
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
        let link = this._simulation.force('link');
        let simulationLinks = link.links();

        let links = pages.reduce((aggregator, page) => {
            let actions = page.getActions();

            if (actions && actions.length) {
                return [
                    ...aggregator,
                    ...actions
                        .map((action) => {
                            let link = simulationLinks.find((link) => link.data === action);

                            if (!link) {
                                let from = action.getFrom();
                                let to = action.getTo();

                                let source = nodes.find((node) => node.data === from);
                                let target = nodes.find((node) => node.data === to);

                                return {
                                    data: action,
                                    source,
                                    target
                                };
                            }

                            if (reset) {
                                return link;
                            }
                        }).filter(Boolean)
                ];
            }

            return aggregator;
        }, []);

        link.links([
            ...(!reset ? simulationLinks : []),
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
