define(['redux', 'underscore', './actions'], function (redux, _, actions) {
    'use strict';

    var initialState = {
        page: 'map',
        browser: 'all',
        region: 'ww',
        year: 0,
        errors: [],
    };

    // pairs 'action type' : 'stat property'
    // that would be much shorte with ES6
    var action2property = {};
    action2property[actions.SET_PAGE] = 'page';
    action2property[actions.SET_REGION] = 'region';
    action2property[actions.FILTER_BROWSER] = 'browser';
    action2property[actions.FILTER_YEAR] = 'year';

    // A function to eliminate a switch/case block.
    function switchCase(state, action){
        var update = {};
        update[action2property[action.type]] = action.value;
        return _.extend({}, state, update);
    }

    function appReducer(state, action){
        if(!state){
            return initialState;
        }
        // whenever the the region chosen change a current page
        if(action.type === actions.SET_REGION){
            return _.extend({}, state, {
                page: 'continent',
                region: action.value,
            });
        }
        // whenever ann error ocurred store it
        if(action.type === actions.ADD_ERROR){
            return _.extend({}, state, {
                errors: state.errors.concat(action.value),
            });
        }
        // clear errors
        if(action.type === actions.CLEAR_ERRORS){
            return _.extend({}, state, {
                errors: [],
            });
        }
        // whenever a new value came return a new state with it.
        if(action2property[action.type]){
            return switchCase(state, action);
        }
        return state;
    }

    // Export an instance to serve as a singleton.
    return redux.createStore(appReducer);
});
