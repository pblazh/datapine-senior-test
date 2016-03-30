define([
    'backbone',
    'underscore',
    'backbone-filtered-collection',
    'layoutmanager',
    'Highcharts',
    'continents',
    'templates',
    '../store/store',
    '../store/actions',
    '../data/tools',
    './charts',
], function(
    Backbone,
    _,
    FilteredCollection,
    Layout,
    Highcharts,
    continents,
    templates,
    store,
    actions,
    dataTools,
    charts
){
    'use strict';

    /*
     * The index page which consists of two charts browser share in years and a
     * map which shows the browser usage on a continent and also is used as a
     * menu to switch to a continent dedicated page.
     */


    /*
     * A small utility fuction to maker a breach through the binding.
     */
    function setChart(self){
        return function(){
            self.__chart = this;
        };
    }
    var MapView = Backbone.Layout.extend({
        template: templates.map,
        onSelect: function(code){
            // when over the continent update the donut chart
            var fc = dataTools.toTopCollection(this.collection, code || 'ww');
            var series = dataTools.getByBrowserSeries(fc);
            charts.colorize(series);
            this.__chart.series[0].setData(series.slice(0,4));
        },
        buildMap: function(){
            var state = store.getState();
            var fc = dataTools.toLastYearCollection(this.collection, state.browser);

            // create a data array to build a map
            var series = dataTools.getMapSeries(fc, state.browser);
            this.$('.fgmap').highcharts('Map',
                charts.map(series,
                    Highcharts.maps['custom/world-continents'],
                    function(){store.dispatch(actions.setRegion(this['hc-key']));},
                    (function(self){ return function(){self.onSelect( this && this['hc-key'] );}}(this)),
                    state.browser !== 'all',
                    state.browser
                )
            );
        },

        /*
         * The function is debounced. There is no need to rerender if more
         * often the one time in 100ms.
         */
        buildChart: _.debounce(function(){
            /*
             * create a filetered collection which stores only browsers whose
             * share worldwide is more than one percent.
             */
            var fc = new FilteredCollection(this.collection).filterBy('ww', {region: 'ww'});

            // create a data array to build a chart
            var series = dataTools.getChartSeries(fc);

            this.$('.bgmap').highcharts(
                charts.chart('lines', dataTools.field(this.collection, 'year'), series)
            );


            this.buildMap();
            this.$('.donut').highcharts(
                    charts.circle(
                        _.map(series,function(e){ return e.data[e.data.length -1];}),
                        setChart(this),
                        _.last(dataTools.field(fc, 'year'))));
        }, 100),

        afterRender: function() {
            this.listenTo(this.collection, 'reset', this.buildChart);
            store.subscribe(this.buildMap.bind(this));
            this.buildChart();
        },
    });

    return MapView;
});
