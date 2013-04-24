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
     * Add support for styling radio fields.
     *
     * @module Radio
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
                    instance.validate();
                });

                $customEl.click(function(e) {
                    e.preventDefault();

                    $el.prop('checked', true);
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
                id: DEFAULTS.classPrefix + $el.attr("name") + "-" + $el.val(),
                'class': _class + ' customForm-hidden ' + _groupClass
            });

            // append it to the markup before the element
            $el.before($customEl);

            SETTINGS.ready();
        };

        instance = new APP.BaseField(SETTINGS);

        instance.bind('validate', function(event) {
            var state = event.data.success;

            // uncheck them
            $('.' + _groupClass).removeClass('checked');

            $customEl[(!state ? 'remove' : 'add') + 'Class']('checked');
        });

        instance.validate();
        attachEvents();

        return instance;
    };

    // Define what elements should use this module
    module.Radio.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'radio'
            }
        }
    };

}(this));
