//(function(global)
//{

//    $(function()
//    {
//var APP = global.app = global.app || {};


//var fieldFactory = (function()
//{

/*
 *SUPPORTED_ELMENTS = {
 *    tagName: [
 *        {
 *            filter: { 'attrname': ['arrval'] },
 *            module: "moduleName"
 *        },
 *        {
 *            filter: { 'attrname2': 'strval' }
 *            module: "moduleName"
 *        },
 *        "strmodulename"
 *    ]
 *};
 */
//    var SUPPORTED_ELMENTS = {},
//        addSupportedElement = function(module, tag) {

//            var filter = APP.module[module].target.filter || {},
//                item;

//            // if we dont have element on the hash add it
//            SUPPORTED_ELMENTS[tag] = SUPPORTED_ELMENTS[tag] || [];

//            // if module has a filter add it, else just add input with module reference.
//            item = filter[tag] ? { filter: filter[tag], module: module } : module;

//            // push item to supported hash
//            SUPPORTED_ELMENTS[tag].push(item);
//        },
//        lookUp = {
//            'arr': function(module, tag) {
//                $.each(tag, function(key, value){
//                    addSupportedElement(module, value);
//                });
//            },
//            'default': addSupportedElement
//        };

//    $.each(APP.module, function(key) {
//        var _tag = APP.module[key].target.tagName;

//        lookUp[$.isArray(_tag) ? 'arr' : 'default'](key, _tag);
//    });

//    //return function()
//    return function(options, $arr) {
//        // TODO:
//        // Loop on all $arr items and check to see if their tageName match
//        // After call all modules from item if they pass on filter or if they dont have one

//        console.log(this, $(this));
//        $(this).each(function() {
//            var $element = $(this);
//            var element = $element.get(0);
//            var tagname = element.nodeName.toLowerCase();

//            if( SUPPORTED_ELMENTS[tagname] ) {
//               $.each(SUPPORTED_ELMENTS[tagname], function( key, value ) {
//                    if(typeof value === 'string') {
//                        APP.module[value.module]({ element: element });
//                    } else {
//                        $.each(value.filter, function(key, val) {
//                           if( $element.attr(key) === val) {
//                                APP.module[value.module]({ element: element });
//                           }
//                        });
//                    }
//               });
//            }
//        });
//    };

//})();

//$.fn.cstmForm = fieldFactory;

//$('input[type="text"]').each(function() {
//    var a = app.module.TextField({
//        element: $(this)[0],
//        force: true, 
//        init: function() {
//            console.log("starting placeholder..");
//        }
//    });
//});

//$('input[type="checkbox"]').each(function() {
//    var b = app.module.Checkbox({
//        element: $(this)[0],
//        init: function() {
//            console.log("starting checkbox..");
//        }
//    });
//});

//$('input[type="radio"]').each(function() {
//    var c = app.module.Radio({
//        element: $(this)[0],
//        init: function() {
//            console.log("starting radio..");
//        }
//    });
//});

//$('input[type="file"]').each(function() {
//    var d = app.module.File({
//        element: $(this)[0],
//        init: function() {
//            console.log("starting file..");
//        }
//    });
//});

//$('select').each(function() {
//    var e = app.module.Select({
//        element: $(this)[0],
//        init: function() {
//            console.log("starting select..");
//        }
//    });
//});

//    });

//}(this));
