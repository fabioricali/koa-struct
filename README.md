<div align="center">
<h1>koa-struct</h1>
Koa struct middleware
<br/><br/>
<a href="https://travis-ci.org/fabioricali/koa-struct" target="_blank"><img src="https://travis-ci.org/fabioricali/koa-struct.svg?branch=master" title="Build Status"/></a>
<a href="https://opensource.org/licenses/MIT" target="_blank"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" title="License: MIT"/></a>
</div>

## Installation

koa-struct requires
- **koa2**
- **koa-body**
- **koa-router**

```
npm install koa-struct --save
```

# Example

#### Basic usage

```javascript
const struct = require('koa-struct');
const body = require('koa-body');
const Router = require('koa-router');
const koa = require('koa');

const app = new koa();
const router = new Router();

app
    .use(body())
    .use(struct())
    .use(router.routes())
    .use(router.allowedMethods());

router.post('/user/update', ctx => {

    ctx.struct({
        username: 'string',
        email: 'email',
        age: 'number'
    });

    ctx.body = 'ok';
});

app.listen(3000);
```

#### Validate params
```javascript
router.post('/user/update/:id', ctx => {

    ctx.structParam({
        id: 'number'
    });

    ctx.body = 'ok';
});
```

#### Validate query
```javascript
router.get('/user/?id=255', ctx => {

    ctx.structQuery({
        id: 'number'
    });

    ctx.body = 'ok';
});
```

## Validation
koa-struct uses <a href="https://github.com/fabioricali/valify#readme">Valify</a> to validating data, so consider it for **documentation** and **options**.

#### Valify options

```javascript
// Globals
app.use(struct({
    autoCast: false
));

// Locals
router.post('/user/update', ctx => {
    ctx.struct({
        username: 'string',
        email: 'email',
        age: 'number'
    }, {
        autoCast: false
    });
    ctx.body = 'ok';
});
```

By default `autoCast` is set to true.

For more info **about Valify** <a target="_blank" href="https://github.com/fabioricali/valify">click here</a>

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/fabioricali/koa-struct/blob/master/CHANGELOG.md">here</a>

## License
koa-struct is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Authors
<a target="_blank" href="http://rica.li">Fabio Ricali</a>