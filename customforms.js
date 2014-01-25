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

(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.Checkbox
         */
        DEFAULTS = {
            active: true,
            ready: function() {},
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            hideCss: {
                position: 'absolute',
                left: '-9999px'
            }
        };

    /**
     * Add support for styling input checkbox fields.
     * A custom element is added before the browser default input checkbox field,
     * The valued is binded to the default browser checkbox field. When clicking on
     * the custom element they will updated the default input checkbox and vise versa.
     * Updates on the browser default field will also trigger updates on the custom input field.
     * Options can be passed to extend the defaults.
     *
     * @module Checkbox
     * @param {Object} obj Options to initialize Checkbox module.
     * @name customformsjs.module.Checkbox
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      hideCss: { // styles can be overwritten or added.
     *          position: 'absolute',
     *          left: '-9999px'
     *      },
     *      element: obj, // input checkbox field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.Checkbox(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module Checkbox.
     */
    module.Checkbox = function(obj) {

        var instance = false;

        var SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            $el = $(SETTINGS.element),
            $customEl = null,
            _class = DEFAULTS.classPrefix + 'checkbox',

            attachEvents = function() {
                $el.focusin(function() {
                    $customEl.addClass("focus");
                })
                    .focusout(function() {
                        $customEl.removeClass("focus");
                    })
                    .change(function() {
                        instance.validate();
                    });

                $customEl.click(function(e) {
                    e.preventDefault();

                    $el.prop('checked', !$el.prop('checked'));
                    instance.validate();
                });
            };

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            SETTINGS.validators.push(function() {
                return $el.prop('checked');
            });

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * Checkbox module works by adding a custom element before the browser
             * input checkbox form field and binding their values together. When updating
             * one the other will be updated.
             *
             * @function
             * @memberof customformsjs.module.Checkbox
             */
            SETTINGS.init = function() {
                // hide element
                $el.css(DEFAULTS.hideCss);

                // create custom element
                $customEl = $("<" + DEFAULTS.customEle + "/>");

                $customEl.attr({
                    id: DEFAULTS.classPrefix + ($el.attr("id") || $el.attr(
                        "name")),
                    'class': _class + ' customForm-hidden'
                });

                // append it to the markup before the element
                $el.before($customEl);

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Updating custom element checked state will trigger an update on the browser
             * default input checkbox checked state property and vice versa.
             *
             * @function
             * @memberof customformsjs.module.Checkbox
             */
            instance.bind('validate', function(event) {
                var state = event.data.success;

                $customEl[(!state ? 'remove' : 'add') + 'Class']('checked');
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'input' with an attribute 'type' that
     * has a value of 'checkbox'.
     *
     * @property {Object} customformsjs.module.Checkbox.blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.Checkbox
     */
    module.Checkbox.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'checkbox'
            }
        }
    };

}(this));

