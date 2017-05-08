import {Prototype} from 'malanka';
import {AbstractModel} from './AbstractModel'

@Prototype({
    url: '/quests'
})
export class Quest extends AbstractModel {
    initialize(data, options = {}) {
        if (!data) {
            let {event: {name, params: {id} = {}} = {}} = options;

            if (name === 'quests' && id) {
                this[this.idAttribute] = id;
            }
        }
    }
}
