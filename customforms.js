(function(global)
{

    "use strict";

    var APP = global.app = global.app || {};

    APP.BaseField = function(obj)
    {

        //  element   - html element
        //  value     - field value
        //  events    - event listeners
        //  validator - validators 
        var element = null,
            value = "",
            events = [],
            validator = [];

        // Constructor
        this.init = function(obj)
        {

            var defaultEvents = ["update", "save", "sync", "validate"];

            // html element
            element = obj.element;

            // starting value
            value = element.value;

            // setup default events listeners
            for (var i = 0, e = defaultEvents.length; i < e; i++)
            {
                events[defaultEvents[i]] = [];
            }

            // setup custom events
            if (obj.events)
            {
                for (var j = 0, l = obj.events.length; j < l; j++)
                {

                    events[obj.events[j]] = [];
                }
            }

            // setup default validator
            validator.push(function(val)
            {
                // checks if value is not undefined
                return val !== "";
            });

            // setup custom validators
            if (obj.validators)
            {
                for (var v = 0, k = obj.validators.length; v < k; v++)
                {
                    validator.push(obj.validators[v]);
                }
            }

            // run custom initializers
            if (typeof obj.init === "function")
            {
                obj.init();
            }
        };

        // attach event callback
        this.bind = function(evnt, func)
        {
            if (events[evnt])
            {
                events[evnt].push(func);
            }

            return this;
        };

        // remove events
        this.unbind = function(evnt, func)
        {
            for (var e = 0, v = events[evnt].length; e < v; e++)
            {
                if (events[evnt][e] === func)
                {
                    events[evnt].splice(e, 1);
                    break;
                }
            }

            return this;
        };

        // 
        this.update = function(val, force)
        {
            if (value !== val && (this.validate(val) || force))
            {
                value = val;

                this.trigger("update", value);
            }

            return this;
        };

        // update element value with custom element value
        this.save = function()
        {
            element.value = value;

            this.trigger("save", value);

            return this;
        };

        // update custom element value with element value
        this.sync = function()
        {
            value = element.value;

            this.trigger("sync", value);

            return this;
        };

        // run custom element value over validators
        this.validate = function(val)
        {
            var ret = true;

            for (var v = 0, l = validator.length; v < l; v++)
            {
                ret = validator[v](val || value);

                if (!ret)
                {
                    break;
                }
            }

            this.trigger("validate", ret);

            return ret;
        };

        // trigger custom event
        this.trigger = function(evnt, data)
        {
            if (events[evnt])
            {
                for (var e = 0, v = events[evnt].length; e < v; e++)
                {
                    events[evnt][e](data);
                }
            }

            return this;
        };

        // call constructor
        this.init(obj);
    };

}(this));

(function(global)
{

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


    module.Checkbox = function(obj)
    {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            opt = obj ? $.extend(
            {}, settings, obj) : settings,
            attachEvents = function()
            {
                $el.focusin(function()
                {
                    $customEl.addClass("focus");
                })
                    .focusout(function()
                {
                    $customEl.removeClass("focus");
                })
                    .change(function()
                {
                    instance.trigger("validate", $el.prop('checked'));
                });

                $customEl.click(function(e)
                {
                    e.preventDefault();

                    $el.prop('checked', !$el.prop('checked'));
                    instance.trigger("validate", $el.prop('checked'));
                });
            };

        opt.validators = opt.validators || [];

        opt.validators.push(function()
        {
            return $el.prop('checked');
        });

        opt.init = function()
        {

            // hide element
            $el.css(settings.hideCss);

            // create custom element
            $customEl = $("<" + settings.customEle + "/>");

            $customEl.attr(
            {
                id: settings.classPrefix + ($el.attr("id") || $el.attr("name")),
                'class': settings.classPrefix + "checkbox"
            });

            // append it to the markup before the element
            $el.before($customEl);

            // hides this element
            $customEl.addClass('customForm-hidden');

        };

        instance = new APP.BaseField(opt);

        instance.bind('validate', function(state)
        {
            $customEl[(!state ? 'remove' : 'add') + 'Class']('checked');
        });

        instance.trigger("validate", $el.prop('checked'));

        attachEvents();

        return instance;
    };

}(this));

(function(global)
{

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings = {
            active: true,
            blur_color: "#777",
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

$(function()
{

    /*
    var a = app.module.TextField({
        element: $("input[type='text']")[0],
        init: function() {
            console.log("starting");
        }
    });

    $('input[type="checkbox"]').each(function() {
        var b = app.module.Checkbox({
            element: $(this)[0],
            init: function() {
                console.log("starting");
            }
        });
    });
    */

});
