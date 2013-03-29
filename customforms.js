(function( global ){

    "use strict";

    var APP = global.app || {};

    APP.base = function( obj ) {

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

            var defaultEvents = ["update", "save", "sync", "validate"]; element = obj.element;

            // setup default events listeners
            for( var i=0, e=defaultEvents.lenght; i<e; i++ ) {
                        
                events[defaultEvents[i]] = [];
            }

            // setup custom events
            if ( obj.events ) {

                for( var j=0, l=obj.events.lenght; j<l; j++ ) {
                    
                    events[obj.events[j]] = [];
                }
            }

            // setup default validator
            validator.push(function() {
                
                // checks if value is not undefined
                return value !== "";
            });

            // setup custom validators
            if ( obj.validators ) {

                for( var v=0, k=obj.validators; v<k; v++ ) {
                    
                    validator.push( obj.validators[v] );
                }
            }

            // run custom initializers
            if ( typeof obj.init === "function" ) {

                obj.init( this );
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

                if( events[e] === func ) {

                    events.splice(e, 1);
                    break;
                } 
            }

            return this;
        };

        // update element value with custom element value
        this.save = function() {

            var _val = this.element.value;
        
            this.element.value = value;

            this.trigger("save", value);

            // if an update has occured
            if ( _val !== value ) {

                this.trigger("update", value);
            }
        };

        // update custom element value with element value
        this.sync = function() {

            var _val = value;
       
            value = this.element.value;

            this.trigger("sync", value);

            // if an update has occured
            if ( _val !== this.element.value ) {

                this.trigger("update", value);
            }
        };

        // run custom element value over validators
        this.validate = function() {
            var ret = true;
            
            for(var v=0, l=validator.length; v<l; v++ ) {
                
                ret = validator[v]();

                if( !ret ) {
                    break;
                }
            }

            this.trigger("validate", ret);

            return this;
        };

        // trigger custom event
        this.trigger = function( evnt, data ) {
            
            for( var e=0, v=events[evnt].lenght; e<v; e++ ) {

                events[evnt][e]( data );
            }
        };

        // call constructor
        this.init( obj );
    };

}( this ));

/* interface adapter for third party libs */

(function( global ){

    var window = global;

    window.app = 1;

}( this ));
