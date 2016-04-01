define(['underscore'], function (_) {
    'use strict';

    // Action types
    var consts = {
        SET_PAGE: 'SET_PAGE',
        SET_REGION: 'SET_REGION',
        FILTER_BROWSER: 'FILTER_BROWSER',
        FILTER_YEAR: 'FILTER_YEAR',
        ADD_ERROR: 'ADD_ERROR',
        CLEAR_ERRORS: 'CLEAR_ERRORS',
    };

    // It generates an action creator
    function action(type){
        return function(value){
            return { type: type, value: value };
        };
    }

    return _.extend(consts, {
        setPage: action(consts.SET_PAGE),
        setRegion: action(consts.SET_REGION),
        filterBrowser: action(consts.FILTER_BROWSER),
        filterYear: action(consts.FILTER_YEAR),
        addError: action(consts.ADD_ERROR),
        clearErrors: action(consts.CLEAR_ERRORS),
    });
});
