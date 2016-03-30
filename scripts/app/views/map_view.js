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
    '../data/tools', './charts',
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
            var fc = new FilteredCollection(this.collection);
            fc.filterBy('ww', {region: code || 'ww',
                               year: _.last(dataTools.field(fc, 'year'))});
            fc.filterBy('top', function(model){return model.get('share') >= 1});

            var series = _.map(dataTools.field(fc, 'browser'), function(browser){
                return {
                    name: browser,
                    y: fc.findWhere({browser: browser}).get('share')
                };
            }.bind(fc));
            charts.colorize(series);

            // keep data in sorted order to havae nice animation
            series.sort(function(a, b){ return (a.name < b.name) ? -1 : (a.name > b.name ? 1 : 0);});
            this.__chart.series[0].setData(series.slice(0,4));
        },
        buildMap: function(){
            var series;
            var state = store.getState();

            // create a filetered collection which stores only a worldwida data.
            var fc2 = new FilteredCollection(this.collection);
            fc2.filterBy('ww', {browser: state.browser,
                                year: _.last(dataTools.field(fc2, 'year'))});

            // create a data array to build a map
            series = _.map(dataTools.field(this.collection, 'region'), function(region){
                var inRegion = fc2.where({region: region});
                return { 'hc-key': region,
                    'name': state.browser,
                    'value': state.browser === 'all'
                        ? 0 : (inRegion.length ? fc2.where({region: region})[0].get('share') : 0)};
            });
            // charts.colorize(series);
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
            var series;
            /*
             * create a filetered collection which stores only browsers whose
             * share worldwide is more than one percent.
             */
            var fc = new FilteredCollection(this.collection);
            fc.filterBy('ww', {region: 'ww'});
            fc.filterBy('top', function(model){return model.get('share') >= 1});

            // create a data array to build a chart
            series = _.map(dataTools.field(fc, 'browser'), function(browser){
                return {
                    name: browser,
                    data: _.map(this.where({browser: browser}),
                                function(el){ return {name: browser, y: el.get('share')};})
                };
            }.bind(fc));

            // set markers to show which line is whose
            _.each(series, function(s){
                var data = s.data;
                if(data && data.length && !data[0].marker){
                    var marker = {symbol: 'url(/assets/' + data[0].name + '_48x48.png)'}
                    data[0].marker = marker;
                    data[data.length - 1].marker = marker;
                }
            });

            this.$('.bgmap').highcharts(
                charts.chart('lines', dataTools.field(this.collection, 'year'), series)
            );


            this.buildMap();
            this.$('.donut').highcharts(
                    charts.circle(
                        _.map(series,function(e){ return e.data[e.data.length -1];}),
                        setChart(this),
                        _.last(dataTools.field(fc, 'year'))));
        }, 10),

        afterRender: function() {
            this.listenTo(this.collection, 'reset', this.buildChart);
            store.subscribe(this.buildMap.bind(this));
            this.buildChart();
        },
    });

    return MapView;
});
