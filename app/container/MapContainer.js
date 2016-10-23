// bikebump
// MapTestContainer
// 10/20/16
// by yasushisakai

import React, {Component} from 'react';
import Leaflet from 'leaflet';
import {Map, TileLayer, Polyline, Marker, Circle} from 'react-leaflet';
import Line from '../utilities/Line';
import Point from '../utilities/Point';
import Loading from '../components/Loading';

import Helpers from '../utilities/Helpers';
import GeolocationHelpers from '../utilities/GeoLocationHelper';

import Config from '../config';


//
// MapTestContainer class
//
export default class MapContainer extends Component {


    constructor(props) {
        super(props);

        this.circleOffset = 2.0; // meters, space between the report circles
        // TODO: show them in actual metrics meters?
        this.parallelOffset = 0.000025; // the offset distance from the road to the side (in latlng)
        this.closeLineLength = 0.00020; // length of the closest Road Line (in latlng)
        this.markerIcon = Leaflet.icon({
            iconUrl: Config.img_root() + 'white_cross.png',
            iconSize: [5, 5],
            iconAnchor: [3, 3]
        });

        this.state = {
            isLoading: true,
            location: [],
            zoom: 16,
            fenceHash: '' // we just need this
        };

        this.fences = [];

        let mapbox_yasushi = {};
        mapbox_yasushi.url = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA';
        mapbox_yasushi.attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe';

        this.mapTile = {};
        this.mapTile.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
        this.mapTile.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

        if(Config.isRemote()) {
            this.mapTile.url = mapbox_yasushi.url;
            this.mapTile.attribution = mapbox_yasushi.attribution
        }
    }


    componentDidMount() {

        let promises = [];

        promises.push(Helpers.getFenceListFromAPI());
        promises.push(GeolocationHelpers.getGeoLocation());

        Promise.all(promises)
            .then((obj)=> {

                let location = [obj[1].latitude, obj[1].longitude];

                this.fences = obj[0].fences;

                this.setState({
                    isLoading: false,
                    location: location,
                    fenceHash: obj[0].hash
                });

            });

    }

    drawClosestRoad(fence, averageValue) {

        let tags = [];

        let roadPoint = new Point(fence.closestRoad.closestPt.x, fence.closestRoad.closestPt.y);
        let roadLine = Line.fromObj(fence.closestRoad.roadLine);

        let centerToRoadLine = new Line(Point.fromLatLngObj(fence.coordinates), roadPoint);

        centerToRoadLine.en.move(centerToRoadLine.getDirection().unitize().multiply(-this.parallelOffset));

        let parallelLine = Line.fromPoint(centerToRoadLine.en, roadLine.getDirection(), this.closeLineLength);


        tags.push(<Polyline key={fence.id+'-pl'} positions={centerToRoadLine.getArray()} weight={1} opacity={0.2}
                            color="#FFFFFF" lineCap="butt"/>);

        tags.push(<Polyline key={fence.id+'-plr'} positions={parallelLine.getArray()} weight={3} opacity={0.8}
                            color={Helpers.getColor(averageValue)} lineCap="butt"/>);


        return tags;

    }


    drawFence(fence) {

        let tags = []; // this will contain the react tags

        let center = Point.fromLatLngObj(fence.coordinates);
        let values = fence.answers.map((answer)=> {
            return answer.value;
        });
        let valueAverage = values.reduce((prev, curr)=> {
                return prev + (curr / 3.0)
            }, 0) / values.length;

        //
        // closest road indicator (if it has one)
        //
        if (fence.hasOwnProperty('closestRoad')) {
            tags.push(...this.drawClosestRoad(fence, valueAverage));
        }

        //
        // circles
        //
        values.map((obj, index)=> {

            tags.push(<Circle
                key={fence.id+'-a_'+index}
                center={center.toArray()}
                radius={parseInt(fence.radius)+index*this.circleOffset}
                color={Helpers.getColor(obj*0.33333)}
                weight={2}
                opacity={0.3}
                fill={false}
            />)
        });

        //
        // marker (x)
        //
        tags.push(<Marker key={fence.id+'-m'} position={center.toArray()} icon={this.markerIcon}/>);

        return tags;
    }

    drawFences() {

        console.log(this.fences.length);

        return this.fences.map((fence)=> {
            return this.drawFence(fence);
        });

    }

    render() {

        if (this.state.isLoading) {
            return (
                <Loading text=""/>
            );
        } else {
            return (
                <Map center={this.state.location} zoom={this.state.zoom} maxZoom={20} style={{height: "100vh"}}>
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

MapContainer.propTypes = {};

MapContainer.defaultProps = {};