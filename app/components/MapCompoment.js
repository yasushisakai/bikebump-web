// bikebump
// MapComponent
// by yasushisakai
// 10/13/16

import React from 'react'

import {Map, TileLayer, Circle} from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer'

//
// MapComponent Stateless Function
//
export default function MapComponent(props) {

    let position = [props.lat, props.lng];


    //
    // we are displaying four heatmaps in different color
    //

    let heatmaps = [];

    // simple single color gradients
    let gradients = [
        {0.0: 'green', 1.0: 'green'},
        {0.0: 'yellow', 1.0: 'yellow'},
        {0.0: 'orange', 1.0: 'orange'},
        {0.0: 'red', 1.0: 'red'}
    ];

    if (props.fences.length != 0) {
        for (let i = 0; i < 4; i++) {
            heatmaps.push(
                <HeatmapLayer
                    key={i}
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={props.fences[i]}
                    latitudeExtractor={p=>p[0]}
                    longitudeExtractor={p=>p[1]}
                    intensityExtractor={()=> 1.0}
                    radius={10}
                    blur={100}
                    max={100}
                    gradient={gradients[i]}
                />
            );
        }
    }

    //
    // here we have some map tile styles
    //

    let normal = {};
    normal.url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    normal.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and the Contributers';

    let mapbox_yasushi = {};
    mapbox_yasushi.url = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA';
    mapbox_yasushi.attribution = '&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe';

    let darkmap = {};
    darkmap.url = 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png';
    darkmap.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

    // let fences = props.fences.map(pos=>{
    //    return(<Circle center={[pos[0],pos[1]]} radius={10}/>);
    // });

    return (
        <div className="map">
            {props.children}
            <Map center={position} zoom={props.zoom} style={{height: "100vh"}}>

                { heatmaps.length === 0 ?
                    null :
                    heatmaps
                }
                <TileLayer
                    attribution={darkmap.attribution}
                    url={darkmap.url}
                />

            </Map>
        </div>

    );
};

MapComponent.propTypes = {
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
    zoom: React.PropTypes.number.isRequired,
    fences: React.PropTypes.array.isRequired
};

MapComponent.defaultProps = {
    zoom: 15
};