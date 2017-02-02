import React, {PropTypes} from 'react'
import { MapVis2 } from 'components'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toJS, Map } from 'immutable'

import * as dingFeedActionCreators from 'modules/dingFeed'
import * as roadActionCreators from 'modules/roads'
import * as commuteActionCreators from 'modules/commutes'
import { findClosestRoad } from 'helpers/api'
import { updateTimeConstrain } from 'helpers/utils'

const MapVis2Container = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    handleSetDingListener:PropTypes.func.isRequired,
    dings: PropTypes.array.isRequired,
    roads: PropTypes.array.isRequired,
    handleRoadsFetch: PropTypes.func.isRequired, 
    handleFetchCommutes: PropTypes.func.isRequired, 
  },
  componentDidMount () {
    // add dings and dingFeed to the state
    // put a timer so we don't request data all
    this.props.handleSetDingListener() 
    this.props.handleRoadsFetch()
    this.props.handleFetchCommutes()
    this.previousUpdate = Date.now()
  },
  shouldComponentUpdate(nextProps) {
    // this is where you define when to trigger 'render' function
    // we can validate or compare nextProps and this.props

    const nextRoadsLength = nextProps.roads.length
    const currentRoadsLength = this.props.roads.length

    const nextDingsLength = nextProps.dings.length
    const currentDingsLength = this.props.dings.length

    // default should be true
      return true
  },
  render () {
    //console.log(this.props.handleFetchCommutes())
    console.log('MapVis2 Container render!!')
    // console.log(this.props.roads)
    return this.props.isFetching === true
    ? null 
    : <MapVis2 isFetching={this.props.isFetching}
        dings={this.props.dings}
        commutes={this.props.commutes}
        roads={this.props.roads} />
  },
})


function mapStateToProps({dings, dingFeed, roads, commutes}){
  // everything from the state is a immutable object
  // this is an array
  const justDings = dingFeed.get('dingIds').toJS().map((dingId)=>{
    return dings.get(dingId).toJS()
  })
  // this is also an array
  const justRoads = roads.toList().filter((road,index)=>{
    return road instanceof Map
  }).toJS()

  var justCommutes = commutes.toList().filter((commute,index)=>{
    return commute instanceof Map
  }).toJS()

  return {
    isFetching:dings.get('isFetching') ||
    dingFeed.get('isFetching') ||
    roads.get('isFetching'),
    dings:justDings,
    roads:justRoads,
    commutes:justCommutes,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({...dingFeedActionCreators,...roadActionCreators,...commuteActionCreators},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(MapVis2Container)