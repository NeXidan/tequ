import {Prototype} from 'malanka';

import {AbstractModel} from './AbstractModel'
import {QuestPage} from './QuestPage';

@Prototype({
    url: '/quests'
})
export class Quest extends AbstractModel {
    initialize(data, options = {}) {
        if (!data) {
            let {event: {name, params: {id} = {}} = {}} = options;

            if (name === 'route:quest' && id) {
                this[this.idAttribute] = id;
            }
        }
    }

    getPages() {
        return this._options.pages;
    }

    extractQuestPage(id) {
        let pages = this.getPages();
        return pages.get(id);
    }

    createQuestPage(options) {
        let page = QuestPage.dataFactory(
            {'quest_id': this.getId()},
            {...this._options, ...options}
        );

        let pages = this.getPages();
        pages.add(page);

        return page;
    }

    getFirstPage() {
        let firstPage = this.get('first_page');

        if (firstPage && !(firstPage instanceof QuestPage)) {
            let pages = this.getPages();
            firstPage = pages.addUniqueById(firstPage, {...this._options, depth: 0});

            this.set('first_page', firstPage, {trigger: false});
        }

        return firstPage;
    }
}
