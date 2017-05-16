import os
from config import CONFIG

MONGO_HOST = os.environ.get('MONGO_HOST', CONFIG['mongo']['MONGO_HOST'])
MONGO_PORT = os.environ.get('MONGO_PORT', CONFIG['mongo']['MONGO_PORT'])
MONGO_USERNAME = os.environ.get('MONGO_USERNAME', CONFIG['mongo']['MONGO_USERNAME'])
MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD', CONFIG['mongo']['MONGO_PASSWORD'])
MONGO_DBNAME = os.environ.get('MONGO_DBNAME', CONFIG['mongo']['MONGO_DBNAME'])

RESOURCE_METHODS = ['GET', 'POST']
ITEM_METHODS = ['GET', 'PUT', 'PATCH', 'DELETE']

X_DOMAINS = '*'
X_HEADERS = ['Content-Type', 'If-Match', 'Accept']

CACHE_CONTROL = 'max-age=20'
CACHE_EXPIRES = 20

EMBEDDABLE = False

user_states = {
    'item_title': 'user_states',
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'user_id'
    },
    'schema': {
        'user_id': {
            'type': 'integer',
            'required': True,
            'unique': True
        },
        'quest_state': {
            'type': 'dict',
            'schema': {
                'quest': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'quests',
                        'field': '_id'
                    }
                },
                'current_page': {
                    'type': 'objectid',
                    'data_relation': {
                        'resource': 'quest_pages',
                        'field': '_id'
                    }
                },
                'current_page_message': {
                    'type': 'list'
                },
                'state': {
                    'type': 'dict'
                }
            }
        }
    }
}

quests = {
    'item_title': 'quests',
    'schema': {
        'name': {
            'type': 'string',
            'minlength': 3,
            'maxlength': 32,
            'required': True
        },
        'first_page': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'quest_pages',
                'field': '_id'
            },
            'required': True
        }
    }
}

quest_pages = {
    'item_title': 'quest_pages',
    'schema': {
        'text': {
            'type': 'string',
            'maxlength': 1000
        },
        'image': {
            'type': 'string'
        },
        'actions': {
            'type': 'list',
            'schema': {
                'type': 'dict',
                'schema': {
                    'text': {
                        'type': 'string',
                        'minlength': 1,
                        'maxlength': 100
                    },
                    'to': {
                        'type': 'objectid',
                        'data_relation': {
                            'resource': 'quest_pages',
                            'field': '_id'
                        },
                        'required': True
                    }
                }
            },
            'default': []
        },
        'quest_id': {
            'type': 'objectid',
            'data_relation': {
                'resource': 'quests',
                'field': '_id'
            }
        }
    }
}

DOMAIN = {
    'user_states': user_states,
    'quests': quests,
    'quest_pages': quest_pages
}
