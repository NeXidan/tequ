from .abstract import AbstractCRUD
from .quest_state import QuestState
from .quest import Quest
from libs.utils import filter_none

class UserState(AbstractCRUD):
    base_url = AbstractCRUD.base_url + 'user_states/'

    def get_user_id(self):
        return self.get('user_id')

    def get_quest_state(self):
        quest_state = self.get('quest_state')

        if quest_state is None:
            quest_state = self.quest_state = {}

        if quest_state is not None and type(quest_state) is not QuestState:
            quest_state = self.quest_state = QuestState(quest_state)

        return quest_state

    def serialize(self):
        return filter_none({
            'user_id': self.get_user_id(),
            'quest_state': self.get_quest_state().serialize()
        })

    @property
    def url(self):
        if self.is_new():
            user_id = self.get_user_id()
            if user_id is not None:
                return self.base_url + str(user_id) + '/'

        return self.base_url + str(self.id) + '/'

    @staticmethod
    def factory_by_id(user_id):
        user = UserState({'user_id': user_id})

        try:
            return user.read()
        except:
            return user.create()
