(function( global ){

    "use strict";

    var APP = global.app = global.app || {};

    APP.BaseField = function( obj ) {

        //  element   - html element
        //  value     - field value
        //  events    - event listeners
        //  validator - validators 
        var element   = null,
            value     = "",
            events    = [], 
            validator = [];

        // Constructor
        this.init = function( obj ) {

            var defaultEvents = ["update", "save", "sync", "validate"]; 

            element = obj.element;

            // setup default events listeners
            for( var i=0, e=defaultEvents.length; i<e; i++ ) {
                        
                events[defaultEvents[i]] = [];
            }

            // setup custom events
            if ( obj.events ) {

                for( var j=0, l=obj.events.length; j<l; j++ ) {
                    
                    events[obj.events[j]] = [];
                }
            }

            // setup default validator
            validator.push(function( val ) {
                
                // checks if value is not undefined
                return val !== "";
            });

            // setup custom validators
            if ( obj.validators ) {

                for( var v=0, k=obj.validators.length; v<k; v++ ) {
                    
                    validator.push( obj.validators[v] );
                }
            }

            // run custom initializers
            if ( typeof obj.init === "function" ) {

                obj.init();
            }
        };

        // attach event callback
        this.bind = function( evnt, func ) {

            if ( events[evnt] ) {

                events[evnt].push( func );
            }

            return this;
        };

        // remove events
        this.unbind = function( evnt, func ) {
        
            for( var e=0, v=events[evnt].length; e<v; e++ ) {
                if( events[evnt][e] === func ) {

                    events[evnt].splice(e, 1);
                    break;
                } 
            }

            return this;
        };

        // 
        this.update = function( val ) {
            
            if( value !== val && this.validate(val) ) {

                value = val;
                this.trigger("update", value);
            }

            return this;
        }

        // update element value with custom element value
        this.save = function() {

            element.value = value;

            this.trigger("save", value);

            return this;
        };

        // update custom element value with element value
        this.sync = function() {

            value = element.value;

            this.trigger("sync", value);

            return this;
        };

        // run custom element value over validators
        this.validate = function( val ) {
            var ret = true;

            for(var v=0, l=validator.length; v<l; v++ ) {
                
                ret = validator[v]( val );

                if( !ret ) {
                    break;
                }
            }

            this.trigger("validate", ret);

            return this;
        };

        // trigger custom event
        this.trigger = function( evnt, data ) {

            if( events[evnt] ) {

                for( var e=0, v=events[evnt].length; e<v; e++ ) {

                    events[evnt][e]( data );
                }
            }
            
            return this;
        };

        // call constructor
        this.init( obj );
    };

}( this ));

(function( global ){

    "use strict";

    var APP = global.app = global.app || {};

    APP.TextField = function( obj ) {

        this.init = function( obj ) {
        }
    };

}( this ));

(function( global ){

    var APP = global.app = global.app || {};

    $(function(){

        var a = {
            value: "miter"
        };

        var b = new app.BaseField({
            element: a,
            validators: [
                function( value ) {
                    return value !== "miter"; 
                }
            ],
            init: function() {
                console.log("ready");
            }
        });

        b
        .bind("validate", function( result ) {

            console.log( "validating:", result );
        })
        .bind("update", function() {
            
            console.log("succesfuly updated..");
        })
        .bind("sync", function( val ) {
            
            console.log(a.value, val);
        });

        b.update("jonas").save();

        a.value = "bostaaaaa";

        console.log(a.value);
        b.sync();
    });

}( this ));
