from telepot import message_identifier, glance, flavor
from telepot.aio.helper import UserHandler

from models.user_state import UserState
from .mixins.commands import CommandsMixin
from .mixins.queries import QueriesMixin

COMMAND_PREFIX = '/'
COMMAND_ARGS_SEPARATOR = '_'
CALLBACK_QUERY_SEPARTOR = ':'

class TequBot(UserHandler, CommandsMixin, QueriesMixin):
    def __init__(self, *args, **kwargs):
        super(TequBot, self).__init__(*args, **kwargs)
        self.user_state = UserState.factory_by_id(self.user_id)

    async def on_chat_message(self, msg):
        text = msg['text']
        if text.startswith(COMMAND_PREFIX):
            command, *command_args = text[len(COMMAND_PREFIX):].split(COMMAND_ARGS_SEPARATOR)

            if hasattr(self, 'on_command_' + command):
                return await getattr(self, 'on_command_' + command)(*command_args)

        await self.on_unknown();

    async def on_callback_query(self, msg):
        query_id, from_id, query_data = glance(msg, flavor = 'callback_query')

        query_command, *query_args = query_data.split(CALLBACK_QUERY_SEPARTOR)

        if hasattr(self, 'on_query_' + query_command):
            return await getattr(self, 'on_query_' + query_command)(*query_args)

        await self.on_unknown();

    async def on_unknown(self):
        await self.sender.sendMessage('I\'m sorry, i\'m afraid i can\'t do that')

    def on_close(self, ex):
        self.user_state.update()
