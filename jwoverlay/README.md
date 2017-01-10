# JW Overlay

### Attached overlay module to your player
```javascript
var playerInstance = jwplayer("player");
playerInstance.setup({
    file: 'bunny.mp4',
    image: 'bunny.jpg',
    width:'100%',
    description: "Description here",
    title: "Title Here"
});
jwoverlay(playerInstance);
```

### Populate overlay with content
```javascript
playerInstance.jwoverlay.html('Hello, world!');
```

### Show / Hide your overlay
```javascript
playerInstance.jwoverlay.show();
playerInstance.jwoverlay.hide();
```

### HTML classes for hiding overlay & playing video
```javascript
// Class: [class="jwoverlay-play"]
// when button is clicked, overlay will hide and video will play
playerInstance.jwoverlay.html('Click to start!<hr /><button class="btn btn-primary jwoverlay-play">Play</button>');

// Class: [class="jwoverlay-close"]
// when button is clicked, overlay will hide
playerInstance.jwoverlay.html('<button class="btn btn-primary jwoverlay-close">Close</button>');
```

### Methods are chainable
```javascript
playerInstance.jwoverlay.html('hello world').show();
```

### Use in conjunction with JW's events API 
```javascript
playerInstance.on('time', function(evt) {
    if(evt.position >= 4 && evt.position <= 6) {
        playerInstance.jwoverlay
            .html("It's somewhere between 4-6 seconds!<hr />" + evt.position)
            .show();
    } else {
        playerInstance.jwoverlay.hide();
    }
});

playerInstance.on('complete', function() {
    playerInstance.jwoverlay
        .html('Cool huh? Shrunk too.')
        .css({width: '50%'})
        .show();        
    setTimeout(function() {
        playerInstance.jwoverlay
            .css({width: ''})
            .html('Okay, thats enough.<hr /><button class="btn btn-primary jwoverlay-close">Close</button>');
    }, 2000);
});
```
