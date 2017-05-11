import {Component, Defaults} from 'malanka';

import template from './QuestContent.hbs';
import styles from './QuestContent.css';

@Defaults({
    styles,
    template,
    events: {
        mousemove: 'onMousemove',
        mousedown: 'onMousedown',
        mouseup: 'onMouseup'
    },
    _dragging: false,
    _position: {
        pageX: 0,
        pageY: 0
    }
})
export class QuestContent extends Component {
    onMousemove({pageX, pageY} = {}) {
        if (this._dragging) {
            this.element.scrollLeft += this._position.pageX - pageX;
            this.element.scrollTop += this._position.pageY - pageY;

            this._setPosition(pageX, pageY);
        }
    }

    onMousedown({pageX, pageY} = {}) {
        this._dragging = true
        this._setPosition(pageX, pageY);
    }

    onMouseup(event) {
        this._dragging = false;
    }

    _setPosition(pageX, pageY) {
        this._position.pageX = pageX;
        this._position.pageY = pageY;
    }
}
