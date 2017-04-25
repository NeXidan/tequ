import requests
from abc import ABC, abstractmethod
from json import dumps

from config import CONFIG

URL_PATTERN = '{protocol}://{host}:{port}/'

class AbstractSerializable(ABC):
    def __init__(self, data = {}):
        super(AbstractSerializable, self).__init__()
        self.set(data)

    @abstractmethod
    def serialize(self):
        pass

    def set(self, data):
        if data:
            for key in data:
                self[key] = data[key]
        return self

    def get(self, key):
        if hasattr(self, key):
            return self[key]

    def __getitem__(self, key):
        return getattr(self, key)

    def __setitem__(self, key, value):
        return setattr(self, key, value)


class AbstractCRUD(AbstractSerializable):
    base_url = URL_PATTERN.format(
        protocol = CONFIG['api']['protocol'],
        host = CONFIG['api']['host'],
        port = CONFIG['api']['port']
    )

    def is_new(self):
        return not hasattr(self, '_id')

    @property
    def id(self):
        return self.get('_id')

    @property
    def etag(self):
        return self.get('_etag')

    @property
    def url(self):
        return self.__class__.base_url + str(self.id) + '/'

    def create(self):
        response = requests.post(self.__class__.base_url, dumps(self.serialize()), headers = {
            'Content-Type': 'application/json'
        })

        return self.set(
            self.__class__.parse(response, force_keys = ['_id', '_etag'])
        )

    def read(self):
        response = requests.get(self.url)

        if response.status_code == 404:
            raise

        return self.set(
            self.__class__.parse(response, ignore_keys = ['_links', '_created', '_updated'])
        )

    def update(self):
        response = requests.post(self.url, dumps(self.serialize()), headers = {
            'Content-Type': 'application/json',
            'If-Match': self.etag
        })

        return self.set(
            self.__class__.parse(response, force_keys = ['_id', '_etag'])
        )

    def delete(self):
        response = requests.delete(self.url, headers = {
            'If-Match': self.etag
        })

        if response.status_code == 200:
            del self['_id']

    @classmethod
    def parse(cls, response, ignore_keys = [], force_keys = []):
        if response.status_code == 200 or response.status_code == 201:
            responseJSON = response.json()

            if '_items' in responseJSON.keys():
                return [
                    cls.parseOne(
                        item,
                        ignore_keys = ignore_keys,
                        force_keys = force_keys
                    ) for item in responseJSON['_items']
                ]

            return cls.parseOne(
                responseJSON,
                ignore_keys = ignore_keys,
                force_keys = force_keys
            )

    @staticmethod
    def parseOne(data, ignore_keys = [], force_keys = []):
        if '_status' not in data.keys() or data['_status'] == 'OK':
            if (len(ignore_keys)):
                for ignore_key in set(ignore_keys) - set(data):
                    del data[ignore_key]

            if len(force_keys):
                return {force_key: data[force_key] for force_key in force_keys}

            return data
