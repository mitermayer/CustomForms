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
            type: 'radio',
            value: 'dummy',
            checked: false
        };

    /*
     * Setup configuration
     */
    module('Checkbox', {
        setup: function() {

            form = $('<form />');

            // generate 3 radio buttons for testing
            for( var i=0; i<totalItems; i++ )  {

                var _input = $('<input />');

                var optAttr = $.extend({}, attr, {
                    value: attr.value + i      
                });

                _input.attr(optAttr);

                form.append(input);

                radio[i] = app.module.Checkbox({
                    element: _input.get(0),
                    classPrefix: settings.classPrefix
                });

                input[i] = _input;

                customEl[i] = $('#' + settings.classPrefix + (_input.attr("id") || _input.attr("name")) + "-" + _input.val() );

                console.log('sso: ' + customEl[i].length  );

            }

            $('#qunit-fixture').append(form);

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

        for( var i=0; i<totalItems; i++ )  {

            // check if we have a radio object
            ok(radio[i], 'The radio object ' + i + '  must be defined.');

            // checked stated should be a reflection of the input checked property
            strictEqual(input[i].prop('checked'), customEl[i].hasClass('checked'), 
                'After initliazed, radios checked class should reflect on their relative inputs checked property.');

        }

    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        expect(0);

/*
 *        for( var i=0; i<totalItems; i++ )  {
 *
 *            customEl[i].click();
 *            console.log( 'STATEEEEEEEEEE ', input[i].attr("id") );
 *
 *            if(i===0) {
 *                input[i].prop("checked", false);
 *                customEl[i].click();
 *                strictEqual( customEl[i].hasClass('checked'), true, 
 *                    'When clicking on item one, it should add a class of Checked to customEl item one.');
 *            } else {
 *                strictEqual( customEl[i].hasClass('checked'), false, 
 *                    'Item one is currently checked and only one item can be checked at a time.');
 *            }
 *        }
 */

        // setting checked state false, than clicking on it.
        //input.prop('checked', false);
        //input.click();
        //strictEqual( customEl.hasClass('checked'), true, 
        //    'When element property checked is set to true, customEl should have class checked.');

        //customEl.click();
        //strictEqual( input.prop('checked'), false, 
        //    'When customEl is clicked and previously it did have class checked, it should updated input checked property to false.');

        //customEl.click();
        //strictEqual( input.prop('checked'), true, 
        //    'When customEl is clicked and previously it didnt have class checked, it should updated input checked property to true.');

        //input.focus();
        //strictEqual( customEl.hasClass('focus'), true, 
        //    'When element receive focus, customEl should have class focus added to it.');

        //input.blur();
        //strictEqual( customEl.hasClass('focus'), false, 
        //    'When element loses focus, customEl should have class focus removed from it.');

    });

}(this));
