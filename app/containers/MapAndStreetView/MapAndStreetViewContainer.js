import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {contents} from 'styles/styles.css'
import {Map} from 'immutable' 
import {tinyTileURL,tinyAttribution} from 'config/constants'
import leaflet from 'leaflet'
// import mapzen from 'mapzen.js'
import { icon, defaultStyle } from 'helpers/mapUtils'

import * as dingActionCreators from 'modules/dings'

const MapAndStreetViewContainer = React.createClass({
  propTypes:{
    isFetching : PropTypes.bool.isRequired,
    dingId:PropTypes.string.isRequired,
    latestLocation : PropTypes.object.isRequired,
    dings:PropTypes.instanceOf(Map).isRequired,
    handleFetchingDing:PropTypes.func.isRequired,
    nextResponsePair : PropTypes.array.isRequired,
  },
  componentDidMount(){
    let position;
    if(this.props.latestLocation.lat === '0' && this.props.latestLocation.lng === '0'){
      position = [parseFloat(this.props.latestLocation.lat),parseFloat(this.props.latestLocation.lng)]
    }else{
      position = [42.3602747,-71.0872227]
    }
    this.map = leaflet.map('tinyMap',{zoomControl:false}).setView(position,16)
    leaflet.tileLayer(tinyTileURL,{attribution:tinyAttribution,maxZoom:20}).addTo(this.map)
    
    // this component will not work when refreshed
    console.log(this.props.dingId)
  },
  componentWillUpdate(){
    
    if(this.props.dingId !== '' ){
      const ding = this.props.dings.get(this.props.dingId)
      
      const coordinate = ding.get('coordinates').toJS()

      if(this.circle !== undefined) this.map.removeLayer(this.circle)

      this.circle = leaflet.circle(coordinate,ding.get('radius'),{...defaultStyle,weight:1, opacity:0.1,color:'#ff0'}).addTo(this.map)

      if(this.marker !== undefined) this.map.removeLayer(this.marker)

      this.marker = leaflet.marker(coordinate,{icon}).addTo(this.map)

      if(this.closestCircle !== undefined) this.map.removeLayer(this.closestCircle)

      if(ding.has('closestRoadPoint')){
        const closestCoordinate = ding.get('closestRoadPoint').toJS()
        this.closestCircle = leaflet.circle(closestCoordinate,ding.get('radius'),{...defaultStyle,weight:2,color:'#f00'}).addTo(this.map)

        if(this.closesetMarker !== undefined) this.map.removeLayer(this.closesetMarker)
        this.closesetMarker = leaflet.marker(closestCoordinate,{icon}).addTo(this.map)
      }

      this.map.panTo(coordinate)
      // this.map.zoomIn(14,{animate:true,duration:5})
    }
  },
  componentWillUnmount(){
    this.map.remove()
  },
  render () {
    return (
      <div id='tinyMap' className={contents}></div>
    )
  },
})

function mapStateToProps (state,props,) {
  return {
    isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching') || props.dingId === undefined,
    latestLocation : state.record.get('latestLocation').toJS(),
    dingId: (props.dingId || state.userResponses.get('nextResponsePair')[0]) || '',
    dings:state.dings,
    nextResponsePair:state.userResponses.get('nextResponsePair'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(dingActionCreators,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(MapAndStreetViewContainer)


