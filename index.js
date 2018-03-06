/*
 * Set up Firebase
 * ----------------------------------------
 */

var firebaseAdmin = require('firebase-admin');
var firebaseSecret = {
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL
};

var firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseSecret),
    databaseURL: 'https://sharedstory-5edb5.firebaseio.com/'
});

var db = firebaseApp.database();

/*
 * Set up Express.js and related settings
 * ----------------------------------------
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/*
 * Global variables
 * ----------------------------------------
 */

var MAPS = {
    stanford: {
        mapName: "Stanford",
        mapFile: "stanford.png",
    },
    paloalto: {
        mapName: "Palo Alto",
        mapFile: "palo_alto.png",
    },
    epa: {
        mapName: "East Palo Alto",
        mapFile: "east_palo_alto.png",
    },
}

/*
 * Helper Methods
 * ----------------------------------------
 */

// Given an array of Firebase hashes, returns an object
// with hashes as keys and true as the value
function createHashKeyValues(array) {
    var obj = {};
    for (var hash in array) {
        obj[hash] = true;
    }
    return obj;
}

/*
 * Handlers
 * ----------------------------------------
 */

// TODO
// Displays project description
app.get('/', function(request, response) {
    response.render('pages/index');
});

// Displays basic page with id for debugging
app.get('/:id', function(request, response) {
    var id = request.params.id;
    db.ref('blah').once('value').then(function(snapshot) {
        console.log(snapshot.val());
    });
    response.render('pages/id', {id: id});
});

// TODO
// Displays aggregated data from database on map
app.get('/map/:map', function(request, response) {
    var map = request.params.map;
    var mapKey = MAPS[map];
    if (mapKey == null) response.render('pages/index');
    response.render('pages/map', {
        mapName: mapKey.mapName,
        mapFile: mapKey.mapFile,
    });
})

// TODO
// Add session data to database
app.post('/session/add', function(request, response) {
    var receivedData = request.body;
    console.log(receivedData);

    // TODO Parse data
    var map = "stanford";
    var markers = [
        {
            map: "stanford",
            text: "This is a sample event",
            image: "sample-image.jpg",
            x: 1,
            y: 2,
        }
    ];

    // Generate a new push ID for the new post
    var sessionKey = db.child("sessions").push().key();
    var markerKeys = [];
    markerKeys.push(db.child("markers").push().key()); //TODO for multiple markers

    // Create the data we want to update
    var pushData = {};
    var markerKeyValues = createHashKeyValues(markerKeys);
    pushData["sessions/" + sessionKey] = {
        map: map,
        markers: markerKeyValues,
        timestamp: Date.now(),
    }
    for (var i in markerKeys) {
        markers[i].session = sessionKey;
        pushData["markers/" + markerKeys[i]] = markers[i];
    }

    // Do a deep-path update
    db.update(pushData, function(error) {
        if (error) {
            console.log("Error updating data:", error);
        }
    });
    response.status(200).send("OK");
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});