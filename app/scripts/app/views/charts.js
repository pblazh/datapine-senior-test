define(['underscore', 'continents', '../constants'],
       function( _, continents, constants ){
    'use strict';

    /*
     * Highcharts configurations are huge and since I don't like them to
     * pollute my code I've moved them here. The two methods below just get
     * parameters and build an object feed it to Highcharts as a configuration.
     *
     * THIS  PLACE NEEDS A REALLY HARD REFACTORING!
     */

    var MAP_DATA = _.map(constants.REGIONS,
        function(region){
            return { 'hc-key': region, 'name': 'all', 'value': 0};
        });

    var options = {
        year: {
            xAxis: {type: 'category' },
            tooltip: { pointFormat: '{point.y:.2f}%' },
        },
        years: {
            xAxis: {type: 'category'},
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                headerFormat: '<span class="chart_title">{series.name}</span>',
                pointFormat: ':{point.y:.2f}%'
            },
        },
        lines: {
            legend: { enabled: false },
            title: { style: {display: 'none'} },
            plotOptions: { line: {lineWidth: 5, dashStyle: 'dash' } },
            chart: {},
        },
        map:{
            title: { style: {display: 'none'} },
            chart: {borderColor: "#ff0000", backgroundColor: 'transparent',style: {cursor: 'pointer'}},
            legend: { enabled: false },
            tooltip: {
                borderWidth: 0,
                borderRadius: 30,
                headerFormat: '',
                shadow: true,
                useHTML: true,
                padding: 0,
                title: false,
                pointFormat: '<span style="font-family: Roboto; font-size: 13px;text-transform: uppercase;">{point.name}:<br/><b style="font-size: 32px;">{point.value}%</b></span>',
            },
            series : [
                {
                    dataLabels: {color: '#ff0000', },
                    borderColor: "#A2A2BB",
                    borderWidth: 1,
                    joinBy: 'hc-key',
                },
            ],
            colorAxis: {
                min: 0,
                type: 'linear',
            },
        }
    };

    var columnsChart = {
        chart: { type: 'column' },
        legend: { enabled: false },
        title: { style: {display: 'none'} },
        tooltip: {  enabled: true, shared: !true, crosshairs: true },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: { enabled: true, format: '{point.y:.1f}%' },
            },
        },
    };

    var circleChart = {
        chart: {
            backgroundColor: 'transparent',
        },
        title: {
            enabled: !false,
            text: '2016',
            align: 'center',
            verticalAlign: 'top',
            y: 120,
            style: {color: '#cccccc', fontSize: 38, fontWeight: 'bold'},
        },
        plotOptions: {
            pie: {
                width: 300,
                height: 200,
                enableMouseTracking: false,
                allowPointSelect: false,
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '100%'],
                size: '235%',
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: '#666666',
                        fontSize: 10,
                        textTransform: 'uppercase',
                        textShadow: 'none',
                    }
                },
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [],
        }]
    };

    function color(browser){
        return constants.COLORS[browser] || constants.COLORS.Other[Math.floor(Math.random() * constants.COLORS.Other.length)];
    }

    function colorize(series){
        _.each(series,
            function(s){
                s.color = color(s.name);
                _.each(s.data, function(p){ p.color = color(p.name)});
            }
        );
    }

    return {
        colorize: colorize,
        chart: function(type, categories, series, onLoad){
            var n = _.extend({}, type === 'lines' ? {} : columnsChart, options[type],
                    {
                        series: series,
                        xAxis: {
                            categories: categories,
                            title: { enabled: false},
                        },
                        yAxis: {
                            showFirstLabel: false,
                            title: { enabled: true, text: ' '},
                        },
                    });
            n.chart.events = {load: onLoad};
            return n;
        },
        map: function(data, click, over, tooltip, browser, onLoad){
            return {
                title: { style: {display: 'none'} },
                legend: { enabled: false },
                chart: {
                    borderColor: '#ff0000',
                    backgroundColor: 'transparent',
                    style: {cursor: 'pointer'},
                    events: {load: onLoad},
                },
                colorAxis: {
                    minColor: constants.MAP_COLORS[browser][0],
                    maxColor: constants.MAP_COLORS[browser][1],
                    min: 0,
                    type: 'linear',
                },
                series: [
                    {
                        dataLabels: {color: '#ff0000'},
                        borderColor: '#A2A2BB',
                        borderWidth: 1,
                        joinBy: 'hc-key',
                        states: { hover: { color: '#7171A7'}},
                        data : _.extend(constants.MAP_DATA, data),
                        mapData: Highcharts.maps['custom/world-continents'],
                        point: {
                            events: {
                                click: click,
                                mouseOver: over,
                                mouseOut: function(){over();}},
                        },
                    },
                ],
                tooltip: {
                    borderWidth: 0,
                    borderRadius: 30,
                    headerFormat: '',
                    shadow: true,
                    useHTML: true,
                    padding: 0,
                    title: false,
                    pointFormat: '<span style="font-family: Roboto; font-size: 13px;text-transform: uppercase;">{point.name}:<br/><b style="font-size: 32px;">{point.value}%</b></span>',
                },
            };
        },
        circle: function(data, onLoad, title){
            var n = _.extend({}, circleChart);
            n.chart.events = {load: onLoad};
            n.series[0].data = data;
            n.title.text = title;
            return n;
        },
        mapColors: function(browser){return constants.MAP_COLORS[browser];},
    };
});
