import {Component, Defaults, ValueProxy} from 'malanka';

import template from './Textarea.hbs';
import styles from './Textarea.css';

@Defaults({
    template,
    styles,
    tagName: 'textarea',
    events: {
        'input': 'onInput'
    }
})
export class Textarea extends Component {
    constructor({value, model, name, ...options}) {
        super({
            value: value ? value :  ValueProxy.fromModel(model, name),
            ...options
        });
    }

    onInput() {
        this.value.setValue(this.element.value);
    }
}
