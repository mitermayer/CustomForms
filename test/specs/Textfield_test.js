(function(global) {
    var form, input, textfield,
        ATTR = {
            id: 'something',
            name: 'something',
            placeholder: 'defaultText',
            type: 'text',
            value: ''
        },
        CSS = {
            color: colorProxy('rgb(0, 0, 255)')
        };

    module('Textfield - initialization.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.Text, 'The textfield module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(textfield, 'The textfield module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-textfield" class applied to it.', function() {
        strictEqual(input.hasClass('custom-textfield'), true,
            'Custom element should have class custom-textfield when initializing.');
    });

    test(
        'Testing custom placeholder value is applied to input when it is empty valued.', function() {
            strictEqual(input.val(), input.attr('placeholder'),
                'Upon initialization input color should be overwrittin.');
        });

    test(
        'Testing custom placeholder value is not applied to input when it has a valid value.', function() {
            initializeTextFieldWithValue('foo');

            notStrictEqual(input.val(), input.attr('placeholder'),
                'When element is intialized with a valid value it should remain with its default value.');
        });

    test('Testing custom placeholder color with an empty valued input.', function() {
        notStrictEqual(colorProxy(input.css('color')), CSS.color,
            'Upon initialization input value should be the same as the placeholder value.');
    });

    test('Testing custom placeholder color with a valid valued input.', function() {
        initializeTextFieldWithValue('bar');

        strictEqual(colorProxy(input.css('color')), CSS.color,
            'When element is intialized with a valid value it should have its default color applied to it.');
    });

    module('Textfield - data synchronization.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing overwriting custom element value with element value.', function() {
        input.val('foo');

        textfield.bind('sync', function() {
            strictEqual(input.val(), 'foo',
                'Input and Model value should be "foo".');
        }).sync();
    });

    test('Testing updating without saving will not update input value.', function() {
        textfield.bind('update', function() {
            notStrictEqual(input.val(), 'foo',
                'After running the method "update" without saving, input value should be unchanged.');
        }).update('foo');
    });

    test('Testing overwriting input value with custom element value.', function() {
        textfield.bind('save', function() {
            strictEqual(input.val(), 'bar',
                'Input value should be "bar".');
        }).update('bar').save();
    });

    module('Textfield - validators.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing empty string.', function() {
        strictEqual(textfield.validate('').success, false,
            '"" string should fail on validation.');
    });

    test('Testing placeholder value.', function() {
        strictEqual(textfield.validate(input.attr('placeholder')).success,
            false,
            'placeholder value should fail on validation.');
    });

    test('Testing placeholder value.', function() {
        strictEqual(textfield.validate('foo').success, true,
            '"foo" should pass on validation.');
    });

    test('Testing custom validator.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                validators: [

                    function(val) {
                        return val !== 'bar';
                    }
                ]
            });

        strictEqual(textfield.validate('bar').success, false,
            '"bar" should fail validation.');
    });

    test('Testing multiple custom validators.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                validators: [

                    function(val) {
                        return val !== 'foo';
                    },
                    function(val) {
                        return typeof val !== 'bar';
                    }
                ]
            });

        strictEqual(textfield.validate('foo').success && textfield.validate(
                'bar').success, false,
            '"foo" and "bar" should fail validation.');
    });

    module('Textfield - events.', {
            setup: setup,
            tearDown: tearDown
        });

    test('Testing "save" event.', function() {
        textfield.bind('save', function() {
            ok(true,
                '"save" callback should be called when model value is saved.');
        }).save();
    });

    test('Testing "sync" event.', function() {
        textfield.bind('sync', function() {
            ok(true,
                '"sync" callback should be called when model value is synchronized.');
        }).sync();
    });

    test('Testing "update" event.', function() {
        textfield.bind('update', function() {
            ok(true,
                '"update" callback should be called when model value is updated.');
        }).update('foo');
    });

    test('Testing "update" event triggers validate event.', function() {
        textfield.bind('validate', function() {
            ok(true,
                '"validate" callback should be called when model value is updated.');
        }).update('bones');
    });

    test('Testing custom event triggers callback.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['foo']
            });

        textfield.bind('foo', function(event) {
            ok(true,
                '"foo" callback should be called when event "foo" is triggered.');
        }).trigger('foo');
    });

    test('Testing custom event triggered with no data.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['foo']
            });

        textfield.bind('foo', function(event) {
            strictEqual(typeof event.data, "undefined",
                'event.data should not be undefined.');
        }).trigger('foo');
    });

    test('Testing custom event triggered with data.', function() {
        textfield = customformsjs.module.Text({
                element: input[0],
                force: true,
                events: ['bar']
            });

        textfield.bind('bar', function(event) {
            strictEqual(event.data, 'Hello world!',
                'event.data value should be "Hello world!".');
        }).trigger('bar', 'Hello world!');
    });


    module('Textfield - interactions.', {
            setup: setup,
            tearDown: tearDown
        });

    test(
        'Testing that when element receives focus it adds class "focus" to it.', function() {
            input.focus();
            strictEqual(input.hasClass('focus'), true,
                'When element receive focus, customEl should have class focus added to it.');
        });

    test(
        'Testing that when element loses focus it removes class "focus" from it.', function() {
            input.focus().blur();
            strictEqual(input.hasClass('focus'), false,
                'When element loses focus, customEl should have class focus removed from it.');
        });

    test('Testing input value when receiving focus with an invalid value.', function() {
        input.focus();
        strictEqual(input.val(), '',
            'Input value should be ' + "" +
            ' when input receive focus and has an invalid value.');
    });

    test('Testing input value when receiving focus with a valid value.', function() {
        input.focus().val('foo');
        strictEqual(input.val(), 'foo', 'Input value should be ' + "foo" +
            ' when input receive and loses focus and has a valid value.');
    });

    test('Testing input value when receiving and losing focus while invalid.', function() {
        input.focus().blur();
        strictEqual(input.val(), input.attr('placeholder'),
            'Input Value should be the placeholder value when input receive and loses focus and has an invalid value.');
    });

    test('Testing input value when receiving and losing focus while valid.', function() {
        focusAndUpdateValue('foo');

        strictEqual(input.val(), 'foo',
            'Input value should be ' + "foo" +
            ' when input receive and loses focus.');
    });

    test('Testing custom placeholder color after a valid value change.', function() {
        focusAndUpdateValue('foo');

        strictEqual(colorProxy(input.css('color')), CSS.color,
            'When updating to a valid value, color should no longer be the placeholder color."');
    });

    test('Testing custom placeholder color after an invalid value change.', function() {
        focusAndUpdateValue('');

        notStrictEqual(colorProxy(input.css('color')), CSS.color,
            'When updating to an invalid value, placeholder color should be kept."');
    });

    test(
        'Testing custom placeholder color after an invalid value change with the placeholder value.', function() {
            focusAndUpdateValue('defaultText');

            notStrictEqual(colorProxy(input.css('color')), CSS.color,
                'When updating to an invalid value, placeholder color should be kept."');
        });

    function colorProxy(color) {
        return (/rgb/).test(color) ? trimrgb(color) : hexToRgb(color);
    }

    function focusAndUpdateValue(val) {
        input.focus();
        input.val(val);
        input.blur();
    }

    function initializeTextFieldWithValue(val) {
        form = $('<form />');
        input = $('<input />');
        input.attr(ATTR).css(CSS).val(val);

        $('#qunit-fixture').html(form.append(input));

        textfield = customformsjs.module.Text({
                element: input[0],
                force: true
            });
    }

    function hexToRgb(hex, opacity) {
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
    }

    function setup() {
        initializeTextFieldWithValue(ATTR.value);
    }

    function tearDown() {
        textfield = null;
        form = null;
        input = null;
        $('#qunit-fixture').html('');
    }

    function trimrgb(rgbcolor) {
        return rgbcolor.replace(/[ ]/g, '');
    }

}(this));
