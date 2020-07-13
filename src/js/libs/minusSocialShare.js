/* 
    MINUS SOCIAL SHARE
*/
(function ($) {
    $.fn.extend({
        minusSocialShare: function (options, callback) {
            var defaults = {
                template: {
                    'twitter': 'https://twitter.com/share?&url={{url}}&via={{name}}',
                    'pinterest': '//pinterest.com/pin/create/button/?description={{description}}&url={{url}}&media={{media}}',
                    'googlePlus': '//plus.google.com/share?url={{url}}',
                    'whatsapp': 'whatsapp://send?text={{url}}',
                    'facebook': '//www.facebook.com/sharer/sharer.php?u={{url}}',
                    'facebookMobi': '//m.facebook.com/sharer/sharer.php?u={{url}}',
                    'linkedin': '//www.linkedin.com/shareArticle?mini=true&url={{url}}'
                },
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'SOCIAL_SHARE', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        template: opt['template'],
                        getPos: function () {
                            var win = $(window), w = 550, h = 300;
                            return 'height=' + h + ',width=' + w + ',left=' + Math.round((win.width() - w) * .5) + ',top=' + Math.round((win.height() - h) * .5);
                        },
                        openWinPp: function (k) {
                            var _t = this, nw = window.open(k, $('title').text() || '', _t.getPos(), false);
                            if (window.focus) nw.focus();
                            return false;
                        },
                        getLnk: function (el) {
                            var _t = this, typ = el.attr('data-type') || '', ttl = el.attr('data-ttl') || $('title').text() || '', dsc = el.attr('data-dsc') || $('[name="description"]').attr('content') || '', media = el.attr('data-img') || $('[property="og:image"]').attr('content') || '', url = el.attr('data-uri') || window.location.href || '', lnk = _t.template[typ] || '';

                            if (isMobile && typ == 'facebook')
                                lnk = _t.template['facebookMobi'];

                            if (lnk != '')
                                lnk = lnk.replace(/{{url}}/g, url).replace(/{{source}}/g, url).replace(/{{media}}/g, media).replace(/{{name}}/g, ttl).replace(/{{caption}}/g, ttl).replace(/{{description}}/g, dsc);
                            else
                                lnk = el.attr('href') || '';

                            return lnk;
                        },
                        addEvent: function () {
                            var _t = this;
                            if (isMobile)
                                ID
                                    .each(function () {
                                        var ths = $(this);
                                        ths.removeAttr('onclick').attr('href', _t.getLnk(ths)).attr('target', '_blank').unbind();
                                    });
                            else
                                ID
                                    .unbind('click')
                                    .bind('click', function (evt) {
                                        evt.preventDefault();
                                        var ths = $(this),
                                            lnk = _t.getLnk(ths) || '';

                                        if (lnk != '')
                                            _t.openWinPp(lnk);
                                    })
                        },

                        init: function () {
                            this.addEvent();
                        }
                    };
                main.init();
            });
        }
    });
})(jQuery);
