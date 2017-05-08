import {webpackResolver} from 'di.js/build/di.es5';

export let config = {
    resolvers: [
        webpackResolver([
            require.context('./', true, /\.js$/)
        ])
    ],
    dependencies: {

    },
    api: {
        root: 'http://127.0.0.1:5000'
    }
};
