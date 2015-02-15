(function(global) {
    var form,
        choice,
        input,
        customEl,
        customElContainer,
        KEY_CODE = {
            TAB: 9,
            ENTER: 13,
            SPACE: 32
        },
        SETTINGS = {
            classPrefix: 'custom-',
            customListCss: {
                'max-height': '300px'
            },
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
    module('Choice - initialization', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Choice, 'The Choice module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(choice, 'The Select module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-select" class applied to it.', function() {
        strictEqual(customEl.hasClass('custom-choice'), true,
            'Custom element should have class custom-select when initializing.');
    });

    test(
        'Testing custom element container has "custom-select-container" class applied to it.', function() {
            strictEqual(customElContainer.hasClass('custom-choice-container'),
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

            initializeChoiceModule(selectedIndex);

            strictEqual(customEl.html(), OPTION_VALUES[selectedIndex],
                'When initializing customEl text must be "moo" since it is the pre selected option node from the select element.');
        });

    /*
     * Interaction tests
     */
    module('Choice - interactions.', {
            setup: setup,
            teardown: tearDown
        });

    /*
     * Interaction tests
     */
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

    test('Test SPACE key opens and closes choice box.', function() {
        var e = jQuery.Event('keydown');
        e.which = KEY_CODE.SPACE;

        input.trigger(e);
        strictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" should open the choice box.');

        input.trigger(e);
        notStrictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" and choice box is open it should than close the choice box.');
    });

    test('Test ENTER key opens and closes choice box.', function() {
        var e = jQuery.Event('keydown');
        e.which = KEY_CODE.ENTER;

        input.trigger(e);
        strictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" should open the choice box.');

        input.trigger(e);
        notStrictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" and choice box is open it should than close the choice box.');
    });

    test('Test TAB key closes choice when its opened.', function() {
        var e = jQuery.Event('keydown');
        e.which = KEY_CODE.ENTER;

        input.trigger(e);
        strictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" should open the choice box.');

        e.which = KEY_CODE.TAB;

        input.trigger(e);
        notStrictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "TAB" and choice box is open it should than close the choice box.');

    });

    test('Test TAB key closes choice when its opened.', function() {
        var e = jQuery.Event('keydown');
        e.which = KEY_CODE.SPACE;

        input.trigger(e);
        strictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "SPACE" should open the choice box.');

        e.which = KEY_CODE.TAB;

        input.trigger(e);
        notStrictEqual(customElContainer.find('ul').hasClass('open'), true,
            'When pressing "TAB" and choice box is open it should than close the choice box.');

    });

    module('Choice - Multiple options', {
            setup: function() {
                var arr = [],
                    i = 0;

                while (++i !== 50) {
                    arr.push('dummyValue' + i);
                }

                initializeChoiceModule(arr);
            },
            teardown: tearDown
        });

    test('Test that there is a max height set for the list container', function() {
        strictEqual(customElContainer.find('ul').css('max-height'), '300px',
            'Default max-height shoud be 300px');
    });

    //test('Test that we are scrolled to the selected element position when scrolling is available.', function() {

    //    ok(false, 'Write a proper test for it.');
    //});


    function createOption(attr, text) {
        var $option = $('<option />');

        $option.attr(attr).html(text);

        return $option;
    }

    function initializeChoiceModule(selectedIndex) {
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

        choice = customformsjs.module.Choice({
                active: true,
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
        initializeChoiceModule();
    }

    function tearDown() {

        form = null;
        choice = null;
        input = null;
        customEl = null;
        customElContainer = null;

        $('#qunit-fixture').html('');
    }

}(this));
