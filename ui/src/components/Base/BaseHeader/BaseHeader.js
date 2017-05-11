import {Component, Defaults} from 'malanka';

import styles from './BaseHeader.css';
import template from './BaseHeader.hbs';

@Defaults({
    template,
    styles,
    tagName: 'header',
    title: 'Tequ'
})
export class BaseHeader extends Component {

}
