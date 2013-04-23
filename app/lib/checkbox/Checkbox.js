(function(global) {

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings = {
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            hideCss: {
                position: 'absolute',
                left: '-9999px'
            }
        };


    module.Checkbox = function(obj) {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            _class = settings.classPrefix + 'checkbox',
            _callback = obj.init || function() {},
            opt = obj ? $.extend(true, {}, settings, obj) : settings,
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

        opt.validators = opt.validators || [];

        opt.validators.push(function() {
            return $el.prop('checked');
        });

        opt.init = function() {
            // hide element
            $el.css(settings.hideCss);

            // create custom element
            $customEl = $("<" + settings.customEle + "/>");

            $customEl.attr({
                id: settings.classPrefix + ($el.attr("id") || $el.attr("name")),
                'class': _class + ' customForm-hidden'
            });

            // append it to the markup before the element
            $el.before($customEl);

            _callback();
        };

        instance = new APP.BaseField(opt);

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
