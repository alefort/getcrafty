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
    csv = require('ya-csv');

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

function processStoreRecord(storeRecord){
    var doc = store(storeRecord);

    doc.save(function(err, doc) {
        return;
    });
}

function processProductRecord(productRecord){
    var doc = product(productRecord);

    doc.save(function(err, doc) {
        return;

    });
}
function processInventoryRecord(inventoryRecord){
    var  doc = inventory(inventoryRecord);

    doc.save(function(err, doc) {
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

function emptyDataset(schema){
    schema.remove({}, function(){
        return;
    });
}

function loadDataset(schema, schemaName, fileName){
    // equivalent of csv.createCsvFileReader('data.csv')
    var reader = csv.createCsvFileReader(fileName, {columnsFromHeader: true});
    var writer = new csv.CsvWriter(process.stdout);
    emptyDataset(schema);

    reader.addListener('data', function(data) {
        var record = convertTsFs(data);

        if(schemaName == 'stores'){
            processStoreRecord(record);
        }else if (schemaName == 'products'){
            processProductRecord(record);
        }else if(schemaName == 'inventories') {
            processInventoryRecord(record);
        }
    });
}

//getDatasetsZip();
//extractDatasetsZip();
loadDataset(store, 'stores', './data/stores.csv');
loadDataset(product, 'products', './data/products.csv');
loadDataset(inventory, 'inventories', './data/inventories.csv');
