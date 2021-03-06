define(function (require, exports, module) {
    'use strict';

    var Backbone = require('backbone'),
        dispatcher = require('./dispatcher'),
        Router,
        router;

    Router = Backbone.Router.extend({
        routes: {
            '(/)': 'index',
            'index/:category': 'index',
            'define/:category': 'define'
        },

        index: function (category) {
            require('./view/index')({
                category: parseInt(category, 10) || 0
            });
        },

        define: function (category) {
            require('./view/define')({
                category: parseInt(category, 10) || 0
            });
        }
    });

    router = new Router();

    dispatcher.on('router.navigate', function (fragment, options) {
        router.navigate(fragment, options);
    });


    module.exports = function () {
        return router;
    };
});
