import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { tileURL, attribution, img_root } from 'config/constants'
import { MapVis } from 'components'
import leaflet from 'leaflet'
import { Map } from 'immutable'
import { isModuleStale, filterStateVariables } from 'helpers/utils'
import { plotRoad, plotCommute, plotDing } from 'helpers/mapUtils'

import * as dingFeedActionCreators from 'modules/dingFeed'
import * as roadsActionCreators from 'modules/roads'

const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    roads: PropTypes.instanceOf(Map).isRequired,
    dings: PropTypes.instanceOf(Map).isRequired,
    dingIds : PropTypes.array.isRequired,

    handleFetchingRoads : PropTypes.func.isRequired,
    handleSetDingListener : PropTypes.func.isRequired,
  },
  contextTypes:{
    router:PropTypes.object.isRequired,
  },
  componentDidMount(){
    
    // initiating the map 
    this.map = leaflet.map('mainMap').setView([42.355596, -71.101363],16)
    leaflet.tileLayer(tileURL,{attribution,maxZoom:20}).addTo(this.map)

    // toggle to render vis elements only once per visit
    this.mapHasLayers = false;


    //
    // fetching 
    // handleXXX function will avoid fetching
    // if target has been already there
    // 
    this.props.handleFetchingRoads()
      
    // fetch dingFeed
    this.props.handleSetDingListener()

    // fetch the commutes
    // TODO: FETCH THE COMMUTES

    //
    // plot commutes
    //
    // if(isModuleStale(this.props.commutes.get('lastUpdated'))){
    //   this.props.handleFetchingCommutes()
    //     .then((result)=>{
    //       Object.keys(result.commutes)
    //         .map(key=>{
    //           plotCommute(result.commutes[key],this.map)
    //         })
    //     })
    // }else{
    //   this.props.commutes.keySeq().toArray()    FIXME
    //     .filter(key=>filterStateVariables(key))
    //     .map(key=>{
    //       plotCommute(this.props.commutes.get(key).toJS(),this.map)
    //     })
    // }
  },
  handleClickRoad (roadId ){
    this.context.router.push(`/roads/${roadId}`)
  },
  handleClickDing (dingId) {
  },
  componentWillUnmount () {
    this.map.remove()
  },
  shouldComponentUpdate (nextProps) {
    return !nextProps.isFetching 
  },
  componentWillUpdate (nextProps) {
    // once everthing is ready plot!
    if (!nextProps.isFetching && !this.mapHasLayers) {
      //roads~
      nextProps.roads.keySeq().toArray()
      .filter(key => filterStateVariables(key))
      .map(key => {
         plotRoad(nextProps.roads.get(key).toJS(), this.map, {}, this.handleClickRoad)
      })

      // dings!
      nextProps.dingIds.map(key => {
        const ding = nextProps.dings.get(key)
        plotDing(nextProps.dings.get(key).toJS(),this.map)
      })

      this.mapHasLayers = true
    }

    this.map.invalidateSize() // to show the whole tiles
  },
  render () {
    return (
      <MapVis/>
    )
  },
})

function mapStateToProps ({roads, dingFeed, dings}) {
  const isFetching = dingFeed.get('isFetching') || roads.get('isFetching')
  return {
    isFetching,
    roads,
    dings,
    dingIds:dingFeed.get('dingIds').toJS()
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...roadsActionCreators,
    ...dingFeedActionCreators,
  },dispatch)
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(MapVisContainer)
