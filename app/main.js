(function(global) {
    var APP = global.app = global.app || {},

        fieldFactory = (function() {

            /*
             *SUPPORTED_ELEMENTS = {
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
            var SUPPORTED_ELEMENTS = {},
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
                    // Global options are options that are 
                    // not namespaced by a module name

                    // Reset on each call
                    GLOBAL_OPTIONS = {};

                    for (var option in options) {
                        if (!APP.module[capitaliseFirstLetter(option)]) {
                            GLOBAL_OPTIONS[option] = options[option];
                        }
                    }
                },
                getTag = function(element) {
                    return SUPPORTED_ELEMENTS[element.nodeName.toLowerCase()];
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
                    SUPPORTED_ELEMENTS[tag] = SUPPORTED_ELEMENTS[tag] || [];

                    // if module has a filter add it, else just add input
                    // with module reference.
                    item = filter[tag] ? {
                        filter: filter[tag],
                        module: module
                    } : module;

                    // push item to supported hash
                    SUPPORTED_ELEMENTS[tag].push(item);
                },
                buildSupportedElementsList = function() {
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

                        lookupTable[$.isArray(_tag) ? 'array' : 'string'](key,
                            _tag);
                    });
                };

            // build list of supported modules
            buildSupportedElementsList();

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
