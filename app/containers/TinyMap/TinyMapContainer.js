// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { contents } from 'styles/styles.css';
import { Map } from 'immutable';
import { tinyTileURL, tinyAttribution } from 'config/constants';
import leaflet from 'leaflet';
// import mapzen from 'mapzen.js'
import { icon, defaultStyle } from 'helpers/mapUtils';

import * as dingActionCreators from 'modules/dings';
import type { LatLng, Ding } from 'types';

type Props = {
    isFetching: boolean;
    dingId: string;
    latestLocation: LatLng;
    dings: Map<string, Ding>;
    handleFetchingDing: Function;
    nextResponsePair: Array<number>;
  }

class TinyMapContainer extends React.Component<void, Props, void> {
  componentDidMount () {
    let position;
    if (this.props.latestLocation.lat === '0' && this.props.latestLocation.lng === '0') {
      position = [parseFloat(this.props.latestLocation.lat), parseFloat(this.props.latestLocation.lng)];
    } else {
      position = [42.3602747, -71.0872227];
    }
    this.map = leaflet.map('tinyMap', {zoomControl: false}).setView(position, 16);
    leaflet.tileLayer(tinyTileURL, {attribution: tinyAttribution, maxZoom: 20}).addTo(this.map);
  }
  componentWillUpdate () {
    if (this.props.dingId !== '') {
      const ding: Ding = ((this.props.dings.get(this.props.dingId): any): Map<any, any>).toJS();

      const coordinate: LatLng = ding.coordinates;

      if (this.circle !== undefined) this.map.removeLayer(this.circle);

      this.circle = leaflet.circle(
        coordinate,
        ding.radius,
        {...defaultStyle, weight: 1, opacity: 0.1, color: '#ff0'}
      ).addTo(this.map);

      if (this.marker !== undefined) this.map.removeLayer(this.marker);

      this.marker = leaflet.marker(coordinate, {icon}).addTo(this.map);

      if (this.closestCircle !== undefined) this.map.removeLayer(this.closestCircle);

      if (ding.closestRoadPoint) {
        const closestCoordinate: {cp: LatLng, dist:number} = ding.closestRoadPoint;
        this.closestCircle = leaflet.circle(
          closestCoordinate.cp,
          ding.radius,
          {...defaultStyle, weight: 2, color: '#f00'}
        ).addTo(this.map);

        if (this.closesetMarker !== undefined) this.map.removeLayer(this.closesetMarker);
        this.closesetMarker = leaflet.marker(closestCoordinate, {icon}).addTo(this.map);
      }

      this.map.panTo(coordinate);
      // this.map.zoomIn(14,{animate:true,duration:5})
    }
  }

  componentWillUnmount () {
    this.map.remove();
  }

  map: leaflet.Map;
  circle: leaflet.Circle;
  closestCircle: leaflet.Circle;
  marker: leaflet.Marker;
  closesetMarker: leaflet.Marker;

  render () {
    return (
      <div id='tinyMap' className={contents} />
    );
  }
}

function mapStateToProps (state, props) {
  return {
    isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching') || props.dingId === undefined,
    latestLocation: state.record.get('latestLocation').toJS(),
    dingId: (props.dingId || state.userResponses.get('nextResponsePair')[0]) || '',
    dings: state.dings,
    nextResponsePair: state.userResponses.get('nextResponsePair'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(dingActionCreators, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(TinyMapContainer);
