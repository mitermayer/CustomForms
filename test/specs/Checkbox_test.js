(function(global) {

    var checkbox,
        input,
        customEl,
        form,
        settings = {
            classPrefix: 'custom-'
        },
        attr = {
            name: 'something',
            id: 'something',
            type: 'checkbox',
            value: '1',
            checked: false
        };

    /*
     * Setup configuration
     */
    module('Checkbox', {
        setup: function() {

            form = $('<form />');

            input = $('<input />');

            input.attr(attr);

            $('#qunit-fixture').append(form.append(input));

            checkbox = app.module.Checkbox({
                element: input.get(0),
                classPrefix: settings.classPrefix
            });

            customEl = $('#' + settings.classPrefix + attr.id );

        },
        teardown: function() {
            checkbox = null;
            form = null;
            input = null;
            $('#qunit-fixture').html('');
        }
    });

    /*
     * Initialization tests
     */
    test('Test initiliazation.', function() {

        ok(checkbox, 'The checkbox object must be defined.');

        strictEqual(input.prop('checked'), customEl.hasClass('checked'), 
            'At first when input checkbox is initialized, it should have class "checked" based on the checkbox current "checked property".');

    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        // uncked the input 
        input.prop('checked', false);
        strictEqual( customEl.hasClass('checked'), false, 
            'When element has its property changed it should reflect on the customEl class checked state');

        input.prop('checked', true);
        strictEqual( customEl.hasClass('checked'), false, 
            'When element has its property changed it should reflect on the customEl class checked state');

        customEl.click();
        strictEqual( input.prop('checked'), false, 
            'When element has its property changed it should reflect on the customEl class checked state');

        customEl.click();
        strictEqual( input.prop('checked'), true, 
            'When element has its property changed it should reflect on the customEl class checked state');


        // TO DO
        // add tests for class focus on custom element
    });

}(this));
