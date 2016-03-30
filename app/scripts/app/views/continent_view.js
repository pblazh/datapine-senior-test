define([
    'backbone',
    'underscore',
    'backbone-filtered-collection',
    'layoutmanager',
    'templates',
    '../store/store',
    '../store/actions',
    '../data/tools',
    './charts',
    'Highcharts',
], function(
    Backbone,
    _,
    FilteredCollection,
    Layout,
    templates,
    store,
    actions,
    dataTools,
    charts
){
    'use strict';

    /*
     * This view displays a chart of browser distribution on one continent. It
     * can be a summary for all years or one particular year.
     */


    /*
     * A small utility fuction to maker a breach through the binding.
     */
    function setChart(self){
        return function(){
            self.__chart = this;
        };
    }

    var ContinetView = Backbone.Layout.extend({
        template: templates.continent,
        lastState: 'none',
        __chart: null,
        initialize: function(){
            this.listenTo(this.collection, 'sync', this.render);
        },
        beforeRender: function() {
            // if we are just switchig between years there is no need to rerender.
            var state = store.getState();
            return !(state.year && (this.lastState === !!state.year));
        },
        afterRender: function(){
            var fc, browsers, series, chartOptions;
            var state = store.getState();

            var fc = new FilteredCollection(this.collection);
            fc.filterBy('region', {region: state.region});
            if(state.year){
                fc.filterBy('year', {year: state.year});
            }
            fc.filterBy('top', function(model){return model.get('share') > 1});


            if(state.year){
                browsers = dataTools.field(fc, 'browser');
                series = [{
                    name: 'share',
                    data: _.map(dataTools.field(fc, 'browser'), function(browser){
                        return {
                            name: browser,
                            y: fc.findWhere({browser: browser}).get('share')
                        };
                    }),
                }];
            }else{
                browsers = dataTools.field(fc, 'year');
                series = _.map(dataTools.field(fc, 'browser'), function(browser){
                    return {
                        name: browser,
                        data: _.map(
                            fc.where({browser: browser}),
                            function(el){
                                return {name: browser, y: el.get('share')};
                            }
                        ),
                    };
                });
            }

            if(state.year && (this.lastState === !!state.year && series.length)){
                charts.colorize(series);
                this.__chart.series[0].setData(series[0].data);
                this.__chart.axes[0].setCategories(browsers);
            }else{
                this.$('.chart').highcharts(
                    _.extend(charts.chart(state.year ? 'year' : 'years', browsers, series), {
                        chart:{type: 'column', events: {load: setChart(this)}}
                    })
                );
            }
            this.lastState = !!state.year;
        },

    });

    return ContinetView;
});
