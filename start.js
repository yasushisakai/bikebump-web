'use strict';

var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var process = require('process');

var isRemote = process.argv[2] + '' != 'local';

app.use('/', express.static('dist'));

var api_router = require(__dirname + '/api_routes');
app.use('/api', api_router);

app.get('*', function (req, res) {
    //res.send('you\'ve landed on a random address');

    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

var portNum = isRemote ? 19651 : 8080;

app.listen(portNum, function () {
    console.log((isRemote ? 'remote' : 'local') + " server on, listening to " + portNum);
});
