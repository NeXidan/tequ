import requests

from .abstract import AbstractCRUD
from .quest_page import QuestPage
from libs.utils import filter_none

class Quest(AbstractCRUD):
    base_url = AbstractCRUD.base_url + 'quests/'

    def get_name(self):
        return self.get('name')

    def get_first_page(self):
        first_page = self.get('first_page')

        if first_page is not None and type(first_page) is not QuestPage:
            first_page = self.first_page = QuestPage({'_id': first_page})

        return first_page

    def serialize(self):
        return filter_none({
            'name': self.get_name(),
            'first_page': self.get_first_page().serialize()
        })

    @classmethod
    def read_all(cls):
        response = requests.get(cls.base_url)
        return [cls(data) for data in cls.parse(response)]
