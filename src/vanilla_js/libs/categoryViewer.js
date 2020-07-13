/* 

   <div class="product-list-view">
        <a rel="view-2" class="view-2-trigger" href="javascript:void(0);"><iclass="icon-view-2"></i></a>
        <a rel="view-1" class="view-1-trigger ems-mobile" href="javascript:void(0);"><i class="icon-view-2"></i></a>
        <a rel="view-3" class="view-3-trigger ems-desktop selected" href="javascript:void(0);"><i class="icon-view-3"></i></a>
    </div>

    new categoryViewer({ ID: document.querySelector('.product-list-view') });

*/

function categoryViewer(o, callback) {

    o = o || {};
    var defaults = {
        btn: '[rel]',
        selected: 'selected',
        defaultSelected: {
            mobi: 'view-2',
            desktop: 'view-3'
        }
    };
    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.callback = callback;
    this.init();
}

categoryViewer.prototype = {
    constructor: categoryViewer,
    key: 'category-view-type',
    _dispatch: function () {
        dispatcher({ type: DISPATCHER_TYPES.VIEW_TYPE_CLICKED });
    },
    addEvent: function () {
        var _t = this,
            btn = _t.ID.querySelectorAll(_t.opt.btn),
            rels = [],
            htm = document.querySelectorAll('html'),
            btnClick = function (evt) {
                evt.preventDefault();
                var ths = this,
                    rel = ths.getAttribute('rel') || '';

                utils.setClass({ target: btn, cls: _t.opt.selected, type: 'remove' });
                ths.classList.add(_t.opt.selected);

                utils.setClass({ target: htm, cls: rels, type: 'remove' });
                htm[0].classList.add(rel);

                utils.sessionStorage({ type: 'set', key: _t.key, value: rel });

                _t._dispatch();
            };

        utils.forEach(btn, function (i, elm) {
            rels.push( elm.getAttribute('rel') || '' );
            elm.addEventListener('click', btnClick);
        });

        rels = rels.join(' ');
    },
    check: function () {
        var _t = this,
            key = utils.sessionStorage({ type: 'get', key: _t.key }) || (utils.responsiveControl() ? _t.opt['defaultSelected']['mobi'] : _t.opt['defaultSelected']['desktop']),
            btn = _t.ID.querySelector('[rel="' + key + '"]');

        if (utils.detectEl(btn)) {
            btn.click();
            return false;
        }

        btn = _t.ID.querySelector('.' + _t.opt.selected);
        if (utils.detectEl(btn)) {
            btn.click();
            return false;
        }

        btn = _t.ID.querySelectorAll(_t.opt.btn);
        btn[0].click();

    },
    init: function () {
        var _t = this,
            btn = _t.ID.querySelectorAll(_t.opt.btn);
        if (utils.detectEl(btn)) {
            _t.addEvent();
            _t.check();
        }
    }
};