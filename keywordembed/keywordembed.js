/**
*
* Libary for doing a single-line player embed that is driven by JWPlatform search feeds
*/
(function() {

    var XHR =function(){try{return new XMLHttpRequest}catch(a){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(a){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(a){}return null};

    var request_feed_run_fcn = function(feed, cb) {
        var xhr = XHR();
        xhr.open('get', feed);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                cb(JSON.parse(xhr.responseText));
            }
        }
    }

    var insert_after = function (newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var load_script = function(script_src, callback_fnc) {
        var s = document.createElement('script');
        s.onload = callback_fnc;
        s.src = script_src;
        document.body.appendChild(s);        
    }

    var keyword_player = function(player_key, query, feed_id, tag) {
        var feed_url = '//content.jwplatform.com/feed.json?feed_id=' + feed_id + '&search=' + query,
            uniq = Math.random().toString(36).substr(2, 7),
            div_id = ["jw_feed_", feed_id, "_", player_key, "_", uniq].join(''),
            playerInstance;

        if(!document.getElementById(div_id)) {
            var div_anchor = document.createElement('div');
            div_anchor.setAttribute('id', div_id);
            insert_after(div_anchor, tag);
        }
        
        request_feed_run_fcn(feed_url, function(feed) {
            if(!feed.playlist) return; // cancel player build for empty feeds

            load_script('//content.jwplatform.com/libraries/' + player_key + '.js', function() {
                playerInstance = jwplayer(div_id);
                playerInstance.setup({
                    playlist: feed.playlist
                });                
            });

        });
    }

    var init = function() {
        [].forEach.call((document.body.querySelectorAll('script[data-player][data-feed]') || []), function(tag) {
            if(!tag.dataset.init) {
                var query = '';
                try {
                    var query = tag.dataset.query || document.querySelector(tag.dataset.selector).innerText;                    
                } catch(e) { } /* no query or valid selector found */

                if(query) {
                    keyword_player(tag.dataset.player, query, tag.dataset.feed, tag);
                }
                tag.dataset.init = 1;
            }
        });
    }

    init();

})();