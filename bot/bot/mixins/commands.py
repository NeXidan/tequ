from models.quest import Quest
from .sender import SenderMixin

class CommandsMixin(SenderMixin):
    async def on_command_help(self, *args):
        await self.sender.sendMessage('Here will be my help\n/quests - display all quests')

    async def on_command_quests(self, *args):
        if len(args):
            quest_id, = args
            self.user_state.quest_state = ({
                'quest': Quest({'_id': quest_id}).read()
            })
            return await self.send_current_page()

        # TODO: pagination
        await self.sender.sendMessage(
            'Select quest:\n' + '\n'.join([
                '/quests_{0}'.format(quest.id) for quest in Quest.read_all()
            ])
        )

    async def on_command_repeat(self, *args):
        await self.send_current_page()
