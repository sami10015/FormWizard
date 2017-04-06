//Invoke Strict JS Mode
'use strict'

var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
// Require mongoose models for queries
require('./public/javascripts/models/Category');
require('./public/javascripts/models/Form')

var app = express();
var router = express.Router();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(methodOverride());


// Connect to the database we're using for this app
var db = mongoose.connect('mongodb://10.10.7.65/krypton');
var Category = mongoose.model('Category');
var Form = mongoose.model('Form');
var ObjectId = mongoose.ObjectId;


// Different arrays used for making routes with functional programming
var paths = [];
var tempRoutes = [];
var routes = [];

// Way to make routes with functional programming
Category.find({}, function(err, category){
    // Collect all path names for functional programming to create routes
    for(var i = 0; i < category.length; i++){
        paths.push(category[i].name);
    }

    // With functional programming, go through the full paths and create individual routes(i.e /insurance, /insurance/cob/, etc...)
    paths.forEach(function(pathName){
        var routeString = '/';
        for(var i = 0; i <= pathName.length; i++){
            if(pathName.charAt(i) == '/' || i == pathName.length){
                tempRoutes.push(routeString);
                routeString += pathName.charAt(i);
            }else{
                routeString += pathName.charAt(i);
            }
        }
    })

    // Remove duplicate routes
    for(var i = 0; i < tempRoutes.length; i++){
        var route = tempRoutes[i];
        var duplicated = false;
        if(route.length > 0){
            for(var j = 0; j < routes.length; j++){
                if(routes[j] == route){
                    duplicated = true;
                    break;
                }
            }
        }
        // If it is not duplicated, add it to the list
        if(duplicated == false){
            routes.push(route);
        }
    }

    // Create routes for each route name
    routes.forEach(function(routeName){
        var categoryPath = routeName.substring(1);
        var jsonObj = {};
        Category.find({name: new RegExp(categoryPath, 'i')}, function(err, category){
            // Return an array of paths in the JSONobj to the controller if more than one category is returned
            if(category.length > 1){
                var paths = [];
                for(var i = 0; i < category.length; i++){
                    paths.push(category[i].name.replace(categoryPath, ''));
                }
                jsonObj.paths = paths;
            }
            // This means that only one category corresponds to the route, therefore you should return a different JSONobj
            else{
                var path = category[0].name.replace(categoryPath,'');
                Form.find({_id: category[0].form}, function(err, form){
                        jsonObj.pages = form[0].pages;
                        jsonObj.title = form[0].name;
                        jsonObj.paths = path
                });
            }
        });
        router.get(routeName, function(req, res){
            res.json(JSON.stringify(jsonObj));
        })
    })
})

// Initial route to get all main form types
router.get('/formTypes', function(req, res){
    Category.find({}, function(err, category){
        res.json(JSON.stringify(category));
    })
})

// Attach all routes created with functional programming and initial route to the router
app.use('/', router);

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
    var queryObject = require('url').parse(req.url,true).query;
    console.log('static file request : ' + req.url);
    //console.log('static file request : ' + req.params);
    res.sendFile( __dirname + req.params[0]);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log("Listening on 127.0.0.1:3000")
module.exports = app;
