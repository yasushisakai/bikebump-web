var express = require('express');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');

var Point = require('./utilities/Point');

var json_path = path.resolve(__dirname, '../', 'data');
var api_router = express.Router();


var RoadMatcher = require('./roadMatching');

var roadMatcher = new RoadMatcher();

// TODO:rewrite in es2015 or es6

api_router.get('/', (req, res)=> {
    res.json({
        message: "root of api"
    });
});

//
// FENCES
//

// get fences
api_router.get('/fences', (req, res)=> {
    fs.readFile(path.resolve(json_path, 'fences.json'), (err, data)=> {
        if (err) console.error(err);
        else {
            res.json(JSON.parse(data));
        }
    });
});

//
// add fence
//

api_router.get('/fences/add', (req, res)=> {

    //
    // example url fences/add?u=userid&lat=49&lng=-71&r=10&a=2
    //

    // read the file
    var fences_path = path.resolve(json_path, 'fences.json');

    fs.readFile(fences_path, (err, data)=> {
        if (err) console.error(err);

        var fences = JSON.parse(data);

        var latitude = parseFloat(req.query.lat);
        var longitude = parseFloat(req.query.lng);
        var newFence = {
            id: uuid.v4(), // overkill??
            userid: req.query.u,
            coordinates: {lat: latitude, lng: longitude},
            radius: req.query.r,
            answers: [
                {
                    userid: req.query.u,
                    question: '0',
                    value: parseInt(req.query.a),
                    timestamp: Date.now() // TODO: redundant !!
                }
            ],
            timestamp: Date.now()
        };

        // get the closest Road info
        var closestRoad = roadMatcher.findClosestRoad(new Point(latitude,longitude));
        newFence.closestRoad = closestRoad;


        // push it
        fences.push(newFence);

        // and rewrite it
        fs.writeFile(fences_path, JSON.stringify(fences, null, 4), (err)=> {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(newFence); // we don't want to resend the whole fence again
        });
    });

    console.log('added a fence');

});

//
// append response
//
api_router.get('/fences/:id/append', (req, res)=> {

    //
    // example url fences/:id/append?u=userid&q=0&a=2
    //

    // read the file
    var fences_path = path.resolve(json_path, 'fences.json');

    fs.readFile(fences_path, (err, data)=> {
        if (err) console.error(err);

        var fences = JSON.parse(data);

        for (var i = 0; i < fences.length; i++) {
            if (fences[i].id === req.params.id) {
                fences[i].answers.push({
                    userid: req.query.u,
                    question: req.query.q,
                    value: parseInt(req.query.a),
                    timestamp: Date.now()
                });
                break;
            }
        }

        // and rewrite it
        fs.writeFile(fences_path, JSON.stringify(fences, null, 4), (err)=> {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            res.json(fences[i]); // we don't want to resend the whole fence again
        });
    });

});


//
// flush
//
api_router.get('/fences/flush', (req, res)=> {
    var fences_path = path.resolve(json_path, 'fences.json');
    fs.writeFile(fences_path, JSON.stringify([]), (err)=> {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.json([]);
    });
});

// add answer to existing fence
api_router.get('/fences/answer', (req, res)=> {

    // TODO: implement answer amendment
    // design question on model

});

// delete fence

// modify fence

//
// QUESTIONS
//

// get questions
api_router.get('/questions', (req, res)=> {
    fs.readFile(path.resolve(json_path, 'questions.json'), (err, data)=> {
        if (err) console.error(err);
        else {
            res.json(JSON.parse(data));
        }
    });
});

// get question from id
api_router.get('/questions/:id', (req, res)=> {
    fs.readFile(path.resolve(json_path, 'questions.json'), (err, data)=> {
        if (err) console.error(err);
        else {
            var question = JSON.parse(data)[parseInt(req.params.id)];
            res.json(question);
        }
    });
});

// get child question from parent id
api_router.get('/questions/:id/children', (req, res)=> {
    fs.readFile(path.resolve(json_path, 'questions.json'), (err, data)=> {
        if (err) console.error(err);
        else {
            var questions_json = JSON.parse(data);

            // include if the parent_id matches
            var child_questions = questions_json.filter((q) => {
                return q.parent_id == req.params.id
            });

            res.json(child_questions);
        }
    });
});

//
// roads data was taken from OSM using Nina's geobits
//

api_router.get('/roads', (req, res)=> {
    fs.readFile(path.resolve(json_path, 'roads.json'), (err, data)=> {
        if (err) console.error(err);
        else {
            res.json(JSON.parse(data));
        }
    });
});


module.exports = api_router;
