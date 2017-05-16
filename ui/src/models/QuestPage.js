import {Prototype} from 'malanka';
import di from 'di.js';

import {AbstractModel} from './AbstractModel';
import {Action} from './Action';
import {Actions} from '../collections/Actions';

@Prototype({
    url: '/quest_pages'
})
export class QuestPage extends AbstractModel {
    parse({actions = [], ...data} = {}) {
        if (actions && !(actions instanceof Actions)) {
            actions = new Actions(
                actions.map(
                    (action) => new Action({_from: this, ...action}, this._options)
                ),
                this._options
            );
        }

        return {...data, actions};
    }

    getActions() {
        return this.get('actions') || [];
    }

    getSubPages() {
        let actions = this.getActions();
        return (actions instanceof Actions) ? actions.getPages() : [];
    }

    getDepth() {
        return this._options.depth;
    }

    toJSON() {
        let actions = this.getActions();

        return {
            ...super.toJSON(),
            actions: actions.map((action) => action.serialize())
        };
    }

    serialize() {
        return this[this.idAttribute];
    }
}
