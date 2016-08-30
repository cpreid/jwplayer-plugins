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
        var elt                 = player.getContainer(),
            position            = getPosition( elt ),
            height              = player.getHeight(),
            width               = player.getWidth(),
            missingHeightPixels = 0,
            missingWidthPixels  = 0,
            showing             = 0,
            calculation         = 100.00;

        // missing from top fold
        if(position.y < 0) {
            if(Math.abs(position.y) >= height) {
                missingHeightPixels = height;
            }
            else {
                missingHeightPixels += Math.abs(position.y);
            }
        }

        // missing from bottom fold
        if(window.innerHeight - position.y <= height) {
            if(window.innerHeight - position.y < 0) {
                missingHeightPixels = height;
            }
            else {
                missingHeightPixels += (height - Math.abs(window.innerHeight - position.y));
            }
        }

        // missing from left fold
        if(position.x < 0) {
            if(Math.abs(position.x) >= width) {
                missingWidthPixels = width;
            }
            else {
                missingWidthPixels += Math.abs(position.x);
            }
        }

        // missing from right fold
        if(window.innerWidth - position.x <= width) {
            if(window.innerWidth - position.x < 0) {
                missingWidthPixels = width;
            }
            else {
                missingWidthPixels += (width - Math.abs(window.innerWidth - position.x));
            }
        }

        return {
            'x': (width - missingWidthPixels) / width * 100,
            'y': (height - missingHeightPixels) / height * 100
        }
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