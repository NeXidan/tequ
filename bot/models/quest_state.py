from .abstract import AbstractSerializable
from .quest import Quest
from .quest_page import QuestPage
from libs.utils import filter_none

class QuestState(AbstractSerializable):
    def get_quest(self):
        quest = self.get('quest')

        if quest is not None and type(quest) is not Quest:
            quest = self.quest = Quest({'_id': quest})

        return quest

    def get_current_page(self):
        current_page = self.get('current_page')

        if current_page is None and self.get_quest() is not None:
            current_page = self.current_page = self.get_quest().get_first_page()

        if current_page is not None and type(current_page) is not QuestPage:
            current_page = self.current_page = QuestPage({'_id': current_page})

        return current_page

    def get_current_page_message(self):
        current_page_message = self.get('current_page_message')

        if current_page_message is not None and type(current_page_message) is list:
            current_page_message = self.current_page_message = tuple(current_page_message)

        return current_page_message

    def serialize(self):
        return filter_none({
            'quest': self.get_quest().id
                if self.get_quest() is not None else None,
            'current_page': self.get_current_page().id
                if self.get_current_page() is not None else None,
            'current_page_message': list(self.get_current_page_message())
                if self.get_current_page_message() is not None else None
        })
