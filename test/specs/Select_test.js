(function(global) {

    var form,
        select,
        input,
        customEl,
        customElContainer,
        settings = {
            classPrefix: 'custom-'
        },
        optVal = [
            'default',
            'foo',
            'moo'
        ],
        attr = {
            name: 'something',
            id: 'somthingelse'
        };

    /*
     * Setup configuration
     */
    module('Select', {
        setup: function() {

            var options;

            form = $('<form />');

            input = $('<select />');
            input.attr(attr);


            for (var i = 0, len = optVal.length; i < len; i++) {
                if (i === 0) {
                    options += "<option>" + optVal[i] + "</option>";
                } else {
                    options += "<option value='" + i + "'>" + optVal[i] +
                        "</option>";
                }
            }

            // add options, make default with no value
            input.html(options);

            form.append(input);

            $('#qunit-fixture').append(form);

            select = customformsjs.module.Select({
                element: input.get(0),
                classPrefix: settings.classPrefix
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

        // custom container must be a valid html element
        notStrictEqual(customElContainer.length, 0,
            'When initializing customElContainer must be a valid html element.');

        // custom element must be a valid html element
        notStrictEqual(customEl.length, 0,
            'When initializing customEl must be a valid html element.');

        // input should now be inside the custom container 
        strictEqual(input.parent()[0], customElContainer[0],
            'When initialized select should be now instide of custom container.');
        // input next sibbling should be custom element
        strictEqual(input.next()[0], customEl[0],
            'When initialized select should be followed by custom element.');

        // checked stated should be a reflection of the input checked property
        strictEqual(customEl.html(), optVal[0],
            'When initializing customEl text must be "default" since it is the first option node from the select elemet.');

        strictEqual(customEl.hasClass('custom-select'), true,
            'Custom elment should have class custom-select when initializing');
    });

    /*
     * Interaction tests
     */
    test('Test interactions.', function() {

        // The change event definition
        // For select boxes, checkboxes, and radio buttons, the event is fired immediately when the user makes a selection with the mouse, but for the other element types the event is deferred until the element loses focus.
        // So in orther to unit test this, we need to call trigger manually since it can only activate change event with a mouse selection.
        //
        for (var i = 0, len = optVal.length; i < len; i++) {
            input.val(i).trigger('change');
            strictEqual(customEl.html(), optVal[i],
                'When changing the select value, custom element text must reflect to the option selected text.');
        }

        input.focus();
        strictEqual(customElContainer.hasClass('focus'), true,
            'When element gain focus, custom element container should have class focus added to it.');

        input.blur();
        strictEqual(customElContainer.hasClass('focus'), false,
            'When element loses focus, custom element container should have class focus removed from it.');

    });

}(this));
