import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { Map } from 'immutable';
import * as Microsoft from 'Microsoft';
import { connect } from 'react-redux';
// import { formatGoogleStreetViewURL } from 'helpers/utils';
import { streetSideMap } from './styles.css';

import type { Ding, LatLng } from 'types';

import * as dingActionCreators from 'modules/dings';

type Props = {
    isFetching: bool;
    dingId: ?string;
    ding: Ding;
    handleFetchingDing: Function;
    nextResponsePair: Array<number>;
}

class StreetSideContainer extends React.Component<void, Props, void> {
  componentDidMount () {
    this.element = document.getElementById('streetSide');

    // load bing
    // let bingMaps = document.createElement('script')
    // bingMaps.type='text/javascript';
    // bingMaps.src = 'https://www.bing.com/api/maps/mapcontrol?'
    // document.head.append(bingMaps)

    // console.log(this.props.dingId)

    // this.getBingMap(this.element)
    if (this.props.dingId !== '' && this.props.ding !== new Map() && this.element) {
      let location: LatLng;
      if (this.props.ding.closestRoadPoint !== undefined) {
        location = this.props.ding.closestRoadPoint.cp;
        const arrayLocation = [location.lat, location.lng];
        /*
        const direction = this.props.ding.get('direction').toJS();
        const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
        */
        // console.log(direction,angle)
        // console.log(arrayLocation)
        this.getBingMap(this.element, arrayLocation);
      } else {
        location = this.props.ding.coordinates;
        const arrayLocation = [location.lat, location.lng];
        this.getBingMap(this.element, arrayLocation, null);
      }
    }
  }

  componentWillUpdate () {
    let location: LatLng;
    if (this.props.ding.closestRoadPoint) {
      location = this.props.ding.closestRoadPoint.cp;
      const arrayLocation = [location.lat, location.lng];
      /*
      const direction = this.props.ding.get('direction').toJS();
      const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
      */
      this.map.setView({center: new Microsoft.Maps.Location(arrayLocation[0], arrayLocation[1])});
    } else {
      // console.log(this.props.ding.toJS());
      location = this.props.ding.coordinates;
      const arrayLocation = [location.lat, location.lng];
      this.map.setView({center: new Microsoft.Maps.Location(arrayLocation[0], arrayLocation[1])});
    }
  }

  map: any;
  element: any;

  getBingMap (element, location, heading = null) {
    let bingMapInitOptions = {
      credentials: 'AoVnu-gjYPGDRnY4hHsyRfjTekMrsKUT3kRhMePEcIzzxknHOGCSKHyGQO3PFJbB',
      mapTypeId: Microsoft.Maps.MapTypeId.streetside,
      zoom: 18,
      center: new Microsoft.Maps.Location(location[0], location[1]),
    };

    if (heading !== null) {
      bingMapInitOptions = {...bingMapInitOptions, heading};
    }

    this.map = new Microsoft.Maps.Map(element, bingMapInitOptions);

    this.map.setOptions({ streetsideOptions: { overviewMapMode: Microsoft.Maps.OverviewMapMode.hidden,
      showCurrentAddress: false,
      showProblemReporting: false,
      showExitButton: false,
      disablePanoramaNavigation: true,
      showHeadingCompass: false,
      showZoomButtons: false },
    });
  }
  render () {
    return (<div id='streetSide' className={streetSideMap} />);
  }
}

function mapStateToProps (state, props) {
  const rawDing: Map<any, any> = (state.dings.get(props.dingId) || new Map());
  return {
    isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching'),
    dingId: props.dingId,
    ding: rawDing.toJS(),
    nextResponsePair: state.userResponses.get('nextResponsePair'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...dingActionCreators,
  }, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(StreetSideContainer);
