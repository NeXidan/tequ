import {Component, Defaults} from 'malanka';
import {hierarchy, tree} from 'd3-hierarchy';

import template from './QuestPagesTree.hbs';
import styles from './QuestPagesTree.css';

const DIMENSION = 100;

@Defaults({
    styles,
    template,
    tagName: 'svg',
    factoryTree: tree().nodeSize([DIMENSION, DIMENSION]),
    _tree: null
})
export class QuestPagesTree extends Component {
    get tree() {
        if (!this._tree) {
            this.refreshTree();
        }

        return this._tree;
    }

    set tree(value) {
        this._tree = value;
    }

    refreshTree() {
        this.tree = this._getTree();
    }

    _setSize({minX, minY, width, height} = {}) {
        this.element.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
        this.element.setAttribute('width', width);
        this.element.setAttribute('height', height);
    }

    _getTree() {
        let root = this.factoryTree(
            hierarchy(this.model.getFirstPage(), (page) => page.getSubPages())
        );

        let leaves = root.leaves();
        let leavesX = leaves.map((leave) => leave.x);
        let leavesY = leaves.map((leave) => leave.y);

        let minX = Math.min(...leavesX);
        let maxX = Math.max(...leavesX);
        let minY = root.x;
        let maxY = Math.max(...leavesY);

        let delta = Math.abs(minX);
        this._setSize({
            minX: minX - DIMENSION / 2,
            minY: minY - DIMENSION / 2,
            width: maxX + delta + DIMENSION,
            height: maxY + DIMENSION
        });

        root = root.each((node) => {
            node.expanded = Boolean(
                (node.children && node.children.length)
                || (node.data.actions && node.data.actions.length)
            );
        });

        return {
            nodes: root.descendants(),
            links: root.links()
        };
    }

    loadFirstPage() {
        let firstPage = this.model.getFirstPage();

        if (firstPage) {
            return firstPage.fetch().then(() => {
                let pages = firstPage.getSubPages();
                return Promise.all(pages.map((page) => page.fetch()));
            });
        }

        return Promise.resolve();
    }
}
