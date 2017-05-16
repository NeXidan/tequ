import 'source-map-support/register';

import {Router} from 'express';
import bodyParser from 'body-parser';

import {staticController} from './server/controllers/staticController';
import {apiController} from './server/controllers/apiController';
import {diController} from './server/controllers/diController';
import {serverRender} from './server/controllers/serverRender';

export let app = new Router();

app.use('/api/', apiController);
app.use(bodyParser.json());
app.use('/assets/', staticController);
app.use(diController);
app.use(serverRender);
