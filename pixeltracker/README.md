## PixelTracker Plugin

> Allows user to 'drop a pixel' into the player to track playback/user metrics at various playback events

### Basic Usage
```
playerInstance.setup({
    file: 'bunny.mp4',
    image: 'bunny.jpg',
    width:'100%'
});

playerInstance.on('ready', function() {
    pixeltracker(playerInstance);
});
```
