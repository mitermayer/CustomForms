(function(global)
{

    $(function()
    {
        var APP = global.app = global.app || {};


        var fieldFactory = (function()
        {

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
            var SUPPORTED_ELMENTS = {};


            for (var _module in APP.module)
            {

                var _tag = APP.module[_module].target.tagName,
                    _filter = APP.module[_module].target.filter,
                    _ref,
                    blueprint;

                if ($.isArray(_tag))
                {
                    for (var i = 0, len = _tag.length; i < len; i++)
                    {
                        blueprint = SUPPORTED_ELMENTS[_tag[i]] =
                            SUPPORTED_ELMENTS[_tag[i]] || [];
                        _ref = _filter[_tag[i]] ?
                        {
                            filter: _filter[_tag[i]],
                            module: _module
                        } : _module;
                        blueprint.push(_ref);
                    }
                }
                else
                {
                    blueprint = SUPPORTED_ELMENTS[_tag] = SUPPORTED_ELMENTS[
                        _tag] || [];
                    _ref = _filter ?
                    {
                        filter: _filter,
                        module: _module
                    } : _module;
                    blueprint.push(_ref);
                }

            }

            //return function(options, $arr) {
            return function()
            {
                // TODO:
                // Loop on all $arr items and check to see if their tageName match
                // After call all modules from item if they pass on filter or if they dont have one
            };

        })();

        $.fn.cstmForm = fieldFactory;

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

    });

}(this));
