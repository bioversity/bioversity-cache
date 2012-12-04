var apejs = require("apejs.js");
var memcache = require("memcache.js");
var googlestore = require("googlestore.js");

var httpget = require('./httpget.js')

var mustache = require("./common/mustache.js");

apejs.urls = {
    "/cache-url": {
        get: function(request, response) {
            var p = param(request)
            var url = p('url')

            // check if url is in cache
            var data = memcache.get(url)
            if(data) {
                return print(response).jsonp(data, p('callback'))
            }

            // check if url is in datastore
            try {
                var key = googlestore.createKey('url', url)
                var urlEntity = googlestore.get(key)
            } catch(e) { // entity wasn't found
            }
            if(urlEntity) {
                var value = urlEntity.getProperty('value').getValue()
                // add it to cache
                memcache.put(url, value)
                return print(response).jsonp(value, p('callback'))
            }
            
            // else download it from the web
            var ret = httpget(url)

            // add it to cache
            memcache.put(url, ret);

            // add it to datastore
            var e = googlestore.entity('url', url, {
                'value': new Text(ret)
            })
            googlestore.put(e)

            return print(response).jsonp(ret, p('callback'))
        }
    }
}


// simple syntax sugar
function print(response) {
    return {
        // callback is a Java string that contains the name
        // of the callback, so we can run JSONP if it exists
        jsonp: function(jsonString, callback) {
            if(response == null) return;

            if(callback) { // JSONP
                jsonString = "" + callback + "(" + jsonString + ");";  
            }

            response.setContentType("application/json");
            response.getWriter().println(jsonString);
            return jsonString;
        },
        text: function(text) {
            if(text) response.getWriter().println(text);
        }
    };
}
function param(request) {
    return function(par) {
        var p = request.getParameter(par);
        if(p) return p;
        else return false;
    }
}
