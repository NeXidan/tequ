from telepot import message_identifier
from telepot.exception import TelegramError

CALLBACK_QUERY_SEPARTOR = ':'

class SenderMixin():
    async def send_current_page(self):
        quest_state = self.user_state.get_quest_state()

        current_page = quest_state.get_current_page()
        if current_page is None:
            return await self.on_unknown()

        if not current_page.is_synced():
            current_page = current_page.read()

        current_page_message = quest_state.get_current_page_message()
        if current_page_message is not None:
            try:
                await self.bot.editMessageReplyMarkup(
                    current_page_message,
                    reply_markup = ''
                )
            except TelegramError as error:
                pass

        actions = current_page.get_actions()
        if not len(actions):
            self.user_state.quest_state = None

        msg = await self.sender.sendMessage(
            current_page.get_text(),
            reply_markup = {
                'inline_keyboard': [
                    [{
                        'text': action['text'] if 'text' in action else '',
                        'callback_data': 'action' + CALLBACK_QUERY_SEPARTOR + action['to']
                    }] for action in actions
                 ]
            }
        )

        quest_state.current_page_message = message_identifier(msg)
