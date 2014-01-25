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
