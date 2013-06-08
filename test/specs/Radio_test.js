(function(global) {

    var form,
        radio = [],
        input = [],
        customEl = [],
        totalItems = 3,
        settings = {
            classPrefix: 'custom-'
        },
        attr = {
            name: 'something',
            value: 'dummy',
            checked: false
        };

    /*
     * Setup configuration
     */
    module('Radio', {
            setup: function() {

                form = $('<form />');

                $('#qunit-fixture').append(form);

                // generate 3 radio buttons for testing
                for (var i = 0; i < totalItems; i++) {

                    var _input = $('<input />');

                    // Setting the type on a radio button after the value resets the value in IE6-9, 
                    // to avoid that instead of setting all attributes to the radio at the same type, 
                    // manually set type attribute before the other attributes on the test suit setup
                    _input.attr('type', 'radio');

                    var optAttr = $.extend({}, attr, {
                            value: attr.value + i
                        });

                    form.append(_input);

                    _input.attr(optAttr);

                    radio[i] = customformsjs.module.Radio({
                            element: _input.get(0),
                            classPrefix: settings.classPrefix
                        });

                    input[i] = _input;

                    customEl[i] = $('#' + settings.classPrefix + _input.attr(
                            "name") +
                        "-" + _input.val());

                }
            },
            teardown: function() {
                form = null;
                radio = [];
                input = [];
                customEl = [];
                $('#qunit-fixture').html('');
            }
        });

    /*
     * Initialization tests
     */
    test('Test initiliazation.', function() {

        for (var i = 0; i < totalItems; i++) {

            // check if we have a radio object
            ok(radio[i], 'The radio object ' + i + '  must be defined.');

            // checked stated should be a reflection of the input checked property
            strictEqual(input[i].prop('checked'), customEl[i].hasClass(
                    'checked'),
                'After initliazed, radios checked class should reflect on their relative inputs checked property.');
            strictEqual(customEl[i].hasClass('custom-radio'), true,
                'Custom elment should have class custom-radio when initializing');

        }

    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        for (var i = 0; i < totalItems; i++) {

            if (i === 0) {
                input[i].prop("checked", false);
                customEl[i].click();
                strictEqual(customEl[i].hasClass('checked'), true,
                    'When clicking on item one, it should add a class of Checked to customEl item one.');
            } else {
                strictEqual(customEl[i].hasClass('checked'), false,
                    'Item one is currently checked and only one item can be checked at a time.');
            }
        }

        input[0].focus();
        strictEqual(customEl[0].hasClass('focus'), true,
            'When element receive focus, customEl should have class focus added to it.');

        input[0].blur();
        strictEqual(customEl[0].hasClass('focus'), false,
            'When element loses focus, customEl should have class focus removed from it.');

    });

}(this));
