/* 
    <div 
        class="ems-animated"
        data-cls="d-banner-effect01-ready"
        data-threshold="250">
    </div>
*/
function minusWayPoint(o, callback) {

    o = o || {};
    var defaults = {};
    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.callback = callback;
    this.init();
}

minusWayPoint.prototype = {
    constructor: minusWayPoint,
    cls: {
        activeted: 'activeted'
    },
    adjust: function () {
        var _t = this;
        utils.forEach(_t.ID, function (index, target) {
            if (getComputedStyle(target).display !== 'none') {

                var cls = target.getAttribute('data-cls') || _t.cls['activeted'],
                    rate = target.getAttribute('data-rate') || 1,
                    threshold = target.getAttribute('data-threshold') || 0;

                if (utils.detectPosition({ target: target, elementNext: true, rate: rate, threshold: threshold })) {
                    target.classList.add(cls);
                } else
                    target.classList.remove(cls);
            }
        });
    },

    addEvent: function () {
        var _t = this;
        document.addEventListener('scroll', function () { _t.adjust(); });
        window.addEventListener('resize', function () { _t.adjust(); });
        window.addEventListener('orientationchange', function () { _t.adjust(); });
        _t.adjust();
    },

    init: function () {
        var _t = this;
        _t.addEvent();
    }
};