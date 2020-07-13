function iStyler(o) {
    var defaults = {
        wrapper: false,
        customClass: '',
        passiveIco: '',
        activeIco: ''
    };

    this.ID = o['ID'] || '';
    //this.opt = utils.extend(defaults, o['options'] || {});
    this.init();
}

iStyler.prototype = {

    constructor: iStyler,

    cls: {
        active: 'act-iStyler',
        select: 'sSelect',
        checkbox: 'sCheckbox',
        radio: 'sRadio',
        checked: 'checked'
    },

    init: function () {

        var _t = this,
            obj = _t.ID,
            tag = utils.toLowerCase(obj.tagName || ''),
            type = utils.toLowerCase(obj.type || '').split('-')[ 0 ] || '',
            opt = ( ( ( SITE_CONFIG || {} )['plugin'] || {} )['styler'] || {} )[ type ] || {},
            sClass = '',
            name,
            check,
            customIcon = opt.passiveIco + opt.activeIco;

        if (utils.hasClass({ element: obj, value: _t.cls['active'] })) return false;

        obj.classList.add(_t.cls['active']);

        switch (true) {
            case tag == 'select': {

                var selText = obj.options[obj.selectedIndex].text || '';

                obj.classList.add(_t.cls['select']);

                var node = utils.getCreateElement({ elm: 'span', cls: 'sStylerMainWrp ' + opt.customClass + ' sStylerWrp_select' });

                utils.wrap({ target: obj, wrapper: node });

                node = utils.getCreateElement({ elm: 'div', cls: 'sStylerWrp' });
                node.innerHTML = '<span class="sStyleHolder"><span class="sStyler">' + selText + '</span>' + customIcon + '</span>';

                obj.parentNode.insertBefore(node, obj);


                obj.onchange = function () {
                    selText = this.options[this.selectedIndex].text || '';

                    this.previousSibling.querySelector('.sStyler').innerHTML = selText;
                };

                break;
            }

            case type == 'checkbox': {

                sClass = obj.checked ? sClass + ' checked' : '';

                obj.classList.add(_t.cls['checkbox']);

                var node = utils.getCreateElement({ elm: 'span', cls: 'sStylerMainWrp ' + opt.customClass + ' sStylerWrp_checkbox' });

                utils.wrap({ target: obj, wrapper: node });

                node = utils.getCreateElement({ elm: 'span', cls: 'cStyler' + sClass });

                node.innerHTML = customIcon;

                obj.parentNode.insertBefore(node, obj);


                obj.previousSibling.onclick = function () {
                    var ths = this;
                    if (obj.checked) {
                        obj.checked = false;
                        ths.classList.remove(_t.cls['checked'])
                    } else {
                        obj.checked = true;
                        ths.classList.add(_t.cls['checked'])
                    }
                };

                obj.onchange = function () {
                    if (obj.checked)
                        obj.previousSibling.classList.add(_t.cls['checked']);
                    else
                        obj.previousSibling.classList.remove(_t.cls['checked']);
                };

                break;
            }


            case type == 'radio': {


                name = obj.name || '';

                if (obj.checked) sClass = sClass + ' checked'; else sClass = '';

                obj.classList.add(_t.cls['radio']);

                var node = utils.getCreateElement({ elm: 'span', cls: 'sStylerMainWrp ' + opt.customClass + ' sStylerWrp_radio' });

                utils.wrap({ target: obj, wrapper: node });

                node = utils.getCreateElement({ elm: 'span', cls: 'rStyler' + sClass });

                if (name != '')
                    node.setAttribute('name', name);

                node.innerHTML = customIcon;

                obj.parentNode.insertBefore(node, obj);


                var removeNameClass = function () {
                    if (name != '') {

                        var elm = document.querySelectorAll('span.rStyler[name="' + name + '"]');
                        if (utils.detectEl(elm))
                            utils.forEach(elm, function (index, value) {
                                value.classList.remove(_t.cls['checked']);
                            });
                    }
                };

                obj.previousSibling.onclick = function () {
                    var ths = this;
                    if (!obj.checked) {
                        removeNameClass();
                        obj.checked = true;
                        ths.classList.add(_t.cls['checked'])
                    }
                };

                obj.onchange = function () {
                    if (obj.checked){
                        removeNameClass();
                        obj.previousSibling.classList.add(_t.cls['checked']);
                    }
                };

                break;
            }

            default:
                break;
        }

    }

}