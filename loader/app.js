"use strict";
/**
 * Created by Andre LeFort on 2015-04-10.
 */

/**
 * 1. Let's get all the stores
 * 2. Loop through each store, get all the products listed at that store
 * 3
 */
// Some bootstrapping
// Let's serve up the data file via json
var requestify = require( 'requestify' );



function getAllStores(page){

    requestify.request('https://lcboapi.com/stores', {
        method: 'GET',
        params: {
            'per_page': 100,
            'page': page
        },
        headers: {
            'Authorization': 'Token MDphNWJlOWVlNi1kZmU2LTExZTQtOTI0Mi1iYmJjODAzYmFiMWY6akFwYTA1MG5RbHFXb3RNSG03NUE2ZUNjVnZFT3Rick9CNDNH'
        }
    })
    .then(function(response) {
        handleStoreData(response.getBody());
    });

}

function handleStoreData(data){
    var pager = data.pager;
    console.log(data.pager);

    while(pager.current_page <= pager.total_pages){
        getAllStores(pager.next_page);
    }
}

getAllStores(1);
