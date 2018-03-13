var initialData = require('./initialData.js').models;

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

var async = require('async');

/*
 * Global variables
 * ----------------------------------------
 */

var MAPS = {
    default: {
        mapName: "Stanford",
        mapFile: "stanford.png",
    },
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
        obj[array[hash]] = true;
    }
    return obj;
}

/*
 * Handlers
 * ----------------------------------------
 */

// Displays project description
app.get('/', function(request, response) {
    response.render('pages/index');
});

// Displays basic page with id for debugging
app.get('/:id', function(request, response) {
    var id = request.params.id;
    response.render('pages/id', {id: id});
});

// Displays aggregated data from database on map
app.get('/map/:map', function(request, response) {
    var map = request.params.map;
    var mapKey = MAPS[map];
    if (mapKey == null) response.render('pages/index');
    var markerArray = [];

    function getSessionData(s, sessionCallback) {
        function getMarkerData(m, markerCallback) {
            db.ref('markers/' + m).once('value').then(function(markerSnapshot) {
                var marker = markerSnapshot.val();
                console.log("marker", marker);
                markerArray.push(marker);
                markerCallback();
            });
        }

        console.log("I has session");
        db.ref('sessions/' + s).once('value').then(function(sessionSnapshot) {
            var markers = sessionSnapshot.val().markers;
            async.each(Object.keys(markers), getMarkerData, function(error) {
                if (error) console.log("Error while getting marker data", error);
                sessionCallback();
            });
        });
    }

    db.ref('maps/' + map).once('value').then(function(mapSnapshot) {
        var sessions = mapSnapshot.val();
        async.each(Object.keys(sessions), getSessionData, function(error) {
            if (error) console.log("Error while getting session data", error);
            response.render('pages/map', {
                mapName: mapKey.mapName,
                mapFile: mapKey.mapFile,
                markers: markerArray,
            });
        });
    });
})

// Add session data to database
app.post('/session/add', function(request, response) {
    var map = request.body.map;
    var markers = request.body.markers;
    addSession(map, markers);
    response.status(200).send("OK");
});

app.get('/db/add/sample', function(request, response){
	var small = initialData.small;
	for (var i in small) {
		addSession(small[i].map, small[i].markers);
	}
	response.render('pages/index');
});

function addSession(map, markers) {
	var pushData = {};
    var sessionKey = db.ref('sessions').push().key;
    var markerKeys = [];

    for (var i in markers) {
        markerKeys.push(db.ref("markers").push().key);
        markers[i].session = sessionKey;
        pushData["markers/" + markerKeys[i]] = markers[i];
    }

    pushData['sessions/' + sessionKey] = {
        map: map,
        markers: createHashKeyValues(markerKeys),
        timestamp: Date.now(),
    }
    pushData['maps/' + map + '/' + sessionKey] = true;

    db.ref().update(pushData, function(error) {
        if (error) {
            console.log("Error updating data:", error);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});