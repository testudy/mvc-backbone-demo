define(function (require, exports, module) {
    'use strict';

    var BaseView = require('./base'),
        Hogan = require('hogan'),
        $ = require('jquery'),
        GoodsListView;

    GoodsListView = BaseView.extend({
        className: 'goods-list',

        template: Hogan.compile(require('../tpl/goods-list.tpl')),

        events: {
            'click .title>label': 'toggleDescription',
            'click .title>span': 'toggleDescription',
            'change input[type=checkbox]': 'toggleDoneState'
        },

        toggleDescription: function (e) {
            e.preventDefault();
            var $parent = $(e.target).closest('li').find('.description');
            $parent = $parent.parents('li');

            $parent.toggleClass('expand');
        },

        getId: function (id) {
            var value = parseInt(id, 10);

            if (String(value) === id) {
                return value;
            }

            return id;
        },

        toggleDoneState: function (e) {
            var target = e.target,
                id = this.getId(target.getAttribute('data-id')),
                model = this.collection.get(id);

            if (this.dataType === 'goods-list-define') {
                if (model.get('type') === 2) {
                    target.checked = true;
                    require('./confirm')({
                        model: model
                    });
                } else {
                    model.set('isSelect', target.checked);
                    model.save(null, {silent: true});
                }
            } else {
                model.set('isDone', target.checked);
                model.save();
            }
        },

        initialize: function (options) {
            this.gc();

            this.category = options.category;
            this.dataType = options.dataType;
            this.title = options.title;

            this.collection = require('../collection/goods')();
            this.render();
            this.listenTo(this.collection, 'add update sync remove', this.render);
        },

        render: function (mc, resp, options) {
            var that = this,
                data;

            if (options && options.silent) {
                return;
            }

            data = {
                title: this.title,
                data: this.collection.getData(this.category, this.dataType),
                isChecked: function () {
                    if (that.dataType === 'goods-list-define') {
                        return this.isSelect;
                    }
                    return this.isDone;
                },
                isDefine: function () {
                    if (that.dataType === 'goods-list-define') {
                        return this.type === 2;
                    }
                },
                isDefault: function () {
                    return this.type === 1;
                },
                getTitle: function () {
                    if (this.title && this.data.length) {
                        return this.title;
                    }
                    return '';
                }
            };
            this.$el.html(this.template.render(data));
            $('.container').append(this.$el);
        }
    });

    module.exports = function (options) {
        return new GoodsListView(options);
    };
});
