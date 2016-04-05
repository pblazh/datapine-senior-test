define([], function(){
    'use strict';

    return {
        REGIONS: ['ww', 'eu', 'na', 'sa', 'oc', 'as', 'af'],

        BROWSERS: ['Chrome', 'Firefox', 'IE', 'Edge', 'Safari', 'Opera', 'Android'],

        // I want the colors to be consistant across charts.
        COLORS: {
            IE:      '#7AE1F7',
            Chrome:  '#FFCE44',
            Firefox: '#E07E27',
            Opera:   '#F53241',
            Safari:  '#0EBDF1',
            Edge:    '#598ABD',
            Android: '#e4d354',
            Other:  ['#2b908f', '#f45b5b', '#91e8e1'],
        },

        MAP_COLORS: {
            IE:      ['#C9F6FF', '#00D2FF'],
            Chrome:  ['#FFE498', '#E2A700'],
            Firefox: ['#FFC898', '#D06200'],
            Opera:   ['#FFADB3', '#CC0010'],
            Safari:  ['#A1E9FF', '#00A2D2'],
            Edge:    ['#6EB5FF', '#0071E6'],
            Android: ['#F7E45D', '#DAC000'],
            all:     ['#CACAD6', '#CACAD6'],
            Other:   ['#D9A5FF', '#9303FB'],
        },

    }
});
