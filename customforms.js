(function(global) {

    "use strict";

    var APP = global.app = global.app || {};

    APP.BaseField = function(obj) {

        //  element   - html element
        //  value     - field value
        //  events    - event listeners
        //  validator - validators 
        var element = null,
            value = "",
            events = [],
            validator = [];

        // Constructor
        this.init = function(obj) {

            var defaultEvents = ["update", "save", "sync", "validate"];

            // html element
            element = obj.element;

            // starting value
            value = element.value;

            // setup default events listeners
            for (var i = 0, e = defaultEvents.length; i < e; i++) {
                events[defaultEvents[i]] = [];
            }

            // setup custom events
            if (obj.events) {
                for (var j = 0, l = obj.events.length; j < l; j++) {
                    var _e = obj.events[j],
                        _evnt = events[_e.name || _e] = events[_e.name || _e] || [];

                    if (_e.callback && typeof _e.callback === 'function') {
                        _evnt.push(_e.callback);
                    }
                }
            }

            // setup default validator
            validator.push({
                validator: function(val) {
                    // checks if value is not undefined
                    return val !== "";
                },
                message: "value can't be undefined."
            });

            // setup custom validators
            if (obj.validators) {
                for (var v = 0, k = obj.validators.length; v < k; v++) {
                    var _validator = obj.validators[v];

                    validator.push({
                        validator: _validator.validator || _validator,
                        message: _validator.message
                    });
                }
            }

            // run custom initializers
            if (typeof obj.init === "function") {
                obj.init();
            }
        };

        // attach event callback
        this.bind = function(evnt, func) {
            if (events[evnt]) {
                events[evnt].push(func);
            }

            return this;
        };

        // remove events
        this.unbind = function(evnt, func) {
            for (var e = 0, v = events[evnt].length; e < v; e++) {
                if (events[evnt][e] === func) {
                    events[evnt].splice(e, 1);
                    break;
                }
            }

            return this;
        };

        // 
        this.update = function(val, force) {
            if (value !== val && (this.validate(val) || force)) {
                value = val;

                this.trigger("update", value);
            }

            return this;
        };

        // update element value with custom element value
        this.save = function() {
            element.value = value;

            this.trigger("save", value);

            return this;
        };

        // update custom element value with element value
        this.sync = function() {
            value = element.value;

            this.trigger("sync", value);

            return this;
        };

        // run custom element value over validators
        this.validate = function(val) {
            var ret = {
                success: true,
                message: []
            },
                message = '"' + val + '" is not a valid value.';

            for (var v = 0, l = validator.length; v < l; v++) {
                var _validator = validator[v],
                    _ret = _validator.validator(val || value);

                if (!_ret) {

                    ret.success = false;
                    ret.message.push(_validator.message || message);
                }
            }

            this.trigger("validate", ret);

            return ret;
        };

        // trigger custom event
        this.trigger = function(evnt, data) {
            if (events[evnt]) {
                for (var e = 0, v = events[evnt].length; e < v; e++) {
                    var that = this,
                        _event = {
                            element: element,
                            model: that,
                            event: evnt,
                            data: data,
                            time: new Date().getTime()
                        };

                    events[evnt][e](_event);
                }
            }

            return this;
        };

        // call constructor
        this.init(obj);
    };

}(this));

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

