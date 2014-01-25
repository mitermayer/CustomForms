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
