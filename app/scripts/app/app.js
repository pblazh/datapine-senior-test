define([
    'backbone',
    'jquery',
    'underscore',
    'backbone-filtered-collection',
    'layoutmanager',
    'templates',
    './store/store',
    './store/actions',
    './views/navigation_view',
    './views/timeline_view',
    './views/map_view',
    './views/continent_view',
    './views/about_view',
    './data/store',
    './router',
], function (Backbone, $, _, FilteredCollection, Layout, templates, store, actions, NavigationView, TimelineView, MapView, ContinentView, AboutView, DataStore ) {
    'use strict';

    var timeout;

    /*
     * The main application layout which contains subviews and handles page switching.
     */
    return function App(placeholder){
        var mainLayout, fc;

        /*
         * I use a real data from http://gs.statcounter.com/ but for convience
         * I stored them locally.  Here I load statistics files for a
         * differrent regions.
         */
        var dt = new DataStore();
        dt.load(_.map(['ww', 'hz', 'eu', 'na', 'sa', 'oc', 'as', 'af'], function(region){
            return {region: region, url: ['./data/browser-', '-yearly-2010-2016.csv'].join(region)};
        }));

        fc = new FilteredCollection(dt);

        mainLayout = new Backbone.Layout({
            currentPage: store.getState().page,
            manage: true,
            template: templates.main,
            views: {
                '#navigation': new NavigationView(),
                '#timeline': new TimelineView({collection: fc}),
                '#map': new MapView({collection: fc}),
            },
            openAbout: function(){
                this.insertView('#about', new AboutView());
                this.getView('#about').render();
                this.$el.addClass('page_about');
                this.el.className = 'page_about';
            },
            openContinent: function(page){
                this.insertView('#continent', page);
                this.getView('#continent').render();
                this.el.className = 'page_content';
            },
            closePages: function(){
                this.el.className = 'page_map';
                timeout = setTimeout(function(){
                    this.removeView('#about');
                    this.removeView('#continent');
                }.bind(this), 1000);
            },
            pageSwitcher: function(){
                clearInterval(timeout);
                var state = store.getState();
                // console.log( state );
                if(state.page === 'about'){
                    mainLayout.openAbout();
                } else if(state.page === 'map'){
                    mainLayout.closePages();
                }else{
                    mainLayout.openContinent(new ContinentView({collection: dt}));
                }
            },
            initialize: function(){
                /*
                 * Whenever the page property in the store is changed, modify
                 * the layout and change a base element CSS class to easily
                 * access the page property from the CSS.
                 */
                store.subscribe(this.pageSwitcher);
            },
            afterRender: function(){
                // Set an initial state.
                this.pageSwitcher();
            },
        });

        mainLayout.$el.appendTo(placeholder);
        mainLayout.render();
    };
});
