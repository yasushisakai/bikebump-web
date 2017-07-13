// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { contents } from 'styles/styles.css';
import { Map } from 'immutable';
import { darkTile } from 'config/constants';
import leaflet from 'leaflet';
// import mapzen from 'mapzen.js'
import { defaultCircleStyle, defaultRoadStyle } from 'helpers/mapUtils';
import { extractActionCreators, isModuleStale } from 'helpers/utils';

import * as dingActionCreators from 'modules/dings';
import { type LatLng, type Ding } from 'types';

type MapAndStreetViewProps = {
    latestFetchAttempt: number,
    latestLocation: LatLng,

    isFetching: boolean,
    dingId: string,
    ding: Map<any, any>,

    handleFetchingDing: Function,
}

class MapAndStreetViewContainer extends React.Component<void, MapAndStreetViewProps, void> {
    constructor (props) {
        super(props);
        this.drawCircles = this.drawCircles.bind(this);
    }

    componentWillMount () {
    // fetching
        this.props.handleFetchingDing(this.props.dingId);
    }

    componentDidMount () {
    // init map
        let position;
        if (isModuleStale(this.props.latestFetchAttempt)) {
            // latest location fetch was long ago
            position = [42.3602747, -71.0872227];
        } else {
            // fresh location!
            position = [
                parseFloat(this.props.latestLocation.lat),
                parseFloat(this.props.latestLocation.lng),
            ];
        }

        this.map = leaflet.map('tinyMap', {zoomControl: false})
            .setView(position, 17);

        leaflet.tileLayer(darkTile, { maxZoom: 20 }).addTo(this.map);

        if (!this.props.isFetching) {
            // sometimes component never updates after mounting
            this.drawCircles(this.props);
        }
    }

    componentWillReceiveProps (nextProps: MapAndStreetViewProps) {
        if (this.props.dingId !== nextProps.dingId) {
            this.props.handleFetchingDing(nextProps.dingId);
        }
    }

    shouldComponentUpdate (nextProps: MapAndStreetViewProps) {
    // only draw when
        return !nextProps.isFetching || (this.props.dingId !== nextProps.dingId);
    }

    componentWillUpdate (nextProps: MapAndStreetViewProps) {
        if (!nextProps.isFetching) {
            this.drawCircles(nextProps);
        }
    }

    componentWillUnmount () {
        this.map.remove();
    }

  map: leaflet.Map;
  reportedLocation: leaflet.Circle;
  closestRoad: leaflet.Circle;
  drawCircles: Function;

  drawCircles (props: MapAndStreetViewProps) { // also focuses the map to the report
        const coordinate: LatLng = props.ding.get('coordinates').toJS();
        this.map.panTo(coordinate);

        // remove previous dings

        if (this.reportedLocation) this.map.removeLayer(this.reportedLocation);
        if (this.closestRoad) this.map.removeLayer(this.closestRoad);

        // draw the dings
        this.reportedLocation = leaflet.circle(
            coordinate,
            props.ding.get('radius'),
            defaultCircleStyle
        ).addTo(this.map);

        // if there is a road, draw that too
        if (props.ding.has('road')) {
            const {x, y} = ((props.ding.getIn(['road', 'point']): any): Map<string, number>).toJS();
            const closestPoint = {lat: y, lng: x};

            this.closestRoad = leaflet.circle(
                closestPoint,
                props.ding.get('radius'),
                defaultRoadStyle
            ).addTo(this.map);
        }
    }

  render () {
        const style = {
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
        };
        return (
            <div style={style}>
                <div id='tinyMap' className={contents} style={{height: '100%'}}/>
            </div>
        );
    }
}

function mapStateToProps (state, props) {
    const dingId: string = props.dingId;
    const ding: Ding = state.dings.get(dingId);

    return {
        latestLocation: state.record.get('latestLocation').toJS(),
        latestFetchAttempt: state.record.get('latestFetchAttempt'),

        isFetching: state.dings.get('isFetching') || !ding,
        dingId,
        ding,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators(extractActionCreators(dingActionCreators), dispatch);
}

export default connect(mapStateToProps,
    mapDispatchToProps)(MapAndStreetViewContainer);
