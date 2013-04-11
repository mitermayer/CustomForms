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
            customEl = null;
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

        // setting checked state true, than clicking on it.
        input.prop('checked', true);
        input.click();
        strictEqual( customEl.hasClass('checked'), false, 
            'When element property checked is set to false, customEl should not have class checked.');

        // setting checked state false, than clicking on it.
        input.prop('checked', false);
        input.click();
        strictEqual( customEl.hasClass('checked'), true, 
            'When element property checked is set to true, customEl should have class checked.');

        customEl.click();
        strictEqual( input.prop('checked'), false, 
            'When customEl is clicked and previously it did have class checked, it should updated input checked property to false.');

        customEl.click();
        strictEqual( input.prop('checked'), true, 
            'When customEl is clicked and previously it didnt have class checked, it should updated input checked property to true.');

        input.focus();
        strictEqual( customEl.hasClass('focus'), true, 
            'When element receive focus, customEl should have class focus added to it.');

        input.blur();
        strictEqual( customEl.hasClass('focus'), false, 
            'When element loses focus, customEl should have class focus removed from it.');

    });

}(this));

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

            $('#qunit-fixture').append(form);

            // generate 3 radio buttons for testing
            for( var i=0; i<totalItems; i++ )  {

                var _input = $('<input />');

                var optAttr = $.extend({}, attr, {
                    value: attr.value + i      
                });

                form.append(_input);

                _input.attr(optAttr);

                radio[i] = app.module.Radio({
                    element: _input.get(0),
                    classPrefix: settings.classPrefix
                });

                input[i] = _input;

                customEl[i] = $('#' + settings.classPrefix + _input.attr("name") + "-" + _input.val() );

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

        for( var i=0; i<totalItems; i++ )  {

            if(i===0) {
                input[i].prop("checked", false);
                customEl[i].click();
                strictEqual( customEl[i].hasClass('checked'), true, 
                    'When clicking on item one, it should add a class of Checked to customEl item one.');
            } else {
                strictEqual( customEl[i].hasClass('checked'), false, 
                    'Item one is currently checked and only one item can be checked at a time.');
            }
        }

        input[0].focus();
        strictEqual( customEl[0].hasClass('focus'), true, 
            'When element receive focus, customEl should have class focus added to it.');

        input[0].blur();
        strictEqual( customEl[0].hasClass('focus'), false, 
            'When element loses focus, customEl should have class focus removed from it.');

    });

}(this));

