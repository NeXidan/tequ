import {Component, Defaults} from 'malanka';

import template from './QuestPagesTreeNode.hbs';
import styles from './QuestPagesTreeNode.css';

@Defaults({
    styles,
    template,
    tagName: 'g'
})
export class QuestPagesTreeNode extends Component {
    constructor({node: {data, x, y} = {}, ...options} = {}) {
        super({
            model: data,
            attributes: {
                transform: `translate(${x}, ${y})`
            },
            ...options
        });
    }
}
