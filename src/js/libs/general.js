/*
	Facebook redirect close popup
*/
if (window.location.search.indexOf('?redirect_uri=fcbk') != -1) window.close();

/*
	requestAnim shim layer by Paul Irish	
*/
window.requestAnimFrame = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) { window.setTimeout(callback, 1E3 / 30) } }();
window.cancelRequestAnimFrame = function () { return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout }();

/*
	SCROLL STOP
	ex: jQuery(window).bind('scrollstop', function(e){ onScroll(); });
*/
(function () {
    var special = jQuery.event.special, uid1 = "D" + +new Date, uid2 = "D" + (+new Date + 1); special.scrollstart = { setup: function () { var timer, handler = function (evt) { var _self = this, _args = arguments; if (timer) clearTimeout(timer); else { evt.type = "scrollstart"; jQuery.event.dispatch.apply(_self, _args) } timer = setTimeout(function () { timer = null }, special.scrollstop.latency) }; jQuery(this).bind("scroll", handler).data(uid1, handler) }, teardown: function () { jQuery(this).unbind("scroll", jQuery(this).data(uid1)) } }; special.scrollstop =
        { latency: 300, setup: function () { var timer, handler = function (evt) { var _self = this, _args = arguments; if (timer) clearTimeout(timer); timer = setTimeout(function () { timer = null; evt.type = "scrollstop"; jQuery.event.dispatch.apply(_self, _args) }, special.scrollstop.latency) }; jQuery(this).bind("scroll", handler).data(uid2, handler) }, teardown: function () { jQuery(this).unbind("scroll", jQuery(this).data(uid2)) } }
})();

/*
	RESIZE STOP
	ex: $(window).bind('resizestop', function (e) {  console.log(e.data.size); });
*/
(function ($, setTimeout) {
    var $window = $(window), cache = $([]), last = 0, timer = 0, size = {}; function onWindowResize() { last = $.now(); timer = timer || setTimeout(checkTime, 10) } function checkTime() { var now = $.now(); if (now - last < $.resizestop.threshold) timer = setTimeout(checkTime, 10); else { clearTimeout(timer); timer = last = 0; size.width = $window.width(); size.height = $window.height(); cache.trigger("resizestop") } } $.resizestop = { propagate: false, threshold: 500 }; $.event.special.resizestop = {
        setup: function (data, namespaces) {
            cache = cache.not(this);
            cache = cache.add(this); if (cache.length === 1) $window.bind("resize", onWindowResize)
        }, teardown: function (namespaces) { cache = cache.not(this); if (!cache.length) $window.unbind("resize", onWindowResize) }, add: function (handle) { var oldHandler = handle.handler; handle.handler = function (e) { if (!$.resizestop.propagate) e.stopPropagation(); e.data = e.data || {}; e.data.size = e.data.size || {}; $.extend(e.data.size, size); return oldHandler.apply(this, arguments) } }
    }
})(jQuery, setTimeout);

/*
	ENDSWITH
	ex: 'example,'.endsWith(',') son karekter , varsa true yoksa false
*/
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

/*
	IE8 TRIM FIX
*/
if (typeof String.prototype.trim !== "function") String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, "") };

/*
	IE8 FOREACH FIX
*/
if (typeof Array.prototype.forEach != "function") Array.prototype.forEach = function (callback) { for (var i = 0; i < this.length; i++)callback.apply(this, [this[i], i, this]) };