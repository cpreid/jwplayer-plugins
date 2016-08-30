(function(jwplayer) {

    /**
     * Interface for easily setting/getting cookies
     * http://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
     **/
    var $cookie = {
        getItem: function(sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function(sKey, sPath, sDomain) {
            if (!sKey || !this.hasItem(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function(sKey) {
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: /* optional method: you can safely remove it! */ function() {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }
    };

    var template = function(player, config, div) {

        var id = config.unique || player.id,
            cookieName = ['resumevideodata', id].join('_');

        player.on('time', function(e) {
            $cookie.setItem(cookieName, Math.floor(e.position) + ':' + player.getDuration());
        });

        player.once('play', function() {    
            var cookieData = $cookie.getItem(cookieName);
            if(cookieData) {
                var resumeAt = cookieData.split(':')[0],
                    videoDur = cookieData.split(':')[1];
                if(parseInt(resumeAt) < parseInt(videoDur)) {
                    player.seek(resumeAt);          
                }
                else if(cookieData && !(parseInt(resumeAt) < parseInt(videoDur))) {
                    // Video ended last time! Will skip resume behavior
                }        
            }
            else {
                // No resume cookie detected
            }
        });

    };

    jwplayer().registerPlugin('remember', '7.0', template);

})(jwplayer);