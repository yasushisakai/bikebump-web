import React, {PropTypes} from 'react'
import { MapVis } from 'components'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import * as dingFeedActionCreators from 'modules/dingFeed'
import { findClosestRoad } from 'helpers/api'


const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    handleSetDingListener:PropTypes.func.isRequired,
  },
  componentDidMount () {
    // add dings and dingFeed to the state
    this.props.handleSetDingListener() 
  },
  render () {
    return (
      <MapVis isFetching={this.props.isFetching}/>
      )
  },
})


function mapStateToProps({dings, dingFeed}){
  return {
    isFetching:dings.get('isFetching') || dingFeed.get('isFetching'),
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators(dingFeedActionCreators,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(MapVisContainer)