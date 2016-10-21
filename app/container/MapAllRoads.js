// bikebump
// MapTestContainer
// 10/20/16
// by yasushisakai

import React, {Component} from 'react';
import Leaflet from 'leaflet';
import {Map, TileLayer, Polyline, Marker, Circle} from 'react-leaflet';
import Line from '../utilities/Line';
import Point from '../utilities/Point';

import Helpers from '../utilities/Helpers';
import GeolocationHelpers from '../utilities/GeoLocationHelper';

import Config from '../config';

//
// MapTestContainer class
//
export default class MapAllRoads extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            location: [],
            roads: [],
            zoom: 15
        };

        this.mapTile = {};
        this.mapTile.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
        this.mapTile.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

        this.icon = Leaflet.icon({
            iconUrl: Config.img_root() + 'white_cross.png',
            iconSize: [5, 5],
            iconAnchor: [3, 3]
        });


    }


    componentDidMount() {

        let promises = [];

        promises.push(Helpers.getRoadsFromAPI());
        promises.push(GeolocationHelpers.getGeoLocation());

        Promise.all(promises)
            .then((obj)=> {

                let location = [obj[1].latitude, obj[1].longitude];


                this.setState({
                    isLoading: false,
                    location: location,
                    roads: obj[0]
                });

            });

    }


    drawRoad(road) {

        let roads = [];

        if(road.geometry.type == 'LineString'){
            roads.push(
                <Polyline key={road.id} positions={road.geometry.coordinates} weight={3} color="#0000FF"/>)
        }else{
            road.geometry.coordinates.map((segments,index)=>{

                roads.push(
                    <Polyline key={road.id+'-'+index} positions={segments} weight={3} color="#FF0000"/>
                )

                });

        }

        return roads;

    }

    drawRoads() {

        return this.state.roads.map((road)=> {
            return this.drawRoad(road);
        });
    }

    render() {


        if (this.state.isLoading) {
            return (
                <div id="map">Loading...</div>
            );
        } else {
            return (
                <Map center={this.state.location} zoom={this.state.zoom} style={{height: "100vh"}}>
                    {this.drawRoads()}
                    <TileLayer
                        attribution={this.mapTile.attribution}
                        url={this.mapTile.url}
                    />
                </Map>
            );
        }
    }
}

MapAllRoads.propTypes = {};

MapAllRoads.defaultProps = {};