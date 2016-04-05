/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_',
        },
        backbone: {
            deps: [
                'underscore',
                'jquery',
            ],
            exports: 'Backbone',
        },
        Highcharts: {
            deps: ['jquery'],
            exports: 'Highcharts',
        },
        map: {
            deps: ['Highcharts'],
        },
        continents: {
            deps: ['map'],
        },
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        'backbone-filtered-collection': '../bower_components/backbone-filtered-collection/backbone-filtered-collection',
        Highcharts: '../bower_components/highcharts/highcharts',
        map: '../bower_components/highcharts/modules/map',
        redux: '../bower_components/redux/index',
        text: '../bower_components/requirejs-text/text',
        underscore: '../bower_components/underscore/underscore',
        //underscore: '../bower_components/lodash/lodash.min',
        layoutmanager: '../bower_components/layoutmanager/backbone.layoutmanager',
        templates: './app/templates/templates',
        continents: './app/maps/world-continents',
    },
});

require([
    'backbone',
    './app/app',
], function (Backbone, App) {
    /*
     * Just an entrance point, which starts the history manageing and then create an app.
     * I would perhaps refactor config options into a separate file.
     */
    Backbone.history.start();
    var app = new App('#app');
});
