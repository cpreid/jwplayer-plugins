## PixelTracker Plugin

> Allows user to 'drop a pixel' into the player to track playback/user metrics at various playback events

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
            if(metric_name == 'event') metric_name = 'evt';
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
| evts            | array             | {}        |                                                                                                              | no       |
| alias           | object            | {}        | specify aliases for each metric/event name - examples:  -- track duration as 'dur' -- track ready as 'init'  | no       |
| alias.evts      | object            | {}        | provide a mapping of event names to aliases using key/val pairing: -- 'seek': 'skip' -- 'complete': 'finish' | no       |
| alias.metrics   | object            | {}        | provide a mapping of metric names to aliases using key/val pairing: -- 'muted': 'm' -- 'duration': 'dur'     | no       |
| addMetrics      | function          | undefined | provide a function to add additional, custom metrics prior to a pixel ping                                   | no       |
| transformMetric | function          | undefined | provide a function to transform key/value pairs of metrics prior to pixel ping                               | no       |