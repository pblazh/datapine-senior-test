define(['backbone', './store/store', './store/actions'], function (Backbone, store, actions) {
    'use strict';

    /*
     * The simple router. Whenever state changed -- change the URL.
     * Whenever the URL changed -- notify the store.
     */
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'about': 'about',
            'continent/:continent': 'continent',
            '.*': 'notFound',
        },
        index: function() {
            store.dispatch(actions.setPage('map'));
        },
        continent: function(continent) {
            store.dispatch(actions.setRegion(continent));
        },
        about: function() {
            store.dispatch(actions.setPage('about'));
        },
        notFound: function() {
            store.dispatch(actions.setPage('404'));
        },
    });

    var appRouter = new AppRouter();

    store.subscribe(function(){
        var state = store.getState();

        if(state.page === 'continent'){
            appRouter.navigate('/continent/' + state.region);
        }else if(state.page === 'map'){
            appRouter.navigate('/');
        }else{
            appRouter.navigate('/' + state.page);
        }
    });

    return appRouter;
});
