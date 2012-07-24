var backend = 'http://www.lamoda.ru/tools/useless_styles/useless_styles.php';

function getStyle(el, styleProp){
    var y = 'undefined';
    if(el.currentStyle){
        y = el.currentStyle[styleProp];
    }else if(window.getComputedStyle){
        y = document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    }
    return y;
}

var els = document.getElementsByTagName('*'), unusedIntervals = {};
for( var i = 0; i < els.length; i++ ){
    var el = els[i];
    if( getStyle(el, 'counter-increment') == 'unused 1'){
        $.ajax(backend, {
            type: 'POST',
            crossDomain: true,
            data: {
                'action': 'error',
                'url': document.location.href,
                'element': el.outerHTML
            }
        });
    }
}

var usedSelectors = [], uselessSelectors = [];
for( var i = 0; i < document.styleSheets.length; i++ ){
    var styleSheet = document.styleSheets[i];
    if( styleSheet.cssRules ){
        for( var ri = 0; ri < styleSheet.cssRules.length; ri++ ){
            var selector = styleSheet.cssRules[ri].selectorText;
            var l = $(selector.replace(/:[:-a-zA-Z]*/g, '')).length,
            obj = {
                    selector: selector,
                    css: styleSheet.href
                };
            if( l > 0 ){
                usedSelectors.push(obj);
            }else{
                uselessSelectors.push(obj);
            }
        }
    }
}

$.ajax(backend, {
    type: 'POST',
    crossDomain: true,
    data: {
        'action': 'selectors',
        'used_selectors': usedSelectors,
        'useless_selectors': uselessSelectors
    }
});
