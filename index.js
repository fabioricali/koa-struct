const Validator = require('valify');
const defaulty = require('defaulty');

const defaultGlobals = {
    autoCast: true,
    appendToError: {
        status: 400,
        expose: true
    }
};

module.exports = function (globals = {}) {

    defaulty(globals, defaultGlobals);

    return async function (ctx, next) {

        globals.appendToError.request = {
            method: ctx.request.method,
            url: ctx.request.url,
            header: ctx.request.header,
            body: ctx.request.body,
            query: ctx.request.query
        };

        ctx.struct = (model, opt = {}) => {
            defaulty(opt, globals);
            return new Validator(model, opt)(ctx.request.body);
        };

        ctx.structParam = (model, opt = {}) => {
            defaulty(opt, globals);
            return new Validator(model, opt)(ctx.params);
        };

        ctx.structQuery = (model, opt = {}) => {
            defaulty(opt, globals);
            const query = Object.assign({}, ctx.request.query);
            return new Validator(model, opt)(query);
        };

        await next();
    }

};