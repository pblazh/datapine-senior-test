define([
    'underscore',
    'backbone-filtered-collection',
], function(
    _,
    FilteredCollection
){
    'use strict';

    // Just utility methods to simplify querying the collections.

    function toTopCollection(collection, code){
            var fc = new FilteredCollection(collection);
            fc.filterBy('ww', {region: code,
                               year: _.last(field(fc, 'year'))});
            fc.filterBy('top', function(model){return model.get('share') >= 1});
            return fc;
    }

    function toLastYearCollection(collection, browser){
            var fc = new FilteredCollection(collection);
            fc.filterBy('ww', { year: _.last(field(collection, 'year'))});
            if(browser !== 'all'){
                fc.filterBy('browser', {browser: browser});
            }
            return fc;
    }

    function getByBrowserSeries(collection){
        var series = _.map(field(collection, 'browser'), function(browser){
            return {
                name: browser,
                y: collection.findWhere({browser: browser}).get('share')
            };
        });
        // keep data in sorted order to have a nice animation
        series.sort(function(a, b){ return (a.name < b.name) ? -1 : (a.name > b.name ? 1 : 0);});
        return series;
    }


    function getMapSeries(collection, browser){
            var series = _.map(field(collection, 'region'), function(region){
                var inRegion = collection.where({region: region});
                return { 'hc-key': region,
                    'name': browser,
                    'value': browser === 'all'
                        ? 0 : (inRegion.length ? collection.where({region: region})[0].get('share') : 0)};
            });
            return series;
    }


    function getChartSeries(collection){
        var series = _.map(field(collection, 'browser'), function(browser){
            return {
                name: browser,
                data: _.map(collection.where({browser: browser}),
                            function(el){ return {name: browser, y: el.get('share')};})
            };
        });
        insertMarkers(series);
        return series;
    }

    // set markers to show which line is whose
    function insertMarkers(series){
            _.each(series, function(s){
                var data = s.data;
                if(data && data.length && !data[0].marker){
                    var marker = {symbol: 'url(./assets/' + data[0].name + '_48x48.png)'}
                    data[0].marker = marker;
                    data[data.length - 1].marker = marker;
                }
            });
    }

    function field(collection, name){
        return _.uniq(collection.pluck(name));
    }

    return {
        field: field,
        toTopCollection: toTopCollection,
        toLastYearCollection: toLastYearCollection,
        getByBrowserSeries: getByBrowserSeries,
        getMapSeries: getMapSeries,
        getChartSeries: getChartSeries,
    };

});
