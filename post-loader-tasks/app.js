"use strict";
/**
 * LCBO API Data Loader - Post load tasks
 *
 * this simple task runner will process the data that was loaded via the LCBO API data loader
 *
 * Created by Andre LeFort on 2016-02-16.
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
    config = require('get-config').loadSync(__dirname + '/config');

var eventController = {
    init: function(){
        /* Lets setup the events we care about */
        eventEmitter.on('begin_process', taskRunner.beginProcess);
        eventEmitter.on('process_is_new_flag', taskRunner.processIsNewFlag);
        eventEmitter.on('exit', taskRunner.terminate);
    }
};

var taskRunner = {
    init: function(){
        taskRunner.mongo.db = mongoose.connect('mongodb://' + taskRunner.config.mongo.host + '/' + taskRunner.config.mongo.db);
        taskRunner.log('Successfully connected to Mongo server ' + mongoose.connection.host + ' on port ' + mongoose.connection.port);
        mongoose.set('debug', false);
    },
    log: function(message){
        console.log(taskRunner.getDate() + ':  ' + message);
    },
    error: function(message){
        console.error(taskRunner.getDate() + ':  ' + message);
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
        inventory_archive: {
            model: mongoose.model('archive', models.schema.inventory_archive)
        },
        db: ''
    },
    terminate: function(){
        taskRunner.log('Terminating task runner process.');
        process.exit(0);
    },
    beginProcess: function(){
        eventEmitter.emit('process_is_new_flag');
    },
    processIsNewFlag: function(){
        // We need to figure out if each beer at each location is considered 'new' or not.
        var archives = taskRunner.mongo.inventory_archive.model;

        //var store_stream = taskRunner.mongo.store.model.find({}).lean().stream();
        //var beer_stream = taskRunner.mongo.product.model.find({primary_category: 'Beer'}).lean().stream();
        var inventory_stream = taskRunner.mongo.inventory.model.find({}).lean().stream();

        var fivedaysAgo = new Date();
        fivedaysAgo.setDate(fivedaysAgo.getDate() - 5);

        inventory_stream.on('data', function (doc) {
            console.log(doc);
            archives.findOne({
                store_id: doc.store_id,
                product_id: doc.product_id,
                reported_on:{
                    $lte: fivedaysAgo
                }
            }).exec(function(err, record){
                if(record == null){
                    doc.is_new = true;
                    doc = taskRunner.mongo.inventory_archive.model(doc);
                    doc.save(function(err, doc){
                        // Non critical, let it fail silently
                    });
                }
            });
        }).on('error', function (err) {
            taskRunner.error(err);
            process.exit(1);
        }).on('close', function () {
            console.log('All Done! Terminating.');
            process.exit(1);
        });
    }
};
/* Final Bootstrap */
eventController.init();
taskRunner.init();
/* Now, let's kick off the work */
eventEmitter.emit('begin_process');