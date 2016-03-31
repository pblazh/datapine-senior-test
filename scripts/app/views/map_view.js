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
    function setChart(self, callBack){
        return function(){
            self.__chart = this;
            callBack();
        };
    }
    var MapView = Backbone.Layout.extend({
        template: templates.map,
        initialize: function(){
              /*
             * create a filtered collection which stores only browsers whose
             * share worldwide is more than one percent.
             */
            this.chartCollection = new FilteredCollection(this.collection)
                .filterBy('ww', {region: 'ww'})
                .filterBy('top', function(model){return model.get('share') >= 2});
        },
        onSelect: function(code){
            // when over the continent update the donut chart
            var fc = dataTools.toTopCollection(this.collection, code || 'ww');
            var series = dataTools.getByBrowserSeries(fc);
            charts.colorize(series);
            this.__chart.series[0].setData(series.slice(0,7));
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
            // create a data array to build a chart
            var series = dataTools.getChartSeries(this.chartCollection);
            this.$('.bgmap').highcharts(
                charts.chart('lines', dataTools.field(this.collection, 'year'), series)
            );

            this.$('.donut').highcharts(
                    charts.circle(
                        [],
                        setChart(this, this.onSelect.bind(this)),
                        _.last(dataTools.field(this.collection, 'year'))));

            this.buildMap();
        }, 100),

        afterRender: function() {
            this.listenTo(this.collection, 'reset', this.buildChart);
            store.subscribe(this.buildMap.bind(this));
            this.buildChart();
        },
    });

    return MapView;
});
