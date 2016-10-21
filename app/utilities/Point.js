/**
 * Created by yasushisakai on 10/20/16.
 */
import L from 'leaflet';


export default class Point extends L.Point {

    constructor(_x, _y) {
        super(_x, _y);
    }

    static fromArray(_arry){
        return new Point(_arry[0],_arry[1]);
    }

    static fromPointLeaflet(_LPoint) {
        return new Point(_LPoint.x, _LPoint.y);
    }

    subtract(_other) {
        return new Point(this.x - _other.x, this.y - _other.y);
    }

    add(_other) {
        return new Point(this.x + _other.x, this.y + _other.y);
    }

    divide(_scalar) {
        return new Point(this.x / _scalar, this.y / _scalar);
    }

    multiply(_scalar) {
        return new Point(this.x * _scalar, this.y * _scalar);
    }

    distanceTo(_point){
        return _point.subtract(this).getLength();
    }

    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    unitize() {

        let len = this.getLength();

        return new Point(this.x / len, this.y / len);
    }

    dot(_other) {
        return this.x * _other.x + this.y * _other.y;
    }

    angle(_other) {

        let unitizedSelf = this.unitize();
        let unitizedOther = _other.unitize();

        return Math.acos(unitizedSelf.dot(unitizedOther));

    }

}

module.exports = Point;