(function(global) {

    "use strict";

    var APP = global.app = global.app || {};

    /**
     * Base class for all modules, it provides a link between the html element and
     * the model. It also implements custom events and validators.
     *
     * @constructor  
     * @name app.BaseField 
     * @param {Object} obj Options to initialize BaseField.
     * @param {HTMLelement} obj.element HTML element, that has an attribute 'value'. 
     * @param {Array} obj.validators Field Validators. 
     * @param {Array} obj.events Custom events. 
     * @param {Function} obj.init Callback function to initialize subclass when BaseField is ready. 
     * @example
     * new APP.BaseField({ 
     *     element: htmlelmenent, 
     *     validators: [], 
     *     events: ["customEventNameSpace", { 
     *         name: "otherCustomEventNamespace", 
     *         callback: function(event){
     *           // custom "otherCustomEventNamespace" event callback.
     *         }
     *     }], 
     *     validators: [{
     *         validator: function(value) {
     *              return value === 'Dummy'; 
     *         },
     *         message: "Value should be 'Dummy'"
     *     }], 
     *     init: function(){
     *         // this only gets fired after initialization has been completed.
     *         console.log("ready");
     *     } 
     * }); 
     */
    APP.BaseField = function(obj) {

        var _element = null,
            _value = "",
            _events = [],
            _validators = [];

        /**
         * Attach HTMLelement reference, and setup events and validators. 
         * Will call a callback function when it's done.
         *
         * @function 
         * @memberof app.BaseField
         * @access public
         * @returns {Bool}
         */
        this.init = function() {

            var defaultEvents = ["update", "save", "sync", "validate"];

            // html element
            _element = obj.element;

            // starting value
            _value = _element.value;

            // setup default events listeners
            for (var i = 0, e = defaultEvents.length; i < e; i++) {
                _events[defaultEvents[i]] = [];
            }

            // setup custom events
            if (obj.events) {
                for (var j = 0, l = obj.events.length; j < l; j++) {
                    var _e = obj.events[j],
                        _evnt = _events[_e.name || _e] = _events[_e.name || _e] || [];

                    if (_e.callback && typeof _e.callback === 'function') {
                        _evnt.push(_e.callback);
                    }
                }
            }

            // setup default validator
            _validators.push({
                validator: function(val) {
                    // checks if value is not undefined
                    return val !== "";
                },
                message: "value can't be undefined."
            });

            // setup custom validators
            if (obj.validators) {
                for (var v = 0, k = obj.validators.length; v < k; v++) {
                    var _validator = obj.validators[v];

                    _validators.push({
                        validator: _validators.validator || _validator,
                        message: _validator.message
                    });
                }
            }

            // run custom initializers
            if (typeof obj.init === "function") {
                obj.init();
            }

            return true;
        };

        /**
         * Bind a callback to a custom event namespace, if the namespace doesn't
         * exists it will create one and add to it.
         *
         * @function 
         * @param {String} evnt Custom event name. 
         * @param {Function} func Callback function to be called when event is triggered.
         * @memberof app.BaseField
         * @returns {object} Returns context for chaining.
         */
        this.bind = function(evnt, func) {
            if (_events[evnt]) {
                _events[evnt].push(func);
            }

            return this;
        };

        /**
         * Unbind the referenced function event from a custom event namespace. 
         *
         * @function 
         * @param {String} evnt Custom event name. 
         * @param {Function} func Callback function reference.
         * @memberof app.BaseField
         * @returns {object} Returns context for chaining.
         */
        this.unbind = function(evnt, func) {
            for (var e = 0, v = _events[evnt].length; e < v; e++) {
                if (_events[evnt][e] === func) {
                    _events[evnt].splice(e, 1);
                    break;
                }
            }

            return this;
        };

        /**
         * Update value with a valid specified string. Triggers 'update' event, and send
         * the updated value as an event data attribute.
         *
         * @function 
         * @param {String} val Value to update field.
         * @param {Bool} force If true, value will be updated regardless of validation.
         * @memberof app.BaseField
         * @returns {object} Returns context for chaining.
         */
        this.update = function(val, force) {
            if (_value !== val && (this.validate(val) || force)) {
                _value = val;

                this.trigger("update", _value);
            }

            return this;
        };

        // update element value with custom element value
        this.save = function() {
            _element.value = _value;

            this.trigger("save", _value);

            return this;
        };

        // update custom element value with element value
        this.sync = function() {
            _value = _element.value;

            this.trigger("sync", _value);

            return this;
        };

        // run custom element value over validators
        this.validate = function(val) {
            var ret = {
                success: true,
                message: []
            },
                message = '"' + val + '" is not a valid value.';

            for (var v = 0, l = _validators.length; v < l; v++) {
                var _validator = _validators[v],
                    _ret = _validator.validator(val || _value);

                if (!_ret) {

                    ret.success = false;
                    ret.message.push(_validator.message || message);
                }
            }

            this.trigger("validate", ret);

            return ret;
        };

        /**
         * Update value with a valid specified string. Triggers 'update' event.  
         *
         * @function 
         * @memberof app.BaseField
         * @returns {object} Returns context for chaining.
         */
        this.trigger = function(evnt, data) {
            if (_events[evnt]) {
                for (var e = 0, v = _events[evnt].length; e < v; e++) {
                    var that = this,
                        _event = {
                            element: _element,
                            model: that,
                            event: evnt,
                            data: data,
                            time: new Date().getTime()
                        };

                    _events[evnt][e](_event);
                }
            }

            return this;
        };

        // call constructor
        this.init();
    };

}(this));
