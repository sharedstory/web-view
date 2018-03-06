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
 * Handlers
 * ----------------------------------------
 */

// TODO
// Displays project description
app.get('/', function(request, response) {
    response.render('pages/index', {id: 0});
});

// Displays aggregated data from database on map
app.get('/map/:map', function(request, response) {
    var map = request.params.map;
    response.render('pages/map', {map: map});
})

// Displays basic page with id for debugging
app.get('/:id', function(request, response) {
    var id = request.params.id;
    db.ref('blah').once('value').then(function(snapshot) {
        console.log(snapshot.val());
    });
    response.render('pages/index', {id: id});
});

// TODO
// Add session data to database
app.post('/session/add', function(request, response) {
    var data = request.body;
    console.log(data);
    response.status(200).send("OK");
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});