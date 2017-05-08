import {Component, Defaults} from 'malanka';

import template from './Quest.hbs';
import styles from './Quest.css';

@Defaults({styles, template})
export class Quest extends Component {
    load() {
        return this.model.fetch();
    }
}
