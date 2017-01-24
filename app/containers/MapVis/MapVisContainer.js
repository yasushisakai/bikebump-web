import React, {PropTypes} from 'react'
import { MapVis } from 'components'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toJS, Map } from 'immutable'

import * as dingFeedActionCreators from 'modules/dingFeed'
import * as roadActionCreators from 'modules/roads'
import { findClosestRoad } from 'helpers/api'


const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    handleSetDingListener:PropTypes.func.isRequired,
    dings: PropTypes.array.isRequired,
    roads: PropTypes.array.isRequired,
    handleRoadsFetch: PropTypes.func.isRequired, 
  },
  componentDidMount () {
    // add dings and dingFeed to the state
    this.props.handleSetDingListener() 
    this.props.handleRoadsFetch()
  },
  shouldComponentUpdate(nextProps) {
    // this is where you define when to trigger 'render' function
    // we can validate or compare nextProps and this.props

    if(
      nextProps.roads.length === this.props.roads.length &&
      nextProps.dings.length === this.props.dings.length
      ) { return false}

    if(nextProps.roads.length === 0 || nextProps.dings.length === 0) {
      return false
    }

    // default should be true
      return true
  },
  render () {
    console.log('MapVis Contaier render!!')
    console.log(this.props.roads)
    return this.props.isFetching === true
    ? null 
    : <MapVis isFetching={this.props.isFetching}/>
  },
})

function mapStateToProps({dings, dingFeed,roads}){
  // everything from the state is a immutable object
  // this is an array
  const justDings = dingFeed.get('dingIds').toJS().map((dingId)=>{
    return dings.get(dingId).toJS()
  })
  // this is also an array
  const justRoads = roads.toList().filter((road,index)=>{
    return road instanceof Map
  }).toJS()
  return {
    isFetching:dings.get('isFetching') ||
    dingFeed.get('isFetching') ||
    roads.get('isFetching'),
    dings:justDings,
    roads:justRoads,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({...dingFeedActionCreators,...roadActionCreators},dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(MapVisContainer)