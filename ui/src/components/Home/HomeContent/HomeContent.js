import {Component, Defaults} from 'malanka';

import {Quest} from '../../../models/Quest';

import template from './HomeContent.hbs';
import styles from './HomeContent.css';

@Defaults({
    styles,
    template
})
export class HomeContent extends Component {
    create() {
        return this.model.save().then((quest) => {
            let {router} = this.getEnv();
            router.navigate(router.reverse('quest', {id: quest.getId()}));
        });
    }
}
