import {Prototype} from 'malanka';
import di from 'di.js';

import {AbstractModel} from './AbstractModel';
import {Action} from './Action';
import {Actions} from '../collections/Actions';

@Prototype({
    url: '/quest_pages'
})
export class QuestPage extends AbstractModel {
    parse(data = {}) {
        if (data.actions && !(data.actions instanceof Actions)) {
            let actions = new Actions(
                data.actions.map(
                    (action) => new Action({_from: this, ...action}, this._options)
                ),
                this._options
            );

            return {...data, actions};
        }

        return data;
    }

    getActions() {
        let actions = this.get('actions');

        if (!actions) {
            actions = new Actions([], this._options);
            this.set('actions', actions, {trigger: false});
        }

        return actions;
    }

    addAction(to) {
        let actions = this.getActions();
        return actions.add(new Action({_from: this, to}, this._options));
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

    remove(...args) {
        if (this.getDepth() === 0) {
            return Promise.reject("Cannot remove first page");
        }

        let actions = this.getActions();
        return Promise.all(actions.map((action) => action.remove({save: false})))
            .then(() => super.remove(...args));
    }

    serialize() {
        return this[this.idAttribute];
    }
}
