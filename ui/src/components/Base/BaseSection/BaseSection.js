import {Component, Defaults} from 'malanka';

import styles from './BaseSection.css';
import template from './BaseSection.hbs';

@Defaults({
    template,
    styles,
    tagName: 'section'
})
export class BaseSection extends Component {

}
