(function(global)
{

    var checkbox,
        input,
        customEl,
        form,
        settings =
        {
            classPrefix: 'custom-'
        },
        attr =
        {
            name: 'something',
            id: 'something',
            type: 'checkbox',
            value: '1',
            checked: false
        };

    /*
     * Setup configuration
     */
    module('Checkbox',
    {
        setup: function()
        {

            form = $('<form />');

            input = $('<input />');

            input.attr(attr);

            $('#qunit-fixture').append(form.append(input));

            checkbox = app.module.Checkbox(
            {
                element: input.get(0),
                classPrefix: settings.classPrefix
            });

            customEl = $('#' + settings.classPrefix + attr.id);

        },
        teardown: function()
        {
            checkbox = null;
            customEl = null;
            form = null;
            input = null;
            $('#qunit-fixture').html('');
        }
    });

    /*
     * Initialization tests
     */
    test('Test initiliazation.', function()
    {

        ok(checkbox, 'The checkbox object must be defined.');

        strictEqual(input.prop('checked'), customEl.hasClass('checked'),
            'At first when input checkbox is initialized, it should have class "checked" based on the checkbox current "checked property".');

        strictEqual(customEl.hasClass('custom-checkbox'), true,
            'Custom elment should have class custom-checkbox when initializing');
    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function()
    {

        // setting checked state true, than clicking on it.
        input.prop('checked', true);
        input.click();
        strictEqual(customEl.hasClass('checked'), false,
            'When element property checked is set to false, customEl should not have class checked.');

        // setting checked state false, than clicking on it.
        input.prop('checked', false);
        input.click();
        strictEqual(customEl.hasClass('checked'), true,
            'When element property checked is set to true, customEl should have class checked.');

        customEl.click();
        strictEqual(input.prop('checked'), false,
            'When customEl is clicked and previously it did have class checked, it should updated input checked property to false.');

        customEl.click();
        strictEqual(input.prop('checked'), true,
            'When customEl is clicked and previously it didnt have class checked, it should updated input checked property to true.');

        input.focus();
        strictEqual(customEl.hasClass('focus'), true,
            'When element receive focus, customEl should have class focus added to it.');

        input.blur();
        strictEqual(customEl.hasClass('focus'), false,
            'When element loses focus, customEl should have class focus removed from it.');


        strictEqual(customEl.hasClass('custom-checkbox'), true,
            'Custom elment should have class custom-textfield when initializing');

    });

}(this));
