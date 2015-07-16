//You really need body parser for things to work correctly
var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bodyParser = require('body-parser'),
    http = require('http'),
    models = require('../models/models.js'),
    restify = require('express-restify-mongoose'),
    methodOverride = require('method-override'),
    compress = require('compression');

mongoose.connect('mongodb://localhost/lcbo');

var InventoryModel = mongoose.model('inventory', models.schema.inventory);
var StoreModel = mongoose.model('store', models.schema.store);
var ProductModel = mongoose.model('product', models.schema.product);

var apiQueries = {
    storesNear: function (long, lat) {
        return {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [long, lat]
                    },
                    $maxDistance: 50000,
                    $minDistance: 0
                }
            }
        };
    },
    getInventoryByStore: function (store_id) {
        return {store_id: store_id};
    },
    getProductsFromIDs: function (ids) {
        return {
            id: {
                $in: ids
            }
        };
    }
};

var app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

var router = express.Router();
restify.serve(router, InventoryModel);
restify.serve(router, StoreModel);
restify.serve(router, ProductModel);

app.use(router);

app.get('/data/fn/storesNear', function(req, res) {

   StoreModel.find(apiQueries.storesNear(req.query.long, req.query.lat), function(err,docs){
       res.send(docs);
   });

});

app.get('/data/fn/inventoryByStore', function(req, res) {

    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_id), function(err,docs){
        res.send(docs);
    });

});

app.get('/data/fn/productIdByStore', function(req, res) {

    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_id), {
        '_id': 0,
        'product_id': 1
    }, function(err,docs){
        res.send(docs);
    });

});

app.get('/data/fn/productsAtStore', function(req, res) {

    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_id), {
        '_id': 0,
        'product_id': 1
    }, function(err,docs){
        var arrayIds = [];
        for(var doc in docs){
            arrayIds.push(docs[doc].product_id);
        }

        ProductModel.find(apiQueries.getProductsFromIDs(arrayIds), function(err,products){
            res.send(products);
        });
    });

});

app.listen(3000, function() {
    console.log("Express server listening on port 3000");
});