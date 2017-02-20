import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { insertCSSLink } from 'helpers/utils'
import { tileURL, attribution} from 'config/constants'
import { mapContents } from './styles.css'
import * as roadActionCreators from 'modules/roads'
import {plotRoad, roadLineStringToLatLngBound, plotDing} from 'helpers/mapUtils'
import leaflet from 'leaflet'

const MidMapContainer = React.createClass({
  propTypes:{
    roadId : PropTypes.number.isRequired,
    latestLocation : PropTypes.object.isRequired,
    handleFetchSingleRoad : PropTypes.func.isRequired,
  },
  componentDidMount(){
    insertCSSLink('https://unpkg.com/leaflet@1.0.2/dist/leaflet.css')

    // map

    let location = [];
    if(this.props.latestLocation.lat === 0){
      location = [42.355596, -71.101363]
    }else{
      const {lat,lng} = this.props.latestLocation
      location = [lat,lng]
    }

    this.map = leaflet.map('midMap').setView(location,17)

    leaflet.tileLayer(tileURL,{attribution}).addTo(this.map)

    // fetch road
    if(this.props.road === undefined){
      this.props.handleFetchSingleRoad(this.props.roadId)
        .then(({road})=>{
          console.log(road)
          plotRoad(road,this.map)
          const bound = roadLineStringToLatLngBound(road)
          console.log(bound)
          this.map.fitBounds(bound)
        })
    }else{
      plotRoad(this.props.road.toJS(),this.map)
      const bound = roadLineStringToLatLngBound(this.props.road.toJS())
      console.log(bound)
      this.map.fitBounds(bound)
    }

    //dings
    if(this.props.dings !== undefined) {
      this.props.dings.keySeq().toArray()
      .filter((key=>key!=='isFetching'&&key!=='error'&&key!=='lastUpdated'))
      .filter((key)=>{
        console.log(key)
        return this.props.dings.getIn([key,'roadId']) === this.props.roadId
      })
      .map(key=>{
        plotDing(this.props.dings.get(key).toJS(),this.map)
      })
    }

  },
  componentWillUnmount(){
    //this.map.remove()
  },
  render () {
    if(!this.props.isFetching && this.props.road !== undefined){
      // draw road
        console.log(this.props.road)

    }
    return (
        <div id='midMap' className={mapContents}></div>
    )
  },
})

function mapStateToProps (state,props) {
  const roadId = parseInt(props.roadId)
  return {
    isFetching:state.roads.get('isFetching'),
    dings:state.dings,
    roadId,
    road:state.roads.get(roadId),
    latestLocation:state.record.get('latestLocation').toJS(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...roadActionCreators
  },dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(MidMapContainer)
