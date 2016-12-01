const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const axios = require('axios');
const Point = require('../geometry/Point');
const RoadHelper = require('../helpers/RoadHelper');

const dataPath = path.resolve(__dirname, '../../', 'data');
const roadHelper = new RoadHelper();

let endpoints = express.Router();

endpoints.get('/', (req, res)=> {
    res.json([
        'root of api',
    ]);
});


/** ______
 * |  ____|
 * | |__ ___ _ __   ___ ___
 * |  __/ _ \ '_ \ / __/ _ \
 * | | |  __/ | | | (_|  __/
 * |_|  \___|_| |_|\___\___|
 */
const fencePath = path.resolve(dataPath, 'fences.json');
let fences = JSON.parse(fs.readFileSync(fencePath)); // sits in memory
let fenceHash = uuid.v4(); // changes each time 'fences' is modified


/**
 * check fence hash
 * ..api/fence/check?hash=109156be-c4fb-41ea-b1b4-efe1671c5836
 */
endpoints.get('/fences/check/', (req, res)=> {
    res.json({result: req.query.hash == fenceHash});
});


/**
 * get all fences
 * ..api/fences
 */
endpoints.get('/fences', (req, res)=> {

    let result = {};
    result.hash = fenceHash;
    result.fences = fences;

    res.json(result);

});


/**
 * add a fence
 * api/fences/add?u=userid&lat=49&lng=-71&r=10&a=2
 */
endpoints.get('/fences/add', (req, res)=> {

    let latitude = parseFloat(req.query.lat);
    let longitude = parseFloat(req.query.lng);

    let newFence = {
        id: uuid.v4(),
        userid: req.query.u,
        coordinates: {lat: latitude, lng: longitude},
        radius: req.query.r,
        answers: [
            {
                userid: req.query.id,
                question: '0',
                value: parseInt(req.query.a),
                timestamp: Date.now()
            },
        ],
        timestamp: Date.now()
    };


    // get the closest road, add it to the object if close enough
    let closestRoad = roadHelper.findClosest(new Point(latitude, longitude));
    if (closestRoad.distance < roadHelper.distanceThreshold) {
        newFence.closestRoad = closestRoad;
    }

    fences.push(newFence);

    fenceHash = uuid.v4(); // update hash

    res.json({hash: fenceHash, newFence: newFence});

    fs.writeFile(fencePath, JSON.stringify(fences, null, 4), (err)=> {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    })

});


/**
 * add a response to an existing fence
 * api/fences/:id/append?u=userid&q=10&a=2
 */
endpoints.get('/fences/:id/append', (req, res)=> {
    let fenceIndex = fences.findIndex((fence)=> {
        return fence.id === req.params.id;
    });

    let newFence = fences[fenceIndex].answers.push({
        userid: req.query.u,
        question: req.query.q,
        value: parseInt(req.query.a),
        timestamp: Date.now()
    });

    fences.splice(fenceIndex, 1, newFence);

    fenceHash = uuid.v4();

    res.json({hash: fenceHash});

    fs.writeFile(fencePath, JSON.stringify(fences, null, 4), (err)=> {
        if (err) {
            console.error(err);
            process.exit(1);
        }

    });

});


/**  ____                  _   _
 *  / __ \                | | (_)
 * | |  | |_   _  ___  ___| |_ _  ___  _ __  ___
 * | |  | | | | |/ _ \/ __| __| |/ _ \| '_ \/ __|
 * | |__| | |_| |  __/\__ \ |_| | (_) | | | \__ \
 *  \___\_\\__,_|\___||___/\__|_|\___/|_| |_|___/
 */
let questionsPath = path.resolve(dataPath, 'questions.json');
let questions = JSON.parse(fs.readFileSync(questionsPath));

/**
 * get all questions
 */
endpoints.get('/questions', (req, res)=> {
    res.json(questions);
});


/**
 * get one question by id
 * ..api/questions/0
 */
endpoints.get('/questions/:id', (req, res)=> {
    res.json(questions[parseInt(req.params.id)]);
});

/**
 * get child questions =require(parent_id
 * ..api/questions/:id/children
 */
endpoints.get('/questions/:id/children', (req, res)=> {
    res.json(questions.filter((question)=> {
        return question.parent_id == req.params.id;
    }));
});


/** _    _
 * | |  | |
 * | |  | |___  ___ _ __ ___
 * | |  | / __|/ _ \ '__/ __|
 * | |__| \__ \  __/ |  \__ \
 *  \____/|___/\___|_|  |___/
 */

/**
 * verify tokens
 * This gets user info
 * by giving id_token and access_token from
 * googleUser.getAuthResponse()
 *
 * Note that this limits handling data in the
 * backend and will not return user data
 * to the client.
 * (wasn't sure it was the right thing to do)
 */

//FIXME: should be using POST??
endpoints.get('/users/verify', (req, res)=> {
    let access_token = req.query.atok;

    // we need another request to the server using the access_token
    // FIXME: again, should be a using POST??
    axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + access_token)
        .then((response)=> {
            // I think the 'sub' field is the 'unique id' that doesn't expire...
            console.log(response.data)

        });
});

/**
 * add Users
 * ..api/users/add?username=
 */

// TODO: Issue #20

/** _____                 _
 * |  __ \               | |
 * | |__) |___   __ _  __| |___
 * |  _  // _ \ / _` |/ _` / __|
 * | | \ \ (_) | (_| | (_| \__ \
 * |_|  \_\___/ \__,_|\__,_|___/
 */

/**
 * get road data
 * ..api/roads
 */
endpoints.get('/roads', (req, res)=> {
    res.json(roadHelper.roads);
});


module.exports = endpoints;