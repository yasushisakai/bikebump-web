// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { darkTile, attribution } from 'config/constants';
import { MapVis } from 'components';
import leaflet, { map, polyline, Polyline, PolylineOptions, tileLayer, latLng } from 'leaflet';
import { Map } from 'immutable';
import { filterStateVariables } from 'helpers/utils';
import { plotCommute, plotDing, defaultRoadStyle } from 'helpers/mapUtils';

import * as dingFeedActionCreators from 'modules/dingFeed';
import * as roadsActionCreators from 'modules/roads';
import * as commutesActionCreators from 'modules/commutes';
import { handleFetchingRoadProposals } from 'modules/roadProposals';

import type { Commute, Ding, Road } from 'types';

type MapVisContaierProps = {
    isFetching: boolean;
    router: Object;
    roads: Map<number, Road>;
    dings: Map<string, Ding>;
    dingIds: Array<string>;
    commutes: Map<string, Commute>;
    roadProposals: Map<any, any>;

    handleFetchingRoads: Function;
    handleFetchingCommutes: Function;
    handleSetDingListener: Function;
    handleFetchingRoadProposals: Function;
}

class MapVisContainer extends React.Component<void, MapVisContaierProps, void> {
    map: leaflet.Map;
    mapHasLayers: boolean;
    handleClickRoad: Function;
    roadPopup: Function;
    checkRoadProposals: Function;

    constructor (props: MapVisContaierProps) {
        super(props);
        this.handleClickRoad = this.handleClickRoad.bind(this);
        this.roadPopup = this.roadPopUp.bind(this);
        this.checkRoadProposals = this.checkRoadProposals.bind(this);
    }

    componentDidMount () {
        console.log('mounted');
        // initiating the map
        this.map = map('mainMap').setView([42.355596, -71.101363], 17);
        tileLayer(darkTile, { attribution, maxZoom: 20 }).addTo(this.map);

        // toggle to render vis elements only once per visit
        this.mapHasLayers = false;

        //
        // fetching
        // handleXXX function will avoid fetching
        // if target has been already there
        //
        this.props.handleFetchingRoads();

        // fetch dingFeed
        this.props.handleSetDingListener();

        // fetch the commutes
        this.props.handleFetchingCommutes();

        // fetch the road - proposals
        this.props.handleFetchingRoadProposals();
    }

    shouldComponentUpdate (nextProps) {
        // console.log(nextProps.isFetching);
        // return !nextProps.isFetching;
        return true;
    }

    checkRoadProposals (roadId, props: MapVisContaierProps): number {
        const roadProposals = props.roadProposals.get(roadId);
        if (!roadProposals) {
            return 0;
        } else {
            return roadProposals.size;
        }
    }

    roadPopUp (name: ?string, kind: string, id: number, num: number): HTMLElement {
        const popupContent: HTMLElement = document.createElement('div');
        const proposalLink = document.createElement('div');
        proposalLink.className = num === 0 ? 'mapButton disabled' : 'mapButton';
        proposalLink.innerHTML = num === 0 ? 'no plans' : `view plans (${num})`;
        proposalLink.onclick = () => num === 0 ? null : this.props.router.push(`proposals#${id}`);
        popupContent.appendChild(proposalLink);
        const createLink = document.createElement('div');
        createLink.innerHTML = 'create new plan';
        createLink.className = 'mapButton';
        createLink.onclick = () => this.props.router.push(`create/${id}`);
        popupContent.appendChild(createLink);
        const roadInfo = document.createElement('div');
        roadInfo.innerHTML = name !== null ? `<b>${name}</b>` : '';
        roadInfo.innerHTML += ` type: ${kind}`;
        popupContent.appendChild(roadInfo);
        return popupContent;
    }

    componentWillUpdate (nextProps: MapVisContaierProps) {
        // once everthing is ready plot!
        console.log(nextProps.isFetching, this.mapHasLayers);
        if (!nextProps.isFetching && !this.mapHasLayers) {
            // roads~
            nextProps.roads.keySeq().toArray()
                .filter(key => filterStateVariables(key))
                .map(key => {
                    const road: Road = ((nextProps.roads.get(key):any): Map<any, any>).toJS();
                    const coordinates = road.geometry.coordinates.map((ary) => latLng(ary[1], ary[0]));
                    const proposalNum = this.checkRoadProposals(key, nextProps);
                    const style: PolylineOptions = proposalNum > 0 ? defaultRoadStyle : {...defaultRoadStyle, color: '#aaa'};
                    const roadPath: Polyline = polyline(coordinates, style);
                    roadPath.bindPopup(this.roadPopUp(road.properties.name, road.properties.kind, key, proposalNum), {maxWidth: '320px'});
                    roadPath.on('popupopen', (e) => { this.map.fitBounds(roadPath.getBounds()); });
                    roadPath.addTo(this.map);
                });

            // dings!
            nextProps.dingIds.map(key => {
                const ding: Ding = ((nextProps.dings.get(key):any): Map<any, any>).toJS();
                plotDing(ding, this.map);
            });

            // commutes
            nextProps.commutes.keySeq().toArray()
                .filter(key => filterStateVariables(key))
                .map(key => {
                    const commute: Commute = ((nextProps.commutes.get(key):any): Map<any, any>).toJS();
                    plotCommute(commute, this.map);
                    // paths.map((path) => path.bindPopup('hello'));
                });

            this.mapHasLayers = true;
        }

        this.map.invalidateSize(); // to show the whole tiles
    }

    componentWillUnmount () {
        this.map.remove();
    }

    handleClickRoad (roadId) {
        console.log(this.props);
    // this.props.router.push(`/create/${roadId}`);
    }

    render () {
        return (
            <MapVis />
        );
    }
}

function mapStateToProps ({ roads, dingFeed, dings, commutes, roadProposals }) {
    console.log('dingFeed', dingFeed.get('isFetching'));
    console.log('roads', roads.get('isFetching'));
    console.log('commutes', commutes.get('isFetching'));
    console.log('roadProposals', roadProposals.get('isFetching'));
    const isFetching: boolean =
        dingFeed.get('isFetching') ||
        roads.get('isFetching') ||
        commutes.get('isFetching') ||
        roadProposals.get('isFetching');
    return {
        isFetching,
        roads,
        dings,
        commutes,
        roadProposals,
        dingIds: dingFeed.get('dingIds').toJS(),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        ...roadsActionCreators,
        ...dingFeedActionCreators,
        ...commutesActionCreators,
        handleFetchingRoadProposals,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapVisContainer);
