define([
    'backbone',
    'underscore',
    'backbone-filtered-collection',
    'layoutmanager',
    'Highcharts',
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
     * @prop self - the objecte to bind
     * @prop store - name of a property to store the loaded chart
     */
    function setChart(self, store, callBack){
        return function(){
            self[store] = this;
            if(callBack){
                callBack();
            }
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

            _.bindAll(this, 'buildMap', 'updateMap', 'onSelect');
        },

        onSelect: function(code){
            // when over the continent update the donut chart
            if(this.__chart){
                var fc = dataTools.toTopCollection(this.collection, code || 'ww');
                var series = dataTools.getByBrowserSeries(fc);
                charts.colorize(series);
                this.__chart.series[0].setData(series.slice(0,7));
            }
        },

        updateLines: function(){
            if( this.__lines){
                var series = dataTools.getChartSeries(this.chartCollection);
                charts.colorize(series);
                this.__lines.xAxis[0].update({
                    categories: dataTools.field(this.chartCollection, 'year'),
                });
                for(var i = this.__lines.series.length, l = series.length; i<l; i++){
                    this.__lines.addSeries(series[i]);
                }
            }
        },

        updateMap: function(forse){
            var state = store.getState();
            if(this.__map && (forse || this.__browser !== state.browser)){
                var fc = dataTools.toLastYearCollection(this.collection, state.browser);
                var series = dataTools.getMapSeries(fc, state.browser);
                var colors = charts.mapColors(state.browser);
                this.__map.colorAxis[0].update({ minColor: colors[0], maxColor: colors[1]});
                this.__map.series[0].setData(series);
                this.onSelect();
            }
            this.__browser = state.browser;
        },

        buildMap: function(){
            var state = store.getState();
            this.__browser = state.browser;
            var fc = dataTools.toLastYearCollection(this.collection, state.browser);
            var series = dataTools.getMapSeries(fc, state.browser);
            this.$('.fgmap').highcharts('Map',
                charts.map(series,
                    function(){store.dispatch(actions.setRegion(this['hc-key']));},
                    (function(self){ return function(){self.onSelect( this && this['hc-key'] );}}(this)),
                    state.browser !== 'all',
                    state.browser,
                    setChart(this, '__map', this.updateMap)
                )
            );

        },

        /*
         * There is no reason to run that function more than once.
         */
        buildCharts: _.once(function(){
            var state = store.getState();
            // create a data array to build a chart
            this.$('.bgmap').highcharts(
                charts.chart('lines',
                            dataTools.field(this.chartCollection, 'year'),
                            [],
                            setChart(this, '__lines', this.updateLines.bind(this))
                            )
            );

            setTimeout((function(){
            this.$('.donut').highcharts(
                charts.circle(
                    [],
                    setChart(this, '__chart', this.onSelect),
                    _.last(dataTools.field(this.collection, 'year'))));
            }).bind(this), 100);

            this.buildMap();
        }),

        afterRender: function() {
            this.listenTo(this.chartCollection, 'reset', this.updateLines);
            this.listenTo(this.collection, 'reset', function(){this.updateMap(true)});
            store.subscribe(this.updateMap);

            this.buildCharts();
        },
    });

    return MapView;
});
