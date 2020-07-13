function minusMenu(o, callback) {

    o = o || {};
    var defaults = {};
    this.ID = o['ID'] || '';
    this.opt = utils.extend(defaults, o['options'] || {});
    this.callback = callback;
    this.init();
}

minusMenu.prototype = {
    constructor: minusMenu,
    el: {
        openedBtn: '.ems-menu-trigger',
        closedBtn: '.ems-menu-overlay',
    },
    cls: {
        ready: 'ems-menu-ready',
        animate: 'ems-menu-animate',
        selected: 'selected'
    },
    addEvent: function () {
        var _t = this,
            bdy = document.body,
            removeMenuSelected = function () {
                utils.forEach(_t.ID.querySelectorAll('.' + _t.cls['selected']), function (index, value) {
                    value.classList.remove(_t.cls['selected']);
                });
            };

        /* 
            accordion menu 
        */
        var menu = _t.ID.querySelectorAll('.menu-category-holder > li > a');
        utils.forEach(menu, function (index, value) {
            value.addEventListener('click', function (evt) {
                evt.preventDefault();
                var ths = this,
                    prts = utils.getParents(ths, 'li');

                if (utils.hasClass({ element: prts, value: _t.cls['selected'] }))
                    removeMenuSelected();
                else {
                    removeMenuSelected();
                    prts.classList.add(_t.cls['selected']);
                }
            })
        });


        /* 
            desktop menuye ozel kod
        
        */
        var _yMax = document.getElementsByClassName('site-header')[0].getAttribute('data-offset') || 50,
            _min = 200,
            _xMax = 270,
            stm = null,
            clearStm = function () {
                if (stm != null)
                    clearTimeout(stm);
            },
            menuState = false,
            mousemove = false;


        var mouse = { x: 0, y: 0 },
            _render = function () {

                if (!window.matchMedia('(max-width: 1024px)').matches && mousemove) {

                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0,
                        clientX = mouse.x,
                        clientY = mouse.y;

                    if (scrollTop < _yMax) {

                        if ((clientX <= _xMax && clientY <= _min) && !menuState) {
                            menuState = true;
                            clearStm();
                            if (!utils.hasClass({ element: bdy, value: _t.cls['animate'] }))
                                stm = setTimeout(function () {
                                    utils.cssClass({ 'target': bdy, 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });

                                }, 222);
                        } else if ((clientX > _xMax) && menuState) {
                            menuState = false;
                            clearStm();
                            if (utils.hasClass({ element: bdy, value: _t.cls['ready'] }))
                                stm = setTimeout(function () {
                                    utils.cssClass({ 'target': bdy, 'delay': 222, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                                    removeMenuSelected();
                                }, 333);
                        }
                    }/* else {

                        if (clientX <= _xMax)
                            menuState = false;
                        else if (clientX > _xMax)
                            menuState = true;
                    }*/

                }

                requestAnimationFrame(_render);
            };
        window.addEventListener('mousemove', function (evt) {
            mousemove = true;
            mouse = utils.getMousePos(evt);
        });
        _render();

        /* 
            menu aç ve kapat butonu
        */
        var btn = document.querySelectorAll(_t.el.openedBtn);
        if (utils.detectEl(btn))
            utils.forEach(btn, function (ind, elm) {
                elm.addEventListener('click', function () {

                    if (!utils.hasClass({ element: bdy, value: _t.cls['ready'] })) {
                        menuState = true;
                        utils.cssClass({ 'target': bdy, 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });
                    } else {
                        menuState = false;
                        utils.cssClass({ 'target': bdy, 'delay': 222, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                        removeMenuSelected();
                    }
                });
            });

        btn = document.querySelectorAll(_t.el.closedBtn);
        if (utils.detectEl(btn))
            utils.forEach(btn, function (ind, elm) {
                elm.addEventListener('click', function () {
                    menuState = false;
                    utils.cssClass({ 'target': bdy, 'delay': 222, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                    removeMenuSelected();
                });
            });



        /* 
            desktop menuye ozel kod
        */

        /*if (!isMobile) {

            var _yMax = document.getElementsByClassName('site-header')[0].getAttribute('data-offset') || 50,
                _min = 300,
                _xMax = 370,
                stm = null,
                clearStm = function () {
                    if (stm != null)
                        clearTimeout(stm);
                },
                menuState = false;

            window.addEventListener('mousemove', function (ev) {

                if (!window.matchMedia('(max-width: 1024px)').matches) {

                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0,
                        mouse = (0, utils.getMousePos)(ev),
                        clientX = mouse.x,
                        clientY = mouse.y;

                    if (scrollTop < _yMax) {

                        if ((clientX <= _xMax && clientY <= _min) && !menuState) {
                            menuState = true;
                            clearStm(stm);
                            if (!utils.hasClass({ element: bdy, value: _t.cls['animate'] }))
                                stm = setTimeout(function () {
                                    utils.cssClass({ 'target': bdy, 'delay': 100, 'type': 'add', 'cls': [_t.cls['ready'], _t.cls['animate']] });
                                }, 222);
                        } else if ((clientX > _xMax) && menuState) {
                            menuState = false;
                            clearStm(stm);
                            if (utils.hasClass({ element: bdy, value: _t.cls['ready'] }))
                                stm = setTimeout(function () {
                                    utils.cssClass({ 'target': bdy, 'delay': 222, 'type': 'remove', 'cls': [_t.cls['animate'], _t.cls['ready']] });
                                    removeMenuSelected();
                                }, 333);
                        }

                    } else {

                        if (clientX <= _xMax)
                            menuState = false;
                        else if (clientX > _xMax)
                            menuState = true;
                    }

                }

            });

        }*/

        /*
            header animation
        */
        var _header = document.getElementsByClassName('site-header')[0],
            _offset = _header.getAttribute('data-offset') || 100,
            cls = {
                ready: _header.getAttribute('data-ready') || 'site-header-ready',
                animate: _header.getAttribute('data-animate') || 'site-header-animate'
            },
            adjust = function () {
                var wst = document.body.scrollTop || document.documentElement.scrollTop || 0;

                if (wst >= _offset)
                    utils.cssClass({ 'target': bdy, 'delay': 100, 'type': 'add', 'cls': [cls['ready'], cls['animate']] });
                else
                    setTimeout(function () {
                        utils.cssClass({ 'target': bdy, 'delay': 333, 'type': 'remove', 'cls': [cls['animate'], cls['ready']] });
                    }, 100);
            };
        document.addEventListener('scroll', function () { adjust(); });
        window.addEventListener('resize', function () { adjust(); });
        window.addEventListener('orientationchange', function () { adjust(); });
        adjust();
    },
    init: function () {
        var _t = this;
        _t.addEvent();
    }
};