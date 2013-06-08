(function(global) {

    var form,
        file,
        input,
        customEl,
        customElContainer,
        settings = {
            classPrefix: 'custom-',
            holderTxt: 'insert..'
        },
        attr = {
            name: 'something',
            type: 'file',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('file', {
            setup: function() {

                var options;

                form = $('<form />');

                input = $('<input />');
                input.attr(attr);

                form.append(input);

                $('#qunit-fixture').append(form);

                file = customformsjs.module.File({
                        element: input.get(0),
                        classPrefix: settings.classPrefix,
                        holderTxt: settings.holderTxt
                    });

                var _customElId = settings.classPrefix + (input.attr("id") ||
                    input
                    .attr('name'));
                var _customElContainerId = _customElId + '-container';

                customEl = $('#' + _customElId);
                customElContainer = $('#' + _customElContainerId);

            },
            teardown: function() {
                form = null;
                file = null;
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
        ok(file, 'The file object  must be defined.');

        // custom container must be a valid html element
        notStrictEqual(customElContainer.length, 0,
            'When initializing customElContainer must be a valid html element.');

        // custom element must be a valid html element
        notStrictEqual(customEl.length, 0,
            'When initializing customEl must be a valid html element.');

        // input should now be inside the custom container 
        strictEqual(input.parent()[0], customElContainer[0],
            'When initialized file should be now instide of custom container.');

        // input next sibbling should be custom element
        strictEqual(input.next()[0], customEl[0],
            'When initialized file should be followed by custom element.');

        // checked stated should be a reflection of the input checked property
        strictEqual(customEl.html(), settings.holderTxt,
            'When initializing file and there is not a file value attached to the input, custom element should have holder text.');

        strictEqual(customEl.hasClass('custom-file'), true,
            'Custom elment should have class custom-file when initializing');

    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        expect(0);
        // Browsers dont allow much functionality to be triggered programaticly on file in puts for security reasons.
        // So there is not much that can be tested in here.

    });

}(this));
