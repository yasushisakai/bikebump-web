/**
 * bikebump
 * HeatMapContainer.jsx
 * by yasushisakai
 * 10/13/16
 */

import React, {Component} from 'react';

import MapComponent from '../components/HeatMapCompoment'
import axios from 'axios';
import Config from '../../app/settings/config';
import GeoLocationHelper from '../../helpers/GeoLocationHelper';

/**
 * MapContainer class
 */
export default class MapContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fences: [],
            lat: 42,
            lng: -71,
        };

        var promises = [];

        let config = Config(window);

        // get the list of fences
        // using old api calls
        promises.push(axios(config.api_root+'fences'));

        // get the current coordinates
        promises.push(GeoLocationHelper.getGeoLocation());
        Promise.all(promises).then(objs => {

            let fenceResults = [0,1,2,3].map(()=>{return []})

            for (let i = 0; i < objs[0].length; i++) {
                let coordinates = [objs[0][i].coordinates.lat,objs[0][i].coordinates.lng,];
                for (let j = 0; j < objs[0][i].answers.length; j++) {
                    if (objs[0][i].answers[j].question === '0') {
                        fenceResults[objs[0][i].answers[j].value].push(coordinates);
                    }
                }
            }

            this.setState({
                lat: objs[1].latitude,
                lng: objs[1].longitude,
                fences: fenceResults
            });

        });

    }

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