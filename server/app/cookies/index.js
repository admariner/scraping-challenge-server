'use strict';

const Person = require('../../model/person.model'),
    Router = require('koa-router');


module.exports = (config) => {
    const router = new Router();

    // Get
    router.get('/', checkAuth, function * (next) {
        const persons = yield Person
            .find()
            .sort({
                given_name: 1,
                family_name: 1,
            });

        yield this.render('cookies/index', {
            title: 'Cookies',
            persons: persons,
        });

        yield next;
    });


    // Get (login)
    router.get('/rejected', function * (next) {
        const token = this.cookies.get('phantomCookie');

        if (token === 'sample_value') {
            this.redirect('/cookies');
        } else {
            yield this.render('cookies/rejected', {
                title: 'Cookies',
            });
    
            yield next;
        }
    });

    // Get (logout)
    router.get('/logout', function * () {
        this.cookies.set('phantomCookie', '');

        return this.redirect('/cookies');
    });

    return router.routes();


    ////////////

    function * checkAuth(next) {
        const token = this.cookies.get('phantomCookie');

        if (token === "sample_value") {
            yield next;
        } else {
            return this.redirect('/cookies/rejected');
        }
    }
};
