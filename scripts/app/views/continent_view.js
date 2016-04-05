define([
    'backbone',
    'underscore',
    'backbone-filtered-collection',
    'layoutmanager',
    'templates',
    '../store/store',
    '../store/actions',
    '../data/tools',
    '../constants',
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
    constants,
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
    function setChart(self, store, callBack){
        return function(){
            self[store] = this;
            if(callBack){
                callBack();
            }
        };
    }

    var ContinetView = Backbone.Layout.extend({
        template: templates.continent,
        lastState: -1,
        __chart: null,
        initialize: function(){
            var state = store.getState();

            this.fc = new FilteredCollection(this.collection);
            this.fc.filterBy('region', {region: state.region});

            this.fc.filterBy('top', function(model){return model.get('share') > 1});

            this.listenTo(this.collection, 'sync', this.updateChart.bind(this));
        },
        beforeRender: function() {
            // if we are just switchig between years there is no need to rerender.
            var state = store.getState();
            return !(this.lastState === state.year || (this.lastState > 0 && state.year > 0));
        },
        updateChart: function(){
            if(!this.__chart) return;

            var browsers, series;
            var state = store.getState();
            this.fc.removeFilter('year');
            if(state.year){
                this.fc.filterBy('year', {year: state.year});
            }
            if(state.year){
                browsers = dataTools.field(this.fc, 'browser');
                series = [{
                    name: 'share',
                    data: _.map(constants.BROWSERS, function(browser){
                        var model = this.fc.findWhere({browser: browser});
                        return {
                            name: browser,
                            y: model ? model.get('share') : 0
                        };
                    }.bind(this)),
                }];
                charts.colorize(series);
                if(this.__chart.series.length < series.length){
                    for(var i = this.__chart.series.length, l = series.length; i<l; i++){
                        this.__chart.addSeries(series[i]);
                    }
                }else{
                    this.__chart.series[0].setData(series[0].data);
                }
            }else{
                browsers = dataTools.field(this.fc, 'year');
                series = _.map(dataTools.field(this.fc, 'browser'), function(browser){
                    return {
                        name: browser,
                        data: _.map(
                            this.fc.where({browser: browser}),
                            function(el){
                                return {name: browser, y: el.get('share')};
                            }
                        ),
                    };
                }.bind(this));

                charts.colorize(series);
                this.__chart.xAxis[0].update({
                    categories: dataTools.field(this.fc, 'year'),
                });
                for(var i = this.__chart.series.length, l = series.length; i<l; i++){
                    this.__chart.addSeries(series[i]);
                }
            }
            this.lastState = state.year;
        },
        afterRender: function(){
            var state = store.getState();
            if(this.lastState === state.year || (this.lastState > 0 && state.year > 0)){
                this.updateChart();
                return;
            }

            this.__chart = null;
            this.$('.chart').highcharts(
                _.extend(charts.chart(state.year > 0 ? 'year' : 'years', constants.BROWSERS, []), {
                    chart:{type: 'column', events: {load: setChart(this, '__chart', this.updateChart.bind(this))}}
                })
            );
        },
    });

    return ContinetView;
});
