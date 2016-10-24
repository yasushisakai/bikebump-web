import fs from 'fs';
import path from 'path';
import Point from './utilities/Point';
import Line from './utilities/Line';

export default class RoadMatching {

    constructor() {

        this.jsonPath = path.resolve(__dirname, '../', 'data');

        // this sits in memory
        this.roads = JSON.parse(fs.readFileSync(path.resolve(this.jsonPath, 'roads.json')));

        this.distanceThreshold = 30;

    }

    findClosestRoad(_point) {

        let closestRoad, closestPt, roadLine, minDistance = 100000000;

        // TODO: able to use huge reduce?

        this.roads.map((road, index)=> {

            if (road.geometry.type == "LineString") {

                // TODO : repeating code error prone

                for (let i = 0, l = road.geometry.coordinates.length - 1; i < l; ++i) {
                    let st = Point.fromArray(road.geometry.coordinates[i]);
                    let en = Point.fromArray(road.geometry.coordinates[i + 1]);
                    let line = new Line(st, en);

                    if (line.getLength() < 0.000000000001) {
                        continue;
                    }

                    let closePoint = line.getClosestPointTo(_point);
                    let distance = closePoint.distanceToInMeters(_point);
                    if (minDistance > distance) {
                        minDistance = distance;
                        closestRoad = road;
                        closestPt = closePoint;
                        roadLine = line;
                    }
                }

            } else {

                road.geometry.coordinates.map((partialRoad)=> {

                    // TODO: repeated code here

                    for (let i = 0, l = partialRoad.length - 1; i < l; ++i) {
                        let st = Point.fromArray(partialRoad[i]);
                        let en = Point.fromArray(partialRoad[i + 1]);
                        let line = new Line(st, en);

                        if (line.getLength() < 0.00000000001) {
                            continue;
                        }

                        let closePoint = line.getClosestPointTo(_point);
                        let distance = closePoint.distanceToInMeters(_point);
                        if (minDistance > distance) {
                            minDistance = distance;
                            closestRoad = road;
                            closestPt = closePoint;
                            roadLine = line;
                        }
                    }

                });

            }
        });

        let result = {};

        result.road = closestRoad;
        result.closestPt = closestPt;
        result.distance = minDistance;
        result.roadLine = roadLine;

        return result;

    }

    checkFenceJSON() {
        fs.readFile(path.resolve(this.jsonPath, 'fences.json'), (err, data)=> {

            if (err) {
                console.error(err);
            }

            let fences = JSON.parse(data);

            let newFences = [];

            fences.map((fence)=> {

                let pt = Point.fromLatLngObj(fence.coordinates);

                let closestRoad = this.findClosestRoad(pt);
                if (closestRoad.distance > this.distanceThreshold) { // threshold in meters
                    closestRoad = null; // geo fences far from roads will not have a closest road
                }

                if (fence.hasOwnProperty('closestRoad')) {

                    if (closestRoad == null) {
                        console.log('deleting existing closest road');

                        delete fence.closestRoad;


                    } else {

                        if (fence.closestRoad.road.id != closestRoad.road.id) {
                            console.log('different road assigned');

                            delete fence.closestRoad;
                            fence.closestRoad = closestRoad;
                        }
                    }

                } else {

                    if (closestRoad != null) {
                        console.log('assigning closest road');

                        fence.closestRoad = closestRoad;
                    }

                }

                newFences.push(fence);
            });

            fs.writeFile(path.resolve(this.jsonPath, 'fences.json'), JSON.stringify(newFences, null, 4), (err, data)=> {
                if (err) {
                    return Promise.resolve(err);
                }
            });
        });
    }

    refactorFenceJSON() {

        let newFences = [];

        fs.readFile(path.resolve(this.jsonPath, 'fences.json'), (err, data)=> {

            if (err) {
                console.error(err);
            }

            let fences = JSON.parse(data);

            fences.map((fence)=> {

                let answers = fence.answer;

                answers = answers.map((obj)=> {
                    let value = obj.answer;
                    delete obj.answer;
                    obj.value = value;
                    return obj;
                });

                delete fence.answer;
                fence.answers = answers;

                newFences.push(fence);
            });

            fs.writeFile(path.resolve(this.jsonPath, 'fences.json'), JSON.stringify(newFences, null, 4), (err, data)=> {
                if (err) console.error(err);
            });

            console.log('refactor complete');

        });


    }

}

module.exports = RoadMatching;