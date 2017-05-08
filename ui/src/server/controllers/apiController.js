import {createProxyServer} from 'http-proxy';
import {config} from '../di.server.js';

const proxy = createProxyServer();

export function apiController(req, res, next) {
    proxy.proxyRequest(req, res, {
        target: config.api.root + req.url,
        ignorePath: true,
    });
}
