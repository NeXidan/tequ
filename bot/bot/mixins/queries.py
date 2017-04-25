from models.quest_page import QuestPage
from .sender import SenderMixin

class QueriesMixin(SenderMixin):
    async def on_query_action(self, *args):
        to, = args

        quest_state = self.user_state.get_quest_state()
        quest_state.current_page = QuestPage({'_id': to}).read()
        await self.send_current_page()
