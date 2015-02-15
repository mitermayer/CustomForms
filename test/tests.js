(function(global) {
    var checkbox, customEl, form, input,
        ATTR = {
            checked: false,
            id: 'something',
            name: 'something',
            type: 'checkbox',
            value: '1'
        },
        SETTINGS = {
            classPrefix: 'custom-'
        };

    module('Checkbox - initialization', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Checkbox,
            'The Checkbox module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(checkbox, 'The checkbox module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-checkbox" class applied to it.', function() {
        strictEqual(customEl.hasClass('custom-checkbox'), true,
            'Custom element should have class custom-checkbox when initializing.');
    });

    test(
        'Testing element does not have class "checked" when input does not have checked property upon initialization.', function() {
            strictEqual(customEl.hasClass('checked'), false,
                'Custom element should not have class "checked".');
        });

    test(
        'Testing element has class "checked" when input has checked property upon initialization.', function() {
            initializeCheckboxWithCheckedStateValue(true);

            strictEqual(customEl.hasClass('checked'), true,
                'custom element should have class "checked".');
        });

    module('Checkbox - interactions.', {
            setup: setup,
            tearDown: tearDown
        });

    test(
        'Testing that when "checked" element is clicked will remove "checked" class from custom element.', function() {
            changeInputCheckedValueAndCLickOnIt(true);

            strictEqual(customEl.hasClass('checked'), false,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that when "unchecked" element is clicked will add "checked" class to custom element.', function() {
            changeInputCheckedValueAndCLickOnIt(false);

            strictEqual(customEl.hasClass('checked'), true,
                'When element property checked is set to true, customEl should have class checked.');
        });

    test(
        'Testing that when "unchecked" custom element is clicked it will add "checked" property to element.', function() {
            changeInputCheckedValueAndCLickOnCustomElement(false);

            strictEqual(input.prop('checked'), true,
                'When customEl is clicked and previously it did have class checked, it should updated input checked property to false.');
        });

    test(
        'Testing that when "checked" custom element is clicked it will remove "checked" property from element.', function() {
            changeInputCheckedValueAndCLickOnCustomElement(true);

            strictEqual(input.prop('checked'), false,
                'When customEl is clicked and previously it did have class checked, it should updated input checked property to false.');
        });

    test(
        'Testing that when focus is triggered on element it adds class "focus" to custom element.', function() {
            input.focus();

            strictEqual(customEl.hasClass('focus'), true,
                'When element receive focus, customEl should have class focus added to it.');
        });

    test(
        'Testing that custom element removes class "focus" when element loses focus.', function() {
            input.focus().blur();

            strictEqual(customEl.hasClass('focus'), false,
                'When element loses focus, customEl should have class focus removed from it.');
        });

    function changeInputCheckedValueAndCLickOnCustomElement(val) {
        input.prop('checked', val);
        customEl.click();
    }

    function changeInputCheckedValueAndCLickOnIt(val) {
        input.prop('checked', val);
        input.click();
    }

    function initializeCheckboxWithCheckedStateValue(checked) {
        form = $('<form />');
        input = $('<input />');
        input.attr(ATTR).prop('checked', typeof checked !== 'undefined' ?
            checked : ATTR.checked);

        $('#qunit-fixture').html(form.append(input));

        checkbox = customformsjs.module.Checkbox({
                element: input[0],
                classPrefix: SETTINGS.classPrefix
            });

        customEl = $('#' + SETTINGS.classPrefix + ATTR.id);
    }

    function setup() {
        initializeCheckboxWithCheckedStateValue(ATTR.checked);
    }

    function tearDown() {
        checkbox = null;
        customEl = null;
        form = null;
        input = null;
        $('#qunit-fixture').html('');
    }

}(this));

