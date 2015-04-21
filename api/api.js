//You really need body parser for things to work correctly
var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bodyParser = require('body-parser'),
    http = require('http'),
    models = require('../models/models.js'),
    restify = require('express-restify-mongoose'),
    methodOverride = require('method-override');;

mongoose.connect('mongodb://localhost/lcbo');

var InventoryModel = mongoose.model('inventory', models.schema.inventory);
var StoreModel = mongoose.model('store', models.schema.store);


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

var router = express.Router();
restify.serve(router, InventoryModel);
restify.serve(router, StoreModel);

app.use(router);

app.listen(3000, function() {
    console.log("Express server listening on port 3000");
});