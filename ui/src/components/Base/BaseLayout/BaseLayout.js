import {Defaults} from 'malanka';
import {DiComponent} from '../../DiComponent';

import template from './BaseLayout.hbs';
import styles from './BaseLayout.css';

@Defaults({
    template,
    styles,
    tagName: 'body'
})
export class BaseLayout extends DiComponent {

}
