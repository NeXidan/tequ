import {Component, Defaults} from 'malanka';

import template from './ActionEdit.hbs';
import styles from './ActionEdit.css';

@Defaults({
    styles,
    template,
    tagName: 'table'
})
export class ActionEdit extends Component {
    onRender() {
        if (!this._firstRendered) {
            this.listenTo(this.questState.channel('change:action'), () => this.render());
        }

        this._firstRendered = true;
    }

    get model() {
        let action = this.questState.getAction();
        return this.questState.extractAction(action);
    }
}
