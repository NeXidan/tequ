import {Component, Defaults} from 'malanka';

import template from './QuestPageEdit.hbs';
import styles from './QuestPageEdit.css';

@Defaults({
    styles,
    template,
    tagName: 'table'
})
export class QuestPageEdit extends Component {
    onRender() {
        if (!this._firstRendered) {
            this.listenTo(this.questState.channel('change:page'), () => this.render());
        }

        this._firstRendered = true;
    }

    get model() {
        let page = this.questState.getPage();
        return this.questState.extractQuestPage(page);
    }
}
