(function(global)
{

    "use strict";

    var APP = global.app = global.app || {},
        module = APP.module = APP.module || {},

        settings =
        {
            customEle: 'a',
            containerEle: 'div',
            autoHide: true,
            classPrefix: 'custom-',
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
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none'
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


    module.Select = function(obj)
    {

        var instance = false;

        var $el = $(obj.element),
            $customEl,
            $customContainer,
            opt = obj ? $.extend({}, settings, obj) : settings,
            _id = settings.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = settings.classPrefix + 'select',
            _containerClass = _class + '-container',
            _callback = obj.init || function(){},
            _size =
            {
                width: 0,
                height: 0
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
                    //instance.validate();
                    instance.trigger('validate');
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

            // we than extend elCss with the dimensions and apply them to element.
            $el.css($.extend({}, opt.elCss, _size));

            _callback();
        };

        instance = new APP.BaseField(opt);

        instance.bind('validate', function()
        {
            var _selectedText = $el.find('option:selected').text();

            _selectedText = _selectedText || $el.find('option').first().text();

            $customEl.html(_selectedText);
        });

        instance.trigger("validate");

        attachEvents();

        return instance;
    };

}(this));
