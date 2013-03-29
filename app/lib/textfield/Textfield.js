(function( global ){

    "use strict";

    var APP    = global.app = global.app || {},
        module = APP.module = APP.module || {};

    module.TextField = function( obj ) {

       var instance = new APP.BaseField({
            element: obj.element,
            init: function() {
            //init: function( obj ) {

                // check for placeholder browser support
                //var support_placeholder = ('placeholder' in 
                 //   global.document.createElement('input'));

                //var _$el = $(obj.element);
            }
       });

       return instance;
    };

}( this ));
