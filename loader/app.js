"use strict";
/**
 * Created by Andre LeFort on 2015-04-10.
 */


// Some bootstrapping
var requestify = require( 'requestify' ),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('../models/models.js'),
    http = require('http-request'),
    fs = require('fs'),
    zip = require('adm-zip'),
    converter = require("csvtojson").core.Converter;

var lcboLoader = {
    config: {
        url: 'https://lcboapi.com/',
        urlnonhttps: 'http://lcboapi.com/',
        per_page: 100,
        first_page: 1,
        headers: {
            'Authorization': 'Token MDphNWJlOWVlNi1kZmU2LTExZTQtOTI0Mi1iYmJjODAzYmFiMWY6akFwYTA1MG5RbHFXb3RNSG03NUE2ZUNjVnZFT3Rick9CNDNH'
        }
    },
    mongo: {
        store: {
            schema: models.schema.store
        },
        product: {
            schema: models.schema.product
        },
        inventory: {
            schema: models.schema.inventory
        }
    },
    pager: {
        stores: {},
        products: {},
        inventories: {}
    }
};

var db = mongoose.connect('mongodb://127.0.0.1:27017/lcbo');
var store = mongoose.model('store', lcboLoader.mongo.store.schema);
var product = mongoose.model('product', lcboLoader.mongo.product.schema);
var inventory = mongoose.model('inventory', lcboLoader.mongo.inventory.schema);

function getPager(element, callback){
    requestify.request(lcboLoader.config.url+element, {
        method: 'GET',
        params: {
            'per_page': lcboLoader.config.per_page,
            'page': lcboLoader.config.first_page
        },
        headers: lcboLoader.config.headers
    }).then(function(response) {
        var paging = response.getBody().pager;
        lcboLoader.pager[element] = paging;
        if(callback !== undefined){
            callback();
        }
    });
}

function getAllStores(){
    if(lcboLoader.pager.stores.current_page <= lcboLoader.pager.stores.total_pages) {
        requestify.request(lcboLoader.config.url+'stores', {
            method: 'GET',
            params: {
                'per_page': lcboLoader.config.per_page,
                'page': lcboLoader.pager.stores.current_page
            },
            headers: lcboLoader.config.headers
        }).then(function (response) {
            handleStoreData(response.getBody());
        });
    }else{

    }
}

function getAllProducts(){
    if(lcboLoader.pager.products.current_page <= lcboLoader.pager.products.total_pages) {
        requestify.request(lcboLoader.config.url + 'products', {
            method: 'GET',
            params: {
                'per_page': lcboLoader.config.per_page,
                'page': lcboLoader.pager.products.current_page
            },
            headers: lcboLoader.config.headers
        }).then(function (response) {
            console.log(response.getBody().pager);
            handleProductData(response.getBody());
        });
    }
}

function getAllInventories(){
    if(lcboLoader.pager.inventories.current_page <= lcboLoader.pager.inventories.total_pages) {
        requestify.request(lcboLoader.config.url + 'inventories', {
            method: 'GET',
            params: {
                'per_page': lcboLoader.config.per_page,
                'page': lcboLoader.pager.inventories.current_page
            },
            headers: lcboLoader.config.headers
        }).then(function (response) {
            console.log(response.getBody().pager);
            handleInventoryData(response.getBody());
        });
    }
}

function handleStoreData(data){
    var result = data.result;
    var key;

    for(key in result){
        processStoreRecord(result[key]);
    }

    lcboLoader.pager.stores.current_page++;
    getAllStores();

}

function handleProductData(data){
    var result = data.result;
    var key;

    for(key in result){
        processProductRecord(result[key]);
    }

    lcboLoader.pager.products.current_page++;
    getAllProducts();

}

function handleInventoryData(data){
    var result = data.result;
    var key;

    for(key in result){
        processInventoryRecord(result[key]);
    }

    lcboLoader.pager.inventories.current_page++;
    getAllInventories();

}

function processStoreRecord(storeRecord){
    store.findOne({ id: storeRecord.id }, function (err, doc) {
        if (err){
            console.log(err);
            process.exit();
        }

        if(doc == null){
            doc = store(storeRecord);
        }else{
            // Update all records
            var newDoc = store(storeRecord);
            newDoc._id = doc._id;
            doc = newDoc;
        }
        doc.save(function(err, doc) {
            return;
        });

        return;
    });
}

function processProductRecord(productRecord){
    product.findOne({ id: productRecord.id }, function (err, doc) {

        if (err){
            console.log(err);
            process.exit();
        }

        if(doc == null){
            doc = product(productRecord);
        }else{
            // Update all records
            var newDoc = product(productRecord);
            newDoc._id = doc._id;
            doc = newDoc;
        }
        doc.save(function(err, doc) {
            return;

        });

        return;
    });
}
function processInventoryRecord(inventoryRecord){
    inventory.findOne({ product_id: inventoryRecord.product_id, store_id: inventoryRecord.store_id }, function (err, doc) {

        if (err){
            console.log(err);
            process.exit();
        }

        if(doc == null){
            doc = inventory(inventoryRecord);
        }else{
            // Update all records
            var newDoc = inventory(inventoryRecord);
            newDoc._id = doc._id;
            doc = newDoc;
        }
        doc.save(function(err, doc) {
            console.log('Inventory Saved: ' + inventoryRecord.product_id);
            return;
        });

        return;
    });
}

function getDatasetsZip(){
    var options = {url: lcboLoader.config.urlnonhttps + 'datasets/latest.zip'};
    http.get(options, 'data/latest.zip', function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.log('File downloaded at: ' + result.file);
            extractDatasetsZip();
        }
    });
}

function extractDatasetsZip(){
    // reading archives
    var zipfile = new zip('data/latest.zip');

    zipfile.extractAllTo("./data", true);

    //Load Data now
    console.log('Done extracting csv files');

}

function convertTsFs(record){
    for(var innerKey in record){
        if(record[innerKey] == 't'){
            record[innerKey] = true;
        }else if(record[innerKey] == 'f'){
            record[innerKey] = false;
        }
    }

    return record;
}

function loadDataset(schema, fileName){
    var fileStream=fs.createReadStream(fileName);
    //new converter instance
    var csvConverter=new converter({constructResult:false});

    //end_parsed will be emitted once parsing finished
    csvConverter.on("record_parsed",function(jsonObj, rawObj, rowIndex){
        var record = jsonObj;
        record = convertTsFs(record);

        if(schema == 'stores'){
            processStoreRecord(record);
        }else if (schema == 'products'){
            processProductRecord(record);
        }else if(schema == 'inventories') {
            processInventoryRecord(record);
        }
    });

    //read from file
    fileStream.pipe(csvConverter);
}

function convertCSVtoJSON(csvFile, jsonFile){
    var csvConverter=new converter({constructResult:false});
    var readStream=fs.createReadStream(csvFile);

    var writeStream=fs.createWriteStream(jsonFile);

    readStream.pipe(csvConverter).pipe(writeStream);
}

//getDatasetsZip();
//extractDatasetsZip();
//convertCSVtoJSON('./data/stores.csv','./data/stores.json');
//convertCSVtoJSON('./data/products.csv','./data/products.json');
//convertCSVtoJSON('./data/inventories.csv','./data/inventories.json');
//loadDataset('stores', './data/stores.csv');
//loadDataset('products', './data/products.csv');
loadDataset('inventories', './data/inventories.csv');
