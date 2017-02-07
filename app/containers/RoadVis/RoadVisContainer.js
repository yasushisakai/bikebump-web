import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {RoadVis} from 'components'
import {toJS, Map} from 'immutable'
import * as roadsActionCreators from 'modules/roads'

const RoadVisContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    roads: PropTypes.object,
    road:PropTypes.instanceOf(Map),
    handleRoadsFetch:PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.handleRoadsFetch()
  },

  render () {
    return this.props.isFetching 
    ? <div>{'isLoading'}</div>
    : (<RoadVis 
        isFetching={this.props.isFetching} 
        road={this.props.road} 
        />)
  },
})

function mapStateToProps (state) {
  const road = state.roads.get(`${42769910}`) || new Map()
  return {
    isFetching:state.roads.get('isFetching'),
    roads:state.roads,
    road: road || new Map(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(roadsActionCreators,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RoadVisContainer)
// export default RoadVisContainer