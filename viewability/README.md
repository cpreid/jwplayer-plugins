## Usage

```
jwplayer("player").setup({
    file: 'bunny.mp4',
    image: 'bunny.jpg',
    width:'100%',
    plugins: {
        'viewability.js': {
            'onUpdate': function(evt) {
                // evt => {visible: xx.xx}
            }
        }
    }
});
```
