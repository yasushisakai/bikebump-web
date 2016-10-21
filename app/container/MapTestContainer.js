// bikebump
// MapTestContainer
// 10/20/16
// by yasushisakai

import React, {Component} from 'react';
import Leaflet from 'leaflet';
import {Map, TileLayer, Polyline, Marker, Circle} from 'react-leaflet';
import Line from '../utilities/Line';
import Point from '../utilities/Point';
import Road from '../utilities/Road';

import Helpers from '../utilities/Helpers';
import GeolocationHelpers from '../utilities/GeoLocationHelper';

import Config from '../config';

//
// MapTestContainer class
//
export default class MapTestContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            location: [],
            roads: [],
            zoom: 20,
            roadsToDraw: [],
            reports: []
        };

        this.mapTile = {};
        this.mapTile.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
        this.mapTile.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

        this.icon = Leaflet.icon({
            iconUrl: Config.img_root() + 'white_cross.png',
            iconSize: [5, 5],
            iconAnchor: [3, 3]
        });


        //
        // a little test
        //

        this.home = new Point(42.355459, -71.103052);

        let p1 = new Point(0, 0);
        let p2 = new Point(4, 4);

        let line = new Line(p1, p2);

        let point = new Point(0, 2);

        let closestPoint = line.getClosestPointTo(point);


    }


    componentDidMount() {

        let promises = [];

        promises.push(Helpers.getRoadsFromAPI());
        promises.push(GeolocationHelpers.getGeoLocation());

        Promise.all(promises)
            .then((obj)=> {

                let location = [obj[1].latitude, obj[1].longitude];

                let closestRoad, closestPt = new Point(0, 0), roadLine, minDistance = 100000000;

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

                // information to know
                let report = {};
                report.center = this.home;
                report.radius = 10;
                report.roadPoint = closestPt;
                report.values = [3, 2, 1, 0, 3, 2,2,2,2];
                report.road = closestRoad.name;
                report.roadLine = roadLine;

                this.setState({
                    isLoading: false,
                    location: location,
                    roads: obj[0],
                    roadsToDraw: [closestRoad],
                    reports: [report]
                });

            });

    }


    drawReport(report) {

        const circleOffset = 2; // meters
        const parallelOffset = 0.00008;

        let centerToRoadLine = new Line(report.center, report.roadPoint);
        centerToRoadLine.en.move(centerToRoadLine.getDirection().unitize().multiply(-parallelOffset));
        
        let parallelLine = Line.fromPoint(centerToRoadLine.en, report.roadLine.getDirection(), 0.001);


        let result = [];

        // marker
        result.push(<Marker key={'marker'+0} position={report.center.toArray()} icon={this.icon}/>);


        let valueAve = report.values.reduce((prev,curr)=>{return prev+(curr/3.0)},0)/report.values.length;

        result.push(<Polyline key={'pl'+0} positions={centerToRoadLine.getArray()} weight={1} opacity={0.2}
                              color="#FFFFFF"/>);

        result.push(<Polyline key={'plr'+0} positions={parallelLine.getArray()} weight={2} opacity={1}
                              color={Helpers.getColor(valueAve)} />);


        // circles
        report.values.map((obj, index)=> {

            result.push(<Circle
                key={index}
                center={report.center.toArray()}
                radius={report.radius+index*circleOffset}
                color={Helpers.getColor(obj/3.0)}
                weight={1}
                opacity={1}
                fill={false}
            />)
        });

        return result;
    }


    render() {


        if (this.state.isLoading) {
            return (
                <div id="map">Loading...</div>
            );
        } else {
            return (
                <Map center={this.state.location} zoom={this.state.zoom} style={{height: "100vh"}}>
                    {this.drawReport(this.state.reports[0])}
                    <TileLayer
                        attribution={this.mapTile.attribution}
                        url={this.mapTile.url}
                    />
                </Map>
            );
        }
    }
}

MapTestContainer.propTypes = {};

MapTestContainer.defaultProps = {};