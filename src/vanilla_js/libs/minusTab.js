function minusTab(o, callback) {
    var defaults = {
        swiperWrapperClass: '.swiper-container',
        content: '.ems-tab-content > [rel]', // content
        tabNav: '.ems-tab-header > [rel]', // tab menu button
        accNav: '.ems-tab-content > div > .ems-tab-inner-header', // accordion menu button
        begin: 0,
        target: '.emosInfinite',
        ajx: {
            target: '.urnList .emosInfinite',
            typ: 'append'
        }
    };

    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.content = this.ID.querySelectorAll(this.opt['content']);
    this.tabNav = this.ID.querySelectorAll(this.opt['tabNav']);
    this.accNav = this.ID.querySelectorAll(this.opt['accNav']);
    this.callback = callback;
    this.init();
}

minusTab.prototype = {
    constructor: minusTab,

    cls: {
        selected: 'selected',
    },

    removedClass: function (o) {
        var _t = this;
        utils.forEach(o['target'], function (index, elm) {
            elm.classList.remove(o['cls']);
        });
    },

    addEvent: function () {
        var _t = this;

        // tab
        utils.forEach(_t.tabNav, function (index, elm) {
            elm.onclick = function () {
                var ths = this,
                    rel = ths.getAttribute('rel') || '';

                if (rel != '') {
                    _t.removedClass({ target: _t.tabNav, cls: _t.cls['selected'] });
                    _t.removedClass({ target: _t.content, cls: _t.cls['selected'] });

                    ths.classList.add(_t.cls['selected']);
                    _t.ID.querySelectorAll(_t.opt['content'] + '[rel="' + rel + '"]')[0].classList.add(_t.cls['selected']);
                }
            };
        });

        // accordion
        utils.forEach(_t.accNav, function (index, elm) {
            elm.onclick = function () {
                var ths = this,
                    prts = utils.getParents(ths, '[rel]'),
                    rel = prts.getAttribute('rel') || '';

                if (rel != '') {

                    if (utils.hasClass({ element: prts, value: _t.cls['selected'] })) {
                        _t.removedClass({ target: _t.tabNav, cls: _t.cls['selected'] });
                        _t.removedClass({ target: _t.content, cls: _t.cls['selected'] });

                    } else {
                        
                        _t.removedClass({ target: _t.tabNav, cls: _t.cls['selected'] });
                        _t.removedClass({ target: _t.content, cls: _t.cls['selected'] });
                        prts.classList.add(_t.cls['selected']);

                        var tab = _t.ID.querySelectorAll(_t.opt['tabNav'] + '[rel="' + rel + '"]');
                        if (tab.length > 0)
                            tab[0].classList.add(_t.cls['selected']);
                    }
                }
            };
        });

    },

    init: function () {
        var _t = this;
        if (utils.detectEl(_t.content) && (utils.detectEl(_t.tabNav) || utils.detectEl(_t.accNav)))
            _t.addEvent();
    }
};