from .abstract import AbstractCRUD
from libs.utils import filter_none

class QuestPage(AbstractCRUD):
    base_url = AbstractCRUD.base_url + 'quest_pages/'

    def get_text(self):
        return self.get('text')

    def get_image(self):
        return self.get('image')

    def get_actions(self):
        actions = self.get('actions')

        if actions is None:
            actions = self.actions = []

        return actions

    def get_quest_id(self):
        return self.get('quest_id')

    def serialize(self):
        return filter_none({
            'text': self.get_text(),
            'image': self.get_image(),
            'actions': self.get_actions(),
            'quest_id': self.get_quest_id()
        })
