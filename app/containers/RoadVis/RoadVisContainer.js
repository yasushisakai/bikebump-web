import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {RoadVis} from 'components'
import {toJS, Map} from 'immutable'
import * as roadsActionCreators from 'modules/roads'
import * as recordActionCreators from 'modules/record'

const RoadVisContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    roads: PropTypes.object,
    latestLocation: PropTypes.object.isRequired,
    road:PropTypes.instanceOf(Map),
    handleFetchingRoads:PropTypes.func.isRequired,
    handleFetchLatLng:PropTypes.func.isRequired,
    handleFetchSingleRoad: PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.handleFetchingRoads()
    this.props.handleFetchLatLng()

  },
  componenetWillUnmount () {
    document.getElementById('app').removeChild(this.mapElement)
  },
  render () {
    return this.props.isFetching 
    ? <div>{'isLoading'}</div>
    : (<RoadVis
        dom = {this.mapElement}
        latestLocation={this.props.latestLocation} 
        isFetching={this.props.isFetching} 
        road={this.props.road} 
        />)
  },
})

function mapStateToProps (state) {
  const road = state.roads.get(`${24054355}`) || new Map()

  console.log(road)
  return {
    isFetching:state.roads.get('isFetching') || state.record.get('isFetchingLatLng'),
    roads:state.roads,
    road: road || new Map(),
    latestLocation: state.record.get('latestLocation')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({...roadsActionCreators, ...recordActionCreators},dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RoadVisContainer)
// export default RoadVisContainer