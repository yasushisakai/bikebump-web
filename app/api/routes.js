var express = require('express');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');

var json_path = path.resolve(__dirname,'../../','data');
var api_router = express.Router();

api_router.get('/',(req,res)=>{
  res.json({
    message:"root of api"
  });
});

//
// FENCES
//

// get fences
api_router.get('/fences',(req,res)=>{
  fs.readFile(path.resolve(json_path,'fences.json'),(err,data)=>{
    if(err) console.error(err);
    else{
      res.json(JSON.parse(data));
    }
  });
});

// add fence
api_router.get('/fences/add',(req,res)=>{

  //
  // example url /fences/add?u=userid&lat=49&lng=-71&a=2
  //

  // read the file
  var fences_path = path.resolve(json_path,'fences.json')
  fs.readFile(fences_path,(err,data)=>{
    if(err) console.error(err);

    var fences = JSON.parse(data);

    var latitude = parseFloat(req.query.lat);
    var longitude = parseFloat(req.query.lng);
    var newFence = {
        user:req.query.u,
        coordinates:{lat:latitude,lng:longitude},
        answer:parseInt(req.query.a),
        id:uuid.v4(), // I know its overkill
        timestamp:Date.now()
      }

    // push it
    fences.push(newFence);

    // and rewrite it
    fs.writeFile(fences_path,JSON.stringify(fences),(err)=>{
      if(err){
        console.error(err);
        process.exit(1);
      }
      res.json(fences);
    });
  });
});

// delete fence

// modify fence

//
// QUESTIONS
//


module.exports = api_router;
