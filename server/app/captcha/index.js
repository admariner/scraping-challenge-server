'use strict';

const Person = require('../../model/person.model'),
    simpleCaptcha = require('simple-captcha'),
    jwt = require('jsonwebtoken'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();
    var captcha = simpleCaptcha.create({width: 250, height: 100});
    captcha.generate();

    // Get
    router.get('/', checkCaptcha, function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('captcha/index', {
            title: 'Captcha',
            persons: persons,
        });

        yield next;
    });

    // Get (captcha form)
    router.get('/form', function * (next) {
        captcha = simpleCaptcha.create({width: 250, height: 100});
        captcha.generate();
        yield this.render('captcha/form', {
            title: 'Captcha',
            captcha: captcha.uri()
        });

        yield next;
    });

    // Post (fill captcha)
    router.post('/solve', function *() {
       const auth = this.request.body;

        if (auth.captcha === captcha.text()) {
            const token = sign({
                captcha: auth.captcha,
            });

            this.cookies.set('token', token);

            return this.redirect('/captcha');
        }
        else {
            return this.redirect('/captcha/form');
        }
    });

    return router.routes();

    ////////////

    function sign(payload) {
        return jwt.sign(payload, config.jwt.secret, {
            algorithm: 'HS256',
            expiresIn: config.jwt.expiresIn,
        });
    }

    function * checkCaptcha(next) {
        const token = this.cookies.get('token');

        try {
            yield verifyToken(token);

            yield next;
        }
        catch (err) {
            if (err.name === 'JsonWebTokenError' ||
                err.name === 'TokenExpiredError') {
                captcha = simpleCaptcha.create();
                return this.redirect('/captcha/form');
            }

            this.throw(err, 500);
        }


        ////////////

        function verifyToken(tk) {
            return new Promise((resolve, reject) => {
                jwt.verify(tk, config.jwt.secret, (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(decoded);
                });
            });
        }
    }
};
