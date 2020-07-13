/* 
    MINUS LOAD MORE
*/
(function ($) {
    $.fn.extend({
        minusLoadMoreButton: function (options, callback) {
            var defaults = {
                activePaging: '.urunPaging_pageNavigation [id$="ascPagingDataAlt_lblPaging"] span', // active
                target: '.urnList .emosInfinite', // hedef ul
                paging: '.urunPaging_pageNavigation', // hedef paging
                infiniteScroll: false,
                threshold: 200,

                // cls
                loading: 'ajx-loading', // ajx yüklenirken body class
                hidden: 'ems-none'
            };

            var option = $.extend(defaults, options);

            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    _dispatch = function (obj) {
                        obj = obj || {};
                        stage.dispatchEvent("CustomEvent", 'LOAD_MORE_LOADED', $.extend({ ID: ID }, obj));
                    },
                    _callback = function (obj) {
                        obj = obj || {};
                        if (typeof callback !== 'undefined')
                            callback($.extend({ ID: ID }, obj));
                    },
                    main = {
                        param: 'srt',
                        clicklable: true,
                        cls: {
                            selected: opt['selected'],
                            ready: opt['ready'],
                            animate: opt['animate']
                        },
                        trigger: function (o) {
                            o = o || {};
                            _dispatch(o);
                            _callback(o);
                        },
                        loading: function (k) {
                            var _t = this;
                            if (k == 'show')
                                bdy.addClass(opt['loading']);
                            else
                                bdy.removeClass(opt['loading']);
                        },
                        control: function () {
                            var _t = this, uri = $(opt['activePaging']).next('a').attr('href') || '';
                            if (uri == '')
                                ID.addClass(opt['hidden']);
                        },
                        ajxResult: function (o) {
                            var _t = this,
                                ajxTargetCon = $('<div>' + uty.clearScriptTag(o['val'] || '') + '</div>'),
                                ajxTarget = ajxTargetCon.find(opt['target']),
                                target = $(opt['target']),
                                type = 'error';

                            if (uty.detectEl(target) && uty.detectEl(ajxTarget)) {
                                type = 'success';
                                target.eq(0).append(ajxTarget.eq(0).html() || '');
                                $(opt['paging']).eq(0).html(ajxTargetCon.find(opt['paging']).eq(0).html() || '');
                            }

                            _t.trigger({ type: type });
                            _t.control();
                            _t.clicklable = true;
                        },
                        addEvent: function () {
                            var _t = this;

                            ID
                                .unbind('click')
                                .bind('click', function () {
                                    var ths = $(this),
                                        uri = $(opt['activePaging']).next('a').attr('href') || '';
                                    if (uri != '' && _t.clicklable) {
                                        _t.clicklable = false;
                                        _t.loading('show');
                                        uty.ajx({ uri: uri }, function (k) {
                                            if (k['type'] == 'success')
                                                _t.ajxResult({ val: k['val'] || '' });

                                            _t.loading('hide');
                                        });
                                    }

                                });

                        },
                        adjust: function () {
                            var _t = this;
                            if (opt['infiniteScroll']) {
                                if (uty.detectPosition({ ID: ID, threshold: opt['threshold'], elementNext: true })) {
                                    ID.click();    
                                }
                            }
                        },
                        init: function () {
                            var _t = this;
                            if (uty.detectEl(ID)) {
                                _t.control();
                                _t.addEvent();
                            }
                        }
                    };
                main.init();

                this.adjust = function () {
                    main.adjust();
                };
            });
        }
    });
})(jQuery);