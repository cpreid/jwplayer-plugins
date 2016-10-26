> Allows you to monitor the percent of the video player that is visible on the screen

## Usage
```
jwplayer("player").setup({
    file: 'bunny.mp4',
    image: 'bunny.jpg',
    width:'100%',
    plugins: {
        'viewability.js': {
            'onUpdate': function(evt) {
                // evt => {visible: {x: xx.xx, y: yy.yy}
            }
        }
    }
});
```
