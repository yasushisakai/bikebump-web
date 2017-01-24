import React, {PropTypes} from 'react'
import { MapVis } from 'components'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toJS } from 'immutable'

import * as dingFeedActionCreators from 'modules/dingFeed'
import { findClosestRoad } from 'helpers/api'


const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    handleSetDingListener:PropTypes.func.isRequired,
    dings: PropTypes.array.isRequired,
  },
  componentDidMount () {
    // add dings and dingFeed to the state
    this.props.handleSetDingListener() 
  },
  render () {
    console.log(this.props.dings)
    return (
      <MapVis isFetching={this.props.isFetching}/>
      )
  },
})


function mapStateToProps({dings, dingFeed}){
  const justDings = dingFeed.get('dingIds').toJS().map((dingId)=>{
    return dings.get(dingId).toJS()
  })
  return {
    isFetching:dings.get('isFetching') || dingFeed.get('isFetching'),
    dings:justDings,
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(dingFeedActionCreators,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(MapVisContainer)