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
