$(function(){

    var el = $("input[type='text']");

    b = new app.module.TextField({
        element: el[0],
        init: function() {
            console.log("Ready..");
        }
    });

});
