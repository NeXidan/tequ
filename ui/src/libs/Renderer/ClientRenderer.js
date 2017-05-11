import {DomRenderer} from 'malanka/es5/Renderer/DomRenderer';

import svg from './svg.json';

export class ClientRenderer extends DomRenderer {
    createElement(tagName) {
        if (svg.elements.indexOf(tagName) !== -1) {
            return document.createElementNS(svg.namespaceURI, tagName);
        }

        return super.createElement(tagName);
    }
}
