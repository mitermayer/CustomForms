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
