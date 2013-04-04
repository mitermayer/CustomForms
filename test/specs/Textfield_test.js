var textfield,
    input,
    form;

module('TextField', {
    setup: function() {

        form = $("<form />"),

        input = $("<input />"),
            attr = {
                type: "text",
                value: "",
                placeholder: "defaultText"
            },
            css = {
                color: "blue"
            };

        input.attr(attr).css(css);

        $("#qunit-fixture").append(form.append(input));

        textfield = app.module.TextField({
            element: input.get(0),
            force: true
        });
    },
    teardown: function() {
        textfield = null;
        form = null;
        input = null;
        $("#qunit-fixture").html("");
    }
});

test('Test initiliazation.', function() {
    ok(textfield, 'The textfield object must be defined.');
});

test('Test updating values', function() {
    strictEqual(input.val(), input.attr("placeholder"), "At first input value should be the same as placeholder value.");

    textfield.update("Tomate");
    strictEqual(input.val(), input.attr("placeholder"), "After running the method 'update' without saving, should keep the input value unchanged.");

    textfield.save();
    strictEqual(input.val(), "Tomate", "Input value should be updated to 'Tomate'");

    //textfield.update("").save();
    //strictEqual(input.val(), input.attr("placeholder"), "Input value should now be set to 'undefined'.");

    textfield.update(1).save();
    strictEqual(typeof input.val(), "string", "Input value should still be of type string even when updated with a number");

    textfield.update(true).save();
    strictEqual(typeof input.val(), "string", "Input value should still be of type string even when updated with a boolean");

});

test('Test saving values', function() {
    ok(textfield, 'The textfield object must be defined.');
});

test('Test synchronizing values', function() {
    ok(textfield, 'The textfield object must be defined.');
});

test('Test validators', function() {
    ok(textfield, 'The textfield object must be defined.');
});

test('Test events', function() {
    ok(textfield, 'The textfield object must be defined.');
});
