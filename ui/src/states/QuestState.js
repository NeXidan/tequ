import {Model} from 'malanka';

export class QuestState extends Model {
    getEnv() {
        return this._options.env;
    }

    getQuest() {
        return this._options.quest;
    }

    getPage() {
        return this.get('page');
    }

    setPage(page) {
        this.set('page', page);
    }

    getAction() {
        return this.get('action');
    }

    setAction(action) {
        this.set('action', action);
    }

    extractQuestPage(...args) {
        return this.getQuest().extractQuestPage(...args);
    }

    extractAction(action) {
        let id = action.split('-').unshift();
        if (id) {
            let quest = this.getQuest();
            let page = quest.extractQuestPage(id);
            if (page) {
                let actions = page.getActions();
                return actions.get(action);
            }
        }
    }

    exchange({page = null, action = null} = {}) {
        if (page !== this.getPage()) {
            this.setPage(page);
        }

        if (action !== this.getAction()) {
            this.setAction(action);
        }
    }

    updateDependencies({event: {query: {page, action} = {}} = {}} = {}) {
        this.exchange({page, action});
    }
}
