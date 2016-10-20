## PixelTracker Plugin

> Allows user to 'drop a pixel' into the player to track playback/user metrics at various playback events

### Basic Usage
```
var playerInstance = jwplayer("player");
playerInstance.setup({
    // player setup code
});
playerInstance.on('ready', function() {
    pixeltracker(playerInstance, {
        pixel: 'http://your-custom-pixel-server.com/pixel.jpg'
    });
});
```

### Advanced Usage
```
var playerInstance = jwplayer("player");
playerInstance.setup({
    // player setup code
});
playerInstance.on('ready', function() {
    pixeltracker(playerInstance, {
        debug: true,
        pixel: 'http://your-custom-pixel-server.com/pixel.jpg',
        evts: ['play', 'pause', 'quartiles'],
        alias: {
            evts: {
                ready : 'init',
                seek  : 'skipto'
            },
            metrics: {
                muted    : 'muted-alias',
                duration : 'dur'
            }
        },
        addMetrics: function(evt_name) {
            return [{key: 'player', val: 'jwplayer'}];
        },
        transformMetric: function(metric_name, metric_value, evt_name) {
            if(metric_name == 'event') metric_name = 'evt';
            return {key: metric_name, val: metric_value};
        }
    });
});
```
