import fs from 'fs';
import path from 'path';
import Point from './utilities/Point';

export default class RoadMatching{

    constructor(){

        // this sits in memory
        this.roads = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../','data','roads.json')));
        
    }


    findClosestRoad(){

        let closestRoad, closestPt, roadLine, minDistance = 100000000;

        // TODO: able to use huge reduce?

        obj[0].map((road, index)=> {

            if (road.geometry.type = "LineString") {

                for (let i = 0, l = road.geometry.coordinates.length - 1; i < l; ++i) {
                    let st = Point.fromArray(road.geometry.coordinates[i]);
                    let en = Point.fromArray(road.geometry.coordinates[i + 1]);
                    let line = new Line(st, en);

                    let closePoint = line.getClosestPointTo(this.home);
                    let distance = closePoint.distanceTo(this.home);
                    if (minDistance > distance) {
                        minDistance = distance;
                        closestRoad = road;
                        closestPt = closePoint;
                        roadLine = line;
                    }
                }

            } else {

                road.geometry.coordinates.map((partialRoad)=> {

                    for (let i = 0, l = partialRoad.length - 1; i < l; ++i) {
                        let st = Point.fromArray(partialRoad[i]);
                        let en = Point.fromArray(partialRoad[i + 1]);
                        let line = new Line(st, en);

                        let closePoint = line.getClosestPointTo(this.home);
                        let distance = closePoint.distanceTo(this.home);
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


    }


    

    
    
}

let roadMatching = new RoadMatching();

module.exports = RoadMatching;