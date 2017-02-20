import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {RoadVis} from 'components'
import { Map } from 'immutable'
import * as roadsActionCreators from 'modules/roads'

const RoadVisContainer = React.createClass({
  propTypes:{
    roadId: PropTypes.string.isRequired,
  },
  componentDidMount () {
  },
  render () {
    return(<RoadVis roadId={this.props.roadId}/>)
  },
})

function mapStateToProps (state,props) {
  const roadId = props.params.roadId
  return {
    roadId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...roadsActionCreators
  },dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RoadVisContainer)