(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.File
         */
        DEFAULTS = {
            active: true,
            ready: function() {},
            // Thats the default 'size' for a button
            // it is used to address some issues on firefox to apply the correct size.
            'BUTTON_BROWSER_SIZE': 36,
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            holderTxt: "Upload..",
            hideCss: {
                opacity: '0',
                filter: 'alpha(opacity=0)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                '-moz-opacity': '0',
                '-khtml-opacity': '0'
            },
            elCss: {
                display: "block",
                "text-align": "left",
                "-moz-appearance": "none",
                "-webkit-appearance": "none"
            },
            customContainerCss: {
                position: 'relative'
            },
            customElCss: {
                display: "block",
                overflow: "hidden",
                'white-space': "nowrap",
                'text-overflow': "ellipsis"
            }
        };


    /**
     * Add support for styling input file fields.
     * A custom element is added behind the browser default input file field,
     * and the file field is made transparent to create the illusion of a
     * custom element. Options can be passed to extend the defaults.
     *
     * @module File
     * @param {Object} obj Options to initialize Radio module.
     * @name customformsjs.module.File
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      // Thats the default 'size' for a button
     *      // it is used to address some issues on firefox to apply the correct size.
     *      'BUTTON_BROWSER_SIZE': 36,
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      holderTxt: "Upload..", // default text for input file placeholder
     *      hideCss: { // styles can be overwritten or added.
     *          opacity: '0',
     *          filter: 'alpha(opacity=0)',
     *          position: 'absolute',
     *          top: '0px',
     *          left: '0px',
     *          '-moz-opacity': '0',
     *          '-khtml-opacity': '0'
     *      },
     *      elCss: { // styles can be overwritten or added.
     *          display: "block",
     *          "text-align": "left",
     *          "-moz-appearance": "none",
     *          "-webkit-appearance": "none"
     *      },
     *      customContainerCss: { // styles can be overwritten or added.
     *          position: 'relative'
     *      },
     *      customElCss: { // styles can be overwritten or added.
     *          display: "block",
     *          overflow: "hidden",
     *          'white-space': "nowrap",
     *          'text-overflow': "ellipsis"
     *      },
     *      element: obj, // input file field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.File(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module File.
     */
    module.File = function(obj) {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            $customContainer,
            SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            _id = DEFAULTS.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = DEFAULTS.classPrefix + 'file',
            _containerClass = _class + '-container',
            _size = {
                width: 0,
                height: 0,
                size: 0
            },

            getButtonSize = function(width) {
                // Firefox needs to set size to button in order for it to work
                return width - SETTINGS.BUTTON_BROWSER_SIZE;
            },
            getFileName = function() {
                return $el.val().split('\\').pop();
            },
            attachEvents = function() {
                $el.focusin(function() {
                    $customContainer.addClass("focus");
                })
                    .focusout(function() {
                        $customContainer.removeClass("focus");
                    })
                    .change(function() {
                        instance.validate();
                    });
            };

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * File module works by adding a custom element behind the browser
             * input file form field and making it transparent. There is also some browser
             * specifics to calculate the final size in order to be fully on top of the
             * input file field.
             *
             * @function
             * @memberof customformsjs.module.File
             */
            SETTINGS.init = function() {
                // hide element
                $el.css(DEFAULTS.hideCss);

                //// create custom element
                $customContainer = $("<" + SETTINGS.containerEle + "/>");

                // setup attr and styles to container
                $customContainer.attr({
                    id: _id + '-container',
                    'class': _containerClass
                }).css(SETTINGS.customContainerCss);

                // create custom element
                $customEl = $("<" + SETTINGS.customEle + "/>");

                // setup attr and styles to custom element
                $customEl.attr({
                    id: _id,
                    'class': _class
                }).css(SETTINGS.customElCss);


                // add container before element
                $el.before($customContainer);

                // move element inside container
                $el.appendTo($customContainer);

                // move custom element inside container
                $customContainer.append($customEl);

                // only after object is added to the DOM we can calculate its dimensions
                _size.height = $customContainer.css("height");
                _size.width = $customContainer.css("width");
                _size.size = getButtonSize(parseInt(_size.width, 10));

                // we than extend elCss with the dimensions and apply them to element.
                $el.css($.extend({}, SETTINGS.elCss, _size));

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Custom validator is added to find if there is a selected file for input field.
             * Applying the filename value to the custom element as a text node, or the holding text.
             *
             * @function
             * @memberof customformsjs.module.File
             */
            instance.bind('validate', function() {
                var _selectedText = getFileName();

                $customEl.html(_selectedText ? _selectedText : SETTINGS.holderTxt);
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'input' with an attribute 'type' that
     * has a value of 'file'.
     *
     * @property {Object} customformsjs.module.File.blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.File
     */
    module.File.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'file'
            }
        }
    };

}(this));

