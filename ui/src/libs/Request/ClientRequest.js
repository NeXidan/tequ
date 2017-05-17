import {Prototype} from 'malanka';

import {Request} from './Request';

@Prototype({
    baseUrl: '/api'
})
export class ClientRequest extends Request {
    request({url, query, body, data, headers = {}, method = 'get'} = {}) {
        return window.fetch(
            this.buildUrl(url, query),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...headers
                },
                method, body, data
            }
        ).then((response) => {
            if (response.status >= 200 && response.status < 210) {
                if (response.statusText === 'NO CONTENT') {
                    return;
                }

                return response.json();
            }

            throw new Error('Response status was ' + response.status);
        });
    }

    get(options = {}) {
        return this.request({
            method: 'get',
            ...options
        });
    }

    post({data, ...options} = {}) {
        return this.request({
            method: 'post',
            body: JSON.stringify(data),
            ...options
        });
    }

    put({data, ...options} = {}) {
        return this.request({
            method: 'put',
            body: JSON.stringify(data),
            ...options
        });
    }

    patch({data, ...options} = {}) {
        return this.request({
            method: 'patch',
            body: JSON.stringify(data),
            ...options
        });
    }

    delete(options = {}) {
        return this.request({
            method: 'delete',
            ...options
        });
    }
}
