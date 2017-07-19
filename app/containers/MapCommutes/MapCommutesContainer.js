// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MapCommutes } from 'components';
import { handleFetchingCommutes } from 'modules/commutes';
import { map, Map, tileLayer, polyline, Polyline, latLng } from 'leaflet';
import { darkTile, attribution } from 'config/constants';
import { tidy } from '@mapbox/geojson-tidy';

type Props = {
    isFetching: true,
    commutes: any,

    handleFetchingCommutes: Function;
}

class MapCommutesContainer extends React.Component<void, Props, void> {
    map: Map;

    componentDidMount () {
        this.props.handleFetchingCommutes();

        const location = [42.355596, -71.101363];
        this.map = map('mapCommutes').setView(location, 18);
        tileLayer(darkTile, {attribution}).addTo(this.map);
    }

    toGeoJSON (commute) {
        let timestamps = [];
        const coordinates = Object.keys(commute)
            .filter(key => key !== 'uid' && key !== 'origin')
            .sort((a, b) => a - b)
            .map((key) => {
                timestamps.push(key);
                return key;
            })
            .map((timestamp) => {
                const coord = commute[timestamp];
                return [coord.lng, coord.lat];
            });

        let geoJSON = {
            type: 'FeatureCollections',
            features: [
                { type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                    properties: {
                        coordTimes: timestamps,
                    },
                },
            ],
        };

        return geoJSON;
    }

    commuteToCoordinates (commute) {
        const coordinates = Object.keys(commute)
            .filter((key) => key !== 'uid' && key !== 'origin')
            .sort((a, b) => a - b)
            .map((timestamp) => {
                return commute[timestamp];
            });

        return coordinates;
    }

    trimCommute (commute) {
        const newCommute = {};

        Object.keys(commute)
            .filter((key) => key !== 'uid' && key !== 'origin')
            .sort((a, b) => a - b)
            .map((timestamp, i, ary) => {
                if (i < ary.length - 2) {
                    const pos1 = latLng(commute[timestamp]);
                    const nextTimestamp = ary[i + 1];
                    const pos2 = latLng(commute[nextTimestamp]);
                    const duration = nextTimestamp - timestamp;
                    const distance = pos1.distanceTo(pos2);
                    const speed = distance / (duration / 3600); // km/h
                    if (1 < speed && speed < 50) {
                        newCommute[timestamp] = commute[timestamp];
                    }
                }
            });

        return newCommute;
    }

    featureToCoordinates (features) {
        return features.map((feature) => {
            let coords = [];
            feature.geometry.coordinates.map((coordinate) => {
                if (coordinate[0] && coordinate[1]) {
                    coords.push(latLng(coordinate[1], coordinate[0]));
                }
            });
            return coords;
        });
    }

    plotCommutes (props: Props) {
        Object.keys(props.commutes)
            .filter(key => key !== 'isFetching' && key !== 'error' && key !== 'lastUpdated')
            .map(key => {
                const commute = props.commutes[key];
                const commutePolyline: Polyline = polyline(this.commuteToCoordinates(commute));
                commutePolyline.addTo(this.map);
                return key;
            });
    }

    componentWillUpdate (nextProps: Props) {
        if (!nextProps.isFetching) {
            this.plotCommutes(nextProps);
        }
    }

    render () {
        return (
            <MapCommutes/>
        );
    }
}

function mapStateToProps ({commutes}, props) {
    return {
        isFetching: commutes.get('isFetching'),
        commutes: commutes.toJS(),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingCommutes,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapCommutesContainer);
