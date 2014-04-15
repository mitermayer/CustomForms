(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {};

    /**
     * Base class for all modules, it provides a link between the html element and
     * the model. It also implements custom events and validators.
     *
     * @constructor
     * @name customformsjs.BaseField
     * @param {Object} obj Options to initialize BaseField.
     * @param {Object} obj.element Object that has an attribute 'value'.
     * @param {Array} obj.validators Field Validators.
     * @param {Array} obj.events Custom events.
     * @param {Function} obj.init Callback function to initialize subclass when BaseField is ready.
     * @example
     * new APP.BaseField({
     *     element: htmlelmenent,
     *     events: ["customEventNameSpace", { *         name: "otherCustomEventNamespace",
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
     * @returns {Object} Returns an Object with some base methods.
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
         * @memberof customformsjs.BaseField
         * @returns {Bool} Returns true with no error occur.
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
         * @memberof customformsjs.BaseField
         * @returns {Object} Returns context for chaining.
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
         * @memberof customformsjs.BaseField
         * @returns {Object} Returns context for chaining.
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
         * Update value with a valid specified String. Triggers 'update' event, and send
         * the updated value as an event data attribute.
         *
         * @function
         * @param {String} val Value to update field.
         * @param {Bool} force If true, value will be updated regardless of validation.
         * @memberof customformsjs.BaseField
         * @returns {Object} Returns context for chaining.
         */
        this.update = function(val, force) {
            if (_value !== val && (this.validate(val) || force)) {
                _value = val;

                this.trigger("update", _value);
            }

            return this;
        };

        /**
         * Update the related element with the value stored in this custom element.
         * Triggers 'save' event, and send the saved value as an event data attribute.
         *
         * @function
         * @memberof customformsjs.BaseField
         * @returns {Object} Returns context for chaining.
         */
        this.save = function() {
            _element.value = _value;

            this.trigger("save", _value);

            return this;
        };

        /**
         * Update the custom element with the value stored in element.
         * Triggers 'sync' event, and send the syncd value as an event data attribute.
         *
         * @function
         * @memberof customformsjs.BaseField
         * @returns {Object} returns context for chaining.
         */
        this.sync = function() {
            _value = _element.value;

            this.trigger("sync", _value);

            return this;
        };

        /**
         * Run all custom element validators over the String val.
         * Will return an Object with a property success and a property
         * message with an array of error messages.
         *
         * @function
         * @param {String} val  Value to be validated
         * @memberof customformsjs.BaseField
         * @returns {Object} Returns success status, and array of error messages.
         */
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
         * Triggers an event from a particular event namespace. Will call
         * all functions that are linked with that namespace with an Event Object.
         * It will have a reference to the element, custom element, event
         * namespace, timestamp and data that can be passed on as part of the trigger.
         *
         * @function
         * @param {String} evnt event namespace
         * @param {Object} data data to be passed on as part of the event
         * @memberof customformsjs.BaseField
         * @returns {Object} returns context for chaining.
         */
        this.trigger = function(evnt, data) {
            if (_events[evnt]) {
                for (var e = 0, v = _events[evnt].length; e < v; e++) {
                    var that = this,
                        _event = {
                            element: _element,
                            model: that,
                            event: evnt,
                            time: new Date().getTime(),
                            data: data
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
