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
    eventEmitter = new events.EventEmitter(),
    ini = require('ini'),
    config = require('get-config').sync(__dirname + '/config');

var eventController = {
    init: function(){
        /* Lets setup the events we care about */
        eventEmitter.on('download_data', lcboLoader.getDatasetsZip);
        eventEmitter.on('extract_data', lcboLoader.extractDatasetsZip);
        eventEmitter.on('load_dataset', lcboLoader.loadDataset);
        eventEmitter.on('load_stores', lcboLoader.loadStores);
        eventEmitter.on('load_products', lcboLoader.loadProducts);
        eventEmitter.on('load_inventories', lcboLoader.loadInventories);
        eventEmitter.on('exit', lcboLoader.terminate);
        eventEmitter.on('load_dataset_complete', lcboLoader.datasetLoaded);
        eventEmitter.on('start_dataload', lcboLoader.loadStores);
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
        doc.location = {};
        doc.location.latitude = doc.latitude;
        doc.location.longitude = doc.longitude;

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
        var doc = lcboLoader.mongo.inventory.model(inventoryRecord);

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
        lcboLoader.log('Downloading file: ' + options.url);

        http.get(options, config.loader.datapath + '/latest.zip', function (error, result) {
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            eventEmitter.emit('extract_data');
        });
    },
    extractDatasetsZip: function(){
        var unzipper = new zip(config.loader.datapath + '/latest.zip')

        unzipper.on('error', function (error) {
            lcboLoader.error('Error extracting zip: ' + error);
            process.exit(1);
        });

        unzipper.on('extract', function (log) {
            lcboLoader.log('Finished extracting files from archive.');

            /* Let's emit the next event in the chain */

            eventEmitter.emit('start_dataload');
            return;
        });

        unzipper.on('progress', function (fileIndex, fileCount) {
            /* */
        });

        unzipper.extract({
            path: config.loader.datapath,
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
    loadDataset: function(schema, schemaName, fileName, deleteQuery){
        /* First let's wipe the collection clean */
        schema.remove(deleteQuery, function(error){
            if (error) {
                lcboLoader.error(error);
                process.exit(1);
            }

            var reader = csv.createCsvFileReader(fileName, {columnsFromHeader: true});

            reader.addListener('data', function(data) {
                var record = lcboLoader.convertTsFs(data);

                /*
                No need to process records that are dead
                 */
                if(record.is_dead == true){
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

            reader.addListener('end', function(data) {
                lcboLoader.log('Finished loading data for "' + schemaName + '" from ' + fileName);
                /*
                Lets let the handler know we're done this file
                 */
                eventEmitter.emit('load_dataset_complete', schemaName);
            });
        });
    },
    loadStores: function(){
        eventEmitter.emit('load_dataset', lcboLoader.mongo.store.model, 'stores', config.loader.datapath + '/stores.csv', {});
    },
    loadProducts: function(){
        eventEmitter.emit('load_dataset', lcboLoader.mongo.product.model, 'products', config.loader.datapath + '/products.csv', {});
    },
    loadInventories: function(){
        var oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() -7);

        var today = new Date();
        var date_query = {updated_at: {$lt: oneWeekAgo}};

        eventEmitter.emit('load_dataset', lcboLoader.mongo.inventory.model, 'inventories', config.loader.datapath + '/inventories.csv', {});
    },
    datasetLoaded: function(schemaName){
        switch(schemaName){
            case 'stores':
                lcboLoader.loadProducts();
                break;
            case 'products':
                lcboLoader.loadInventories();
                break;
            case 'inventories':
                eventEmitter.emit('exit');
                break;
        }
    }
};
/* Final Bootstrap */
eventController.init();
lcboLoader.init();
/* Now, let's kick off the work */
eventEmitter.emit('download_data');
//lcboLoader.loadAllDatasets();