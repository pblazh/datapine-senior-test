define([
    'underscore',
    'templates',
    './reduced_view',
    '../store/store',
    '../store/actions',
    '../data/tools',
], function(
    _,
    templates,
    ReducedView,
    store,
    actions,
    dataTools
){
    'use strict';

    /*
     * Listens for form events and have the store to dispatch actions.
     */

    var TimelineView = ReducedView.extend({
        template: templates.timeline,
        events: {
            'change form': 'onChange',
        },
        interested: ['year', 'browser'],
        store: store,
        serialize: function(){
            return _.extend(ReducedView.prototype.serialize.call(this),
                {
                    years: _.chain(dataTools.field(this.collection, 'year')),
                    browsers: _.chain(dataTools.field(this.collection, 'browser')),
                });
        },
        initialize: function() {
            ReducedView.prototype.initialize.call(this);
            this.listenTo(this.collection, 'reset', this.render);
        },
        /*
         * force it to rerender itself each time
         */
        beforeRender: function() {
            ReducedView.prototype.beforeRender.call(this);
            return true;
        },
        onChange: function(ev){
            var value;
            ev.preventDefault();

            switch(ev.target.name){
            case 'browser':
                value = ev.currentTarget.browser.value;
                store.dispatch(actions.filterBrowser(value));
                break;
            case 'year':
                value = ev.currentTarget.year.value;
                store.dispatch(actions.filterYear(parseInt(value, 10)));
                break;
            default:
                break;
            }
        },
    });

    return TimelineView;
});
