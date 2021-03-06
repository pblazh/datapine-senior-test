define([
    'backbone',
    'underscore',
    'layoutmanager',
], function(
    Backbone,
    _
){
    'use strict';

    /*
     * the base view to work with a Redux store. It listens to state changes
     * and performs some state/representation integrity checks before rendering.
     */
    var ReducedView = Backbone.Layout.extend({
        __state: {},
        interested: [],
        initialize: function() {
            if(this.store){
                this.store.subscribe(this.render.bind(this));
            }
        },
        serialize: function(){
            return _.clone(this.__state);
        },
        beforeRender: function() {
            var newState;
            if(this.store){
                newState = _.pick.apply(null, [this.store.getState()].concat(this.interested));
                this.__skipRender = _.isEqual(newState, this.__state);
                if (!this.__skipRender){
                    this.__state = newState;
                    return true;
                }else{
                    return false;
                }
            }
        },
    });

    return ReducedView;
});
