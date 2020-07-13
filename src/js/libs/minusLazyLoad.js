/* 

    Custom Lazy Load

*/
(function ($) {
    $.fn.extend({
        minusLazyLoad: function (options, callback) {
            var defaults = {
                loaded: 'image-loaded', // nesne yüklendikten sonra gelen class
                rate: .9,
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        stage.dispatchEvent("CustomEvent", "MINUS_LAZY_LOAD", $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        adjust: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                ID
                                    .each(function () {
                                        var ths = $(this);
                                        if (!ths.hasClass(opt['loaded']) && uty.detectPosition({ ID: ths })) {
                                            
                                           uty.lazyLoad({ ID: ths });

                                            _dispatch({ target: ths });
                                            _callback({ target: ths });
                                        }
                                    });
                            }

                        }
                    };
                setTimeout(function () {
                    main.adjust();
                }, 1000);

                this.adjust = function () {
                    main.adjust();
                };

            });
        }
    });
})(jQuery);