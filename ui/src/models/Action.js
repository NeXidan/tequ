import {Prototype} from 'malanka';

import {AbstractModel} from './AbstractModel'
import {QuestPage} from './QuestPage';

export class Action extends AbstractModel {
    getPage() {
        let to = this.get('to');

        if (to && !(to instanceof QuestPage)) {
            to = new QuestPage({_id: to}, this._options);
            this.set('to', to, {trigger: false});
        }

        return to;
    }
}
