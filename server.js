var express = require('express');
var app = express();
var fs = require('fs');

app.use('/',express.static('dist'));

var api_router = require('./app/api/routes');
app.use('/api',api_router);

app.get('*',(req,res)=>{
  res.send('you\'ve landed on a random address');
});

var portNum = 19651;

app.listen(portNum,()=>{
  console.log("server on, listening to "+portNum);
});
