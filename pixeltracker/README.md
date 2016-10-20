## PixelTracker Plugin

> Allows user to 'drop a pixel' into the player to track playback/user metrics at various playback events

### Metrics tracked
| Metric     | type   | details                                                    |
|------------|--------|------------------------------------------------------------|
| muted      | bool   | is player muted                                            |
| duration   | float  | duration of video                                          |
| fullscreen | bool   | is player in fullscreen                                    |
| height     | str    | pixel width of player, ie, 1280px                          |
| flash      | bool   | is player using flash                                      |
| position   | float  | current position of playback                               |
| state      | string | current status of player: idle, buffering, playing, paused |
| volume     | int    | volume of player, 1-100                                    |
| width      | str    | pixel height of player, ie, 720px                          |

### Basic Usage
```
var playerInstance = jwplayer("player");
playerInstance.setup({ /* player setup code */ });

playerInstance.on('ready', function() {
    pixeltracker(playerInstance, {
        pixel: 'http://your-custom-pixel-server.com/pixel.jpg'
    });
});
```

### Advanced Usage
```
var playerInstance = jwplayer("player");
playerInstance.setup({ /* player setup code */ });

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
            // transform the 'event' key to 'evt'
            if(metric_name == 'event') metric_name = 'evt';
            
            // transform boolean values to 1 or 0
            if(metric_value === false) metric_value = '0';
            if(metric_value === true) metric_value = '1';
            return {key: metric_name, val: metric_value};
        }
    });
});
```

### Setup Options

| parameter       | possible values   | default   | notes                                                                                                        | required |
|-----------------|-------------------|-----------|--------------------------------------------------------------------------------------------------------------|----------|
| debug           | bool: true, false | false     | log console messages                                                                                         | no       |
| pixel           | string            | undefined | pixel url                                                                                                    | yes      |
| evts            | array             | ['play', 'pause', 'stop', 'ready', 'quartiles', 'complete']        | Possible values include all JWPlayer event names (https://developer.jwplayer.com/jw-player/docs/developer-guide/api/javascript_api_reference/) and ['quartiles']                                                                                                             | no       |
| alias           | object            | {}        | specify aliases for each metric/event name - examples:  -- track duration as 'dur' -- track ready as 'init'  | no       |
| alias.evts      | object            | {}        | provide a mapping of event names to aliases using key/val pairing: -- 'seek': 'skip' -- 'complete': 'finish' | no       |
| alias.metrics   | object            | {}        | provide a mapping of metric names to aliases using key/val pairing: -- 'muted': 'm' -- 'duration': 'dur'     | no       |
| addMetrics      | function          | undefined | provide a function to add additional, custom metrics prior to a pixel ping                                   | no       |
| transformMetric | function          | undefined | provide a function to transform key/value pairs of metrics prior to pixel ping                               | no       |
