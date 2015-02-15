(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('customformsjs/radio', ['jquery', 'customformsjs/basefield'], function(
            $) {
            factory(window, $);
        });
    } else {
        // Browser globals
        factory(window, jQuery);
    }
}(function(global, $) {
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
                    $el.css(SETTINGS.hideCss);

                    // create custom element
                    $customEl = $("<" + SETTINGS.customEle + "/>");

                    $customEl.attr({
                            id: SETTINGS.classPrefix + $el.attr("name") + "-" + $el
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

    }));
