 var express = require('express'),
        http = require('http'),
        path = require('path'),
        app = express(),
        methodOverride = require('method-override'),
        request = require('request'),
        _ = require('lodash');

    function querify(queryParamsObject){

        //take the parameter {key:xxx, region:xxx} object and convert to a valid format
        var queried = '?'+_.map(queryParamsObject || {}, function(val, key){
            return key+'='+val
        }).join('&');

        return queried;
    }

    // adds a new rule to proxy a localUrl -> webUrl
    // i.e. proxify ('/my/server/google', 'http://google.com/')
    function proxify(localUrl, webUrl){
        app.get(localUrl, function(req, res) {

            //express extracts each query string parameter and places in req.query
            var url = [
                webUrl,
                querify(req.query)
            ].join("");

            console.log(req.query, webUrl)

            req.pipe(request(url)).pipe(res);
        });
    }

    proxify('/brewery/styles', 'https://api.brewerydb.com/v2/styles');

    //testing locations
    proxify('/brewery/locations', 'https://api.brewerydb.com/v2/locations');

    // all environments
    app.set('port', process.argv[3] || process.env.PORT || 3000);
    app.use(methodOverride());
    app.use(express.static(path.join(__dirname, '/public')));

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });