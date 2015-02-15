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