(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.Radio
         */
        DEFAULTS = {
            active: true,
            ready: function() {},
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            hideCss: {
                position: 'absolute',
                left: '-9999px'
            }
        };


    /**
     * Add support for styling input radio fields.
     * A custom element is added before the browser default input radio field,
     * The valued is binded to the default browser radio field. When clicking on
     * the custom element they will updated the default input radio and vise versa.
     * Updates on the browser default field will also trigger updates on the custom input field.
     * Options can be passed to extend the defaults.
     *
     * @module Radio
     * @param {Object} obj Options to initialize Radio module.
     * @name customformsjs.module.Radio
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      hideCss: { // styles can be overwritten or added.
     *          position: 'absolute',
     *          left: '-9999px'
     *      },
     *      element: obj, // input radio field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.Radio(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module Radio.
     */
    module.Radio = function(obj) {

        var instance = false;

        var SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            $el = $(SETTINGS.element),
            $customEl = null,
            _class = SETTINGS.classPrefix + 'radio',
            _group = $el.attr("name"),
            _groupClass = _class + '-' + _group,

            attachEvents = function() {
                $el.focusin(function() {
                    $customEl.addClass("focus");
                })
                    .focusout(function() {
                        $customEl.removeClass("focus");
                    })
                    .change(function() {
                        // uncheck other radio buttons in group
                        $('.' + _groupClass).removeClass('checked');

                        instance.validate();
                    });

                $customEl.click(function(e) {
                    e.preventDefault();

                    $el.prop('checked', true);
                    // ensure original element `change` event is fired
                    $el.trigger('change');

                    instance.validate();
                });
            };

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            SETTINGS.validators.push(function() {
                return $el.prop('checked');
            });

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * Radio module works by adding a custom element before the browser
             * input radio form field and binding their values together. When updating
             * one the other will be updated.
             *
             * @function
             * @memberof customformsjs.module.Radio
             */
            SETTINGS.init = function() {
                // hide element
                $el.css(DEFAULTS.hideCss);

                // create custom element
                $customEl = $("<" + DEFAULTS.customEle + "/>");

                $customEl.attr({
                    id: DEFAULTS.classPrefix + $el.attr("name") + "-" + $el
                        .val(),
                    'class': _class + ' customForm-hidden ' + _groupClass
                });

                // append it to the markup before the element
                $el.before($customEl);

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Custom validator is added to uncheck all custom elements and default browser
             * input radio form elements of a particular group and than than check the
             * selected custom element and input radio form element. This way only a single
             * element of a group can be checked at a time.
             *
             * @function
             * @memberof customformsjs.module.Radio
             */
            instance.bind('validate', function(event) {
                var state = event.data.success;

                $customEl[(!state ? 'remove' : 'add') + 'Class']('checked');
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'input' with an attribute 'type' that
     * has a value of 'radio'.
     *
     * @property {Object} customformsjs.module.Radio.blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.Radio
     */
    module.Radio.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'radio'
            }
        }
    };

}(this));

