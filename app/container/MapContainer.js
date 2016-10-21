// bikebump
// MapContainer
// 10/13/16
// by yasushisakai

import React, {Component} from 'react';

import MapComponent from '../components/MapCompoment'
import QuestionContainer from './QuestionContainer';
import axios from 'axios';

import GeoLocationHelper from '../utilities/GeoLocationHelper';
import Helper from '../utilities/Helpers';

//
// MapContainer class
//
export default class MapContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fences: [],
            lat: 42,
            lng: -71,
        };

        var promises = [];

        // get the list of fences
        promises.push(Helper.getFenceListFromAPI());

        // get the current coordinates
        promises.push(GeoLocationHelper.getGeoLocation());
        Promise.all(promises).then(objs => {

            let fenceResults = [0,1,2,3].map(()=>{return []});
            
            for (let i = 0; i < objs[0].length; i++) {
                let coordinates = [objs[0][i].coordinates.lat,objs[0][i].coordinates.lng,];
                for (let j = 0; j < objs[0][i].answers.length; j++) {
                    if (objs[0][i].answers[j].question === '0') {
                        fenceResults[objs[0][i].answers[j].value].push(coordinates);
                    }
                }
            }

            console.log(fenceResults);

            this.setState({
                lat: objs[1].latitude,
                lng: objs[1].longitude,
                fences: fenceResults
            });

        });

    }

    // componentDidMount() {
    // }

    // componentDidMount(){}
    // componentDidUpdate(){}
    // componentWillUnmount(){}


    render() {

        return (
            <MapComponent lat={this.state.lat} lng={this.state.lng} fences={this.state.fences}/>
        );
    }
}

MapContainer.propTypes = {};

MapContainer.defaultProps = {};