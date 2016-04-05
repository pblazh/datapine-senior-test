define(['backbone', 'underscore', 'jquery', '../store/store', '../store/actions'],
       function(Backbone, _, $, store, actions){
    'use strict';

    /*
     * Convertor to get an array of object from one line of a CSV
     */
    function toObjects(headers, region){
        return function(dataline){
            return dataline.slice(1).map(function(entry, index){
                var ret = {
                    year: parseInt(dataline[0], 10),
                    browser: headers[index + 1],
                    share: parseFloat(entry, 10),
                    region: region,
                };
                return _.extend(ret,
                            {id: [ret.year,
                                  ret.region,
                                  ret.browser].join(':')});
            });
        };
    }

    /*
     * I've decided to split data in as small chunks as possible so later
     * I will be able to have any representation of the data.
     */
    var DataEntry = Backbone.Model.extend({
        defaults: {
            year: 1970,
            browser: 'other',
            share: 0,
        },
    });


    /*
     * Since data is stored in CSV rather than in JSON we have to change the
     * default behavior of a Backbone collection. I altered the "sync" method to
     * prevent it parsing a response and wrote a "parse" method to convert a CSV
     * into an array of JavaScript objects to build a collection.
     */


    var DataStore = Backbone.Collection.extend({

        model: DataEntry,
        comparator: 'year',

        /*
         * Load an array of url one by one
         */
        load: function(list){
            var self = this;
            return list.reduce(
                function(prev, o){
                    return prev.then(function(){
                        var d = new $.Deferred();
                        //setTimeout(function(){
                        self.fetch(o.url, {region: o.region, remove: false})
                            .fail(function(err){
                                store.dispatch(actions.addError('Got an error while fetching ' + o.url));
                                d.resolve();
                            })
                            .done(d.resolve);
                        //}, 1000);
                        return d.promise();
                    });
                },
                $.Deferred().resolve()
            );
        },

        parse: function(data) {
            if(data){
                var res = _.map(data.split('\n'),
                                function(str){ return str.split(','); });
                var columns = res[0].map(function(entry){return entry.slice(1, -1);});
                return _.flatten(res.slice(1).map(toObjects(columns, this.region)));
            }else{
                return [];
            }
        },

        fetch: function(url, options){
            this.url = url;
            this.region = options.region;
            return Backbone.Collection.prototype.fetch.call(this, options);
        },

        /*
         * We alter the underlying jQuery json method
         * to tell it to treat a response as a plain text.
         */
        sync: function(method, model, options){
            return Backbone.sync.call(this, method, model,
                                 _.extend(options, {dataType: 'text'}));
        },
    });

    return DataStore;
});
