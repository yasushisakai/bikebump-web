// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { handleFetchSingleRoad } from 'modules/roads';
import { handleFetchingProposals } from 'modules/proposals';
import { plotRoad, defaultRoadStyle, roadSelectedStyle } from 'helpers/mapUtils';
import { spliceRoad, flipGeometry } from 'helpers/utils';
import { map, Map, tileLayer, polyline, Polyline, latLngBounds, LatLngBounds, LatLng } from 'leaflet';
import { darkTile, attribution } from 'config/constants';
import { proposalMap } from './styles.css';

type Props = {
    isFetching: boolean;
    proposal: Object;
    roadId: string;
    road: Object;

    handleFetchSingleRoad: Function;
    handleFetchingProposals: Function;
}

class ProposalMapContainer extends React.Component<void, Props, void> {
    componentDidMount () {
        this.props.handleFetchSingleRoad(this.props.roadId);
        this.props.handleFetchingProposals();

        const location = [42.355596, -71.101363];
        this.map = map('proposalMap', { zoomControl: false }).setView(location, 17);
        tileLayer(darkTile, { attribution }).addTo(this.map);

        // calculate bbox from domain
        this.mapHasLayers = false;

        if (!this.props.isFetching) {
            const road = this.props.road.toJS();
            const domain = this.props.proposal.get('domain').toJS();           
            this.drawRoad(road, domain);
        }
    }

    componentWillUpdate (nextProps: Props) {
        console.log('hello');
        if (!nextProps.isFetching && !this.mapHasLayers) {
            const road = nextProps.road.toJS();
            const domain = nextProps.proposal.get('domain').toJS();

            this.drawRoad(road, domain);
        }
    }

    componentWillUnmout () {
        this.map.remove();
    }

    map: Map;
    mapHasLayers: boolean;

    drawRoad (road, domain) {
        plotRoad(road, this.map, defaultRoadStyle, () => {});

        const geometry = flipGeometry(road.geometry);
        const splicedGeometry: LatLng[] = spliceRoad(geometry, { ...domain, index: 0 });
        const splicedPolyline: Polyline = polyline(splicedGeometry, roadSelectedStyle);
        splicedPolyline.addTo(this.map);

        // const bounds: LatLngBounds = latLngBounds(splicedGeometry);
        this.map.fitBounds(splicedPolyline.getBounds());
        this.mapHasLayers = true;
    }

    render () {
        return <div id={`proposalMap`} className={proposalMap}>{`Map`}</div>;
    }
}

function mapStateToProps ({ record, roads, proposals }, props) {
    const proposal = proposals.get(props.proposalId);
    const roadId = proposal.get('roadId');
    return {
        isFetching: (roads.get('isFetching') || proposals.get('isFetching')),
        proposal,
        roadId,
        road: roads.get(roadId),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchSingleRoad,
        handleFetchingProposals,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalMapContainer);
