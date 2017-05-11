import {Collection, Prototype} from 'malanka';

import {Action} from '../models/Action';

@Prototype({
    Model: Action
})
export class Actions extends Collection {
    getPages() {
        return this.map((action) => action.getPage());
    }
}
