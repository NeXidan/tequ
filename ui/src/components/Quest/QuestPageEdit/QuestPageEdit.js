import {Component, Defaults} from 'malanka';

import template from './QuestPageEdit.hbs';
import styles from './QuestPageEdit.css';

@Defaults({
    styles,
    template
})
export class QuestPageEdit extends Component {
    initialize() {
        console.log(this.model);
    }
}
