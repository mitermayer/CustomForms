(function(global) {

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

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
     * Add support for styling checkbox fields.
     *
     * @module Checkbox
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

        SETTINGS.validators = SETTINGS.validators || [];

        SETTINGS.validators.push(function() {
            return $el.prop('checked');
        });

        SETTINGS.init = function() {
            // hide element
            $el.css(DEFAULTS.hideCss);

            // create custom element
            $customEl = $("<" + DEFAULTS.customEle + "/>");

            $customEl.attr({
                id: DEFAULTS.classPrefix + ($el.attr("id") || $el.attr("name")),
                'class': _class + ' customForm-hidden'
            });

            // append it to the markup before the element
            $el.before($customEl);

            SETTINGS.ready();
        };

        instance = new APP.BaseField(SETTINGS);

        instance.bind('validate', function(event) {
            var state = event.data.success;

            $customEl[(!state ? 'remove' : 'add') + 'Class']('checked');
        });

        instance.validate();
        attachEvents();

        return instance;
    };

    // Define what elements should use this module
    module.Checkbox.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'checkbox'
            }
        }
    };

}(this));
