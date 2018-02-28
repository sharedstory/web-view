var firebaseAdmin = require('firebase-admin');

console.log(process.env.FIREBASE_PRIVATE_KEY);
console.log(process.env.FIREBASE_CLIENT_EMAIL);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: 'https://sharedstory-5edb5.firebaseio.com/'
});

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index', {id: 0});
});

app.get('/:id', function(request, response) {
    var id = request.params.id;
    response.render('pages/index', {id: id});
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});