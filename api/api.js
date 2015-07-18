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
    cors = require('cors');

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

    InventoryModel.find(apiQueries.getInventoryByStore(req.query.store_id), function(err,docs){
        var arrayIds = [];
        var arrayInventories = [];

        for(var index in docs){
            arrayIds.push(docs[index].product_id);
            arrayInventories[docs[index].product_id] = docs[index];
        }

        ProductModel.find(apiQueries.getProductsFromIDs(arrayIds, 'Beer',[
            "Molson's Brewery of Canada Limited",
            "Sleeman Brewing & Malting Co",
            "Labatt Breweries Ontario",
            "Miller Brewing Company",
            "Moosehead Breweries Limited",
            "Heineken's Brouwerijen Nederland BV",
            "Guinness Brewing Worldwide",
            "Cerveceria Modelo Sa de Cv",
            "Diageo Canada Inc",
            "Coors Brewers Limited",
            "Cerveceria Cuauhtemoc Moctezuma",
            "James Ready Brewing Company",
            "Lakeport Brewing Corporation",
            "The Brick Brewing Co.",
            "Miller Brewing Trading Co Ltd",
            "Brick Brewing Co. Ltd. N / A"
        ]), function(err,products){
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