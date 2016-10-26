(function() {

    /**
    * Library that allows you to 'drop a pixel in the player' for tracking events
    * and capturing various playback metrics
    */

    // deep merge two objects
    var merge = function(o1, o2) {
        var o_new = {};
        for(p in o1) {
            if(o1[p]) {
                if(typeof o1[p] == 'object' && !(o1[p] instanceof Array) && o2.hasOwnProperty(p)) {
                    o_new[p] = merge(o1[p], o2[p]);
                }
                else {
                    o_new[p] = o1[p];
                }
            }
        }
        for(p in o2) {
            if(typeof o2[p] == 'object' && !(o2[p] instanceof Array) && o1.hasOwnProperty(p)) {
                o_new[p] = merge(o1[p], o2[p]);
            }
            else {
                o_new[p] = o2[p];
            }
        }
        return o_new;
    }

    var pixeltracker = function(player, user_config) {

        var user_config = user_config || {};
        var default_config = {
            evts: ['play', 'pause', 'stop', 'ready', 'quartiles', 'complete'],
            alias: {evts: {}, metrics: {}}
        }
        var config = merge(default_config, user_config);        

        var log = function() {
            if(config.debug) console.log.apply(console, arguments);
        }

        var metrics = {
            muted      : function() { return player.getMute(); },
            duration   : function() { return player.getDuration(); },
            fullscreen : function() { return player.getFullscreen(); },
            height     : function() { return player.getHeight(); },
            flash      : function() { return player.getProvider().name.indexOf('flash') > -1; },
            position   : function() { return player.getPosition(); },
            state      : function() { return player.getState(); },
            volume     : function() { return player.getVolume(); },
            width      : function() { return player.getWidth(); }
        }

        var bind_custom_evts = {
            quartiles: function() {
                var fired = {q1: false, q2: false, q3: false, q4: false};
                player.on('time', function(evt) {
                    if(evt.position / evt.duration >= .25 && !fired.q1) {
                        track('firstQuartile');
                        fired.q1 = true;
                    }
                    else if(evt.position / evt.duration >= .5 && !fired.q2) {
                        track('secondQuartile');
                        fired.q2 = true;
                    }
                    else if(evt.position / evt.duration >= .75 && !fired.q3) {
                        track('thirdQuartile');
                        fired.q3 = true;
                    }                    
                });
                player.on('complete', function() {
                    if(!fired.q4) {
                        track('fourthQuartile');
                        fired.q4 = true;
                    }
                });
            }
        }        

        var get_metric_value = function(metric_name) {
            try {
                return metrics[metric_name]();
            } catch(e) { throw 'This metric does not exist: ' + metric_name; }
        }

        var get_alias = function(prop_type, metric_name) {
            try {
                return config.alias[prop_type].hasOwnProperty(metric_name) 
                            ? config.alias[prop_type][metric_name] 
                            : metric_name;
            } catch(e) { return metric_name; }
        }

        var transform = function(metric_name, metric_value, evt_name) {
            if(typeof config.transformMetric === 'function') {
                try {
                    var transformed = config.transformMetric(metric_name, metric_value, evt_name);
                    metric_name     = transformed.key;
                    metric_value    = transformed.val;
                } catch(e) {
                    throw 'Unable to transformMetric: ' + metric_name;
                }
            }
            return {key: metric_name, val: metric_value};
        }

        var track = function(evt_name) {            
            var qstring = [],
                metric_evt_name        = 'event',
                metric_evt_val         = get_alias('evts', evt_name),
                metric_evt_transformed = transform(metric_evt_name, metric_evt_val);
            qstring.push(metric_evt_transformed.key + '=' + metric_evt_transformed.val);
            for(m in metrics) {
                var metric_name  = get_alias('metrics', m),
                    metric_value = get_metric_value(m),
                    transformed  = transform(metric_name, metric_value, evt_name);                
                qstring.push(transformed.key + '=' + transformed.val);
            }
            if(typeof config.addMetrics === 'function') {
                var add_metrics = config.addMetrics(evt_name);
                [].forEach.call(add_metrics || [], function(item) {
                    try {
                        qstring.push(item.key + '=' + item.val);    
                    } catch(e) {
                        log('Unable to track custom metric: ' + item);
                    }
                    
                });
            }
            log('Track', qstring);
            qstring = qstring.join('&');  
            (new Image).src = [config.pixel, '?', qstring].join('');          
        };

        var init = function() {
            // bind all standard player events
            [].forEach.call(config.evts || [], function(evt_name) {
                if(evt_name in bind_custom_evts) {
                    bind_custom_evts[evt_name]();
                }
                else {
                    player.on(evt_name, function(evt) {
                        track(evt.type)
                    });
                }
            });
            track('ready');            
        }

        log(config);
        if(!config.pixel) {
            throw 'Must provide a pixel.';
        }
        else {
            player.on('ready', init);    
        }        

    }

    window.pixeltracker = pixeltracker;

})();