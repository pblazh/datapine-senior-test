define(['./reduced_view', 'templates'], function(ReducedView, templates){
    'use strict';

    /*
     * Just a simple text page.
     */
    var AboutView = ReducedView.extend({
        template: templates.about,
    });

    return AboutView;
});
