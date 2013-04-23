(function(global) {

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        DEFAULTS = {
            active: true,
            ready: function() {},
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
            SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            _id = DEFAULTS.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = DEFAULTS.classPrefix + 'file',
            _containerClass = _class + '-container',
            _size = {
                width: 0,
                height: 0,
                size: 0
            },

            getButtonSize = function(width) {
                // Firefox needs to set size to button in order for it to work
                return width - SETTINGS.BUTTON_BROWSER_SIZE;
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

        SETTINGS.validators = SETTINGS.validators || [];

        SETTINGS.init = function() {
            // hide element
            $el.css(DEFAULTS.hideCss);

            //// create custom element
            $customContainer = $("<" + SETTINGS.containerEle + "/>");

            // setup attr and styles to container
            $customContainer.attr({
                id: _id + '-container',
                'class': _containerClass
            }).css(SETTINGS.customContainerCss);

            // create custom element
            $customEl = $("<" + SETTINGS.customEle + "/>");

            // setup attr and styles to custom element
            $customEl.attr({
                id: _id,
                'class': _class
            }).css(SETTINGS.customElCss);


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
            $el.css($.extend({}, SETTINGS.elCss, _size));

            SETTINGS.ready();
        };

        instance = new APP.BaseField(SETTINGS);

        instance.bind('validate', function() {
            var _selectedText = getFileName();

            $customEl.html(_selectedText ? _selectedText : SETTINGS.holderTxt);
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