(function(global) {
    var form,
        file,
        input,
        customEl,
        customElContainer,
        SETTINGS = {
            classPrefix: 'custom-',
            holderTxt: 'insert..'
        },
        ATTR = {
            name: 'something',
            type: 'file',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('File - initialization', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.File, 'The File module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(file, 'The File module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-file" class applied to it.', function() {
        strictEqual(customEl.hasClass('custom-file'), true,
            'Custom element should have class custom-file when initializing.');
    });

    test(
        'Testing custom element container has "custom-file-container" class applied to it.', function() {
            strictEqual(customElContainer.hasClass('custom-file-container'),
                true,
                'Custom element container should have class custom-file-container when initializing.');
        });

    test(
        'Testing custom element has a holder text applied to it when it is empty valued.', function() {
            strictEqual(customEl.html(), SETTINGS.holderTxt,
                'When initializing file and there is not a file value attached to the input, custom element should have holder text.');
        });

    function initializeFileWithValue() {
        form = $('<form />');
        input = $('<input />');
        input.attr(ATTR).val(val);

        $('#qunit-fixture').html(form.append(input));

        textfield = customformsjs.module.Text({
                element: input[0],
                force: true
            });
    }

    function setup() {
        var options,
            _customElContainerId,
            _customElId;

        form = $('<form />');

        input = $('<input />');
        input.attr(ATTR);

        form.append(input);

        $('#qunit-fixture').append(form);

        file = customformsjs.module.File({
                element: input.get(0),
                classPrefix: SETTINGS.classPrefix,
                holderTxt: SETTINGS.holderTxt
            });

        _customElId = SETTINGS.classPrefix + (input.attr("id") || input.attr(
                'name'));

        _customElContainerId = _customElId + '-container';

        customEl = $('#' + _customElId);
        customElContainer = $('#' + _customElContainerId);
    }

    function tearDown() {
        form = null;
        file = null;
        input = null;
        customEl = null;
        customElContainer = null;

        $('#qunit-fixture').html('');
    }
}(this));

(function(global) {
    var form,
        settings = {};

    /*
     * Setup configuration
     */
    module('General', {
            setup: function() {
                form = $('<form />');
                $('#qunit-fixture').append(form);
            },
            teardown: function() {
                form = null;
                $('#qunit-fixture').html('');
            }
        });

    /*
     * jQuery
     */
    test('Test plugin jQuery chaining.', function() {
        var chain = form.cstmForm();
        ok(chain instanceof jQuery,
            'The plugin should return the jQuery result object for chaining.');
    });
}(this));

