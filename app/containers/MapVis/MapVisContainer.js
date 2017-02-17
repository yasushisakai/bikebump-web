import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as usersActionCreator from 'modules/users'
import { tileURL, attribution, img_root } from 'config/constants'
import { MapVis } from 'components'
import leaflet from 'leaflet'
import {Map} from 'immutable'
import {checkLastUpdate, filterStateVariables } from 'helpers/utils'
import {plotRoad, plotCommute, plotDing} from 'helpers/mapPlot'

import * as commuteActionCreators from 'modules/commutes'
import * as dingFeedActionCreators from 'modules/dingFeed'
import * as dingActionCreators from 'modules/dings'
import * as roadsActionCreators from 'modules/roads'

const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    roads: PropTypes.instanceOf(Map).isRequired,
    // dingFeed : PropTypes.instanceOf(Map).isRequired,
    dings: PropTypes.instanceOf(Map).isRequired,
    commutes : PropTypes.instanceOf(Map).isRequired,
    dingIds : PropTypes.array.isRequired,

    handleFetchingRoads : PropTypes.func.isRequired,
    handleFetchingCommutes : PropTypes.func.isRequired,
    handleSetDingListener : PropTypes.func.isRequired,
    handleFetchingDings : PropTypes.func.isRequired,
  },
  componentDidMount(){
    
    // fetch stuff

    this.map = leaflet.map('mainMap').setView([42.355596, -71.101363],16)
    leaflet.tileLayer(tileURL,{attribution,maxZoom:20}).addTo(this.map)
    
    //
    // plot Road
    //
    if(checkLastUpdate(this.props.roads.get('lastUpdated'))){
      this.props.handleFetchingRoads()
        .then((result)=>{
          Object.keys(result.roads)
            .map(key=>{plotRoad(result.roads[key],this.map,(roadId)=>{console.log(roadId)})})
        }) 
    }else{
      this.props.roads.keySeq().toArray()
      .filter(key=>filterStateVariables(key))
      .map((key)=>{
         plotRoad(this.props.roads.get(key).toJS(),this.map,(roadId)=>{console.log(roadId)})
      })
    }


    //
    // plot commutes
    //
    if(checkLastUpdate(this.props.commutes.get('lastUpdated'))){
      this.props.handleFetchingCommutes()
        .then((result)=>{
          Object.keys(result.commutes)
            .map(key=>{
              // console.log(key)
              plotCommute(result.commutes[key],this.map)
            })
        })
    }else{
      this.props.commutes.keySeq().toArray()
        .filter(key=>filterStateVariables(key))
        .map(key=>{
          // console.log(key)
          plotCommute(this.props.commutes.get(key).toJS(),this.map)
        })
    }

    //
    // plot dings
    //
    if(this.props.listeners.get('dings')===true){
      this.props.dingIds.map(key=>{
        plotDing(this.props.dings.get(key).toJS(),this.map)
      })
    }else{
      this.props.handleFetchingDings()
        .then((result)=>{
          Object.keys(result.dings)
            .map((key)=>{
              plotDing(result.dings[key],this.map)
            })
        })
    }


  },
  render () {
    return (
      <MapVis/>
    )
  },
})

function mapStateToProps ({commutes,dingFeed,roads,listeners,dings}) {
  return {
    isFetching: commutes.get('isFetching') ||  dingFeed.get('isFetching') ||  roads.get('isFetching'),
    roads,
    dings,
    commutes,
    listeners,
    dingIds:dingFeed.get('dingIds').toJS()
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...commuteActionCreators,
    ...dingFeedActionCreators,
    ...dingActionCreators,
    ...roadsActionCreators,
  },dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(MapVisContainer)