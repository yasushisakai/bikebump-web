// bikebump
// MapComponent
// by yasushisakai
// 10/13/16

import React from 'react'

import {Map, TileLayer,Circle} from 'react-leaflet';


//
// MapComponent Stateless Function
//
export default function MapComponent(props) {

    let position = [props.lat,props.lng];

    let url = 'https://api.mapbox.com/styles/v1/yasushisakai/ciu8srn4u002v2jrxc81ty7as/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoieWFzdXNoaXNha2FpIiwiYSI6ImNpdThwajN1ZTAwNjUzM28weHRuMnJ4a2kifQ.ooHi0pGR-SdDraWzTRCoVA';

    let fences = props.fences.map(pos=>{
       return(<Circle center={[pos[0],pos[1]]} radius={10}/>);
    });


    return (
        <div className="map">
            {props.children}
            <Map center={position} zoom={props.zoom} style={{height:"100vh"}}>
                <TileLayer
                    attribution="&copy; Mapbox &copy; OpenStreetMap &copy; DigitalGlobe"
                    url= 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {fences}
            </Map>
        </div>

    );
};

MapComponent.propTypes = {
    lat : React.PropTypes.number.isRequired,
    lng : React.PropTypes.number.isRequired,
    zoom : React.PropTypes.number.isRequired
};

MapComponent.defaultProps = {
    zoom: 15
};