"use strict";
/**
 * LCBO API Data Loader
 *
 * This loader is written to do full loads of the LCBOAPI.COM nightly datasets.
 * These datasets are in CSV format, the following loader is responsible for
 *  - Downloading a new dataset archive
 *  - Expanding the contents of the archives
 *  - Parsing the CSV Files and loading each record into MongoDB
 *
 * Created by Andre LeFort on 2015-04-10.
 */


// Some bootstrapping
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('../models/models.js'),
    http = require('http-request'),
    fs = require('fs'),
    zip = require('decompress-zip'),
    csv = require('ya-csv'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();;

var eventController = {
    init: function(){
        /* Lets setup the events we care about */
        eventEmitter.on('download_data', lcboLoader.getDatasetsZip);
        eventEmitter.on('extract_data', lcboLoader.extractDatasetsZip);
        eventEmitter.on('load_data', lcboLoader.loadAllDatasets);
        eventEmitter.on('exit', lcboLoader.terminate);

    }
};

var lcboLoader = {
    init: function(){
        lcboLoader.mongo.db = mongoose.connect('mongodb://' + lcboLoader.config.mongo.host + '/' + lcboLoader.config.mongo.db);
        lcboLoader.log('Successfully connected to Mongo');
    },
    log: function(message){
        console.log(lcboLoader.getDate() + ':  ' + message);
    },
    error: function(message){
        console.error(lcboLoader.getDate() + ':  ' + message);
    },
    getDate: function(){
      return new Date().toString();
    },
    config: {
        url: 'lcboapi.com',
        per_page: 100,
        first_page: 1,
        headers: {
            'Authorization': 'Token MDphNWJlOWVlNi1kZmU2LTExZTQtOTI0Mi1iYmJjODAzYmFiMWY6akFwYTA1MG5RbHFXb3RNSG03NUE2ZUNjVnZFT3Rick9CNDNH'
        },
        data: {
            zip: './data/latest.zip',
            folder: './data'
        },
        mongo: {
            host: '127.0.0.1:27017',
            db: 'lcbo'
        }
    },
    mongo: {
        store: {
            model: mongoose.model('store', models.schema.store)
        },
        product: {
            model: mongoose.model('product', models.schema.product)
        },
        inventory: {
            model: mongoose.model('inventory', models.schema.inventory)
        },
        db: ''
    },
    terminate: function(){
        lcboLoader.log('Terminating data load process.');
        process.exit(0);
    },
    processStoreRecord: function(storeRecord){
        var doc = lcboLoader.mongo.store.model(storeRecord);

        doc.save(function(error, doc) {
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            return;
        });
    },
    processProductRecord: function(productRecord){
        var doc = lcboLoader.mongo.product.model(productRecord);

        doc.save(function(error, doc) {
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            return;
        });
    },
    processInventoryRecord: function(inventoryRecord){
        var  doc = lcboLoader.mongo.inventory.model(inventoryRecord);

        doc.save(function(error, doc) {
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            return;
        });
    },
    getDatasetsZip: function(){
        var options = {url: 'http://' + lcboLoader.config.url + '/datasets/latest.zip'};
        lcboLoader.log('Downloading file: ' + options);

        http.get(options, 'data/latest.zip', function (error, result) {
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            eventEmitter.emit('extract_data');
        });
    },
    extractDatasetsZip: function(){
        var unzipper = new zip(lcboLoader.config.data.zip)

        unzipper.on('error', function (error) {
            lcboLoader.error('Error extracting zip: ' + error);
            process.exit(1);
        });

        unzipper.on('extract', function (log) {
            /* Let's emit the next event in the chain */
            eventEmitter.emit('load_data');
            return;
        });

        unzipper.on('progress', function (fileIndex, fileCount) {
            /* */
        });

        unzipper.extract({
            path: lcboLoader.config.data.folder,
            filter: function (file) {
                return file.type !== "SymbolicLink";
            }
        });
    },
    convertTsFs: function(record){
        for(var key in record){
            if(record[key] == 't'){
                record[key] = true;
            }else if(record[key] == 'f'){
                record[key] = false;
            }
        }

        return record;
    },
    loadDataset: function(schema, schemaName, fileName){
        /* First let's wipe the collection clean */
        schema.remove({}, function(error){
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            var reader = csv.createCsvFileReader(fileName, {columnsFromHeader: true});

            reader.addListener('data', function(data) {
                var record = lcboLoader.convertTsFs(data);

                /*
                No needto process records that are dead
                 */
                if(record.is_dead == false){
                    return;
                }

                if(schemaName == 'stores'){
                    lcboLoader.processStoreRecord(record);
                }else if (schemaName == 'products'){
                    lcboLoader.processProductRecord(record);
                }else if(schemaName == 'inventories') {
                    lcboLoader.processInventoryRecord(record);
                }
            });
        });
    },
    loadAllDatasets: function(){
        lcboLoader.loadDataset(lcboLoader.mongo.store.model, 'stores', './data/stores.csv');
        lcboLoader.loadDataset(lcboLoader.mongo.product.model, 'products', './data/products.csv');
        lcboLoader.loadDataset(lcboLoader.mongo.inventory.model, 'inventories', './data/inventories.csv', true);
    }
};
/* Final Bootstrap */
eventController.init();
lcboLoader.init();
/* Now, let's kick off the work */
eventEmitter.emit('download_data');