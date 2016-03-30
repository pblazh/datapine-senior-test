define([
    'underscore',
    'text!./app/templates/main.html',
    'text!./app/templates/navigation.html',
    'text!./app/templates/timeline.html',
    'text!./app/templates/map.html',
    'text!./app/templates/continent.html',
    'text!./app/templates/about.html',
], function (_) {
    'use strict';

    /*
     * Just a small utility module to simplify access to templates.
     *
     * It hacks the require.js buffer to define template modules using their
     * file name. If file name ends with an ".html", it's a template.
     */

    return _.chain(require.s.contexts._.defined)
    .pairs()
    .filter(function(pair){ return /\.html$/.test(pair[0])})
    .reduce(function(templates, template){
        var name = template[0].replace(/.*\/(.*)\.html$/i, '$1');
        var templater = _.template(template[1]);
        templates[name] = templater;
        return templates;
    }, {})
    .value();
});
