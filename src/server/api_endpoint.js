import express from 'express';
import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import Point from '../geometry/Point';
import RoadHelper from '../helpers/RoadHelper';

const dataPath = path.resolve(__dirname, '../../', 'data');
const roadHelper = new RoadHelper();



export let endpoints = express.Router();

endpoints.get('/', (req, res)=> {
    res.json([
        'root of api',
    ]);
});


// ______
// |  ____|
// | |__ ___ _ __   ___ ___
// |  __/ _ \ '_ \ / __/ _ \
// | | |  __/ | | | (_|  __/
// |_|  \___|_| |_|\___\___|

// this variable will be on memory,
// changes when the fence.json is modified
let fenceHash = uuid.v4();

const fencePath = path.resolve(dataPath, 'fences.json');
let fences = JSON.parse(fs.readFileSync(fencePath));


//
// check fence hash
// ..api/fence/check?hash=109156be-c4fb-41ea-b1b4-efe1671c5836
//
endpoints.get('/fences/check/', (req, res)=> {
    res.json({result: req.query.hash == fenceHash});
});


//
// get all fences
// ..api/fences
//
endpoints.get('/fences', (req, res)=> {

    let result = {};
    result.hash = fenceHash;
    result.fences = fences;

    res.json(result);

});


//
// add a fence
// api/fences/add?u=userid&lat=49&lng=-71&r=10&a=2
//
endpoints.get('/fences/add', (req, res)=> {

    let latitude = parseFloat(req.query.lat);
    let longitude = parseFloat(req.query.lng);

    let newFence = {
        id: uuid.v4(),
        userid: req.query.u,
        coordinates : {lat:latitude,lng:longitude},
        radius: req.query.r,
        answers:[
            {
                userid:req.query.id,
                question: '0',
                value: parseInt(req.query.a),
                timestamp:Data.now()
            },
        ],
        timestamp:Date.now()
    };


    // get the closest road, add it to the object if close enough
    let closestRoad = roadHelper.findClosest(new Point(latitude,longitude));
    if(closestRoad.distance < roadHelper.distanceThreshold){
        newFence.closestRoad = closestRoad;
    }

    fences.push(newFence);

    // refresh the hash
    fenceHash = uuid.v4();

    res.json({hash:fenceHash, newFence:newFence});

    // write it
    fs.writeFile(fencePath,JSON.stringify(fences,null,4),(err)=>{
        if(err){
            console.log(err);
            process.exit(1);
        }
    })

});


//
// add a response to an existing fence
// api/fences/:id/append?u=userid&q=10&a=2
//
endpoints.get('/fences/:id/append',(req,res)=>{
    let fenceIndex = fences.findIndex((fence)=>{
        return fence.id === req.params.id;
    });

    let newFence = fences[fenceIndex].answers.push({
        userid:req.query.u,
        question:req.query.q,
        value:parseInt(req.query.a),
        timestamp:Date.now()
    });

    fences.splice(fenceIndex,1,newFence);

    fenceHash = uuid.v4();

    res.json({hash:fenceHash});

    fs.writeFile(fencePath,JSON.stringify(fences,null,4),(err)=>{
        if(err){
            console.error(err);
            process.exit(1);
        }

    });

});


//   ____                  _   _
//  / __ \                | | (_)
// | |  | |_   _  ___  ___| |_ _  ___  _ __  ___
// | |  | | | | |/ _ \/ __| __| |/ _ \| '_ \/ __|
// | |__| | |_| |  __/\__ \ |_| | (_) | | | \__ \
//  \___\_\\__,_|\___||___/\__|_|\___/|_| |_|___/

let questionsPath = path.resolve(dataPath,'roads.json');
let questions = JSON.parse(fs.readFileSync(questionsPath));

//
// get all questions
//
endpoints.get('/questions',(req,res)=>{
   res.json(questions);
});


//
// get one question by id
// ..api/questions/0
//
endpoints.get('/questions/:id',(req,res)=>{
    res.json(questions[parseInt(req.params.id)]);
});

//
// get child questions from parent_id
// ..api/questions/:id/children
endpoints.get('/questions/:id/children',(req,res)=>{
   res.json(questions.filter((question)=>{
        return question.parent_id == req.params.id;
   }));
});



//  _    _
// | |  | |
// | |  | |___  ___ _ __ ___
// | |  | / __|/ _ \ '__/ __|
// | |__| \__ \  __/ |  \__ \
//  \____/|___/\___|_|  |___/




//  _____                 _
// |  __ \               | |
// | |__) |___   __ _  __| |___
// |  _  // _ \ / _` |/ _` / __|
// | | \ \ (_) | (_| | (_| \__ \
// |_|  \_\___/ \__,_|\__,_|___/




module.exports = endpoints;