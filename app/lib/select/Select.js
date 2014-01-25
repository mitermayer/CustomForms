(function(global) {

    "use strict";

    var APP = global.customformsjs = global.customformsjs || {},
        module = APP.module = APP.module || {},

        /**
         * Module default settings.
         *
         * @constant
         * @default
         * @access private
         * @memberof customformsjs.module.Select
         */
        DEFAULTS = {
            active: true,
            ready: function() {},
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


    /**
     * Add support for styling select fields.
     * A custom element is added behind the browser default select field,
     * and the select field is made transparent to create the illusion of a
     * custom element. Options can be passed to extend the defaults.
     *
     * @module Select
     * @param {Object} obj Options to initialize Select module.
     * @name customformsjs.module.Select
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      hideCss: { // styles can be overwritten or added.
     *          opacity: '0',
     *          filter: 'alpha(opacity=0)',
     *          position: 'absolute',
     *          top: '0px',
     *          left: '0px',
     *          '-moz-opacity': '0', *          '-khtml-opacity': '0'
     *      },
     *      elCss: { // styles can be overwritten or added.
     *          display: "block",
     *          '-webkit-appearance': 'none',
     *          '-moz-appearance': 'none'
     *      },
     *      customContainerCss: { // styles can be overwritten or added.
     *          position: 'relative'
     *      },
     *      customElCss: { // styles can be overwritten or added.
     *          display: "block",
     *          overflow: "hidden",
     *          'white-space': "nowrap",
     *          'text-overflow': "ellipsis"
     *      },
     *      element: obj, // select input field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.Select(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module Select.
     */
    module.Select = function(obj) {

        var instance = false;

        var SETTINGS = obj ? $.extend(true, {}, DEFAULTS, obj) : DEFAULTS,
            $el = $(SETTINGS.element),
            $customEl = null,
            $customContainer = null,
            _id = DEFAULTS.classPrefix + ($el.attr('id') || $el.attr('name')),
            _class = DEFAULTS.classPrefix + 'select',
            _containerClass = _class + '-container',
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

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * Select module works by adding a custom element behind the browser
             * select form field and making it transparent.
             *
             * @function
             * @memberof customformsjs.module.Select
             */
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

                // we than extend elCss with the dimensions and apply them to element.
                $el.css($.extend({}, SETTINGS.elCss, _size));

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Custom validator is added to find wich option is selected and get its text value.
             * Applying the option value the custom element as a text node.
             *
             * @function
             * @memberof customformsjs.module.Select
             */
            instance.bind('validate', function() {
                var _selectedText = $el.find('option:selected').text();

                _selectedText = _selectedText || $el.find('option').first().text();

                $customEl.html(_selectedText);
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'select'
     *
     * @property {Object} blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.Select
     */
    module.Select.blueprint = {
        tagName: 'select'
    };

}(this));
