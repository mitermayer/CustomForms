(function(global)
{

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings =
        {
            // Thats the default 'size' for a button
            // it is used to address some issues on firefox to apply the correct size.
            'BUTTON_BROWSER_SIZE': 36,
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
            holderTxt: "Upload..",
            hideCss:
            {
                opacity: '0',
                filter: 'alpha(opacity=0)',
                position: 'absolute',
                top: '0px',
                left: '0px',
                '-moz-opacity': '0',
                '-khtml-opacity': '0'
            },
            elCss:
            {
                display: "block",
                "text-align": "left",
                "-moz-appearance": "none",
                "-webkit-appearance": "none"
            },
            customContainerCss:
            {
                position: 'relative'
            },
            customElCss:
            {
                display: "block",
                overflow: "hidden",
                'white-space': "nowrap",
                'text-overflow': "ellipsis"
            }
        };


    module.File = function(obj)
    {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            $customContainer,
            opt = obj ? $.extend(true, {}, settings, obj) : settings,
            _id = settings.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = settings.classPrefix + 'file',
            _containerClass = _class + '-container',
            _callback = obj.init || function(){},
            _size =
            {
                width: 0,
                height: 0,
                size: 0
            },
            getButtonSize = function(width)
            {
                // Firefox needs to set size to button in order for it to work
                return width - opt.BUTTON_BROWSER_SIZE;
            },
            getFileName = function()
            {
                return $el.val().split('\\').pop();
            },
            attachEvents = function()
            {
                $el.focusin(function()
                {
                    $customContainer.addClass("focus");
                })
                    .focusout(function()
                {
                    $customContainer.removeClass("focus");
                })
                    .change(function()
                {
                    instance.validate();
                });
            };

        opt.validators = opt.validators || [];

        opt.init = function()
        {
            // hide element
            $el.css(settings.hideCss);

            //// create custom element
            $customContainer = $("<" + opt.containerEle + "/>");

            // setup attr and styles to container
            $customContainer.attr(
            {
                id: _id + '-container',
                'class': _containerClass
            }).css(opt.customContainerCss);

            // create custom element
            $customEl = $("<" + opt.customEle + "/>");

            // setup attr and styles to custom element
            $customEl.attr(
            {
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

        instance.bind('validate', function()
        {
            var _selectedText = getFileName();

            $customEl.html(_selectedText ? _selectedText : opt.holderTxt);
        });

        instance.validate();

        attachEvents();

        return instance;
    };

}(this));
