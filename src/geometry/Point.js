/**
 * Created by yasushisakai on 10/20/16.
 */
import Helpers from '../helpers/Helpers';
import GeoLocationHelpers from '../helpers/GeoLocationHelper';


export default class Point {

    constructor(_x, _y) {
        this.x = _x;
        this.y = _y;

        this.TILESIZE = 1000;

    }

    static fromArray(_arry) {
        return new Point(_arry[0], _arry[1]);
    }

    static fromObj(obj) {
        return new Point(obj.x, obj.y);
    }

    static fromLatLngObj(obj){
        return new Point(obj.lat,obj.lng);
    }

    flip() {
        return new Point(-this.x, -this.y);
    }

    subtract(_other) {
        return new Point(this.x - _other.x, this.y - _other.y);
    }

    add(_other) {

        if (typeof _other === 'number') {
            return new Point(this.x + _other, this.y + _other);

        } else {
            return new Point(this.x + _other.x, this.y + _other.y);

        }
    }

    move(_point) {
        this.x += _point.x;
        this.y += _point.y;
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

    distanceToInMeters(_latLng){
        // this assumes that you are using LatLng values;

        return GeoLocationHelpers.distFromLatLng(this.x,this.y,_latLng.x,_latLng.y);
    }

    distanceToWorld(_point) {
        return _point.latLngToWorld().subtract(this.latLngToWorld()).getLength();
    }

    getLength() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    unitize() {

        let len = this.getLength();

        return new Point(this.x / len, this.y / len);
    }

    latLngToWorld() {
        let sinY = Math.sin(Helpers.toRadians(this.x));

        sinY = Math.min(Math.max(sinY, -0.9999), 0.9999);

        return new Point(
            this.TILESIZE * (0.5 + this.y / 360.0),
            this.TILESIZE * (0.5 - Math.log((1 + sinY) / (1 - sinY)) / (4 * Math.PI))
        );
    }

    worldToLatLng() {
        let lng = ((this.x / this.TILESIZE) - 0.5) * 360.0;
        let rady = Math.exp((this.y / this.TILESIZE - 0.5) * -(4.0 * Math.PI));

        return new Point(
            Math.asin((rady - 1) / (rady + 1)) * 180 / Math.PI,
            lng
        )
    }


    dot(_other) {
        return this.x * _other.x + this.y * _other.y;
    }

    angle(_other) {

        let unitizedSelf = this.unitize();
        let unitizedOther = _other.unitize();

        return Math.acos(unitizedSelf.dot(unitizedOther));

    }

    toArray() {
        return [this.x, this.y];
    }

}

module.exports = Point;