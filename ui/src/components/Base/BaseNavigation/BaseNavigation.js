import {Component, Defaults} from 'malanka';

import template from './BaseNavigation.hbs';
import styles from './BaseNavigation.css';

@Defaults({
    styles,
    template,

    links: [
        {title: 'Create quest', route: 'route:home'}
    ]
})
export class BaseNavigation extends Component {

}
