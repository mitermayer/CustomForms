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
         * @memberof customformsjs.module.File
         */
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


    /**
     * Add support for styling input file fields.
     * A custom element is added behind the browser default input file field,
     * and the file field is made transparent to create the illusion of a
     * custom element. Options can be passed to extend the defaults.
     *
     * @module File
     * @param {Object} obj Options to initialize Radio module.
     * @name customformsjs.module.File
     * @example
     * var DEFAULTS = {
     *      active: true, // active by default
     *      ready: function() {}, // callback when module is ready.
     *      // Thats the default 'size' for a button
     *      // it is used to address some issues on firefox to apply the correct size.
     *      'BUTTON_BROWSER_SIZE': 36,
     *      customEle: 'a', // default element for handle.
     *      containerEle: 'div', // default element for container.
     *      autoHide: true, // will auto hide html element by default
     *      classPrefix: 'custom-', // prefix used for class.
     *      holderTxt: "Upload..", // default text for input file placeholder
     *      hideCss: { // styles can be overwritten or added.
     *          opacity: '0',
     *          filter: 'alpha(opacity=0)',
     *          position: 'absolute',
     *          top: '0px',
     *          left: '0px',
     *          '-moz-opacity': '0',
     *          '-khtml-opacity': '0'
     *      },
     *      elCss: { // styles can be overwritten or added.
     *          display: "block",
     *          "text-align": "left",
     *          "-moz-appearance": "none",
     *          "-webkit-appearance": "none"
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
     *      element: obj, // input file field.
     *      events: [], // custom events can be added.
     *      validators: [] // custom validators can be added.
     * };
     *
     * customformsjs.module.File(DEFAULTS);
     *
     * @returns {Object} Returns an Instance of module File.
     */
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

        if (SETTINGS.active) {

            SETTINGS.validators = SETTINGS.validators || [];

            /**
             * Initializer for module. Will create custom elements and apply
             * default styles to it. Here will also be browser specific features.
             * File module works by adding a custom element behind the browser
             * input file form field and making it transparent. There is also some browser
             * specifics to calculate the final size in order to be fully on top of the
             * input file field.
             *
             * @function
             * @memberof customformsjs.module.File
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
                _size.size = getButtonSize(parseInt(_size.width, 10));

                // we than extend elCss with the dimensions and apply them to element.
                $el.css($.extend({}, SETTINGS.elCss, _size));

                SETTINGS.ready();
            };

            instance = new APP.BaseField(SETTINGS);

            /**
             * Custom validator is added to find if there is a selected file for input field.
             * Applying the filename value to the custom element as a text node, or the holding text.
             *
             * @function
             * @memberof customformsjs.module.File
             */
            instance.bind('validate', function() {
                var _selectedText = getFileName();

                $customEl.html(_selectedText ? _selectedText : SETTINGS.holderTxt);
            });

            instance.validate();
            attachEvents();

        }

        return instance;
    };

    /**
     * Blueprint used to allow custom field creation.
     * Element must be an object with a tagname 'input' with an attribute 'type' that
     * has a value of 'file'.
     *
     * @property {Object} customformsjs.module.File.blueprint used to see if element meet module requirements.
     * @memberof customformsjs.module.File
     */
    module.File.blueprint = {
        tagName: 'input',
        filter: {
            input: {
                type: 'file'
            }
        }
    };

}(this));
