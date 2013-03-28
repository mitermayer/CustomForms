(function( global ){

    var window = global;

    window.app.base = function( obj ) {

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

            var defaultEvents = ["update", "save", "sync", "validate", "destroy"];

            element = obj.element;

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

        };

        // attach events
        this.bind = function() {};

        // remove events
        this.unbind = function() {};

        // update element value with custom element value
        this.save = function() {};

        // update custom element value with element value
        this.sync = function() {};

        // run custom element value over validators
        this.validate = function() {};

        // detach events and destroy custom element
        this.destroy = function() {};

        // call constructor
        this.init( obj );
    };

}( this ));
