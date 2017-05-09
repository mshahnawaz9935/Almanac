const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var session = require('express-session');
const api = require('./routes/api');
const note = require('./routes/note');
const onenote = require('./routes/onenote');
var cookieParser = require('cookie-parser');
const app = express();

app.use(session({secret:'insert your things'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');   //very important CORS
  next();
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', api);
app.use('/note', note);
app.use('/onenote', onenote);


app.use(session({
  secret: '12345QWERTY-SECRET',
  name: 'nodecookie',
  resave: false,
  saveUninitialized: false
}));


// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
 


/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));