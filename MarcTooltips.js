/* MarcTooltips.js v20170522 - Marc Robledo 2014-2017 - http://www.marcrobledo.com/license */
var MarcTooltips = (function () {
    var closeTooltip;
    var IS_IE8 = /MSIE 8/.test(navigator.userAgent);

    /* universal addEvent function for all browsers+IE8 */
    function addEvent(elem, ev, func) {
        if (IS_IE8)
            elem.attachEvent('on' + ev, func);
        else
            elem.addEventListener(ev, func, false);
    }

    function _stringToElements(str) {
        if (/^#[0-9a-zA-Z_\-]+$/.test(str)) {
            return [document.getElementById(str.replace('#', ''))];
        } else {
            // convert nodeList to Array
            var nodeList = document.querySelectorAll(str);
            if (IS_IE8) {
                var newArray = [];

                for (var i = 0; i < nodeList.length; i++)
                    newArray.push(nodeList[i]);

                return newArray
            } else {
                return Array.prototype.slice.call(nodeList)
            }
        }
    }

    /* relocate tooltip using its caller element, position and align */
    var _relocateTooltip = function (tooltip, position, align) {
        var doc = document.documentElement;
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        var rect = tooltip.attachedTo.getBoundingClientRect();
        var tooltipRect = tooltip.getBoundingClientRect();

        if (position === 'up') {
            tooltip.style.top = parseInt(rect.top + top - tooltip.offsetHeight) + 'px';
        } else if (position === 'down') {
            tooltip.style.top = parseInt(rect.top + top + tooltip.attachedTo.offsetHeight) + 'px';
        } else { //left or right
            if (align === 'top') {
                tooltip.style.top = parseInt(rect.top + top) + 'px';
            } else if (align === 'bottom') {
                tooltip.style.top = parseInt(rect.top + top - (tooltip.offsetHeight - tooltip.attachedTo.offsetHeight)) + 'px';
            } else { //center
                tooltip.style.top = parseInt(rect.top + top - parseInt((tooltip.offsetHeight - tooltip.attachedTo.offsetHeight) / 2)) + 'px';
            }
        }

        if (position === 'up' || position === 'down') {
            if (align === 'left') {
                tooltip.style.left = parseInt(rect.left + left) + 'px';
            } else if (align === 'right') {
                tooltip.style.left = parseInt(rect.left + left - (tooltip.offsetWidth - tooltip.attachedTo.offsetWidth)) + 'px';
            } else { //center
                tooltip.style.left = parseInt(rect.left + left - parseInt((tooltip.offsetWidth - tooltip.attachedTo.offsetWidth) / 2)) + 'px';
            }
        } else if (position === 'left') {
            tooltip.style.left = parseInt(rect.left + left - tooltip.offsetWidth) + 'px';
        } else { //right
            tooltip.style.left = parseInt(rect.left + left + tooltip.attachedTo.offsetWidth) + 'px';
        }
    }
    return {
        add: function (els, str, props) {
            var tooltip = document.createElement('div');
            if (els == closeButton)
                closeTooltip = tooltip;
            tooltip.className = 'tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.zIndex = '9000';
            tooltip.style.top = '0';
            tooltip.style.left = '0';
            tooltip.innerHTML = str;
            document.body.appendChild(tooltip);

            /* default */
            var position = 'down';
            var align = 'center';
            var clickable = false;
            var focusable = false;
            var additionalClassName = false;

            /* check custom properties */
            if (props) {
                if (props.position && /^(up|down|left|right)$/i.test(props.position))
                    position = props.position.toLowerCase();

                if (props.align && /^(top|bottom|left|right)$/i.test(props.align)) {
                    if (
                        ((position === 'up' || position === 'down') && (props.align === 'left' || props.align === 'right')) ||
                        ((position === 'left' || position === 'right') && (props.align === 'top' || props.align === 'bottom'))
                    ) {
                        align = props.align.toLowerCase();
                    }
                }

                if (props.clickable || props.onClick || props.onclick)
                    clickable = true;

                if (props.focusable || props.onFocus || props.onfocus)
                    focusable = true;

                if (props.class)
                    additionalClassName = props.class;
                if (props.className)
                    additionalClassName = props.className;
            }

            /* build HTML elements */
            if (additionalClassName)
                tooltip.className += ' ' + additionalClassName;
            var arrow = document.createElement('div');
            arrow.className = 'arrow';
            tooltip.className += ' position-' + position + ' align-' + align;
            if (position === 'left' || position === 'right') {
                tooltip.className += ' position-horizontal';
            } else {
                tooltip.className += ' position-vertical';
            }
            tooltip.appendChild(arrow);


            var showTooltip = function (e) {
                if (clickable)
                    if (typeof e.stopPropagation !== 'undefined')
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;

                if (IS_IE8)
                    tooltip.attachedTo = e.target || e.srcElement;
                else
                    tooltip.attachedTo = this;
                _relocateTooltip(tooltip, position, align);
                if (!/ visible$/.test(tooltip.className))
                    tooltip.className += ' visible';

            };
            var hideTooltip = function () {
                tooltip.className = tooltip.className.replace(' visible', '');
            };

            var els2;
            if (typeof els === 'string') {
                els2 = _stringToElements(els);
            } else if (els.length) {
                els2 = [];
                for (var i = 0; i < els.length; i++) {
                    if (typeof els[i] === 'string') {
                        els2 = els2.concat(_stringToElements(els[i]));
                    } else {
                        els2.push(els[i]);
                    }
                }
            } else {
                els2 = [els];
            }

            for (var i = 0; i < els2.length; i++) {
                if (focusable) {
                    addEvent(els2[i], 'focus', showTooltip);
                    addEvent(els2[i], 'blur', hideTooltip);
                } else if (clickable) {
                    addEvent(els2[i], 'click', showTooltip);
                    if (IS_IE8)
                        addEvent(document, 'click', hideTooltip);
                    else
                        addEvent(window, 'click', hideTooltip);
                } else {
                    addEvent(els2[i], 'mouseover', showTooltip);
                    addEvent(els2[i], 'mouseout', hideTooltip);
                }
            }
            addEvent(window, 'resize', function () {
                if (/ visible$/.test(tooltip.className))
                    _relocateTooltip(tooltip, position, align);
            });

            if (clickable || focusable) {
                addEvent(tooltip, 'click', function (e) {
                    if (typeof e.stopPropagation !== 'undefined')
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                });
            }
        }
    }
})();
