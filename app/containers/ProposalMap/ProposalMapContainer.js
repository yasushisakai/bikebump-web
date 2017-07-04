// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { handleFetchSingleRoad } from 'modules/roads';
import { plotRoad } from 'helpers/mapUtils';
import { spliceRoad, flipGeometry } from 'helpers/utils';
import { map, Map, tileLayer, polyline, Polyline, latLngBounds, LatLngBounds, LatLng } from 'leaflet';
import { lightURL, attribution } from 'config/constants';
import { proposalMap } from './styles.css';

type Props = {
  isFetching: boolean;
  road: any;
  roadId: number;
  domain: {
    start: number,
    end: number,
  };

  handleFetchSingleRoad: Function;
}

class ProposalMapContainer extends React.Component<void, Props, void> {
  componentDidMount () {
    this.props.handleFetchSingleRoad(this.props.roadId);

    const location = [42.355596, -71.101363];
    this.map = map('proposalMap', {zoomControl: false}).setView(location, 17);
    tileLayer(lightURL, {attribution}).addTo(this.map);

    // calculate bbox from domain
    this.mapHasLayers = false;
  }

  componentWillUpdate (nextProps: Props) {
    if (!nextProps.isFetching && !this.mapHasLayers) {
      let road = nextProps.road.toJS();
      plotRoad(road, this.map, {}, () => {});

      const geometry = flipGeometry(road.geometry);

      // plot spliced 
      const splicedRoadGeometry: LatLng[] = spliceRoad(geometry, { ...nextProps.domain, index: 0 });
      // console.log(splicedRoadGeometry);

      const splicedRoadPolyline: Polyline = polyline(splicedRoadGeometry, {color: '#000'});
      splicedRoadPolyline.addTo(this.map);

      const bounds: LatLngBounds = latLngBounds(splicedRoadGeometry);

      this.map.fitBounds(bounds);

      this.mapHasLayers = true;
    }
  }

  componentWillUnmout () {
    this.map.remove();
  }

  map: Map;
  mapHasLayers: boolean;

  render () {
    return <div id={`proposalMap`} className={proposalMap}>{`Map`}</div>;
  }
}

function mapStateToProps ({roads}, props) {
  const road = roads.get(`${props.roadId}`);
  return {
    isFetching: roads.get('isFetching'),
    roadId: props.roadId,
    road,
    domain: props.domain,
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    handleFetchSingleRoad,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalMapContainer);
