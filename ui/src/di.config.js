import {webpackResolver, staticResolver} from 'di.js/build/di.es5';
import {BaseLayout} from './components/Base/BaseLayout/BaseLayout';
import {Environment, Model, Collection} from 'malanka';

export let diConfig = {
    resolvers: [
        webpackResolver([
            require.context('./models', true, /\.js$/),
            require.context('./collections', true, /\.js$/),
            require.context('./states', true, /\.js$/),
            require.context('./libs', true, /\.js$/),
            require.context('./components', true, /(Header|Content)\.js$/)
        ]),
        staticResolver({
            BaseLayout,
            Environment,
            Collection,
            Model
        })
    ],
    dependencies: {
        // routes

        'route:home': ['!BaseLayout', {
            content: 'HomeContent'
        }],

        'route:error': ['!BaseLayout', {
            content: 'ErrorContent'
        }],

        'route:quest': ['!BaseLayout', {
            content: ['QuestContent', {
                model: 'quest'
            }],
            header: ['QuestHeader', {
                model: 'quest'
            }]
        }],

        // Pages

        BaseLayout: {
            env: 'env',
            header: 'BaseHeader'
        },

        // Components

        // Data models & collections

        quest: ['Quest.fetch', {
            request: 'request'
        }],

        // States

        // Infrastructure

        env: ['Environment', {
            renderer: 'renderer',
            router: 'router'
        }],

        router: 'Router'
    }
};