define(['underscore'], function(_){
    'use strict';

    // Just utility methods to simplify querying the collections.
    return {
        field: function(collection, name){
            return _.uniq(collection.pluck(name));
        },
    };
});
