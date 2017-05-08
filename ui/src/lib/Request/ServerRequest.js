import {Prototype} from 'malanka';

import {Request} from './Request';

import got from 'got';

export class ServerRequest extends Request {
    constructor({baseUrl, ...options} = {}) {
        super(options);

        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    request({url, query, headers = {}, method = 'get'} = {}) {
        return got[method](
            this.buildUrl(url, query),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...headers
                },
                json: true
            }
        ).then(response => {
            if (response.statusCode >= 200 && response.statusCode < 210) {
                return response.body;
            }

            throw new Error('Response status was ' + response.statusCode);
        });
    }

    get(options = {}) {
        return this.request({
            method: 'get',
            ...options
        });
    }
}
