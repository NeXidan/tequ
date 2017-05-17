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
            require.context('./components', true, /(Header|Content|Sidebar)\.js$/)
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
            content: ['HomeContent', {
                model: 'quest',
                questState: 'questState'
            }]
        }],

        'route:error': ['!BaseLayout', {
            content: 'ErrorContent'
        }],

        'route:quest': ['!BaseLayout', {
            content: ['QuestContent', {
                model: 'quest',
                questState: 'questState'
            }],
            sidebar: ['QuestSidebar', {
                questState: 'questState'
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

        questPages: 'QuestPages',

        quest: ['Quest.fetch', {
            request: 'request',
            pages: 'questPages'
        }],

        // States

        questState: ['QuestState', {
            quest: 'quest'
        }],

        // Infrastructure

        env: ['Environment', {
            renderer: 'renderer',
            router: 'router'
        }],

        router: 'Router'
    }
};
