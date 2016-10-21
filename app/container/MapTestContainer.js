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
            roadsToDraw: []
        };

        this.mapTile = {};
        this.mapTile.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
        this.mapTile.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

        //
        // a little test
        //

        this.home = new Point(42.355459, -71.103052);

    }


    componentDidMount() {

        let promises = [];

        promises.push(Helpers.getRoadsFromAPI());
        promises.push(GeolocationHelpers.getGeoLocation());

        Promise.all(promises)
            .then((obj)=> {

                let location = [obj[1].latitude, obj[1].longitude];

                //
                // lets see if we can get the closest!
                //

                let closestRoad, minDistance = 100000000;


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
                                }
                            }

                        });

                    }
                });


                this.setState({
                    isLoading: false,
                    location: location,
                    roads: obj[0],
                    roadsToDraw: [closestRoad]
                });

            });

    }

    drawLines() {

        return Road.flattenRoadObjs(this.state.roadsToDraw).map((road, index)=> {
            return <Polyline key={index} positions={road.getCoordinates()} weight={10} color="#FF0000"/>
        });

    }


    render() {
        let icon = Leaflet.icon({
            iconUrl: Config.img_root() + 'white_cross.png',
            iconSize: [10,10],
            iconAnchor:[5,5]
        });

        console.log(icon);

        if (this.state.isLoading) {
            return (
                <div id="map">Loading...</div>
            );
        } else {
            return (
                <Map center={this.state.location} zoom={this.state.zoom} style={{height: "100vh"}}>
                    <Marker position={[this.home.x,this.home.y]} icon={icon}/>
                    <Circle center={[this.home.x,this.home.y]} radius={10} weight={1} color="#FFFFFF" fill={false} />
                    {this.drawLines()}
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