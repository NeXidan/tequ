import asyncio
import telepot.aio
from telepot.aio.delegate import (
    per_chat_id, create_open, pave_event_space, include_callback_query_chat_id
)

from config import CONFIG
from bot.bot import TequBot

try:
    bot = telepot.aio.DelegatorBot(
        CONFIG['bot']['token'],
        [
            include_callback_query_chat_id(
                pave_event_space()
            )(
                per_chat_id(types = ['private']),
                create_open,
                TequBot,
                timeout = 10
            )
        ]
    )

    loop = asyncio.get_event_loop()
    loop.create_task(bot.message_loop())

    loop.run_forever()

except KeyboardInterrupt as error:
    pass
