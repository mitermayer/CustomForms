(function(global) {
    var form,
        settings = {};

    /*
     * Setup configuration
     */
    module('General', {
            setup: function() {
                form = $('<form />');
                $('#qunit-fixture').append(form);
            },
            teardown: function() {
                form = null;
                $('#qunit-fixture').html('');
            }
        });

    /*
     * jQuery
     */
    test('Test plugin jQuery chaining.', function() {
        var chain = form.cstmForm();
        ok(chain instanceof jQuery,
            'The plugin should return the jQuery result object for chaining.');
    });
}(this));