(function(global) {

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings = {
            // Thats the default 'size' for a button
            // it is used to address some issues on firefox to apply the correct size.
            'BUTTON_BROWSER_SIZE': 36,
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            holderTxt: "Upload..",
            hideCss: {
                opacity: '0',
                filter: 'alpha(opacity=0)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                '-moz-opacity': '0',
                '-khtml-opacity': '0'
            },
            elCss: {
                display: "block",
                "text-align": "left",
                "-moz-appearance": "none",
                "-webkit-appearance": "none"
            },
            customContainerCss: {
                position: 'relative'
            },
            customElCss: {
                display: "block",
                overflow: "hidden",
                'white-space': "nowrap",
                'text-overflow': "ellipsis"
            }
        };


    module.File = function(obj) {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            $customContainer,
            opt = obj ? $.extend(true, {}, settings, obj) : settings,
            _id = settings.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = settings.classPrefix + 'file',
            _containerClass = _class + '-container',
            _callback = obj.init || function() {},
            _size = {
                width: 0,
                height: 0,
                size: 0
            },
            getButtonSize = function(width) {
                // Firefox needs to set size to button in order for it to work
                return width - opt.BUTTON_BROWSER_SIZE;
            },
            getFileName = function() {
                return $el.val().split('\\').pop();
            },
            attachEvents = function() {
                $el.focusin(function() {
                    $customContainer.addClass("focus");
                })
                    .focusout(function() {
                    $customContainer.removeClass("focus");
                })
                    .change(function() {
                    instance.validate();
                });
            };

        opt.validators = opt.validators || [];

        opt.init = function() {
            // hide element
            $el.css(settings.hideCss);

            //// create custom element
            $customContainer = $("<" + opt.containerEle + "/>");

            // setup attr and styles to container
            $customContainer.attr({
                id: _id + '-container',
                'class': _containerClass
            }).css(opt.customContainerCss);

            // create custom element
            $customEl = $("<" + opt.customEle + "/>");

            // setup attr and styles to custom element
            $customEl.attr({
                id: _id,
                'class': _class
            }).css(opt.customElCss);


            // add container before element
            $el.before($customContainer);

            // move element inside container
            $el.appendTo($customContainer);

            // move custom element inside container
            $customContainer.append($customEl);

            // only after object is added to the DOM we can calculate its dimensions
            _size.height = $customContainer.css("height");
            _size.width = $customContainer.css("width");
            _size.size = getButtonSize(parseInt(_size.width, 10));

            // we than extend elCss with the dimensions and apply them to element.
            $el.css($.extend({}, opt.elCss, _size));

            _callback();
        };

        instance = new APP.BaseField(opt);

        instance.bind('validate', function() {
            var _selectedText = getFileName();

            $customEl.html(_selectedText ? _selectedText : opt.holderTxt);
        });

        instance.validate();

        attachEvents();

        return instance;
    };

    // Define what elements should use this module
    module.File.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'file'
            }
        }
    };

}(this));

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
                opacity: '0',
                filter: 'alpha(opacity=0)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                '-moz-opacity': '0',
                '-khtml-opacity': '0'
            },
            elCss: {
                display: "block",
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none'
            },
            customContainerCss: {
                position: 'relative'
            },
            customElCss: {
                display: "block",
                overflow: "hidden",
                'white-space': "nowrap",
                'text-overflow': "ellipsis"
            }
        };


    module.Select = function(obj) {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            $customContainer,
            opt = obj ? $.extend(true, {}, settings, obj) : settings,
            _id = settings.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = settings.classPrefix + 'select',
            _containerClass = _class + '-container',
            _callback = obj.init || function() {},
            _size = {
                width: 0,
                height: 0
            },
            attachEvents = function() {
                $el.focusin(function() {
                    $customContainer.addClass("focus");
                })
                    .focusout(function() {
                    $customContainer.removeClass("focus");
                })
                    .change(function() {
                    instance.validate();
                });
            };

        opt.validators = opt.validators || [];

        opt.init = function() {
            // hide element
            $el.css(settings.hideCss);

            //// create custom element
            $customContainer = $("<" + opt.containerEle + "/>");

            // setup attr and styles to container
            $customContainer.attr({
                id: _id + '-container',
                'class': _containerClass
            }).css(opt.customContainerCss);

            // create custom element
            $customEl = $("<" + opt.customEle + "/>");

            // setup attr and styles to custom element
            $customEl.attr({
                id: _id,
                'class': _class
            }).css(opt.customElCss);


            // add container before element
            $el.before($customContainer);

            // move element inside container
            $el.appendTo($customContainer);

            // move custom element inside container
            $customContainer.append($customEl);

            // only after object is added to the DOM we can calculate its dimensions
            _size.height = $customContainer.css("height");
            _size.width = $customContainer.css("width");

            // we than extend elCss with the dimensions and apply them to element.
            $el.css($.extend({}, opt.elCss, _size));

            _callback();
        };

        instance = new APP.BaseField(opt);

        instance.bind('validate', function() {
            var _selectedText = $el.find('option:selected').text();

            _selectedText = _selectedText || $el.find('option').first().text();

            $customEl.html(_selectedText);
        });

        instance.validate();

        attachEvents();

        return instance;
    };

    // Define what elements should use this module
    module.Select.blueprint = {
        tagName: 'select'
    };

}(this));

