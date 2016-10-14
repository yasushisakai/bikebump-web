// bikebump
// MapContainer
// 10/13/16
// by yasushisakai

import React, {Component} from 'react';

import MapComponent from '../components/MapCompoment'
import QuestionContainer from './QuestionContainer';

import GeoLocationHelper from '../utilities/GeoLocationHelper'

//
// MapContainer class
//
export default class MapContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fences: [],
            lat : 42,
            lng: -71,
        };

        console.log(this.state.lat);
        GeoLocationHelper.getGeoLocation()
            .then(function(position){
                this.setState({
                    lat:position.latitude,
                    lng:position.longitude
                });
            }.bind(this));

        QuestionContainer.getFenceListFromAPI()
            .then((data)=>{
                let coordinates = data.map(obj=>{
                   return [obj.coordinates.lat,obj.coordinates.lng]
                });

                this.setState({
                    fences:coordinates
                })
            })

    }

    componentDidMount(){
    }

    // componentDidMount(){}
    // componentDidUpdate(){}
    // componentWillUnmount(){}


    render() {

        console.log(this.state.lat);

        return (
          <MapComponent lat={this.state.lat} lng={this.state.lng} fences={this.state.fences}/>
        );
    }
}

MapContainer.propTypes = {};

MapContainer.defaultProps = {};