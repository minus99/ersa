/* 
    minus html5 video
*/

(function ($) {
    $.fn.extend({
        minusHTML5Video: function (options, callback) {
            var defaults = {
                button: '.open-video' // siblingsinde bulunan video çalıştırır.
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    main = {
                        cls: {
                            isPlay: 'is-play',
                            scrolling: 'is-scrolling' // scroll ile tetiklencek video class olarak eklenir
                        },
                        adjust: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                ID
                                    .each(function () {
                                        var ths = $(this),
                                            k = ths.get(0);

                                        if (ths.hasClass(_t.cls['scrolling'])) {
                                            if (uty.detectPosition({ ID: ths })) {
                                                if (!ths.hasClass(_t.cls['isPlay'])) {
                                                    ths.addClass(_t.cls['isPlay']);
                                                    k.play();
                                                }
                                            } else {
                                                if (ths.hasClass(_t.cls['isPlay'])) {
                                                    ths.removeClass(_t.cls['isPlay']);
                                                    k.pause();
                                                }
                                            }
                                        }
                                    });
                            }

                        },
                        addEvent: function () {
                            var _t = this;
                            $(opt['button'])
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        vid = ths.siblings('video');
                                    if (uty.detectEl(vid)) {
                                        var k = vid.get(0);
                                        if (!vid.hasClass(_t.cls['isPlay'])) {
                                            vid.add( ths ).addClass(_t.cls['isPlay']);
                                            k.play();
                                        } else {
                                            vid.add( ths ).removeClass(_t.cls['isPlay']);
                                            k.pause();
                                        }
                                    }
                                });
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };

                main.init();

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