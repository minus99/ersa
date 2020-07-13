/* 
    MINUS DROPDOWN 
*/
(function ($) {
    $.fn.extend({
        minusDropDown: function (options, callback) {
            var defaults = {
                closeElem: '',
                type: "hover",
                customClass: "hover",
                bdyCls: "",
                bdyCls2: "",
                delay: 555,
                openedDelay: 0,
                className: "",
                clicked: "",
                closedBtn: '',
                openedControl: "",
                hideDropDown: [],
                attachmentDiv: null,
                isVisible: null,
                overlay: null,
                parents: null,
                toggle: true,
                bdyClicked: true
            };
            var options = $.extend(defaults, options);
            return this.each(function () {

                var holder = $(this),
                    o = options,
                    attachmentDiv = o.attachmentDiv != null ? $(o.attachmentDiv) : null,
                    stm = null,
                    bdy = $('body');

                if (holder.hasClass('activePlug')) return false;

                function init() {
                    if (o.type == "hover") {
                        holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                        if (attachmentDiv != null) attachmentDiv.mouseenter(events.mouseenter).mouseleave(events.mouseleave)

                        $("body, html").bind('click touchstart', events.bodyClicked);
                    }
                    else if (o.type == "click") {
                        $(o.clicked, holder).bind('click', events.clicked);
                        if (o.bdyClicked)
                            $("body, html").bind('click touchstart', events.bodyClicked);
                    } else if (o.type == "hoverClick") {
                        holder.mouseenter(events.onMouseenter).mouseleave(events.onMouseleave);
                        $(o.clicked, holder).bind('click', events.onClicked);
                        if (o.bdyClicked)
                            $("body, html").bind('click touchstart', events.bodyClicked);
                    }

                    $(o.closedBtn)
                        .unbind('click')
                        .bind('click', function () {
                            animate.closed();
                        });
                }
                var animate = {
                    opened: function () {
                        controls();
                        if (attachmentDiv != null) attachmentDiv.addClass(o.customClass);
                        holder.addClass(o.customClass);
                        if (o.parents != null) holder.parents(o.parents).addClass(o.customClass);
                        overlayControls('opened');
                        if (callback != undefined) callback("opened")
                    },
                    closed: function () {
                        if (attachmentDiv != null) attachmentDiv.removeClass(o.customClass);
                        holder.removeClass(o.customClass);
                        if (o.parents != null) holder.parents(o.parents).removeClass(o.customClass);
                        overlayControls('closed');
                        if (callback != undefined) callback("closed");
                        bdy.removeClass(o.bdyCls2);
                    }
                };

                function closeElem() {
                    if (o.closeElem != '')
                        $(o.closeElem).each(function () {
                            var ths = $(this).get(0);
                            if (typeof ths.closed !== 'undefined')
                                ths.closed();
                        });
                }
                var events = {

                    onMouseenter: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function () {
                            closeElem();
                            overlayControls('opened');
                        }, o.openedDelay)
                    },
                    onMouseleave: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function () {
                            if (!holder.hasClass(o.customClass))
                                overlayControls('closed');

                        }, o.delay)
                    },
                    onClicked: function () {
                        animate.opened();
                        bdy.addClass(o.bdyCls2);
                    },
                    mouseenter: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        if (o.openedControl != "") {
                            var ID = o.openedControl;
                            if (ID.html() == "") return false
                        }
                        stm = setTimeout(function () {
                            animate.opened()
                        }, o.openedDelay)
                    },
                    mouseleave: function () {
                        if (visibleControls()) return false;
                        if (stm != null) clearTimeout(stm);
                        stm = setTimeout(function () {
                            animate.closed()
                        }, o.delay)
                    },
                    clicked: function () {
                        if (o.toggle) {
                            if (holder.hasClass(o.customClass)) animate.closed();
                            else animate.opened()
                        } else
                            animate.opened()
                    },
                    bodyClicked: function (e) {
                        if (!holder.is(e.target) && holder.has(e.target).length === 0)
                            animate.closed();
                    }
                };

                var lazyImage = function (obj) {
                    obj = obj || {};
                    var typ = obj['typ'] || '';
                    if (typ == 'opened')
                        uty.lazyImage({ ID: holder });
                };

                function overlayControls(k) {
                    if (o.overlay != null) {
                        if (k == 'opened') {
                            bdy.addClass(o.bdyCls);
                            if (o.bdyCls2 != '')
                                setTimeout(function () { bdy.addClass(o.bdyCls2); }, 100);
                        }
                        else {
                            if (o.bdyCls2 != '') {
                                bdy.removeClass(o.bdyCls2);
                                setTimeout(function () { bdy.removeClass(o.bdyCls); }, 333);
                            } else
                                bdy.removeClass(o.bdyCls);
                        }
                    }

                    lazyImage({ typ: k });
                }

                function visibleControls() {
                    if (o.isVisible != null)
                        return uty.visibleControl();
                }

                function controls() {
                    if (o.hideDropDown.length > 0)

                        for (var i = 0; i < o.hideDropDown.length; ++i)
                            if (o.hideDropDown[i].length > 0) o.hideDropDown[i][0].closed()
                }

                this.opened =
                    function () {
                        animate.opened()
                    };
                this.closed = function () {
                    if (stm != null) clearTimeout(stm);
                    animate.closed()
                };
                this.dispose = function () {
                    if (o.type == "hover") holder.unbind("mouseenter").unbind("mouseleave");
                    else $(o.clicked, holder).unbind("click")
                };
                this.live = function () {
                    if (o.type == "hover") holder.mouseenter(events.mouseenter).mouseleave(events.mouseleave);
                    else $(o.clicked, holder).click(events.clicked)
                };

                init();
            })
        }
    })
})(jQuery, window);