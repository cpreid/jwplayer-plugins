(function(jwplayer){

  // The initialization function, called on player setup.
  var template = function(player, config, div) {

    // normalize onUpdate callback
    var onUpdate = (function() {
        if(config.onUpdate && typeof config.onUpdate === 'function') {
            return config.onUpdate;
        }
        return function() {};
    })();

    var getPosition = function(element) {
        var viewportOffset = element.getBoundingClientRect();
        return {y: viewportOffset.top, x: viewportOffset.left};    
    }

    var measure = function() {
        var elt = player.getContainer(),
            position = getPosition( elt ),
            height = player.getHeight(),
            missingPixels = 0,
            showing = 0,
            calculation = 100.00;

        // missing from top fold
        if(position.y < 0) {
            if(Math.abs(position.y) >= height) {
                missingPixels = height;
            }
            else {
                missingPixels += Math.abs(position.y);
            }
        }

        // missing from bottom fold
        if(window.innerHeight - position.y <= height) {
            if(window.innerHeight - position.y < 0) {
                missingPixels = height;
            }
            else {
                missingPixels += (height - Math.abs(window.innerHeight - position.y));
            }                
        }
        showing = height - missingPixels;
        showing = showing / height * 100;    
        return showing;
    }

    player.on('ready', function() {
        onUpdate.call(player, {'visible': measure()});
        window.addEventListener('scroll', function(evt) {
            onUpdate.call(player, {'visible': measure()});
        });
    });    
  };

  jwplayer().registerPlugin('viewability', '7.0', template);

})(jwplayer);