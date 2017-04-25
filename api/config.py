from json import load

with open('../config.json') as config_file:
    CONFIG = load(config_file)
