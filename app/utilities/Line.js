import Point from './Point'
import Helpers from './Helpers';

export default class Line{

    constructor(_st,_en){
        this.st = _st;
        this.en = _en;
    }

    static fromPoint(_point,_direction,_length){
        // extends a point in front and back


        let unitizedDirection = _direction.unitize();
        let st = _point.add(unitizedDirection.multiply(_length*0.5));
        let en = _point.add(unitizedDirection.flip().multiply(_length*0.5));

        return new Line(st,en);

    }
    
    static fromObj(obj){

        return new Line(Point.fromObj(obj.st), Point.fromObj(obj.en));
    }

    getLength(){
        let delta = this.en.subtract(this.st);
        return Math.sqrt(Math.pow(delta.x,2)+Math.pow(delta.y,2));
    }
    
    getDirection(){
        return this.en.subtract(this.st);
    }

    getPointAt(_t){
        let delta = this.en.subtract(this.st);
        return delta.multiply(_t).add(this.st);
    }

    //
    // this will modify this
    //
    move(_vector){
        this.st.move(_vector);
        this.en.move(_vector);
    }
    
    getClosestPointTo(_point) {
        let len = this.getLength();

        let pointToEnd = this.en.subtract(_point);
        let angle = this.getDirection().angle(pointToEnd);


        let t = 1.0 - (pointToEnd.getLength() * Math.cos(angle) / len);

        t = Math.max(Math.min(1.0, t), 0.0);
        
        return this.getPointAt(t);

    }
    
    getArray(){
       return [this.st.toArray(),this.en.toArray()]
    }

}

module.exports = Line;
