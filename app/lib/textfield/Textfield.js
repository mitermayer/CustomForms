(function( global ){

    "use strict";

    var APP    = global.app = global.app || {},
        module = APP.module = APP.module || {},

    settings = {
        active: true,
        blur_color: "#777",
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

       function clearText() {
           instance.update("").save();
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
               clearText();
               toggleColor(true);
           }
       })
       .focusout(function(){
           if ( !instance.sync().validate() ) {
               setDefaultText();
           }
       })
       .closest('form').on("submit", function() {
           if ( !instance.sync().validate() ) {
               clearText();
           }
       });

       return instance;
    };

}( this ));
