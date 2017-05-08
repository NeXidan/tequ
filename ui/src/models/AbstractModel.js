import {Model, Prototype} from 'malanka';

@Prototype({
    idAttribute: '_id',
    etagAttribute: '_etag'
})
export class AbstractModel extends Model {
    setAttrs(attrs, {parse = true, ...options} = {}) {
        return super.setAttrs(parse ? this.parse(attrs) : attrs, options);
    }

    _request({method = 'get', ...options} = {}) {
        let request = this.getRequest();

        let url = this._prepareUrl();
        let headers = {};

        let etag = this[this.etagAttribute];
        if (etag) {
            headers['If-Match'] = etag;
        }

        return request[method]({url, headers, ...options})
    }

    fetch({query, ...options} = {}) {
        return this._request({query}).then((data) => {
            this.setAttrs(data, options);
            return this;
        });
    }

    save(options = {}) {
        let data = this.toJSON();
        let method = data[this.idAttribute] ? 'put' : 'post';

        return this._request({method, data}).then((data) => {
            this.setAttrs(data, options);
            return this;
        });
    }

    remove() {
        return this._request({method: 'delete'}).then(() => {
            this.set(this.idAttribute, null);
            this.channel('remove').emit(this);
        });
    }
}
