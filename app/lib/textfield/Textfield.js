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

       var instance = false;

       if( !settings.placeholder_support ) {

           var $el = $(obj.element),
               color = $el.css("color"), 
               placeholder = $el.attr("placeholder"),
               opt = obj,
               toggleColor,
               clearText,
               setDefaultText;

           opt.validators = [
                function( val ) {
                    return val !== placeholder;
                }
           ];

           instance = new APP.BaseField(obj);

           toggleColor = function( state ) {

                $el.css("color", (state ? color : settings.blur_color));
           };

           clearText = function() {

               instance.update("").save();
           };

           setDefaultText = function() {

               instance.update(placeholder).save();
           };

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

       }

       return instance;
    };

}( this ));
