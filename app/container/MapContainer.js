// bikebump
// MapContainer
// 10/13/16
// by yasushisakai

import React, {Component} from 'react';

import Map from '../components/Map'

//
// MapContainer class
//
export default class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    // getInitialState(){}
    // componentDidMount(){}
    // componentDidUpdate(){}
    // componentWillUnmount(){}

    render() {
        return (
          <Map/>
        );
    }
}

MapContainer.propTypes = {};

MapContainer.defaultProps = {};