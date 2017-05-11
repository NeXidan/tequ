import {Prototype} from 'malanka';
import {AbstractRequest} from 'malanka/es5/Request/AbstractRequest';

@Prototype({
    baseUrl: ''
})
export class Request extends AbstractRequest {
    buildUrl(url, query) {
        if (!url.match(/^https?:/)) {
            url = this.baseUrl + url;
        }

        return super.buildUrl(url, query);
    }

    request() {
        return Promise.resolve();
    }

    get(options) {
        throw new Error('GET is not implemented!');
    }

    post(options) {
        throw new Error('POST is not implemented!');
    }

    put(options) {
        throw new Error('PUT is not implemented!');
    }

    delete(options) {
        throw new Error('DELETE is not implemented!');
    }
}
