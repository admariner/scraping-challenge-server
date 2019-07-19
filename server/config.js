module.exports = {
    port: process.env.PORT || 9000,

    mongo: {
        url: process.env.MONGO_URI || 'mongodb://localhost/scraping-challenge',
    },

    assets: {
        path: 'assets',
    },

    template: {
        viewPath: 'app',
        defaultLayout: 'template/index.tpl',
    },

    pagination: {
        size: 2,
    },

    useragent: {
        pattern: /chrome/i,
    },

    scrapoxy: {
        max_requests: 30,
        unban_delay: 2 * 60 * 1000,
    },

    scrapoxy_adv: {
        max_requests: 15,
        unban_delay: 2 * 60 * 1000,
    },

    jwt: {
        secret: process.env.JWT_TOKEN || 'Kkbxz1Thpi87u91gHNXO4Mt4YD58rW8e',
        expiresIn: '10m',
    },
};
