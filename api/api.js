//You really need body parser for things to work correctly
var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bodyParser = require('body-parser'),
    http = require('http'),
    models = require('../models/models.js'),
    restify = require('express-restify-mongoose'),
    methodOverride = require('method-override'),
    compress = require('compression'),
    cors = require('cors'),
    config = require('get-config').sync(__dirname + '/config');

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
    getInventoryByStore: function (store_url) {
        return {url_friendly_name: store_url};
    },
    getProductsFromIDs: function (ids, primaryCategory, producerExclusions) {
        return {
            id: {
                $in: ids
            },
            producer_name: {
                $nin: producerExclusions
            },
            primary_category: primaryCategory,
            secondary_category: {
                $nin: ['Specialty']
            }
        };
    }
};

var app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

var access_control = {
    prereq: function(req) {
        // Disallow POST PUT DELETE
        return false;
    }
};

var router = express.Router();
restify.serve(router, InventoryModel, access_control);
restify.serve(router, StoreModel, access_control);
restify.serve(router, ProductModel, access_control);

app.use(router);

app.get('/api/v1/storesNear', function(req, res) {
    StoreModel.geoNear({
            type: "Point",
            coordinates: [parseFloat(req.query.long), parseFloat(req.query.lat)]
        },
        { maxDistance: 50000, spherical: true }, function(err,docs){
            var results = []
            docs.forEach(function(doc) {
                doc.obj.location.distance_from_me = doc.dis;
                results.push(doc.obj);
            });

            res.send(results);
    });
});

app.get('/api/v1/inventoryByStore', function(req, res) {
    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_url), function(err,docs){
        res.send(docs);
    });
});

app.get('/api/v1/productIdByStore', function(req, res) {
    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_url), {
        '_id': 0,
        'product_id': 1
    }, function(err,docs){
        res.send(docs);
    });
});

app.get('/api/v1/productsAtStore', function(req, res) {
    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_url), function(err,docs){
        var arrayIds = [];
        var arrayInventories = [];

        for(var index in docs){
            arrayIds.push(docs[index].product_id);
            arrayInventories[docs[index].product_id] = docs[index];
        }

        ProductModel.find(apiQueries.getProductsFromIDs(arrayIds, 'Beer', config.api.brewery_exclusions), function(err,products){
            for(var index in products){
                var product = products[index];
                product.inventory.quantity = arrayInventories[product.id].quantity;
            }
            res.send(products);
        });
    });
});

app.listen(3000, function() {
    console.log("Express server listening on port 3000");
});