class Factory {

    applyMiddleware(subject, middlewares) {
        if (middlewares) {
            middlewares.forEach((middlewareConfig) => {
                const middleware = this.buildMiddleware(middlewareConfig);
                middleware.apply(subject);
            });
        }
    }

    buildAdapter(config) {
        const {Adapter} = require('./' + config.path);
        let adapter = new Adapter(config);
        this.applyMiddleware(adapter, config.middleware);
        return adapter;
    }

    buildStrategy(config, adapters) {
        const {Strategy} = require('./' + config.path);
        let strategy = new Strategy(config, adapters);
        this.applyMiddleware(strategy, config.middleware);
        return strategy;
    }

    buildMiddleware(config) {
        const {Middleware} = require('./' + config.path);
        return new Middleware(config);
    }
}

module.exports = {Factory}