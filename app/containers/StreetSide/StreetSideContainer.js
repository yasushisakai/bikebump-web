import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { formatGoogleStreetViewURL} from 'helpers/utils'
import { streetSideMap } from './styles.css'

import * as dingActionCreators from 'modules/dings'

const StreetSideContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    dingId: PropTypes.string,
    ding : PropTypes.instanceOf(Map).isRequired,
    handleFetchingDing : PropTypes.func.isRequired,
    nextResponsePair : PropTypes.array.isRequired,
  },
  componentDidMount(){
    this.element = document.getElementById('streetSide')

    // load bing
    // let bingMaps = document.createElement('script')
    // bingMaps.type='text/javascript';
    // bingMaps.src = 'https://www.bing.com/api/maps/mapcontrol?'
    // document.head.append(bingMaps)

    // console.log(this.props.dingId)

    // this.getBingMap(this.element)
    if(this.props.dingId !== '' && this.props.ding !== new Map() && this.element){
      let location
      if(this.props.ding.has('closestRoadPoint')){
        location=this.props.ding.get('closestRoadPoint').toJS()
        const arrayLocation = [location.lat,location.lng]
        const direction = this.props.ding.get('direction').toJS()
        const angle = Math.atan2(direction.y,direction.x)*(180/Math.PI)
        //console.log(direction,angle)
        //console.log(arrayLocation)
        this.getBingMap(this.element,arrayLocation,angle)
      }else{
        location=this.props.ding.get('coordinates').toJS()
        const arrayLocation = [location.lat,location.lng]
        this.getBingMap(this.element,arrayLocation,null)
      }
      
    }
  },
  getBingMap(element,location,heading=null){
    
    let bingMapInitOptions = {
            credentials:'AoVnu-gjYPGDRnY4hHsyRfjTekMrsKUT3kRhMePEcIzzxknHOGCSKHyGQO3PFJbB',
      mapTypeId: Microsoft.Maps.MapTypeId.streetside,
      zoom: 18,
      center: new Microsoft.Maps.Location(location[0],location[1],)
    }

    if(heading !== null){
      bingMapInitOptions.heading = heading
    }

    this.map = new Microsoft.Maps.Map(element,bingMapInitOptions)

    this.map.setOptions({ streetsideOptions: { overviewMapMode: Microsoft.Maps.OverviewMapMode.hidden,
        showCurrentAddress: false,
        showProblemReporting: false,
        showExitButton: false,
        disablePanoramaNavigation: true,
        showHeadingCompass: false,
        showZoomButtons: false } 
      })
  },
  componentWillUpdate(){
      let location
      if(this.props.ding.has('closestRoadPoint')){
        location=this.props.ding.get('closestRoadPoint').toJS()
        const arrayLocation = [location.lat,location.lng]
        const direction = this.props.ding.get('direction').toJS()
        const angle = Math.atan2(direction.y,direction.x)*(180/Math.PI)
        this.map.setView({center:new Microsoft.Maps.Location(arrayLocation[0],arrayLocation[1]),heading:angle})
      }else{
        console.log(this.props.ding.toJS())
        location=this.props.ding.get('coordinates').toJS()
        const arrayLocation = [location.lat,location.lng]
        this.map.setView({center:new Microsoft.Maps.Location(arrayLocation[0],arrayLocation[1])})
      }
      
  },
  render () {
    return (<div id='streetSide' className={streetSideMap}></div>)
  },
})

function mapStateToProps (state,props) {
  return {
    isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching'),
    dingId: props.dingId,
    ding:state.dings.get(props.dingId) || new Map(),
    nextResponsePair : state.userResponses.get('nextResponsePair'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...dingActionCreators,
  },dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(StreetSideContainer)
