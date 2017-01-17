(function() {

    var Overlay = function(player) {
        var overlay = document.createElement('div'),
            addOverlay = function() {
                player.getContainer().appendChild(overlay);
            }

        // any element with class 'jwoverlay-close' will close the overlay
        overlay.addEventListener('click', function(evt) {
            var clicked = evt.target || evt.toElement;
            if(clicked.className.split(/\s+/).indexOf('jwoverlay-close') > -1) {
                api.hide();
            }
            else if(clicked.className.split(/\s+/).indexOf('jwoverlay-play') > -1) {
                api.hide();
                try {
                    player.play();
                } catch(err) { }                
            }
        });      

        // api methods are chainable
        var api = {            
            show: function() {
                overlay.style.display = 'block';
                return api;
            },
            css: function(cssProperties) {
                for(p in cssProperties) {
                    overlay.style[p] = cssProperties[p];
                }
                return api;
            },
            resetCss: function() {
                overlay.style.cssText += 'position:absolute;left:0;right:0;padding:10px;color:#FFF;';
                overlay.style.cssText += 'height:100%;width:100%;background:rgba(0,0,0,.8);z-index:99';
                return api;
            },
            hide: function() {
                overlay.style.display = 'none';
                return api;
            },
            html: function(html) {
                overlay.innerHTML = html || '';
                return api;
            },
            init: function() {
                overlay.innerHTML     =  '';        
                overlay.className     = 'jwoverlay';
                overlay.style.display = 'none';      
                if(player.getState() && player.getContainer() && player.getContainer().className.indexOf('jwplayer') > -1) {                                
                    addOverlay(); // player was already `ready` when jwoverlay(playerInstance); was called
                }
                else {                    
                    player.on('ready', addOverlay); // wait for player readiness
                }
                return api;          
            },
            elt: function() {
                return overlay;
            }
        };    

        // initiallize div, reset style
        api.init().resetCss();
        return api;
    }

    window.jwoverlay = function(_player) {
        var overlay = Overlay(_player);        
        // attach overlay object to player instance
        _player.jwoverlay = overlay;                
    }    

})();