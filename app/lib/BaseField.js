(function(global) {

    "use strict";

    var APP = global.app = global.app || {};

    APP.BaseField = function(obj) {

        //  element   - html element
        //  value     - field value
        //  events    - event listeners
        //  validator - validators 
        var _element = null,
            _value = "",
            _events = [],
            _validators = [];

        // Constructor
        this.init = function(obj) {

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
        };

        // attach event callback
        this.bind = function(evnt, func) {
            if (_events[evnt]) {
                _events[evnt].push(func);
            }

            return this;
        };

        // remove events
        this.unbind = function(evnt, func) {
            for (var e = 0, v = _events[evnt].length; e < v; e++) {
                if (_events[evnt][e] === func) {
                    _events[evnt].splice(e, 1);
                    break;
                }
            }

            return this;
        };

        // 
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

        // trigger custom event
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
        this.init(obj);
    };

}(this));
