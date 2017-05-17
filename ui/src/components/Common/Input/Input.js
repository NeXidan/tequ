import {Component, Defaults, ValueProxy} from 'malanka';

import styles from './Input.css';

@Defaults({
    styles,
    tagName: 'input',
    events: {
        'input': 'onInput'
    }
})
export class Input extends Component {
    constructor({value, model, name, ...options}) {
        super({
            value: value ? value : ValueProxy.fromModel(model, name),
            ...options
        });
    }

    onInput() {
        this.value.setValue(this.element.value);
    }
}
