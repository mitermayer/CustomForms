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

       function toggleColor( state ) {
            $el.css("color", (state ? color : settings.blur_color));
       }

       function setDefaultText() {
           instance.update(placeholder).save();
       }

       instance.bind("validate", function( state ) {
            toggleColor(state);
       });

       // sync element state
       if ( !instance.sync().validate() ) {
           setDefaultText();
       }

       $el
       .focusin(function(){
           if ( !instance.sync().validate() ) {
               instance.update("").save();
               toggleColor(true);
           }
       })
       .focusout(function(){
           if ( !instance.sync().validate() ) {
               setDefaultText();
           }
       });

       return instance;
    };

}( this ));
