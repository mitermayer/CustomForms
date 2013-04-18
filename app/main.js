(function(global) {
    var APP = global.app = global.app || {};


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
    var fieldFactory = (function() {

        var SUPPORTED_ELMENTS = {},
            getTag = function(element) {
                return SUPPORTED_ELMENTS[element.nodeName.toLowerCase()];
            },
            callModule = function(moduleName, element, options) {
                var opt = options || {};
                opt.element = element;

                APP.module[moduleName](opt);
            },
            assertFilter = function(matchvalue, match) {
                var _lookUp = {
                    array: function() {
                        return match.indexOf(matchvalue) !== -1;
                    },
                    string: function() {
                        return matchvalue === match;
                    }
                };

                return _lookUp[typeof match === 'string' ? 'string' : 'array']();
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

                var tag = getTag($element[0]);

                for (var i = 0, len = tag.length; i < len; i++) {

                    if (typeof tag[i] === 'string') {

                        callModule(tag[i], $element[0], options[tag[i].toLowerCase()]);

                    } else {

                        if (checkFilter(tag[i].filter, $element)) {

                            callModule(tag[i].module, $element[0], options[tag[
                                i].module.toLowerCase()]);
                        }
                    }
                }
            },
            getSupportedChildren = function($parent, options) {
                $.each($parent.children(), function() {
                    if (getTag($(this)[0])) {
                        getModule($(this), options);
                    } else {
                        getSupportedChildren($(this), options);
                    }
                });
            },
            addSupportedElement = function(module, tag) {

                var filter = APP.module[module].target.filter || {},
                    item;

                // if we dont have element on the hash add it
                SUPPORTED_ELMENTS[tag] = SUPPORTED_ELMENTS[tag] || [];

                // if module has a filter add it, else just add input with module reference.
                item = filter[tag] ? {
                    filter: filter[tag],
                    module: module
                } : module;

                // push item to supported hash
                SUPPORTED_ELMENTS[tag].push(item);
            },
            lookUp = {
                'arr': function(module, tag) {
                    $.each(tag, function(key, value) {
                        addSupportedElement(module, value);
                    });
                },
                'default': addSupportedElement
            };

        // Build the supported list
        $.each(APP.module, function(key) {
            var _tag = APP.module[key].target.tagName;

            lookUp[$.isArray(_tag) ? 'arr' : 'default'](key, _tag);
        });

        //return function()
        return function(options) {

            $(this).each(function() {
                var _lookUp = {
                    validTag: getModule,
                    checkChildrenForValidTag: getSupportedChildren
                };

                _lookUp[getTag($(this)[0]) ? "validTag" :
                    "checkChildrenForValidTag"]($(this), options);
            });
        };

    })();

    $.fn.cstmForm = fieldFactory;

}(this));
