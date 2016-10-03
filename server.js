var express = require('express');
var app = express();
var fs = require('fs');
var Config = require('./app/config');

app.use('/', express.static('dist'));

var api_router = require('./app/api/routes');
app.use('/api', api_router);

app.get('*', (req, res)=> {
    res.send('you\'ve landed on a random address');
});

var portNum = Config.isRemote() ? 19651 : 8080;

app.listen(portNum, ()=> {
    console.log((Config.isRemote()? 'remote': 'local')+"server on, listening to " + portNum);
});
