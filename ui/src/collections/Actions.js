import {Collection, Prototype} from 'malanka';

import {Action} from '../models/Action';

@Prototype({
    Model: Action
})
export class Actions extends Collection {
    get(id) {
        let idAttribute = Action.prototype.idAttribute;
        return this.find((action) => action[idAttribute] === id);
    }

    getPages() {
        return this.map((action) => action.getTo());
    }
}
