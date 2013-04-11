(function(global)
{

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings =
        {
            active: true,
            blur_color: "#777",
            classPrefix: 'custom-',
            placeholder_support: (function()
            {
                return ('placeholder' in global.document.createElement('input'));
            })()
        };


    module.TextField = function(obj)
    {

        var instance = false;

        if (!settings.placeholder_support || obj.force)
        {

            var $el = $(obj.element),
                color = $el.css("color"),
                placeholder = $el.attr("placeholder"),
                opt = obj ? $.extend({}, settings, obj) : settings,
                _class = opt.classPrefix + 'textfield',
                _callback = obj.init || function(){},

                clearText = function()
                {
                    instance.update("", true).save();
                },
                toggleColor = function(state)
                {
                    $el.css("color", (state ? color : settings.blur_color));
                },
                setDefaultText = function()
                {
                    instance.update(placeholder, true).save();
                },
                validationFailProxy = function(func)
                {
                    if (!instance.sync().validate())
                    {
                        func();
                    }
                },
                addPlaceholder = function()
                {
                    validationFailProxy(function()
                    {
                        setDefaultText();
                    });
                },
                attachEvents = function()
                {
                    $el.focusin(function()
                    {
                        $(this).addClass("focus");
                        validationFailProxy(function()
                        {
                            clearText();

                            // overwrite default invalid color
                            toggleColor(true);
                        });
                    })
                        .focusout(function()
                    {
                        $(this).removeClass("focus");
                        addPlaceholder();
                    })
                        .closest('form')
                        .on("submit", function()
                    {
                        validationFailProxy(function()
                        {
                            clearText();
                        });
                    });
                };

            opt.validators = opt.validators || [];

            opt.validators.push(function(val)
            {
                return val !== placeholder;
            });

            opt.init = function()
            {
                $el.addClass(_class);

                _callback();
            };

            instance = new APP.BaseField(opt);

            instance.bind("validate", function(state)
            {
                toggleColor(state);
            });

            attachEvents();
            addPlaceholder();
        }

        return instance;
    };

}(this));
