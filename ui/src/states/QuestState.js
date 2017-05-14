import {Model} from 'malanka';

export class QuestState extends Model {
    sync() {
        let {router} = this.getEnv();
        let page = this.getPage();
        let action = this.getAction();

        router.replace({page, action}, {trigger: false});
    }

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

    get questPage() {
        let page = this.getPage();

        if (!page) {
            return;
        }

        let quest = this.getQuest();
        let pages = quest.getPages();

        return pages.get(page);
    }

    get questAction() {
        let action = this.getAction();

        if (!action) {
            return;
        }

        let id = action.split('-').unshift();
        if (!id) {
            return;
        }

        let quest = this.getQuest();
        let pages = quest.getPages();

        let page = pages.get(id);
        if (!page) {
            return;
        }

        let actions = page.getActions();
        return actions.get(action);
    }

    exchange({page = null, action = null} = {}) {
        if (page !== this.getPage()) {
            this.setPage(page);
        }

        if (action !== this.getAction()) {
            this.setAction(action);
        }

        this.sync();
    }

    updateDependencies({event: {query: {page, action} = {}} = {}} = {}) {
        this.exchange({page, action});
    }
}
