import 'source-map-support/register';

import express from 'express';
import bodyParser from 'body-parser';

import {diController} from './server/controllers/diController';
import {serverRender} from './server/controllers/serverRender';

export let app = new express.Router();

app.use(bodyParser.json());
app.use('/assets', express.static('assets'));
app.use(diController);
app.use(serverRender);
