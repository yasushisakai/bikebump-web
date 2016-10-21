/**
 * Created by yasushisakai on 10/20/16.
 */
export default class Plyline{

    constructor(_lines){
        this.lines = _lines;
    }

    pushLineSegment(_line){
        _line;
    }

    closestPt(_point){
        let closestPt,closestIndex,minDistance=10000000000;

        this.lines.map((line,index)=>{
            let closePoint = line.getClosestPointTo(_point);
            let tempDistance = _point.distanceTo(closePoint);

            if(minDistance > tempDistance){
                minDistance = tempDistance;
                closestPt = closePoint;
                closestIndex = index;
            }

        });

        return {closestPoint:closestPt,index:closestIndex,distance:minDistance};

    }



}

module.exports = Plyline;