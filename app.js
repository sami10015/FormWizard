//Invoke Strict JS Mode
'use strict'

// Modules used within server side script
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var PDFDocument = require('pdfkit');

// Require mongoose models for queries
require('./public/javascripts/models/Category');
require('./public/javascripts/models/Form');
require('./public/javascripts/models/User');

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
var User = mongoose.model('User');
var ObjectId = mongoose.ObjectId;


// Different arrays used for making routes with functional programming
var paths = [];
var tempRoutes = [];
var routes = [];

/*
 * When a new category is entered, it has a route name that looks something like insurance/cob/lincoln
 * That means that there is a RESTFUL route for /insurance, /insurance/cob, /insurance/cob/lincoln
 * The block of code below parses each full category route(/insurance/cob/lincoln) no matter how long it is
 * and creates a route for each individual SUB route within the FULL route
*/
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

/*
 * This initial route gets all the FULL category route names (i.e insurance/cob/lincoln) and attaches an array of them to a JSON object
 * The code also checks if there is a user stored in the database for resume functionality
 * If there is a user, then it sends over a different JSON response object then if there wasnt a user
 * The initialController then checks if there is a user stored in the JSON object, and if there is, it displays the resume button
 * The initialController also parses the route names in the array of categories and displays all the main categories under the first div on the landing page
 * My thought process on this was to make the resume functionality easy without changing too much code
*/
router.get('/formTypes', function(req, res){
    // Get initial categories
    Category.find({}, function(err, category){
        // Check if there are any users stored
        User.findOne({}, function(err, user){
            if(!user){
                var jsonObj = {
                    category : category
                }
                res.json(JSON.stringify(jsonObj));
            } else {
                var jsonObj = {
                    category : category,
                    user : user
                }
                res.json(JSON.stringify(jsonObj));
            }
        })
    })
})

/*
 * This post route is for when the user completes the form and wants to generate a PDF
 * The request object that is sent over from the formController is in JSON format
 * The JSON object consists inner JSON objects that hold a fence corresponding to a field and the value the user entered for that field 
 * The code then loops through each inner JSON object and renders onto an image of our initial central united test form
 * Couple of things here are static...for one, the font size is a static number of 8 which needs to be dynamic depending on the size of the form
 * Also...the image of the form is static...that should be dynamic based on whatever form is being filled out
*/
router.post('/pdfCreation', function(req, res){
    var userJSON = req.body;

    var doc = new PDFDocument();
	var filename = "result.pdf"
	
	res.set({
		"Content-Disposition": 'attachment; filename="'+filename+'"',
		"Content-Type": "application/pdf"
	});

    doc.pipe(res);

    doc.image('./public/forms/Central United Life beneficiary change-1.png', 0, 0);
    
    for(var key in userJSON){
        // Each object in the overall user JSON object is an array of object
        for(var i = 0; i < userJSON[key].length; i++){
            var userJSONObj = userJSON[key][i];
            var fence = userJSONObj.fence
            var value = userJSONObj.value
            // Render a button different than text
            if(value == 'radioButton'){
                var fence = userJSONObj.fence
                var startX = fence.startX;
                var startY = fence.startY;
                var width = fence.endX - startX;
                var height = fence.endY - startY;

                doc.rect(startX, startY, width, height).fill('black').stroke();
            }else{
                var height = fence.endY - fence.y;
                var width = fence.endX - fence.x;
                var fontSize = 10;
                if(width <= 45 && height <= 13){
                    fontSize = 8;
                }
                doc.fontSize(8).fillColor('black').text(value.toString(), fence.startX, fence.startY, {width: fence.endX - fence.x, height: fence.endY - fence.y}).stroke();
            }
        }
    } 

    doc.end();
})

/*
 * This post request saves all the information into a user collection in the database
 * The data that is saved is everything that is needed for the resume functionality to work
 * The request object that is sent from the formController is in JSON format which holds sectionNum, userData, and formData
 * sectionNum is the number of the section artifact that the user left on
 * userData is an array of JSON objects that hold fence and field combinations along with the values stored in each field(if filled in)
 * formData is the form object originally pulled when the user first started filling out the form(look at the form data model for more info)
*/
router.post('/saveAndQuit', function(req, res){
    // Gather the user JSON information
    var userJSON = req.body;
    
    // Clear the User Collection, and then insert a new user
    User.remove({}, function(err){
        console.log("Users Cleared...")
        // Insert the new User
        var newUserObj = {
            userData : userJSON.userData,
            formData : userJSON.formData,
            sectionNum : userJSON.sectionNum
        };
        var newUser = new User(newUserObj);
        newUser.save(function (err) {
            if (err) {
                console.log("Save user failed");
                return next(err);
            } else {
                console.log("Save user successful");
                res.end('Saved successful');
            }
        });
    });
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
