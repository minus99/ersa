/*
	minusPopup
	ex:
		$('body').minusPopup({ 
				openWith: 'auto', 
				content: $('.content').html() || '', 
				customClass: 'ems-custom-class', 
				width: 920, 
				widthStyle: 'max-width', 
				height: 500 
			});	
*/
(function ($) {
    $.fn.extend({
        minusPopup: function (options, callback) {
            var defaults = {
                width: 0,						//Popupin genisligi (responsive için deger 0 verilmelidir)
                height: 0,						//Popupin yüksekligi (içerige göre yükseklik almasi gerekiyorsa deger 0 verilmelidir)
                timeout: 0,						//Popup otomatik kapanma süresi (0 ise otomatik kapanmaz)
                openWith: 'click',				//Popupin ne sekilde açilacagi (click | auto)
                closeWith: '.btnMinPpCl', 		//Kapat buttonu disinda baska herhangi bir yere tiklandiginda popupin kapanabilmesi
                customClass: '',				//Popupi Özellestirmek için özel bir class eklenebilir
                header: '',						//Popupin basligi
                content: '',					//Popupta yer alacak olan içerik (Not: Tek satirda olacak sekilde yazilmalidir.)
                type: 'content',				//Popup content tipi (content | iframe | image | object)
                href: '',						//"image" kullaniliyorsa ve linki varsa "href" i buraya yazilir. Url'de http var ise yeni pencerede a�ar
                target: 'self',					//"imageLink" targetini belirler
                callBack: '',					//Popupin açilmasi esnasinda herhangi baska bir kodun tetiklenmesi
                fire: '',					//Popupin kapanmasi sonrasinda herhangi baska bir kodun tetiklenmesi

                //
                cookie: null,                   //{ name: 'cookie-name', minutes: 5 }

                // plugin ekstra ozellik
                titleClass: '',
                columnClass: 'col-md-10 col-md-offset-1',
                closeIcon: true,
                closeIconClass: 'btnMinPpCl',
                containerFluid: false,
                theme: 'light',
                type: 'yellow',
                boxWidth: '50%'
            };
            var option = $.extend(defaults, options);
            return this.each(function (e) {
                var opt = option,
                    ID = $(this),
                    uty = {
                        detectEl: function (ID) { return ID.length > 0 ? true : false; },
                        cookie: function (o) {
                            var typ = o['typ'] || '', name = o['name'] || '';
                            if (typ == 'set') {
                                var date = new Date(), minutes = o['minutes'] || 5;
                                date.setTime(date.getTime() + (minutes * 60 * 1000));
                                $.cookie(name, o['value'] || '', { expires: date, path: '/' });
                            } else if (typ == 'get')
                                return $.cookie(name) || '';
                        }
                    },
                    main = {
                        el: { wrp: '.jconfirm', container: '.jconfirm-box-container', content: '.jconfirm-content' },
                        dialog: null,
                        getContent: function () {
                            var _t = this, htm = opt['content'] || '', typ = opt['type'] || '';
                            if (typ == 'image') {
                                htm = '<img class="minPpImg" border="0" src="' + htm + '" />';
                                if (opt['href'] != '')
                                    htm = '<a target="_' + opt['target'] + '" class="minPpImgLink" href="' + opt['href'] + '">' + htm + '</a>';
                            } else if (typ == 'iframe')
                                htm = '<iframe class="minPpIframe" frameborder="0" name="minPpIframe" style="margin:0; padding:0; width:100%; height:100%;" data-src="' + htm + '">';
                            else if (typ == 'object')
                                htm = $(htm).html() || '';

                            return htm;
                        },
                        cookies: function (o) {
                            var _t = this, typ = o['typ'] || 'get', c = opt['cookie'] || '', b = false;
                            if (c != '') {
                                if (typ == 'get') {
                                    if (uty.cookie({ name: c['name'] || '', typ: 'get' }) == 'true')
                                        b = true;
                                } else
                                    uty.cookie({ name: c['name'] || '', typ: 'set', minutes: c['minutes'] || 5, value: 'true' });
                            }

                            return b;
                        },
                        set: function () {
                            var _t = main;

                            if (_t.cookies({ typ: 'get' }))
                                return false;

                            _t.dialog = $.dialog({
                                backgroundDismiss: true,
                                title: opt['header'],
                                titleClass: opt['titleClass'],
                                content: _t.getContent(),
                                columnClass: opt['columnClass'] + ' ' + opt['customClass'],
                                closeIcon: opt['closeIcon'],
                                closeIconClass: opt['closeIconClass'],
                                containerFluid: opt['containerFluid'],
                                theme: opt['theme'],
                                boxWidth: opt['boxWidth'],
                                onContentReady: function () {
                                    var frm = $(_t.el.wrp).find('iframe');
                                    if (uty.detectEl(frm))
                                        frm.attr('src', frm.attr('data-src') || '');

                                    _t.callBack({ typ: 'onContentReady' });
                                },
                                contentLoaded: function (data, status, xhr) {
                                    _t.callBack({ typ: 'contentLoaded' });
                                },
                                onOpenBefore: function () {
                                    $(_t.el.wrp)
                                        .addClass(opt['customClass'])
                                        .addClass('type-' + opt['type'])
                                        .find(_t.el.container)
                                        .css({ 'max-width': opt['width'] || '100%' })
                                        .end()
                                        .find(_t.el.content)
                                        .css({ 'min-height': opt['height'] || '100%' });
                                },
                                onOpen: function () {
                                    _t.cookies({ typ: 'set' });
                                    _t.runIt(opt['callBack'] || '');
                                    _t.callBack({ typ: 'onOpen' });
                                },
                                onClose: function () {
                                    _t.runIt(opt['fire'] || '');
                                    _t.callBack({ typ: 'onClose' });
                                    $(_t.el.wrp)
                                        .removeClass(opt['customClass'])
                                        .removeClass('type-' + opt['type']);
                                    if (uty.detectEl($(_t.el.wrp).find('iframe')))
                                        $(_t.el.wrp).find('iframe').removeAttr('src');
                                }
                            });
                        },
                        runIt: function (k) {
                            if (k != '')
                                $.globalEval(k);
                        },
                        callBack: function (o) {
                            if (typeof callback !== 'undefined')
                                callback(o);
                        },
                        addEvent: function () {
                            var _t = this;
                            if (opt.openWith == 'click')
                                ID
                                    .unbind('click', _t.set)
                                    .bind('click', _t.set);
                            else
                                _t.set();
                        },
                        init: function () {
                            var _t = this;
                            _t.addEvent();
                        }
                    };
                main.init();


            });
        }
    });
})(jQuery);