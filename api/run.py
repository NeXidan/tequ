import os
from eve import Eve
from auth import TequAuth
from config import CONFIG

if 'PORT' in os.environ:
    port = int(os.environ.get('PORT'))
    host = '0.0.0.0'
else:
    port = CONFIG['api']['port']
    host = CONFIG['api']['host']

app = Eve(auth = TequAuth)
app.run(host = host, port = port, debug = True)
