"use strict";

// Some bootstrapping
var http = require('http-request'),
    config = require('get-config').sync(__dirname + '/config'),
    express = require('express'),
    methodOverride = require('method-override'),
    compress = require('compression'),
    bodyParser = require('body-parser');


var app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

app.listen(80, function() {
    console.log("Express server listening on port 80");
});