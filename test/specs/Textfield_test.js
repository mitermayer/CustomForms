(function(global) {

    var textfield,
        input,
        form,
        attr = {
            type: 'text',
            value: '',
            placeholder: 'defaultText'
        },
        css = {
            color: 'blue'
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
        ok(textfield, 'The textfield object must be defined.');

        strictEqual(input.val(), input.attr('placeholder'), 
            'At first input value should be the same as placeholder value.');
    });


    /*
     * Test model updates
     */
    test('Test updating values', function() {

        textfield.update('Tomate');
        strictEqual(input.val(), input.attr('placeholder'), 
            'After running the method "update" without saving, should keep the input value unchanged.');

        textfield.save();
        strictEqual(input.val(), 'Tomate', 
            'Input value should be updated to "Tomate".');

        textfield.update('', true).save();
        strictEqual(input.val(), '', 
            'Even if failing on validation Input value should now be set to an empty string "" when called with force parameter.');

        textfield.update(input.attr('placeholder'), true).save();
        strictEqual(input.val(), input.attr('placeholder'), 
            'Even if failing on validation Input value should now be set to Placeholder value when called with force parameter.');

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

}(this));
