(function( global ){

    var APP = global.app = global.app || {};

    $(function(){

        var a = {
            value: "miter"
        };

        var b = new app.BaseField({
            element: a,
            validators: [
                function( value ) {
                    return value !== "miter"; 
                }
            ],
            init: function() {
                console.log("ready");
            }
        });

        b
        .bind("validate", function( result ) {

            console.log( "validating:", result );
        })
        .bind("update", function() {
            
            console.log("succesfuly updated..");
        })
        .bind("sync", function( val ) {
            
            console.log(a.value, val);
        });

        b.update("jonas").save();

        a.value = "bostaaaaa";

        console.log(a.value);
        b.sync();
    });

}( this ));
