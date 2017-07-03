// @flow
import React, { PropTypes } from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { tileURL, attribution } from 'config/constants';
import { MapVis } from 'components';
import leaflet from 'leaflet';
import { Map } from 'immutable';
import { filterStateVariables } from 'helpers/utils';
import { plotRoad, plotCommute, plotDing } from 'helpers/mapUtils';

import * as dingFeedActionCreators from 'modules/dingFeed';
import * as roadsActionCreators from 'modules/roads';
import * as commutesActionCreators from 'modules/commutes';

import type { Commute, Ding, Road } from 'types';

type MapVisContaierProps = {
    isFetching: boolean;
    roads: Map<number, Road>;
    dings: Map<string, Ding>;
    dingIds: Array<string>;
    commutes: Map<string, Commute>;

    handleFetchingRoads: Function;
    handleFetchingCommutes: Function;
    handleSetDingListener: Function;
}

class MapVisContainer extends React.Component<void, MapVisContaierProps, void> {
  contextTypes: {
    router: PropTypes.object.isRequired,
  }

  componentDidMount () {
    // initiating the map
    this.map = leaflet.map('mainMap').setView([42.355596, -71.101363], 16);
    leaflet.tileLayer(tileURL, {attribution, maxZoom: 20}).addTo(this.map);

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
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.isFetching;
  }

  componentWillUpdate (nextProps: MapVisContaierProps) {
    // once everthing is ready plot!
    if (!nextProps.isFetching && !this.mapHasLayers) {
      // roads~
      nextProps.roads.keySeq().toArray()
        .filter(key => filterStateVariables(key))
        .map(key => {
          const road: Road = ((nextProps.roads.get(key):any): Map<any, any>).toJS();
          plotRoad(road, this.map, {}, this.handleClickRoad);
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
          const paths = plotCommute(commute, this.map);
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
    this.context.router.push(`/roads/${roadId}`);
  }

  map: leaflet.Map;
  mapHasLayers: boolean;

  render () {
    return (
      <MapVis/>
    );
  }
}

function mapStateToProps ({roads, dingFeed, dings, commutes}) {
  const isFetching: boolean =
    dingFeed.get('isFetching') ||
    roads.get('isFetching') ||
    commutes.get('isFetching');
  return {
    isFetching,
    roads,
    dings,
    commutes,
    dingIds: dingFeed.get('dingIds').toJS(),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...roadsActionCreators,
    ...dingFeedActionCreators,
    ...commutesActionCreators,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapVisContainer);
