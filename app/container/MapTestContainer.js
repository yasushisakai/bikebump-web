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
export default class MapTestContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            location: [],
            fences: [],
            zoom: 20,
        };

        let mapbox_yasushi = {};
        mapbox_yasushi.url = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA';
        mapbox_yasushi.attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe';

        this.mapTile = {};
        this.mapTile.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
        this.mapTile.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';


        this.mapTile.url = mapbox_yasushi.url;
        this.mapTile.attribution = mapbox_yasushi.attribution

        this.icon = Leaflet.icon({
            iconUrl: Config.img_root() + 'white_cross.png',
            iconSize: [5, 5],
            iconAnchor: [3, 3]
        });


    }


    componentDidMount() {

        let promises = [];

        promises.push(Helpers.getFenceListFromAPI());
        promises.push(GeolocationHelpers.getGeoLocation());

        Promise.all(promises)
            .then((obj)=> {

                let location = [obj[1].latitude, obj[1].longitude];


                this.setState({
                    isLoading: false,
                    location: location,
                    fences: obj[0]
                });

            });

    }


    drawFence(fence) {

        // becareful of these
        //report.center = new Point(fence.coordinates.lat,fence.coordinates.lng);
        //report.radius = parseInt(fence.radius);

        //report.values = fence.answers.map((answer)=>{ return answer.value });

        const circleOffset = 2; // meters
        const parallelOffset = 0.00002;

        let center = new Point(fence.coordinates.lat, fence.coordinates.lng);
        let roadPoint = new Point(fence.closestRoad.closestPt.x, fence.closestRoad.closestPt.y);
        let roadLine = Line.fromObj(fence.closestRoad.roadLine);

        let centerToRoadLine = new Line(center, roadPoint);
        centerToRoadLine.en.move(centerToRoadLine.getDirection().unitize().multiply(-parallelOffset));


        let parallelLine = Line.fromPoint(centerToRoadLine.en, roadLine.getDirection(), 0.0001);


        let result = [];

        // marker
        result.push(<Marker key={fence.id+'-m'} position={center.toArray()} icon={this.icon}/>);

        let values = fence.answers.map((answer)=> {
            return answer.value;
        });

        let valueAve = values.reduce((prev, curr)=> {
                return prev + (curr / 3.0)
            }, 0) / values.length;

        result.push(<Polyline key={fence.id+'-pl'} positions={centerToRoadLine.getArray()} weight={1} opacity={0.2}
                              color="#FFFFFF"/>);

        result.push(<Polyline key={fence.id+'-plr'} positions={parallelLine.getArray()} weight={3} opacity={0.8}
                              color={Helpers.getColor(valueAve)}/>);


        // circles
        values.map((obj, index)=> {

            result.push(<Circle
                key={fence.id+'-a_'+index}
                center={center.toArray()}
                radius={parseInt(fence.radius)+index*circleOffset}
                color={Helpers.getColor(obj/3.0)}
                weight={2}
                opacity={1}
                fill={false}
            />)
        });

        return result;
    }

    drawFences() {

        return this.state.fences.map((fence)=> {
            return this.drawFence(fence);
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
                    {this.drawFences()}
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