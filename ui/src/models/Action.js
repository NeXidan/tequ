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
        return this.get('_from');
    }

    save(...args) {
        let page = this.getFrom();
        return page.save(...args);
    }

    remove({save = true, ...options} = {}) {
        let from = this.getFrom();
        let to = this.getTo();

        this.channel('remove').emit(this);

        return Promise.all([
            save ? from.save(options) : Promise.resolve(),
            to.remove(options)
        ]);
    }
}
