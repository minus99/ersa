/* 

*/

function customSearch(o, callback) {

    o = o || {};
    var defaults = {
        input: '.ems-search-input > input',
        content: '.ems-search-results',
        closeBtn: '.ems-search .modal-close',
    };
    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.callback = callback;
    this.init();
}

customSearch.prototype = {
    constructor: customSearch,
    cls: {
        focused: 'search-focused',
        keyup: 'search-keyup',
        loading: 'ajx-loading',
        resultFound: 'ems-search-results-ready'
    },
    uri: '/{{lang}}/Page/Get/HeaderSearch?q={{val}}',
    getURI: function (o) {
        o = o || {};
        var _t = this;
        return o['uri'].replace(/{{val}}/g, encodeURIComponent(o['val'] || '')).replace(/{{lang}}/g, lang);
    },
    stm: null,
    clearTm: function () {
        var _t = this;
        if (_t.stm != null)
            clearTimeout(_t.stm);
    },
    loading: function (o) {
        var _t = this,
            type = o['type'] || '',
            ID = _t.ID;

        if (type == 'add')
            ID.classList.add(_t.cls['loading']);
        else
            ID.classList.remove(_t.cls['loading']);
    },
    addEvent: function () {
        var _t = this,
            ID = _t.ID,
            opt = _t.opt,
            bdy = document.body,
            content = ID.querySelectorAll(opt.content)[0] || {},
            input = ID.querySelectorAll(opt.input)[0] || {},
            uri = input.getAttribute('data-uri') || _t.uri,
            mx = input.getAttribute('data-max') || 3,
            _onFocus = function () {
                ID.classList.add(_t.cls['focused']);
            },
            _onBlur = function () {
                var ths = this,
                    val = utils.trimText(ths.value || '');

                if (val.length == 0)
                    ID.classList.remove(_t.cls['focused']);
            },
            _onChange = function () {

                var ths = this,
                    val = utils.trimText(ths.value || '');

                _t.clearTm();

                if (val.length > 0)
                    ID.classList.add(_t.cls['keyup']);
                else
                    ID.classList.remove(_t.cls['keyup']);

                if (val.length >= mx) {

                    _t.stm = setTimeout(function () {

                        _t.loading({ type: 'add' });

                        utils.ajx({ uri: _t.getURI({ uri: uri, val: val }), type: 'html' }, function (res) {

                            val = utils.trimText(input.value || '');
                            if (res['type'] == 'success' && val.length >= mx) {
                                var htm = res.data || '';
                                content.innerHTML = htm;
                                bdy.classList.add(_t.cls['resultFound']);
                            }

                            _t.loading({ type: 'remove' });
                        });

                    }, 333);

                } else {
                    bdy.classList.remove(_t.cls['resultFound']);
                    content.innerHTML = '';
                }

            };

        if (utils.detectEl(input) && utils.detectEl(content)) {
            input.addEventListener('keyup', _onChange, true);
            input.addEventListener('keydown', _onChange, true);
            input.addEventListener('change', _onChange, true);
            input.addEventListener('input', _onChange, true);
            input.addEventListener('paste', _onChange, true);

            input.addEventListener('focus', _onFocus, true);
            input.addEventListener('blur', _onBlur, true);
        }

        // 
        var closeBtn = document.querySelectorAll(_t.opt.closeBtn);
        utils.forEach(closeBtn, function (i, elm) {
            elm.addEventListener('click', function (evt) {
                evt.preventDefault();
                _t.destroy();
            });
        });

    },
    destroy: function () {
        var _t = this,
            ID = _t.ID,
            bdy = document.body,
            content = ID.querySelectorAll(_t.opt.content)[0] || {},
            input = ID.querySelectorAll(_t.opt.input)[0] || {};

        bdy.classList.remove(_t.cls['resultFound']);
        ID.classList.remove(_t.cls['focused']);
        ID.classList.remove(_t.cls['keyup']);

        content.innerHTML = '';
        input.value = '';
    },
    init: function () {
        var _t = this;
        _t.addEvent();
    }
};

new customSearch({ ID: document.querySelector('.ems-search') })