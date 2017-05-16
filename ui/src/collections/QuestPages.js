import {Collection, Prototype} from 'malanka';

import {QuestPage} from '../models/QuestPage';

@Prototype({
    Model: QuestPage
})
export class QuestPages extends Collection {
    get(id) {
        let idAttribute = QuestPage.prototype.idAttribute;
        return this.find((page) => page[idAttribute] === id);
    }

    addUniqueById(id, options) {
        let page = this.get(id);

        if (!page) {
            let data = {};
            if (id) {
                let idAttribute = QuestPage.prototype.idAttribute;
                data[idAttribute] = id;
            }
            page = QuestPage.dataFactory(data, options);
            this.add(page);
        }

        return page;
    }

    listenModel(model) {
        super.listenModel(model);

        this.listenTo(model.channel('fetch'), () => {
            this.emitToChannel('fetch', model);
        });
    }

    reduce(...args) {
        return this.models.reduce(...args);
    }
}
