import {Prototype} from 'malanka';

import {AbstractModel} from './AbstractModel';
import {Actions} from '../collections/Actions';

@Prototype({
    url: '/quest_pages'
})
export class QuestPage extends AbstractModel {
    getActions() {
        let actions = this.get('actions');

        if (actions && !(actions instanceof Actions)) {
            actions = new Actions(actions, this._options);
            this.set('actions', actions, {trigger: false});
        }

        return actions;
    }

    getSubPages() {
        let actions = this.getActions();
        return (actions instanceof Actions) ? actions.getPages() : [];
    }

    serialize() {
        return this[this.idAttribute];
    }
}
