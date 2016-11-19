let Point=require('./Point');

class Line{

    constructor(_st,_en){
        this.st = _st;
        this.en = _en;
    }

    static fromPoint(_point,_direction,_length){
        // extends a point in both directions

        let unitizedDirection = _direction.unitize();
        let st = _point.add(unitizedDirection.multiply(_length*0.5));
        let en = _point.add(unitizedDirection.flip().multiply(_length*0.5));

        return new Line(st,en);

    }
    
    static fromObj(obj){
        return new Line(Point.fromObj(obj.st), Point.fromObj(obj.en));
    }

    static fromArray(_stArry,_enArry){
        return new Line(Point.fromArray(_stArry),Point.fromArray(_enArry));
    }

    getLength(){
        return this.st.distanceTo(this.en);
    }

    getLengthInMeters(){
        return this.st.distanceToInMeters(this.en);
    }
    
    getDirection(){
        return this.en.subtract(this.st);
    }

    getPointAt(_t){
        let delta = this.en.subtract(this.st);
        return delta.multiply(_t).add(this.st);
    }

    //
    // this will modify the line!
    //
    move(_vector){
        this.st.move(_vector);
        this.en.move(_vector);
    }
    
    getClosestPointTo(_point) {

        //
        // this assumes every thing is in lat lng coordinates
        // converts to world coordinates and compares them
        //

        let meInWorld = new Line(this.st.latLngToWorld(),this.en.latLngToWorld());
        let ptInWorld = _point.latLngToWorld();
        
        let len = meInWorld.getLength();

        let pointToEnd = meInWorld.en.subtract(ptInWorld);
        let angle = meInWorld.getDirection().angle(pointToEnd);


        let t = 1.0 - (pointToEnd.getLength() * Math.cos(angle) / len);

        t = Math.max(Math.min(1.0, t), 0.0);
        
        return this.getPointAt(t);

    }
    
    getArray(){
       return [this.st.toArray(),this.en.toArray()]
    }

}

module.exports = Line;
