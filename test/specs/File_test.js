(function(global) {
    var form,
        file,
        input,
        customEl,
        customElContainer,
        SETTINGS = {
            classPrefix: 'custom-',
            holderTxt: 'insert..'
        },
        ATTR = {
            name: 'something',
            type: 'file',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('File - initialization', {
            setup: setup,
            teardown: tearDown
        });

    test('Testing module is available.', function() {
        ok(customformsjs.module.File, 'The File module must be defined.');
    });

    test('Testing module is instantiated.', function() {
        ok(file, 'The File module must be successfuly instantiated.');
    });

    test('Testing custom element has "custom-file" class applied to it.', function() {
        strictEqual(customEl.hasClass('custom-file'), true,
            'Custom element should have class custom-file when initializing.');
    });

    test(
        'Testing custom element container has "custom-file-container" class applied to it.', function() {
            strictEqual(customElContainer.hasClass('custom-file-container'),
                true,
                'Custom element container should have class custom-file-container when initializing.');
        });

    test(
        'Testing custom element has a holder text applied to it when it is empty valued.', function() {
            strictEqual(customEl.html(), SETTINGS.holderTxt,
                'When initializing file and there is not a file value attached to the input, custom element should have holder text.');
        });

    function initializeFileWithValue() {
        form = $('<form />');
        input = $('<input />');
        input.attr(ATTR).val(val);

        $('#qunit-fixture').html(form.append(input));

        textfield = customformsjs.module.Text({
                element: input[0],
                force: true
            });
    }

    function setup() {
        var options,
            _customElContainerId,
            _customElId;

        form = $('<form />');

        input = $('<input />');
        input.attr(ATTR);

        form.append(input);

        $('#qunit-fixture').append(form);

        file = customformsjs.module.File({
                element: input.get(0),
                classPrefix: SETTINGS.classPrefix,
                holderTxt: SETTINGS.holderTxt
            });

        _customElId = SETTINGS.classPrefix + (input.attr("id") || input.attr(
                'name'));

        _customElContainerId = _customElId + '-container';

        customEl = $('#' + _customElId);
        customElContainer = $('#' + _customElContainerId);
    }

    function tearDown() {
        form = null;
        file = null;
        input = null;
        customEl = null;
        customElContainer = null;

        $('#qunit-fixture').html('');
    }
}(this));