(function(global) {
    var TOTAL_ITEMS = 3,
        DEFAULT_CHECKED_OPTION = 1,
        customEl = [],
        form, input = [],
        radio = [],
        ATTR = {
            type: 'radio',
            name: 'something',
            value: 'dummy',
            checked: false
        },
        SETTINGS = {
            classPrefix: 'custom-'
        };

    module('Radio - initialization.', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Radio, 'The Radio module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(radio[0], 'The radio module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-radio" class applied to it.', function() {
        strictEqual(customEl[0].hasClass('custom-radio'), true,
            'Custom element should have class custom-radio when initializing.');
    });

    test(
        'Testing element have class "checked" when input have checked property upon initialization.', function() {
            strictEqual(customEl[DEFAULT_CHECKED_OPTION].hasClass('checked'),
                true,
                'Custom element should not have class "checked".');
        });

    test(
        'Testing element does not have class "checked" when input does not have checked property upon initialization.', function() {
            strictEqual(customEl[0].hasClass('checked'), false,
                'Custom element should not have class "checked".');
        });

    test('Testing no checked elements upon initialization.', function() {
        initializeRadioModule(); // initialize with no checked element

        strictEqual(getCheckedCustomElement().length, 0,
            'No Custom element should have class "checked".');
    });

    module('Radio - interactions.', {
            setup: setup,
            tearDown: tearDown
        });

    test(
        'Testing that when focus is triggered on element it adds class "focus" to custom element.', function() {
            input[0].focus();

            strictEqual(customEl[0].hasClass('focus'), true,
                'When element receive focus, customEl should have class focus added to it.');
        });

    test(
        'Testing that custom element removes class "focus" when element loses focus.', function() {
            input[0].focus().blur();

            strictEqual(customEl[0].hasClass('focus'), false,
                'When element loses focus, customEl should have class focus removed from it.');
        });

    test(
        'Testing that when another "unchecked" custom element is clicked it will remove "checked" class from previously checked custom element.', function() {
            customEl[0].click();

            strictEqual(customEl[DEFAULT_CHECKED_OPTION].hasClass('checked'),
                false,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that when "unchecked" custom element is clicked it will add "checked" class to that custom element.', function() {
            customEl[0].click();

            strictEqual(customEl[0].hasClass('checked'), true,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that when "unchecked" when element is clicked it will add "checked" class to custom element.', function() {
            input[0].click();

            strictEqual(customEl[0].hasClass('checked'), true,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that when "unchecked" when element has property checked changed it will add "checked" class to custom element.', function() {
            input[0].prop('checked', true).change();

            strictEqual(customEl[0].hasClass('checked'), true,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that when another "unchecked" custom element is clicked it will remove "checked" class from previously checked custom element.', function() {
            input[0].click();

            strictEqual(customEl[DEFAULT_CHECKED_OPTION].hasClass('checked'),
                false,
                'When element property checked is set to false, customEl should not have class checked.');
        });

    test(
        'Testing that can only exist one checked element at a time, when clicking custom element.', function() {
            customEl[0].click();
            customEl[1].click();

            strictEqual(getCheckedCustomElement().length, 1,
                'There can only be a single checked element at a time.');
        });

    test(
        'Testing that can only exist one checked element at a time, when clicking element.', function() {
            input[0].click();
            input[1].click();

            strictEqual(getCheckedCustomElement().length, 1,
                'There can only be a single checked element at a time.');
        });

    test(
        'Testing that can only exist one checked element at a time, when changing element checked property.', function() {
            input[0].prop('checked', true);
            input[1].prop('checked', true);

            strictEqual(getCheckedCustomElement().length, 1,
                'There can only be a single checked element at a time.');
        });

    test(
        'Testing that clicking on custom-element from a different form wont change the other item of another form.', function() {
            initializeRadioModule([{
                        numOfItems: TOTAL_ITEMS,
                        form: $('<form id="first"/>')
                    }, {
                        numOfItems: TOTAL_ITEMS,
                        ATTR: {
                            name: 'foo'
                        },
                        form: $('<form id="second"/>')
                    }
                ]);

            strictEqual(getCheckedCustomElement().length, 0,
                'All custom radio should be unchecked.');

            $('#first').find('.custom-radio').first().click();
            $('#second').find('.custom-radio').first().click();

            strictEqual(getCheckedCustomElement().length, 2,
                'Even if they have the same name they should still be able to be both checked since they are in different forms.');
        });

    test(
        'Testing that clicking on element from a different form wont change the other item of another form.', function() {
            initializeRadioModule([{
                        numOfItems: TOTAL_ITEMS,
                        form: $('<form id="first"/>')
                    }, {
                        numOfItems: TOTAL_ITEMS,
                        ATTR: {
                            name: 'foo'
                        },
                        form: $('<form id="second"/>')
                    }
                ]);

            strictEqual(getCheckedCustomElement().length, 0,
                'All custom radio should be unchecked.');

            $('#first').find('input').first().click();
            $('#second').find('input').first().click();

            strictEqual(getCheckedCustomElement().length, 2,
                'Even if they have the same name they should still be able to be both checked since they are in different forms.');
        });

    function getCheckedCustomElement(className) {
        var elements = className || SETTINGS.classPrefix + 'radio';

        return $('.' + elements).filter('.checked');
    }

    function createFixture(options) {

        var baseValue = options.baseValue || ATTR.name,
            checkedItemIndex = options.checkedItemIndex,
            form = options.form,
            numOfItems = options.numOfItems,
            attr = $.extend({}, ATTR, options.ATTR),
            optAttr,
            $input;

        for (var i = 0; i < numOfItems; i++) {

            $input = $('<input />');
            optAttr = $.extend({}, attr, {
                    value: attr.value + i
                });

            // Lets make the second item checked by default
            if (checkedItemIndex && i === checkedItemIndex) {
                optAttr.checked = 'checked';
            }

            $input.attr(optAttr);

            form.append($input);

            radio[i] = customformsjs.module.Radio({
                    element: $input[0],
                    classPrefix: SETTINGS.classPrefix
                });

            input[i] = $input;

            customEl[i] = $('#' + SETTINGS.classPrefix + $input.attr(
                    'name') +
                '-' + $input.val());
        }
    }

    function createMultipleFixtures(fixtureSettingsArr) {
        for (var i = 0, len = fixtureSettingsArr.length; i < len; i++) {
            var fixture = fixtureSettingsArr[i];

            fixture.baseValue = ATTR.name + i;
            createFixture(fixture);
        }
    }

    function initializeRadioModule(settings) {
        var data = settings || [{
                numOfItems: TOTAL_ITEMS,
                checkedItemIndex: null,
                form: $('<form/>')
            }
        ];

        $('#qunit-fixture').html('');

        for (var i = 0, len = data.length; i < len; i++) {
            $('#qunit-fixture').append(data[i].form);
        }

        createMultipleFixtures(data);
    }

    function setup() {
        initializeRadioModule([{
                    numOfItems: TOTAL_ITEMS,
                    checkedItemIndex: DEFAULT_CHECKED_OPTION,
                    form: $('<form />')
                }
            ]);
    }

    function tearDown() {
        form = null;
        radio = [];
        input = [];
        customEl = [];
        $('#qunit-fixture').html('');
    }

}(this));

(function(global) {
    var form,
        select,
        input,
        customEl,
        customElContainer,
        SETTINGS = {
            classPrefix: 'custom-'
        },
        OPTION_VALUES = [
            'default',
            'foo',
            'moo'
        ],
        ATTR = {
            name: 'something',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('Select - initialization', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Select, 'The Select module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(select, 'The Select module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-select" class applied to it.', function() {
        strictEqual(customEl.hasClass('custom-select'), true,
            'Custom element should have class custom-select when initializing.');
    });

    test(
        'Testing custom element container has "custom-select-container" class applied to it.', function() {
            strictEqual(customElContainer.hasClass('custom-select-container'),
                true,
                'Custom element container should have class custom-select-container when initializing.');
        });

    test(
        'Testing custom element text when initialized with no selected option.', function() {
            strictEqual(customEl.html(), OPTION_VALUES[0],
                'When initializing customEl text must be "default" since it is the first option node from the select element.');
        });

    test(
        'Testing custom element text when initialized with a pre selected option.', function() {
            var selectedIndex = 2;

            initializeSelectModule(selectedIndex);

            strictEqual(customEl.html(), OPTION_VALUES[selectedIndex],
                'When initializing customEl text must be "moo" since it is the pre selected option node from the select element.');
        });

    /*
     * Interaction tests
     */
    module('Select - interactions.', {
            setup: setup,
            tearDown: tearDown
        });

    test(
        'Testing that when focus is triggered on element it adds class "focus" to custom element container.', function() {
            input.focus();

            strictEqual(customElContainer.hasClass('focus'), true,
                'When element receive focus, customElContainer should have class focus added to it.');
        });

    test(
        'Testing that customElContainer removes class "focus" when element loses focus.', function() {
            input.focus().blur();

            strictEqual(customElContainer.hasClass('focus'), false,
                'When element loses focus, customElContainer should have class focus removed from it.');
        });

    test('Testing custom element text when element value gets updated.', function() {
        var selectedIndex = 2;

        // The change event definition
        // For select boxes, checkboxes, and radio buttons, the event is fired immediately when the user makes a selection with the mouse, but for the other element types the event is deferred until the element loses focus.
        // So in orther to unit test this, we need to call trigger manually since it can only activate change event with a mouse selection.
        input.val(selectedIndex).trigger('change');

        strictEqual(customEl.html(), OPTION_VALUES[selectedIndex],
            'When changing the select value, custom element text must reflect to the option selected text.');
    });

    function createOption(attr, text) {
        var $option = $('<option />');

        $option.attr(attr).html(text);

        return $option;
    }

    function initializeSelectModule(selectedIndex) {
        var _customElId,
            _customElContainerId,
            _$input,
            attr;

        form = $('<form />');

        input = $('<select />');
        input.attr(ATTR);

        for (var i = 0, len = OPTION_VALUES.length; i < len; i++) {
            attr = {};

            // having first element with no value
            if (i !== 0) {
                attr.value = i;
            }

            _$input = createOption(attr, OPTION_VALUES[i]);
            _$input.prop('selected', i === selectedIndex);

            input.append(_$input);
        }

        form.append(input);

        $('#qunit-fixture').html(form);

        select = customformsjs.module.Select({
                element: input.get(0),
                classPrefix: SETTINGS.classPrefix
            });

        _customElId = SETTINGS.classPrefix + (input.attr('id') || input.attr(
                'name'));
        _customElContainerId = _customElId + '-container';

        customEl = $('#' + _customElId);
        customElContainer = $('#' + _customElContainerId);
    }

    function setup() {
        initializeSelectModule();
    }

    function tearDown() {
        form = null;
        select = null;
        input = null;
        customEl = null;
        customElContainer = null;

        $('#qunit-fixture').html('');
    }

}(this));

(function(global) {
    var form, input, textfield,
        ATTR = {
            id: 'something',
            name: 'something',
            placeholder: 'defaultText',
            type: 'text',
            value: ''
        },
        CSS = {
            color: colorProxy('rgb(0, 0, 255)')
        };

    module('Textfield - initialization.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Text, 'The textfield module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(textfield, 'The textfield module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-textfield" class applied to it.', function() {
        strictEqual(input.hasClass('custom-textfield'), true,
            'Custom element should have class custom-textfield when initializing.');
    });

    test(
        'Testing custom placeholder value is applied to input when it is empty valued.', function() {
            strictEqual(input.val(), input.attr('placeholder'),
                'Upon initialization input color should be overwrittin.');
        });

    test(
        'Testing custom placeholder value is not applied to input when it has a valid value.', function() {
            initializeTextFieldWithValue('foo');

            notStrictEqual(input.val(), input.attr('placeholder'),
                'When element is intialized with a valid value it should remain with its default value.');
        });

    test('Testing custom placeholder color with an empty valued input.', function() {
        notStrictEqual(colorProxy(input.css('color')), CSS.color,
            'Upon initialization input value should be the same as the placeholder value.');
    });

    test('Testing custom placeholder color with a valid valued input.', function() {
        initializeTextFieldWithValue('bar');

        strictEqual(colorProxy(input.css('color')), CSS.color,
            'When element is intialized with a valid value it should have its default color applied to it.');
    });

    module('Textfield - data synchronization.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing overwriting custom element value with element value.', function() {
        input.val('foo');

        textfield.bind('sync', function() {
            strictEqual(input.val(), 'foo',
                'Input and Model value should be "foo".');
        }).sync();
    });

    test('Testing updating without saving will not update input value.', function() {
        textfield.bind('update', function() {
            notStrictEqual(input.val(), 'foo',
                'After running the method "update" without saving, input value should be unchanged.');
        }).update('foo');
    });

    test('Testing overwriting input value with custom element value.', function() {
        textfield.bind('save', function() {
            strictEqual(input.val(), 'bar',
                'Input value should be "bar".');
        }).update('bar').save();
    });

    module('Textfield - validators.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing empty string.', function() {
        strictEqual(textfield.validate('').success, false,
            '"" string should fail on validation.');
    });

    test('Testing placeholder value.', function() {
        strictEqual(textfield.validate(input.attr('placeholder')).success,
            false,
            'placeholder value should fail on validation.');
    });

    test('Testing placeholder value.', function() {
        strictEqual(textfield.validate('foo').success, true,
            '"foo" should pass on validation.');
    });

    test('Testing custom validator.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                validators: [

                    function(val) {
                        return val !== 'bar';
                    }
                ]
            });

        strictEqual(textfield.validate('bar').success, false,
            '"bar" should fail validation.');
    });

    test('Testing multiple custom validators.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                validators: [

                    function(val) {
                        return val !== 'foo';
                    },
                    function(val) {
                        return typeof val !== 'bar';
                    }
                ]
            });

        strictEqual(textfield.validate('foo').success && textfield.validate(
                'bar').success, false,
            '"foo" and "bar" should fail validation.');
    });

    module('Textfield - events.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing "save" event.', function() {
        textfield.bind('save', function() {
            ok(true,
                '"save" callback should be called when model value is saved.');
        }).save();
    });

    test('Testing "sync" event.', function() {
        textfield.bind('sync', function() {
            ok(true,
                '"sync" callback should be called when model value is synchronized.');
        }).sync();
    });

    test('Testing "update" event.', function() {
        textfield.bind('update', function() {
            ok(true,
                '"update" callback should be called when model value is updated.');
        }).update('foo');
    });

    test('Testing "update" event triggers validate event.', function() {
        textfield.bind('validate', function() {
            ok(true,
                '"validate" callback should be called when model value is updated.');
        }).update('bones');
    });

    test('Testing custom event triggers callback.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['foo']
            });

        textfield.bind('foo', function(event) {
            ok(true,
                '"foo" callback should be called when event "foo" is triggered.');
        }).trigger('foo');
    });

    test('Testing custom event triggered with no data.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['foo']
            });

        textfield.bind('foo', function(event) {
            strictEqual(typeof event.data, "undefined",
                'event.data should not be undefined.');
        }).trigger('foo');
    });

    test('Testing custom event triggered with data.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['bar']
            });

        textfield.bind('bar', function(event) {
            strictEqual(event.data, 'Hello world!',
                'event.data value should be "Hello world!".');
        }).trigger('bar', 'Hello world!');
    });


    module('Textfield - interactions.', {
            setup: setup,
            tearDown: tearDown
        });

    test(
        'Testing that when element receives focus it adds class "focus" to it.', function() {
            input.focus();
            strictEqual(input.hasClass('focus'), true,
                'When element receive focus, customEl should have class focus added to it.');
        });

    test(
        'Testing that when element loses focus it removes class "focus" from it.', function() {
            input.focus().blur();
            strictEqual(input.hasClass('focus'), false,
                'When element loses focus, customEl should have class focus removed from it.');
        });

    test('Testing input value when receiving focus with an invalid value.', function() {
        input.focus();
        strictEqual(input.val(), '',
            'Input value should be ' + "" +
            ' when input receive focus and has an invalid value.');
    });

    test('Testing input value when receiving focus with a valid value.', function() {
        input.focus().val('foo');
        strictEqual(input.val(), 'foo', 'Input value should be ' + "foo" +
            ' when input receive and loses focus and has a valid value.');
    });

    test('Testing input value when receiving and losing focus while invalid.', function() {
        input.focus().blur();
        strictEqual(input.val(), input.attr('placeholder'),
            'Input Value should be the placeholder value when input receive and loses focus and has an invalid value.');
    });

    test('Testing input value when receiving and losing focus while valid.', function() {
        focusAndUpdateValue('foo');

        strictEqual(input.val(), 'foo',
            'Input value should be ' + "foo" +
            ' when input receive and loses focus.');
    });

    test('Testing custom placeholder color after a valid value change.', function() {
        focusAndUpdateValue('foo');

        strictEqual(colorProxy(input.css('color')), CSS.color,
            'When updating to a valid value, color should no longer be the placeholder color."');
    });

    test('Testing custom placeholder color after an invalid value change.', function() {
        focusAndUpdateValue('');

        notStrictEqual(colorProxy(input.css('color')), CSS.color,
            'When updating to an invalid value, placeholder color should be kept."');
    });

    test(
        'Testing custom placeholder color after an invalid value change with the placeholder value.', function() {
            focusAndUpdateValue('defaultText');

            notStrictEqual(colorProxy(input.css('color')), CSS.color,
                'When updating to an invalid value, placeholder color should be kept."');
        });

    function colorProxy(color) {
        return (/rgb/).test(color) ? trimrgb(color) : hexToRgb(color);
    }

    function focusAndUpdateValue(val) {
        input.focus();
        input.val(val);
        input.blur();
    }

    function initializeTextFieldWithValue(val) {
        form = $('<form />');
        input = $('<input />');
        input.attr(ATTR).css(CSS).val(val);

        $('#qunit-fixture').html(form.append(input));

        textfield = customformsjs.module.Text({
                element: input[0],
                force: true
            });
    }

    function hexToRgb(hex, opacity) {
        var h = hex.replace('#', ''),
            alpha = typeof opacity !== 'undefined',
            prefix = 'rgb' + (alpha ? 'a' : '');

        h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

        for (var i = 0; i < h.length; i++) {
            h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
        }

        if (alpha) {
            h.push(opacity);
        }

        return prefix + '(' + h.join(',') + ')';
    }

    function setup() {
        initializeTextFieldWithValue(ATTR.value);
    }

    function tearDown() {
        textfield = null;
        form = null;
        input = null;
        $('#qunit-fixture').html('');
    }

    function trimrgb(rgbcolor) {
        return rgbcolor.replace(/[ ]/g, '');
    }

}(this));
