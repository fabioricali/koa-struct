const supertest = require('supertest');
const Koa = require('koa');
const assert = require('assert');
const Router = require('koa-router');
const body = require('koa-body');
const struct = require('../');
let server;
let request;
let app;
let router;

describe('Koa struct', function () {

    this.timeout(5000);

    before(function () {
        app = new Koa();
        router = new Router();
        app
            .use(body())
            .use(struct())
            .use(router.routes())
            .use(router.allowedMethods());
        server = app.listen();
        request = supertest(server);
    });

    after(function () {
        server.close();
    });

    it ('body validation should be ok', function (done) {

        router.post('/my-body', ctx => {
            ctx.struct({
                hello: 'string'
            });
            ctx.body = 'ok';
        });

        request
            .post('/my-body')
            .send({hello: 'world'})
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                done()
            });
    });

    it ('body validation should be ok, with convert', function (done) {

        router.post('/my-body-convert', ctx => {
            ctx.struct({
                hello: {
                    type: 'string',
                    convert: value => `hello ${value}`
                }
            });

            ctx.body = ctx.request.body.hello;
        });

        request
            .post('/my-body-convert')
            .send({hello: 'world'})
            .expect(200)
            .end((err, res) => {
                assert.strictEqual(res.text, 'hello world');
                if (err) throw err;
                done()
            });
    });

    it ('body validation should be fail', function (done) {

        router.post('/my-body-fail', ctx => {
            ctx.struct({
                hello: 'string'
            });
        });

        request
            .post('/my-body-fail')
            .send({})
            .expect(400)
            .end((err, res) => {
                console.log(res.text);
                if (err) throw err;
                done()
            });
    });

    it ('params validation should be ok', function (done) {

        router.get('/my-param/:id/', ctx => {
            ctx.structParam({
                id: 'number'
            });
            ctx.body = 'ok';
        });

        request
            .get('/my-param/255')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                done()
            });
    });

    it ('params validation should be fail', function (done) {

        router.get('/my-param-fail/:id', ctx => {
            ctx.structParam({
                id: 'number'
            });
        });

        request
            .get('/my-param-fail/ciao')
            .expect(400)
            .end((err, res) => {
                console.log(res.text);
                if (err) throw err;
                done()
            });
    });

    it ('query validation should be ok', function (done) {

        router.get('/my-query/', ctx => {
            ctx.structQuery({
                id: 'number'
            });
            ctx.body = 'ok';
        });

        request
            .get('/my-query/?id=255')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                done()
            });
    });

    it ('query validation should be fail', function (done) {

        router.get('/my-query-fail/', ctx => {
            ctx.structQuery({
                id: 'number'
            });
        });

        request
            .get('/my-query-fail/?id=ciao')
            .expect(400)
            .end((err, res) => {
                console.log(res.text);
                if (err) throw err;
                done()
            });
    });

    it ('query validation should be fail, overwrite global autoCast', function (done) {

        router.get('/my-query-fail-2/', ctx => {
            ctx.structQuery({
                id: 'number'
            }, {
                autoCast: false
            });
        });

        request
            .get('/my-query-fail-2/?id=255')
            .expect(400)
            .end((err, res) => {
                console.log(res.text);
                if (err) throw err;
                done()
            });
    });

});