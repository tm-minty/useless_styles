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
            if(typeof selector == 'string'){
                var l = document.body.querySelectorAll(selector.replace(/:[:-a-zA-Z]*/g, '')).length,
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

var Extension = function(){ 
    var blocks = [];

    this.hasBlocks = function(){
        if( blocks.length > 0 ){
            return blocks;
        }else{
            return false;
        }
    };
    this.showCmsBlocks = function(){
        $('.lamoda-cmsblock-wrapper').remove();

        blocks = [];

        var comments = [];
        function childs(el){
            if(el.nodeType != 8){
                for( var i = 0; i < el.childNodes.length; i++ ){
                    childs(el.childNodes[i]);
                }
            }else{
                if(el.nodeValue.indexOf('CMSBLOCK:') > -1){
                    comments.push(el);
                }
            }
        }
        childs(document);

        function getMin( a, b ){
            if( a == 0 ){
                return b;
            }else if( b == 0 ){
                return a;
            }else{
                if( a <= b ){
                    return a;
                }else{
                    return b;
                }
            }
        }

        function getMax( a, b ){
            if( a != 0 && b != 0 ){
                if( a >= b ){
                    return a;
                }else{
                    return b;
                }
            }else if( a == 0 ){
                return b;
            }else if( b == 0 ){
                return a;
            }else{
                if( a >= b ){
                    return a;
                }else{
                    return b;
                }
            }
        }

        for( var i = 0; i < comments.length; i++ ){
            var comment = comments[i];
            var blockName = comment.nodeValue.replace(' CMSBLOCK: ', '').replace(/['"\s]*/g, '');
            var blockContent = [];
            var contentBounding = {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            };
            for( var next = comment.nextSibling; next.nodeType != 8 || next.nodeValue && next.nodeValue.indexOf('CMSBLOCK_END') <= -1; next = next.nextSibling ){
                blockContent.push(next);
                if( next.nodeType == 1 ){
                    var bounding = next.getBoundingClientRect();
                    contentBounding.top = getMin(contentBounding.top, bounding.top);
                    contentBounding.left = getMin(contentBounding.left, bounding.left);
                    contentBounding.width = getMax(contentBounding.width, bounding.width);
                    contentBounding.height = getMax(contentBounding.height, bounding.height);
                }
            }
            var blockWrapper = $('<div class="lamoda-cmsblock-wrapper" id="lamoda-cmsblock-wrapper-' + $.trim(blockName) + '"></div>');
            $(document.body).append(blockWrapper);
            $(blockWrapper).css({
                width: contentBounding.width,
                height: contentBounding.height,
                top: contentBounding.top + $(window).scrollTop(),
                left: contentBounding.left + $(window).scrollLeft(),
            }).bind('mouseenter', function(){
                $(this).addClass('active');
            }).bind('mouseleave', function(){
                $(this).removeClass('active');
            });

            var blockNameElement = $('<div class="lamoda-cmsblock-name"></div>');
            blockNameElement.html('<a href="#" target="_blank">' + blockName + '</a>');
            blockWrapper.append(blockNameElement);
            blocks.push(blockName);
        }
        return blocks;
    };

    this.activateCmsBlock = function( id ){
        $('#lamoda-cmsblock-wrapper-'+id).addClass('active');
    };

    this.deactivateCmsBlock = function( id ){
        $('#lamoda-cmsblock-wrapper-'+id).removeClass('active');
    };

    this.hideCmsBlocks = function( id ){
        $('.lamoda-cmsblock-wrapper').remove();
    };
}

var extension = new Extension();

chrome.extension.onRequest.addListener( function( request, sender, sendResponse ){
    if( request.action ){
        if( extension[request.action] ){
            var action = request.action;
            delete request.action;
            var args = [];
            for( i in request ){
                args.push( request[i] );
            }
            sendResponse( extension[action].apply( extension[action], args ) );
        }
    }
});