(function(global) {

    'use strict';

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        DEFAULTS = {
            active: true,
            ready: function() {},
            blur_color: '#777',
            classPrefix: 'custom-',
            placeholder_support: (function() {
                return ('placeholder' in global.document.createElement('input'));
            })()
        };


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
                        .on('submit', function() {
                        validationFailProxy(function() {
                            clearText();
                        });
                    });
                };

            SETTINGS.validators = SETTINGS.validators || [];

            SETTINGS.validators.push(function(val) {
                return val !== _placeholder;
            });

            SETTINGS.init = function() {
                $el.addClass(_class);

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            instance.bind('validate', function(event) {
                var state = event.data.success;
                toggleColor(state);
            });

            addPlaceholder();
            attachEvents();
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

(function(global) {
    var APP = global.app = global.app || {},

        fieldFactory = (function() {

            /*
             *SUPPORTED_ELMENTS = {
             *    tagName: [
             *        {
             *            filter: { 'attrname': ['arrval'] },
             *            module: "moduleName"
             *        },
             *        {
             *            filter: { 'attrname2': 'strval' }
             *            module: "moduleName"
             *        },
             *        "strmodulename"
             *    ]
             *};
             */
            var SUPPORTED_ELMENTS = {},
                GLOBAL_OPTIONS = {},
                capitaliseFirstLetter = function(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                },
                callModule = function(moduleName, element, options) {
                    var opt = options || {},
                        settings = $.extend(true, {}, GLOBAL_OPTIONS, opt);

                    settings.element = element;

                    APP.module[moduleName](settings);
                },
                setGlobalOptions = function(options) {
                    // Global options are options that are not namespaced by a module name

                    // Reset on each call
                    GLOBAL_OPTIONS = {};

                    for (var option in options) {
                        if (!APP.module[capitaliseFirstLetter(option)]) {
                            GLOBAL_OPTIONS[option] = options[option];
                        }
                    }
                },
                getTag = function(element) {
                    return SUPPORTED_ELMENTS[element.nodeName.toLowerCase()];
                },
                assertFilter = function(matchvalue, match) {
                    var lookupTable = {
                        array: function() {
                            return $.inArray(matchvalue, match) !== -1;
                        },
                        string: function() {
                            return matchvalue === match;
                        }
                    };

                    return lookupTable[typeof match === 'string' ? 'string' :
                        'array']();
                },
                checkFilter = function(filter, $element) {

                    var ret = false;

                    $.each(filter, function(key, filter) {

                        ret = assertFilter($element.attr(key), filter);

                        if (ret) {
                            return false;
                        }
                    });

                    return ret;
                },
                getModule = function($element, options) {

                    var element = $element[0],
                        tag = getTag(element);

                    for (var i = 0, len = tag.length; i < len; i++) {
                        var _tag = tag[i],
                            _modulename = _tag.module || _tag,
                            _options = options[_modulename.toLowerCase()];


                        if (typeof _tag === 'string' || checkFilter(_tag.filter,
                            $element)) {
                            callModule(_modulename, element, _options);
                        }
                    }
                },
                getSupportedChildren = function($parent, options) {
                    $.each($parent.children(), function() {
                        var lookupTable = {
                            getModule: getModule,
                            getSupportedChildren: getSupportedChildren
                        };

                        lookupTable[getTag($(this)[0]) ? 'getModule' :
                            'getSupportedChildren']($(this), options);
                    });
                },
                addSupportedElement = function(module, tag) {

                    var filter = APP.module[module].blueprint.filter || {},
                        item;

                    // if we dont have element on the hash add it
                    SUPPORTED_ELMENTS[tag] = SUPPORTED_ELMENTS[tag] || [];

                    // if module has a filter add it, else just add input
                    // with module reference.
                    item = filter[tag] ? {
                        filter: filter[tag],
                        module: module
                    } : module;

                    // push item to supported hash
                    SUPPORTED_ELMENTS[tag].push(item);
                };


            // Build the supported list
            $.each(APP.module, function(key) {
                var _tag = APP.module[key].blueprint.tagName,
                    lookupTable = {
                        array: function(module, tag) {
                            $.each(tag, function(key, value) {
                                addSupportedElement(module, value);
                            });
                        },
                        string: addSupportedElement
                    };

                lookupTable[$.isArray(_tag) ? 'array' : 'string'](key, _tag);
            });

            //return function()
            return function(options) {
                setGlobalOptions(options);

                $(this).each(function() {
                    var lookupTable = {
                        validTag: getModule,
                        checkChildrenForValidTag: getSupportedChildren
                    };

                    lookupTable[getTag($(this)[0]) ? "validTag" :
                        "checkChildrenForValidTag"]($(this), options);
                });
            };

        })();

    $.fn.cstmForm = fieldFactory;

}(this));
