(function( global ){

    "use strict";

    var APP    = global.app = global.app || {},
        module = APP.module = APP.module || {},

    settings = {
        active: true,
        blur_color: "blue",
        //blur_color: "#777",
        placeholder_support: (function() {

            return ('placeholder' in global.document.createElement('input'));
        })()
    };

    module.TextField = function( obj ) {

       var $el = $(obj.element),
           color = $el.css("color"), 
           placeholder = $el.attr("placeholder"),
           opt = obj,
           instance;

       opt.validators = [
            function( val ) {
                return val !== placeholder;
            }
       ];

       instance = new APP.BaseField(obj);

       instance.bind("validate", function( state ) {
            
            if(!state) {
                $el.css("color", settings.blur_color);
            } else {
                $el.css("color", color);
            }
       });

       // sync element state
       instance.sync().validate();

       $el
       .focusin(function(){
           if ( !instance.sync().validate() ) {
               instance.update("").save();
           }
       })
       .focusout(function(){
           if ( !instance.sync().validate() ) {
               instance.update(placeholder).save();
           }
       })

       return instance;
    };

}( this ));
