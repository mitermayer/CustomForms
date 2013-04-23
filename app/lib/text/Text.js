(function(global) {

    'use strict';

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        DEFAULTS = {
            active: true,
            blur_color: '#777',
            classPrefix: 'custom-',
            placeholder_support: (function() {
                return ('placeholder' in global.document.createElement('input'));
            })()
        };


    module.Text = function(obj) {

        var instance = false;

        if (!DEFAULTS.placeholder_support || obj.force) {

            var $el = $(obj.element),
                color = $el.css('color'),
                placeholder = $el.attr('placeholder'),
                SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
                _class = SETTINGS.classPrefix + 'textfield',
                _callback = obj.init || function() {},

                clearText = function() {
                    instance.update('', true).save();
                },
                toggleColor = function(state) {
                    $el.css('color', (state ? color : SETTINGS.blur_color));
                },
                setDefaultText = function() {
                    instance.update(placeholder, true).save();
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
                        .on('submit', function() {
                        validationFailProxy(function() {
                            clearText();
                        });
                    });
                };

            SETTINGS.validators = SETTINGS.validators || [];

            SETTINGS.validators.push(function(val) {
                return val !== placeholder;
            });

            SETTINGS.init = function() {
                $el.addClass(_class);

                _callback();
            };

            instance = new APP.BaseField(SETTINGS);

            instance.bind('validate', function(event) {
                var state = event.data.success;
                toggleColor(state);
            });

            attachEvents();
            addPlaceholder();
        }

        return instance;
    };

    // Define what elements should use this module
    module.Text.blueprint = {
        tagName: ['input', 'textarea'],
        filter: {
            input: {
                type: ['text', 'search', 'tel', 'url', 'email', 'password']
            }
        }
    };

}(this));
