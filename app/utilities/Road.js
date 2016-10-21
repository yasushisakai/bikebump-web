/**
 * Created by yasushisakai on 10/20/16.
 */
export default class Road {

    constructor(_roadObj) {
        this.id = _roadObj.id;
        this.segmentId = 0;
        this.name = _roadObj.name;
        this.type = _roadObj.type;
        this.width = _roadObj.width;
        this.coordinates = _roadObj.geometry.coordinates;
        this.lineType = _roadObj.geometry.type;
    }

    static fromMultiLineString(_multiRoadObj) {
        let roads = _multiRoadObj.geometry.coordinates.map((lineString, index)=> {

            let road = {};
            road.id = _multiRoadObj.id;
            road.segmentId = index;
            road.name = _multiRoadObj.name;
            road.type = _multiRoadObj.type;
            road.width = _multiRoadObj.width;
            road.coordinates = lineString;
            road.lineType = "MultiLineString";


            return new Road(road);

        });

        return roads;
    }

    static flattenRoadObjs(_chunk) {
        let roads = [];

        _chunk.map((road)=> {
            if (road.geometry.type == 'LineString') {
                roads.push(new Road(road));
            }else{
                Road.fromMultiLineString(road).map((obj)=>{
                    obj.push(new Road(obj));
                })
            }
        })

        return roads;
    }

    getUniqueId(){
        return this.id+'-'+this.segmentId;
    }

    getCoordinates() {
        return this.coordinates;
    }

}