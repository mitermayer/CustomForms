(function(global)
{

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},
        helper = APP.helper = APP.helper || {},

        settings = {
            active: true,
            blur_color: "#777",
            placeholder_support: (function()
            {
                return ('placeholder' in global.document.createElement('input'));
            })()
        },

        HELPER = helper.TextField = {
            toggleColor: function($el, color, state)
            {
                $el.css("color", (state ? color : settings.blur_color));
            },
            clearText: function(instance)
            {
                instance.update("", true)
                    .save();
            },
            setDefaultText: function(instance, placeholder)
            {
                instance.update(placeholder, true)
                    .save();
            },
            addPlaceholder: function(instance, setDefaultText)
            {
                if (!instance.sync()
                    .validate())
                {
                    setDefaultText();
                }
            },
            removePlaceholder: function(instance, clearText, toggleColor)
            {
                if (!instance.sync()
                    .validate())
                {
                    clearText();
                    toggleColor(true);
                }
            },
            attachEvents: function(instance, clearText, toggleColor,
                setDefaultText, $el)
            {
                $el.focusin(function()
                {
                    if (!instance.sync()
                        .validate())
                    {
                        clearText();
                        toggleColor(true);
                    }
                })
                    .focusout(function()
                {
                    if (!instance.sync()
                        .validate())
                    {
                        setDefaultText();
                    }
                })
                    .closest('form')
                    .on("submit", function()
                {
                    if (!instance.sync()
                        .validate())
                    {
                        clearText();
                    }
                });
            }
        };

    module.TextField = function(obj)
    {

        var instance = false;

        if (!settings.placeholder_support || obj.force)
        {

            var $el = $(obj.element),
                color = $el.css("color"),
                placeholder = $el.attr("placeholder"),
                opt = obj,
                toggleColor,
                clearText,
                setDefaultText,
                addPlaceholder,
                removePlaceholder,
                attachEvents;


            opt.validators = opt.validators || [];

            opt.validators.push(function(val)
            {
                return val !== placeholder;
            });

            instance = new APP.BaseField(opt);


            clearText = function()
            {
                HELPER.clearText(instance);
            };
            toggleColor = function(state)
            {
                HELPER.toggleColor($el, color, state);
            };
            setDefaultText = function()
            {
                HELPER.setDefaultText(instance, placeholder);
            };


            removePlaceholder = function()
            {
                HELPER.removePlaceholder(instance, clearText, toggleColor);
            };
            addPlaceholder = function()
            {
                HELPER.addPlaceholder(instance, setDefaultText);
            };
            attachEvents = function()
            {
                HELPER.attachEvents(instance, clearText, toggleColor,
                    setDefaultText, $el);
            };


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
