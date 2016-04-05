define([
    './reduced_view',
    'templates',
    '../store/store',
    '../store/actions',
], function(
    ReducedView,
    templates,
    store,
    actions
){
    'use strict';

    /*
     * A simple view based on ReducedView. It just declares that it is
     * interested in "page" and "country" fields in the store.
     */
    var NavigationView = ReducedView.extend({
        className: 'navigation',
        template: templates.navigation,
        store: store,
        interested: ['page', 'region', 'browser', 'errors'],
        events: {
            'click .button.world': function(){
                store.dispatch(actions.setPage('map'));
            },
            'click .button.about': function(){
                store.dispatch(actions.setPage('about'));
            },
            'click .errorsbox': function(){
                this.$('.errorsbox').fadeOut(function(){
                    store.dispatch(actions.clearErrors());
                });
            },
        },
        afterRender: function(self){
            if(!self.__skipRender){
                this.$('.errorsbox').hide().fadeIn('slow');
            }
        }
    });

    return NavigationView;
});
