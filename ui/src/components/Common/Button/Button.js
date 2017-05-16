import {Component, Defaults} from 'malanka';

import template from './Button.hbs';
import styles from './Button.css';

@Defaults({
    template,
    styles,
    tagName: 'button',
    events: {
        'click': 'onClick'
    }
})
export class Button extends Component {
    onClick() {
        this.model[this.method]();
    }
}