(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.Select
         */
        DEFAULTS = {
            active: true,
            ready: function() {},
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            hideCss: {
                opacity: '0',
                filter: 'alpha(opacity=0)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                '-moz-opacity': '0',
                '-khtml-opacity': '0'
            },
            elCss: {
                display: "block",
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none'
            },
            customContainerCss: {
                position: 'relative'
            },
            customElCss: {
                display: "block",
                overflow: "hidden",
                'white-space': "nowrap",
                'text-overflow': "ellipsis"
            }
        };


    /**
     * Add support for styling select fields.
     * A custom element is added behind the browser default select field,
     * and the select field is made transparent to create the illusion of a
     * custom element. Options can be passed to extend the defaults.
     *
     * @module Select
     * @param {Object} obj Options to initialize Select module.
     * @name customformsjs.module.Select
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      hideCss: { // styles can be overwritten or added.
     *          opacity: '0',
     *          filter: 'alpha(opacity=0)',
     *          position: 'absolute',
     *          top: '0px',
     *          left: '0px',
     *          '-moz-opacity': '0', *          '-khtml-opacity': '0'
     *      },
     *      elCss: { // styles can be overwritten or added.
     *          display: "block",
     *          '-webkit-appearance': 'none',
     *          '-moz-appearance': 'none'
     *      },
     *      customContainerCss: { // styles can be overwritten or added.
     *          position: 'relative'
     *      },
     *      customElCss: { // styles can be overwritten or added.
     *          display: "block",
     *          overflow: "hidden",
     *          'white-space': "nowrap",
     *          'text-overflow': "ellipsis"
     *      },
     *      element: obj, // select input field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.Select(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module Select.
     */
    module.Select = function(obj) {

        var instance = false;

        var SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            $el = $(SETTINGS.element),
            $customEl = null,
            $customContainer = null,
            _id = DEFAULTS.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = DEFAULTS.classPrefix + 'select',
            _containerClass = _class + '-container',
            _size = {
                width: 0,
                height: 0
            },

            attachEvents = function() {
                $el.focusin(function() {
                    $customContainer.addClass("focus");
                })
                    .focusout(function() {
                        $customContainer.removeClass("focus");
                    })
                    .change(function() {
                        instance.validate();
                    });
            };

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * Select module works by adding a custom element behind the browser
             * select form field and making it transparent.
             *
             * @function
             * @memberof customformsjs.module.Select
             */
            SETTINGS.init = function() {
                // hide element
                $el.css(DEFAULTS.hideCss);

                //// create custom element
                $customContainer = $("<" + SETTINGS.containerEle + "/>");

                // setup attr and styles to container
                $customContainer.attr({
                    id: _id + '-container',
                    'class': _containerClass
                }).css(SETTINGS.customContainerCss);

                // create custom element
                $customEl = $("<" + SETTINGS.customEle + "/>");

                // setup attr and styles to custom element
                $customEl.attr({
                    id: _id,
                    'class': _class
                }).css(SETTINGS.customElCss);


                // add container before element
                $el.before($customContainer);

                // move element inside container
                $el.appendTo($customContainer);

                // move custom element inside container
                $customContainer.append($customEl);

                // only after object is added to the DOM we can calculate its dimensions
                _size.height = $customContainer.css("height");
                _size.width = $customContainer.css("width");

                // we than extend elCss with the dimensions and apply them to element.
                $el.css($.extend({}, SETTINGS.elCss, _size));

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Custom validator is added to find wich option is selected and get its text value.
             * Applying the option value the custom element as a text node.
             *
             * @function
             * @memberof customformsjs.module.Select
             */
            instance.bind('validate', function() {
                var _selectedText = $el.find('option:selected').text();

                _selectedText = _selectedText || $el.find('option').first().text();

                $customEl.html(_selectedText);
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'select'
     *
     * @property {Object} blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.Select
     */
    module.Select.blueprint = {
        tagName: 'select'
    };

}(this));

(function(global) {

    'use strict';

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.Text
         */
        DEFAULTS = {
            active: true,
            force: false,
            ready: function() {},
            blur_color: '#777',
            classPrefix: 'custom-',
            placeholder_support: (function() {
                return ('placeholder' in global.document.createElement('input'));
            })()
        };


    /**
     * Add support for placeholder in browsers that don't natively support it.
     * Options can be passed to extend the defaults. When adding custom validators they
     * will force the placeholder to appear when failing validation.
     *
     * @module Text
     * @param {Object} obj Options to initialize Text module.
     * @name customformsjs.module.Text
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      force: false, // force to use custom placeholders even when browser natively support it.
     *      ready: function() {}, // callback when module is ready.
     *      blur_color: '#777', // blur color used to mimic placeholder color.
     *      classPrefix: 'custom-', // prefix used for class.
     *      placeholder_support: (function() { // this is used to check if placeholder support is enabled.
     *          return ('placeholder' in global.document.createElement('input'));
     *      })()
     *      element: obj, // input ('text', 'search', 'tel', 'url', 'email', 'password') field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.Text(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module Text.
     */
    module.Text = function(obj) {

        var instance = false;

        if (!DEFAULTS.placeholder_support || obj.force) {

            var SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
                $el = $(SETTINGS.element),
                _class = SETTINGS.classPrefix + 'textfield',
                _color = $el.css('color'),
                _placeholder = $el.attr('placeholder'),

                clearText = function() {
                    instance.update('', true).save();
                },
                toggleColor = function(state) {
                    $el.css('color', (state ? _color : SETTINGS.blur_color));
                },
                setDefaultText = function() {
                    instance.update(_placeholder, true).save();
                },
                validationFailProxy = function(func) {
                    if (!instance.sync().validate().success) {
                        func();
                    }
                },
                addPlaceholder = function() {
                    validationFailProxy(function() {
                        setDefaultText();
                    });
                },
                attachEvents = function() {
                    $el.focusin(function() {
                        $(this).addClass('focus');
                        validationFailProxy(function() {
                            clearText();

                            // overwrite default invalid color
                            toggleColor(true);
                        });
                    })
                        .focusout(function() {
                            $(this).removeClass('focus');
                            addPlaceholder();
                        })
                        .closest('form')
                        .bind('submit', function() {
                            validationFailProxy(function() {
                                clearText();
                            });
                        });
                };

            // only initialize the module if the is a placeholder attribute on the input
            if (SETTINGS.active && _placeholder) {

                SETTINGS.validators = SETTINGS.validators || [];

                SETTINGS.validators.push(function(val) {
                    return val !== _placeholder;
                });

                /**
                 * Initializer for module. Will mimic default browser placeholder by
                 * applying a placeholder when input have an invalid field. This can be used
                 * in conjuction of custom validators.
                 *
                 * @function
                 * @memberof customformsjs.module.Text
                 */
                SETTINGS.init = function() {
                    $el.addClass(_class);

                    SETTINGS.ready();
                };

                instance = new APP.BaseField(SETTINGS);

                /**
                 * When validation fails, custom placeholder will be added.
                 *
                 * @function
                 * @memberof customformsjs.module.Text
                 */
                instance.bind('validate', function(event) {
                    var state = event.data.success;
                    toggleColor(state);
                });

                addPlaceholder();
                attachEvents();
            }
        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'input' with an attribute 'type' that
     * has a value of ('text', 'search', 'tel', 'url', 'email', 'password') field.
     *
     * @property {Object} customformsjs.module.Text.blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.Text
     */
    module.Text.blueprint = {
        tagName: ['input', 'textarea'],
        filter: {
            input: {
                type: ['text', 'search', 'tel', 'url', 'email', 'password']
            }
        }
    };

}(this));

(function(global) {

    /**
     * @namespace
     * @name customformsjs
     * @example
     * // You can overwrite defaults by passing an object with some options, when an option is passed
     * // without a module name as namespace it will be a global option, module namespaced options will
     * // overwrite global options, also modules will have some options that are particular for that module,
     * // please refer to the documentation page to see all possible options for each module.
     *  var options = { active: true, lowercasemodulename: { active: false } };
     *
     *  // All supported elements inside container, will recurse to find all elements
     *  $('#container').cstmForm( options )
     *
     *  // All Form elements
     *  $('form').cstmForm( options )
     *
     *  // target a certain group of element
     *  $('input[type=file]').cstmForm( options )
     *
     *  // You can target specific groups of elements
     *  $('input[type=radio], input[type=checkbox], select').cstmForm( options )
     */
    var APP = global.customformsjs = global.customformsjs || {},

        fieldFactory = (function() {

            var SUPPORTED_ELEMENTS = {},
                GLOBAL_OPTIONS = {},
                capitaliseFirstLetter = function(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                },
                callModule = function(moduleName, element, options) {
                    var opt = options || {},
                        settings = $.extend(true, {}, GLOBAL_OPTIONS, opt);

                    settings.element = element;

                    APP.module[moduleName](settings);
                },
                setGlobalOptions = function(options) {
                    // Global options are options that are 
                    // not namespaced by a module name

                    // Reset on each call
                    GLOBAL_OPTIONS = {};

                    for (var option in options) {
                        if (!APP.module[capitaliseFirstLetter(option)]) {
                            GLOBAL_OPTIONS[option] = options[option];
                        }
                    }
                },
                getTag = function(element) {
                    return SUPPORTED_ELEMENTS[element.nodeName.toLowerCase()];
                },
                assertFilter = function(matchvalue, match) {
                    var lookupTable = {
                        array: function() {
                            return $.inArray(matchvalue, match) !== -1;
                        },
                        string: function() {
                            return matchvalue === match;
                        }
                    };

                    return lookupTable[typeof match === 'string' ? 'string' :
                        'array']();
                },
                checkFilter = function(filter, $element) {

                    var ret = false;

                    $.each(filter, function(key, filter) {

                        ret = assertFilter($element.attr(key), filter);

                        if (ret) {
                            return false;
                        }
                    });

                    return ret;
                },
                getModule = function($element, options) {

                    var element = $element[0],
                        tag = getTag(element);

                    for (var i = 0, len = tag.length; i < len; i++) {
                        var _tag = tag[i],
                            _modulename = _tag.module || _tag,
                            _options = options[_modulename.toLowerCase()];


                        if (typeof _tag === 'string' || checkFilter(_tag.filter,
                            $element)) {
                            callModule(_modulename, element, _options);
                        }
                    }
                },
                getSupportedChildren = function($parent, options) {
                    $.each($parent.children(), function() {
                        var lookupTable = {
                            getModule: getModule,
                            getSupportedChildren: getSupportedChildren
                        };

                        lookupTable[getTag($(this)[0]) ? 'getModule' :
                            'getSupportedChildren']($(this), options);
                    });
                },
                addSupportedElement = function(module, tag) {

                    var filter = APP.module[module].blueprint.filter || {},
                        item;

                    // if we dont have element on the hash add it
                    SUPPORTED_ELEMENTS[tag] = SUPPORTED_ELEMENTS[tag] || [];

                    // if module has a filter add it, else just add input
                    // with module reference.
                    item = filter[tag] ? {
                        filter: filter[tag],
                        module: module
                    } : module;

                    // push item to supported hash
                    SUPPORTED_ELEMENTS[tag].push(item);
                },
                buildSupportedElementsList = function() {
                    $.each(APP.module, function(key) {
                        var _tag = APP.module[key].blueprint.tagName,
                            lookupTable = {
                                array: function(module, tag) {
                                    $.each(tag, function(key, value) {
                                        addSupportedElement(module, value);
                                    });
                                },
                                string: addSupportedElement
                            };

                        lookupTable[$.isArray(_tag) ? 'array' : 'string'](key,
                            _tag);
                    });
                };

            // Build list of supported modules on the following format:
            //
            //SUPPORTED_ELEMENTS = {
            //    tagName: [
            //        {
            //            filter: { 'attrname': ['arrval'] },
            //            module: "moduleName"
            //        },
            //        {
            //            filter: { 'attrname2': 'strval' }
            //            module: "moduleName"
            //        },
            //        "strmodulename"
            //    ]
            //};
            buildSupportedElementsList();

            //return function()
            return function(options) {
                setGlobalOptions(options);

                $(this).each(function() {
                    var lookupTable = {
                        validTag: getModule,
                        checkChildrenForValidTag: getSupportedChildren
                    };

                    lookupTable[getTag($(this)[0]) ? "validTag" :
                        "checkChildrenForValidTag"]($(this), options);
                });
            };

        })();

    // assign to jquery as a pluggin
    $.fn.cstmForm = fieldFactory;

}(this));
