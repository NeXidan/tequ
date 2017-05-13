import {Prototype} from 'malanka';

import {AbstractModel} from './AbstractModel'
import {QuestPage} from './QuestPage';

export class Action extends AbstractModel {
    get _id() {
        let to = this.getTo();
        let from = this.getFrom();
        return `${from.getId()}-${to.getId()}`;
    }

    getPages() {
        return this._options.pages;
    }

    getTo() {
        let to = this.get('to');

        if (to && !(to instanceof QuestPage)) {
            let pages = this.getPages();
            to = pages.addUniqueById(to, {
                ...this._options,
                depth: this.getFrom().getDepth() + 1
            });

            this.set('to', to, {trigger: false});
        }

        return to;
    }

    getFrom() {
        return this.get('from');
    }
}