(function(global) {

    var form,
        select,
        input, 
        customEl,
        customElContainer,
        settings = {
            classPrefix: 'custom-'
        },
        attr = {
            name: 'something',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('Select', {
        setup: function() {

            form = $('<form />');

            input = $('<select />');
            input.attr(attr);

            // add options, make default with no value
            input.html("<option>default</option>" +
                       "<option value='foo'>foo</option>" +
                       "<option value='moo'>moo</option>");

            form.append(input);

            $('#qunit-fixture').append(form);

            select = app.module.Select({
                element: input.get(0),
                classPrefix: settings.classPrefix
            });

            var _customElId = settings.classPrefix + (input.attr("id") || input.attr('name'));
            var _customElContainerId = _customElId + '-container';

            customEl = $('#' + _customElId );
            customElContainer = $('#' + _customElContainerId );

        },
        teardown: function() {
            form = null;
            select = null;
            input = null;
            customEl = null;
            customElContainer = null;

            $('#qunit-fixture').html('');
        }
    });

    /*
     * Initialization tests
     */
    test('Test initiliazation.', function() {

        // check if we have a radio object
        ok(select, 'The select object  must be defined.');

        // customEl must be a valid html element
        notStrictEqual(customEl.length, 0, 
            'When initializing customEl must be a valid html element.');

        // customEl must be a valid html element
        notStrictEqual(customElContainer.length, 0, 
            'When initializing customElContainer must be a valid html element.');

        // customEl must be a valid html element
        strictEqual(input.parent()[0], customElContainer[0], 
            'When initialized select should be now instide of custom container.');

        // customEl must be a valid html element
        strictEqual(input.next()[0], customEl[0], 
            'When initialized select should be followed by custom element.');

        // checked stated should be a reflection of the input checked property
        strictEqual(customEl.html(), 'default', 
            'When initializing customEl text must be "default" since it is the first option node from the select elemet.');

    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        expect(0);

        //for( var i=0; i<totalItems; i++ )  {

        //    if(i===0) {
        //        input[i].prop("checked", false);
        //        customEl[i].click();
        //        strictEqual( customEl[i].hasClass('checked'), true, 
        //            'When clicking on item one, it should add a class of Checked to customEl item one.');
        //    } else {
        //        strictEqual( customEl[i].hasClass('checked'), false, 
        //            'Item one is currently checked and only one item can be checked at a time.');
        //    }
        //}

        //input[0].focus();
        //strictEqual( customEl[0].hasClass('focus'), true, 
        //    'When element receive focus, customEl should have class focus added to it.');

        //input[0].blur();
        //strictEqual( customEl[0].hasClass('focus'), false, 
        //    'When element loses focus, customEl should have class focus removed from it.');

    });

}(this));

(function(global) {

    var textfield,
        input,
        form,
        attr = {
            name: 'something',
            id: 'something',
            type: 'text',
            value: '',
            placeholder: 'defaultText'
        },
        css = {
            color: 'rgb(0, 0, 255)'
        };

    /*
     * Setup configuration
     */
    module('TextField', {
        setup: function() {

            form = $('<form />');

            input = $('<input />');

            input.attr(attr).css(css);

            $('#qunit-fixture').append(form.append(input));

            textfield = app.module.TextField({
                element: input.get(0),
                force: true
            });
        },
        teardown: function() {
            textfield = null;
            form = null;
            input = null;
            $('#qunit-fixture').html('');
        }
    });

    /*
     * Initialization tests
     */
    test('Test initiliazation.', function() {

        var _color;

        ok(textfield, 'The textfield object must be defined.');

        _color = input.css("color");
        strictEqual(input.val(), input.attr('placeholder'), 
            'At first input value should be the same as placeholder value.');
        notStrictEqual(input.css("color"), css.color, 
            'At first input value should not have default color since it has a placeholder value.');

        input.val("somthing");
        textfield.sync().validate();
        _color = input.css("color");
        textfield = app.module.TextField({
            element: input.get(0),
            force: true
        });
        notStrictEqual(input.val(), input.attr('placeholder'), 
            'When element is intialized with a valid value it should remain with its default value.');
        strictEqual(input.css("color"), css.color, 
            'When element is intialized with a valid value it should have its default color applied to it.');
    });


    /*
     * Test model updates
     */
    test('Test updating values', function() {

        var inputColor = input.css("color");
        textfield.update('Tomate');
        strictEqual(input.val(), input.attr('placeholder'), 
            'After running the method "update" without saving, should keep the input value unchanged.');
        strictEqual(input.css("color"), css.color, 
            'When updating to a valid value, color value should be "blue"');

        textfield.save();
        strictEqual(input.val(), 'Tomate', 
            'Input value should be updated to "Tomate".');

        textfield.update('', true).save();
        strictEqual(input.val(), '', 
            'Even if failing on validation Input value should now be set to an empty string "" when called with force parameter.');

        textfield.update(input.attr('placeholder'), true).save();
        strictEqual(input.val(), input.attr('placeholder'), 
            'Even if failing on validation Input value should now be set to Placeholder value when called with force parameter.');
        strictEqual(input.css("color"), inputColor, 
            'When updating to an invalid value, color value placeholder color should be "' + inputColor +'"');


    });

    /*
     * Test model saving
     */
    test('Test saving values', function() {

        textfield.update("DUMMY").save();
        strictEqual(input.val(), 'DUMMY', 
            'Input value should be updated to "DUMMY".');

        textfield.update(1).save();
        strictEqual(typeof input.val(), 'string', 
            'Input value should still be of type string even when updated with a number.');

        textfield.update(true).save();
        strictEqual(typeof input.val(), 'string', 
            'Input value should still be of type string even when updated with a boolean.');

    });

    /*
     * Test model synchronization
     */
    test('Test synchronizing values', function() {

        expect( 10 );

        textfield.bind("sync", function(value) {
            strictEqual(input.val(), value, 
                'Model and input should share same value when input is directly updated and than sync is called, expected: ' + input.val() );

            strictEqual(typeof value, 'string', 
                'value :' + value + ' should be of type string' );

        });

        input.val('OtherValue');
        textfield.sync();

        input.val(1);
        textfield.sync();

        input.val(true);
        textfield.sync();

        input.val("");
        textfield.sync();

        input.val(false);
        textfield.sync();

    });

    /*
     * Test model validator integration
     */
    test('Test validators', function() {

        strictEqual(textfield.validate(""), false, 
            '"" string should fail on validation.');

        strictEqual(textfield.validate(input.attr("placeholder")), false, 
            'placeholder value should fail on validation.');

        strictEqual(textfield.validate('Somthing else'), true, 
            '"Something else" should pass on validation.');

                
        textfield = app.module.TextField({
            element: input.get(0),
            force: true,
            validators: [
                function( val ) {
                    return val !== "dummy";
                },
                function( val ) {
                    return typeof val !== "number";
                }
            ]
        });

        strictEqual(textfield.validate("dummy"), false, 
            '"dummy" should fail validation');

        strictEqual(textfield.validate(1), false, 
            '1 should fail since it uses number validation.');

    });


    /*
     * Test model events handling
     */
    test('Test events', function() {

        expect(6);

        textfield.bind("save", function() {
            ok(true, 
               'Event save should be called when model is saved.');
        }).save();

        textfield.bind("sync", function() {
            ok(true, 
               'Event save should be called when model is synchronized.');
        }).sync();

        textfield
        .bind("update", function() {
            ok(true, 
               'Event save should be called when model is updated.');
        })
        .bind("validate", function() {
            ok(true, 
               'Event validation should be called when model is query for validation.');
        }).update("bones");


        textfield = app.module.TextField({
            element: input.get(0),
            force: true,
            events: ["someevent", "customevent"]
        });

        textfield.bind("someevent", function() {
            ok(true, 
               'Custom Event someevnt should be called when model triggers it.');
        }).trigger("someevent");

        textfield.bind("customevent", function( data ) {
            strictEqual(textfield.validate('Somthing else'), true, 
                '"customevent" should pass "Hello world!" as a parameter when triggered.');
        }).trigger("customevent", "Hello world!");

    });

    /*
     * Markup related tests
     */
    test('Test markup', function() {

        input.focus();
        strictEqual( input.val(), "", 
            'Value should become empty when input receive focus and has placeholder value on it.');

        input.blur();
        strictEqual( input.val(), input.attr('placeholder'), 
            'Value should of placeholder when input receive loses focus has an invalid value on it.');

        input.val("something");
        input.focus();
        notStrictEqual( input.val(), "", 
            'When focus on an element with valid data should not clear it, instead should append text to it.');

        input.blur();
        notStrictEqual( input.val(), input.attr('placeholder'), 
            'When losing focus on an elment with valid data it should not update to placeholder value.');

    });

}(this));
