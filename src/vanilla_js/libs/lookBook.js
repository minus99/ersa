function lookBook(o, callback) {

    o = o || {};
    var defaults = {
        btn: '.ems-prd-list-wrapper > li',
        content: '.lookbook-detail > .modal-body',
    };
    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.callback = callback;
    this.init();
}

lookBook.prototype = {
    constructor: lookBook,
    clicklable: true,
    cls: {
        ready: 'lookbook-detail-ready',
        animate: 'lookbook-detail-animate',
        ajxLoading: 'ajx-lookbook-loading',
        loading: 'content-loading'
    },
    uri: '/{{lang}}/Page/Get/LookbookItem?products={{products}}&name={{name}}&image={{image}}',
    getURI: function (o) {
        var _t = this;
        return _t.uri.replace(/{{lang}}/g, lang).replace(/{{products}}/g, o['products'] || '').replace(/{{name}}/g, o['name'] || '').replace(/{{image}}/g, o['image'] || '');
    },
    loading: function (o) {
        var _t = this,
            type = o['type'] || 'add',
            bdy = document.body;

        switch (type) {
            case 'add':
                bdy.classList.add(_t.cls['ajxLoading']);
                break;
            case 'remove':
                bdy.classList.remove(_t.cls['ajxLoading']);
                break;
            default:
                break;
        }
    },
    panel: function (o) {
        var _t = this,
            type = o['type'] || 'show',
            bdy = document.body;

        switch (type) {
            case 'show':
                utils.cssClass({ 'target': bdy, 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });
                break;
            case 'hide':
                utils.cssClass({ 'target': bdy, 'delay': 333, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['animate']] });
                break;
            default:
                break;
        }
    },
    onClick: function (_t, evt) {
        var ths = evt.currentTarget,
            products = ths.getAttribute('data-products') || '',
            image = ths.getAttribute('data-image') || '',
            name = ths.getAttribute('data-name') || '';

        if (_t.clicklable) {
            _t.clicklable = false;
            _t.loading({ type: 'add' });
            ths.classList.add(_t.cls['loading']);
            utils.ajx({ uri: _t.getURI({ products: products, image: image, name: name }), type: 'html' }, function (res) {
                var htm = res.data || '',
                    content = document.querySelectorAll(_t.opt.content);
                if (utils.detectEl(content))
                    content[0].innerHTML = htm;

                _t.loading({ type: 'remove' });
                ths.classList.remove(_t.cls['loading']);
                _t.panel({ type: 'show' });
                _t.clicklable = true;
            });
        }
    },
    addEvent: function () {
        var _t = this,
            btn = document.querySelectorAll(_t.opt.btn);

        if (utils.detectEl(btn))
            utils.forEach(btn, function (i, elm) {
                elm.removeEventListener('click', _t.onClick.bind(this, _t));
                elm.addEventListener('click', _t.onClick.bind(this, _t));
            });
    },
    init: function () {
        var _t = this;
        _t.addEvent();
    }
};

new lookBook({ ID: document.querySelector('.lookbook') });