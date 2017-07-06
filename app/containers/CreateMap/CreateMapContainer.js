// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleFetchSingleRoad } from 'modules/roads';

import { darkTile, attribution } from 'config/constants';
import { spliceRoad, arrayToLatLng } from 'helpers/utils';
import { map, Map, LatLng, polyline, Polyline, tileLayer } from 'leaflet';

import { type Road, emptyRoad } from 'types';
import { CreateMap } from 'components';

type Props = {
    isFetching: boolean;
    roadId: string;
    road: Object;
    domain: {
        start: number;
        end: number;
    };
    handleFetchSingleRoad: Function;
}

class CreateMapContainer extends React.Component<void, Props, void> {
    constructor (props: Props) {
        super(props);
        this.targetRoad = polyline([]);
        this.road = polyline([], {color: '#ffff00', opacity: 0.8, weight: 10});
    }

    componentDidMount () {
        // show map
        this.props.handleFetchSingleRoad(this.props.roadId);

        const location = [42.355596, -71.101363];

        this.map = map('createMap', {zoomControl: false}).setView(location, 18);
        tileLayer(darkTile, {attribution}).addTo(this.map);
        this.road.addTo(this.map);
        this.targetRoad.addTo(this.map);
    }

    componentWillUpdate (nextProps: Props) {
        if (!nextProps.isFetching) {
            console.log(nextProps.road);
            const roadLatLngs: LatLng[] = nextProps.road.geometry.coordinates.map((array) => arrayToLatLng(array));
            this.road.setLatLngs(roadLatLngs);

            const partialGeom = spliceRoad(nextProps.road.geometry, nextProps.domain);
            console.log(partialGeom);
            this.targetRoad.setLatLngs(partialGeom);
            this.map.fitBounds(this.road.getBounds());
        }
    }

    componentWillUnmout () {
        this.map.remove();
    }

    map: Map;
    road: Polyline;
    targetRoad: Polyline;
    mapHasLayers: boolean;

    render () {
        return <CreateMap />;
    }
}

function mapStateToProps ({ roads, userProposals }, props) {
    const roadMap = roads.get(`${props.roadId}`);
    const road: Road = roadMap ? roadMap.toJS() : emptyRoad;
    return {
        isFetching: roads.get('isFetching'),
        roadId: props.roadId,
        road,
        domain: userProposals.get('domain').toJS(),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchSingleRoad,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMapContainer);
