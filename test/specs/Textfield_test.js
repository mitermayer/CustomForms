(function(global) {

    var textfield,
        input,
        form,
        trimrgb = function(rgbcolor) {
            return rgbcolor.replace(/[ ]/g, '');
        },
        hexToRgb = function(hex, opacity) {

            var h = hex.replace('#', ''),
                alpha = typeof opacity !== 'undefined',
                prefix = 'rgb' + (alpha ? 'a' : '');

            h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));

            for (var i = 0; i < h.length; i++) {
                h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
            }

            if (alpha) {
                h.push(opacity);
            }

            return prefix + '(' + h.join(',') + ')';
        },
        colorProxy = function(color) {
            return (/rgb/).test(color) ? trimrgb(color) : hexToRgb(color);
        },
        attr = {
            name: 'something',
            id: 'something',
            type: 'text',
            value: '',
            placeholder: 'defaultText'
        },
        css = {
            color: colorProxy('rgb(0, 0, 255)')
        };

    /*
     * Setup configuration
     */
    module('Text', {
        setup: function() {

            form = $('<form />');

            input = $('<input />');

            input.attr(attr).css(css);

            $('#qunit-fixture').append(form.append(input));

            textfield = customformsjs.module.Text({
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

        _color = colorProxy(input.css("color"));
        strictEqual(input.val(), input.attr('placeholder'),
            'At first input value should be the same as placeholder value.');
        notStrictEqual(_color, css.color,
            'At first input value should not have default color since it has a placeholder value.');

        input.val("somthing");
        textfield.sync().validate();
        textfield = customformsjs.module.Text({
            element: input.get(0),
            force: true
        });
        _color = colorProxy(input.css("color"));
        notStrictEqual(input.val(), input.attr('placeholder'),
            'When element is intialized with a valid value it should remain with its default value.');
        strictEqual(_color, css.color,
            'When element is intialized with a valid value it should have its default color applied to it.');

        strictEqual(input.hasClass('custom-textfield'), true,
            'Custom elment should have class custom-textfield when initializing');

    });


    /*
     * Test model updates
     */
    test('Test updating values', function() {

        var _color;

        textfield.update('Tomate');
        _color = colorProxy(input.css("color"));
        strictEqual(input.val(), input.attr('placeholder'),
            'After running the method "update" without saving, should keep the input value unchanged.');
        strictEqual(_color, css.color,
            'When updating to a valid value, color value should be "blue"');

        textfield.save();
        strictEqual(input.val(), 'Tomate',
            'Input value should be updated to "Tomate".');

        textfield.update('', true).save();
        strictEqual(input.val(), '',
            'Even if failing on validation Input value should now be set to an empty string "" when called with force parameter.');

        textfield.update(input.attr('placeholder'), true).save();
        _color = colorProxy(input.css("color"));
        strictEqual(input.val(), input.attr('placeholder'),
            'Even if failing on validation Input value should now be set to Placeholder value when called with force parameter.');
        strictEqual(colorProxy(input.css("color")), _color,
            'When updating to an invalid value, color value placeholder color should be "' +
            _color + '"');


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

        textfield.bind("sync", function(event) {

            var value = event.data;

            strictEqual(input.val(), value,
                'Model and input should share same value when input is directly updated and than sync is called, expected: ' +
                input.val());

            strictEqual(typeof value, 'string',
                'value :' + value + ' should be of type string');

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

        strictEqual(textfield.validate("").success, false,
            '"" string should fail on validation.');

        strictEqual(textfield.validate(input.attr("placeholder")).success,
            false,
            'placeholder value should fail on validation.');

        strictEqual(textfield.validate('Somthing else').success, true,
            '"Something else" should pass on validation.');


        textfield = customformsjs.module.Text({
            element: input.get(0),
            force: true,
            validators: [

                function(val) {
                    return val !== "dummy";
                },
                function(val) {
                    return typeof val !== "number";
                }
            ]
        });

        strictEqual(textfield.validate("dummy").success, false,
            '"dummy" should fail validation');

        strictEqual(textfield.validate(1).success, false,
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


        textfield = customformsjs.module.Text({
            element: input.get(0),
            force: true,
            events: ["someevent", "customevent"]
        });

        textfield.bind("someevent", function() {
            ok(true,
                'Custom Event someevnt should be called when model triggers it.');
        }).trigger("someevent");

        textfield.bind("customevent", function() {
            strictEqual(textfield.validate('Somthing else').success, true,
                '"customevent" should pass "Hello world!" as a parameter when triggered.');
        }).trigger("customevent", "Hello world!");

    });

    /*
     * Markup related tests
     */
    test('Test markup', function() {

        input.focus();
        strictEqual(input.val(), "",
            'Value should become empty when input receive focus and has placeholder value on it.');

        input.blur();
        strictEqual(input.val(), input.attr('placeholder'),
            'Value should of placeholder when input receive loses focus has an invalid value on it.');

        input.val("something");
        input.focus();
        notStrictEqual(input.val(), "",
            'When focus on an element with valid data should not clear it, instead should append text to it.');

        input.blur();
        notStrictEqual(input.val(), input.attr('placeholder'),
            'When losing focus on an elment with valid data it should not update to placeholder value.');

    });

}(this));
