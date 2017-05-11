import {staticResolver, then, createContainer, createMethodFactory, createInstanceFactory} from 'di.js/build/di.es5';

import {ClientRenderer} from './libs/Renderer/ClientRenderer';
import {ClientRequest} from './libs/Request/ClientRequest';

import {diConfig} from './di.config';

let isRestored = false;

let createRestoreFactory = (data) => {
    return ({id, Module}, dependencies) => {
        if (!isRestored && data[id]) {
            return Module.restore(data[id], dependencies);
        }
    }
};

diConfig.factories = [
    createRestoreFactory(diData),
    createMethodFactory(),
    createInstanceFactory()
];

diConfig.resolvers.push(staticResolver({ClientRequest}));
diConfig.dependencies.request = 'ClientRequest';

let di = createContainer(diConfig);

di.put('renderer', new ClientRenderer());

then(di({'env': 'env', router: 'router'}, {di}), ({env, router}) => {
    return router.start().then(event => {
        env.render(event.page, document.body);
        isRestored = true;
    });
});
