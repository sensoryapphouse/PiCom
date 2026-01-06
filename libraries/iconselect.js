
/**
 *
 * Created with NetBeans IDE
 *
 * Code     : Icon Select JS
 * Version  : 1.0
 *
 * User     : Bugra OZDEN
 * Site     : http://www.bugraozden.com
 * Mail     : bugra.ozden@gmail.com
 *
 * Date     : 10/30/13
 * Time     : 01:10 PM
 *
 */

var currentGlobalSelected = -1;

IconSelect.DEFAULT = {};
IconSelect.DEFAULT.SELECTED_ICON_WIDTH = 48;
IconSelect.DEFAULT.SELECTED_ICON_HEIGHT = 48;
IconSelect.DEFAULT.SELECTED_BOX_PADDING = 1;
IconSelect.DEFAULT.SELECTED_BOX_PADDING_RIGHT = 12;
IconSelect.DEFAULT.ICONS_WIDTH = 32;
IconSelect.DEFAULT.ICONS_HEIGHT = 32;
IconSelect.DEFAULT.BOX_ICON_SPACE = 1;
IconSelect.DEFAULT.HORIZONTAL_ICON_NUMBER = 3;
IconSelect.DEFAULT.VECTORAL_ICON_NUMBER = 3;

var _boxScroll;
function IconSelect($$elementID, $$parameters) {
    
    var _icons = [];
    var _selectedIndex = -1;
    
    var _default = IconSelect.DEFAULT;

    function _init() {
        
        //parametreler boş gelirse
        if(!$$parameters) $$parameters = {};
        //En üst elementi seç
        if(_View.setIconSelectElement($$elementID)){
            
            //set parameters
            $$parameters = _Model.checkParameters($$parameters);
            //create UI
            var ui = _View.createUI($$parameters, $$elementID);
            //basıldığında göster/gizle
            _View.iconSelectElement.onclick = function(){
                _View.showBox();
            };
//            _View.showBox(false);
            _View.iconSelectElement.addEventListener('click', function($event){
                $event.stopPropagation();             
            });
            window.addEventListener('click', function(){
                _View.showBox(false);
            });
            _View.showBox(false);
           
        }else{
            alert("Element not found.");
        }
        
    }
    
        //Tüm iconları yeniden yükle.
    this.show = function(){
            _View.showBox(true);
    }
    
    //Tüm iconları yeniden yükle.
    this.refresh = function($icons){
        
        _icons = [];
        
		_View.clearIcons();
		
        var setSelectedIndex = this.setSelectedIndex;
        setSelectedIndex(-1);
        for(var i = 0; i < 36; i++){
            if (i < $icons.length) {
                $icons[i].element = _View.createIcon($icons[i].iconFilePath, $icons[i].iconValue, i, $icons[i].title, $$parameters);
                $icons[i].element.onclick = function(){
                    currentGlobalSelected = parseInt(this.childNodes[0].getAttribute('icon-index'));
                    setSelectedIndex(this.childNodes[0].getAttribute('icon-index'));
                };
            }
            else 
                return;
            _icons.push($icons[i]);
        }
        
        var horizontalIconNumber = Math.round(($icons.length) / $$parameters.vectoralIconNumber);
        
        _View.boxElement.style.height = (($$parameters.iconsHeight + 2) * horizontalIconNumber) + ((horizontalIconNumber + 1) * $$parameters.boxIconSpace) + 'px';
    };
    
    this.getIcons = function(){ return _icons; };
    
    //iconu seçili hale gelir.
    this.setSelectedIndex = function($index){
        if ($index == -1)
            return;
		_View.iconSelectElement.dispatchEvent(new CustomEvent('change'));
    };
    
    this.getSelectedIndex = function(){ return _selectedIndex; };
    this.getSelectedValue = function(){ return _icons[_selectedIndex].iconValue };
    this.getSelectedFilePath = function(){ return _icons[_selectedIndex].iconFilePath };
    
    
    
    //### VIEW CLASS ###
        
    
    _View.iconSelectElement;
    _View.boxElement;
    _View.boxScrollElement;
    
    _View.showBox = function($isShown){
         if($isShown == null) {
             $isShown = (_View.boxElement.style.display == "none") ? true : false;
         }
                
        if($isShown) {
            _View.boxElement.style.display = "block";
            _View.boxScrollElement.style.display = "block";
            _boxScroll = (_boxScroll) ? _boxScroll : new iScroll($$elementID + "-box-scroll");
            _boxScroll.scrollTo(0,0);
        }else{
            _View.boxElement.style.display = "none";
            _View.boxScrollElement.style.display = "none";
        }
        
        _View.boxElement.style.display = ($isShown) ? "block" : "none";
        //_boxScroll.scrollTo(0,0);
    };
    
    _View.setIconSelectElement = function($elementID){
        _View.iconSelectElement = document.getElementById($elementID);
        return _View.iconSelectElement;
    };
    
    _View.clearUI = function(){
        _View.iconSelectElement.innerHTML = "";
    };
    
    _View.clearIcons = function(){
        _View.boxElement.innerHTML = "";
    };
    
    
    _View.createUI = function($parameters){
        
        _View.clearUI();
        
        _View.iconSelectElement.setAttribute('class', 'icon-select');
        
//        var selectedBoxElement = document.createElement('div');
//        selectedBoxElement.setAttribute('class' ,'selected-box');
        
        // PB hide dropdown
//        selectedBoxElement.style.left = "-20px";

        
        _View.boxScrollElement = document.createElement('div');
        _View.boxScrollElement.setAttribute('id',$$elementID + "-box-scroll");
        _View.boxScrollElement.setAttribute('class', 'box');
        
        _View.boxElement = document.createElement('div');
        _View.boxScrollElement.appendChild(_View.boxElement);
        
//        selectedBoxElement.style.width = '0px'; //$parameters.selectedIconWidth + $parameters.selectedBoxPadding + $parameters.selectedBoxPaddingRight + 'px';
//        selectedBoxElement.style.height = '0px'; //$parameters.selectedIconHeight + ($parameters.selectedBoxPadding * 2) + 'px';
        
        _View.boxScrollElement.style.left = "30vw"; //parseInt(selectedBoxElement.style.width) + 1 + 'px';
        _View.boxScrollElement.style.top = "25vh";
        
        _View.boxScrollElement.style.width = (($parameters.iconsWidth + 2) * $parameters.vectoralIconNumber) + (($parameters.vectoralIconNumber + 1) * $parameters.boxIconSpace) + 'px';
        _View.boxScrollElement.style.height = (($parameters.iconsHeight + 2) * $parameters.horizontalIconNumber) + (($parameters.horizontalIconNumber + 1) * $parameters.boxIconSpace) + 'px';
         
        _View.boxElement.style.left = _View.boxScrollElement.style.left + 'px';
        _View.boxElement.style.width = _View.boxScrollElement.style.width + 'px';
//        _View.boxElement.style.border = "solid";
        _View.boxElement.style.backgroundColor = "#B9D9EB";
//        _View.boxElement.style.borderRadius = "5px";
        
//        _View.iconSelectElement.appendChild(selectedBoxElement);
        _View.iconSelectElement.appendChild(_View.boxScrollElement);
        
        var results = {};
        results['iconSelectElement'] = _View.iconSelectElement;
//        results['selectedBoxElement'] = selectedBoxElement;
        
        return results;
    };
        
    _View.createIcon = function($iconFilePath, $iconValue, $index, $title, $parameters){
        
        var iconElement = document.createElement('div');
        iconElement.setAttribute('class', 'icon');
        iconElement.style.width = $parameters.iconsWidth + 'px';
        iconElement.style.height = $parameters.iconsHeight + 'px';
        iconElement.style.marginLeft = $parameters.boxIconSpace + 'px';
        iconElement.style.marginTop = $parameters.boxIconSpace + 'px';
        MarcTooltips.add(iconElement, $title, {
            position: 'up',
            align: 'center'
        });
        
        var iconImgElement = document.createElement('img');
        iconImgElement.setAttribute('src', $iconFilePath);
        iconImgElement.setAttribute('icon-value', $iconValue);
        iconImgElement.setAttribute('icon-index', $index);
        iconImgElement.setAttribute('width', $parameters.iconsWidth);
        iconImgElement.setAttribute('height', $parameters.iconsHeight);
        
        iconElement.appendChild(iconImgElement);
        _View.boxElement.appendChild(iconElement);
        
        return iconElement;
        
    };
    
    function _Model(){}
    
    _Model.checkParameters = function($parameters){
        
//        $parameters.selectedIconWidth          = ($parameters.selectedIconWidth)          ? $parameters.selectedIconWidth        : _default.SELECTED_ICON_WIDTH;
//        $parameters.selectedIconHeight         = ($parameters.selectedIconHeight)         ? $parameters.selectedIconHeight       : _default.SELECTED_ICON_HEIGHT;
        $parameters.selectedBoxPadding         = ($parameters.selectedBoxPadding)         ? $parameters.selectedBoxPadding       : _default.SELECTED_BOX_PADDING;
        $parameters.selectedBoxPaddingRight    = ($parameters.selectedBoxPaddingRight)    ? $parameters.selectedBoxPaddingRight  : _default.SELECTED_BOX_PADDING_RIGHT;
        $parameters.iconsWidth                 = ($parameters.iconsWidth)                 ? $parameters.iconsWidth               : _default.ICONS_WIDTH;
        $parameters.iconsHeight                = ($parameters.iconsHeight)                ? $parameters.iconsHeight              : _default.ICONS_HEIGHT;
        $parameters.boxIconSpace               = ($parameters.boxIconSpace)               ? $parameters.boxIconSpace             : _default.BOX_ICON_SPACE;
        $parameters.vectoralIconNumber         = ($parameters.vectoralIconNumber)         ? $parameters.vectoralIconNumber       : _default.VECTORAL_ICON_NUMBER;
        $parameters.horizontalIconNumber       = ($parameters.horizontalIconNumber)       ? $parameters.horizontalIconNumber     : _default.HORIZONTAL_ICON_NUMBER;
    
        return $parameters;
    
    };
    
    _init();
    
}

(function () {
    if (typeof window.CustomEvent === "function") return false; //If not IE

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

    function _View(){}

    