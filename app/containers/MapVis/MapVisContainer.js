import React, {PropTypes} from 'react'
import { MapVis } from 'components'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { toJS, Map } from 'immutable'

import * as dingFeedActionCreators from 'modules/dingFeed'
import * as roadActionCreators from 'modules/roads'
import * as commuteActionCreators from 'modules/commutes'
import * as recordActionCreators from 'modules/record'

import { findClosestRoad } from 'helpers/api'
import { updateTimeConstrain, getDomainLength, getTotalLength } from 'helpers/utils'

const MapVisContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    dings:PropTypes.object.isRequired,
    roads:PropTypes.object.isRequired,
    commutes:PropTypes.object.isRequired,
    latestLocation:PropTypes.instanceOf(Map),
    handleFetchingRoads : PropTypes.func.isRequired,
    handleFetchingCommutes : PropTypes.func.isRequired,
    handleSetDingListener: PropTypes.func.isRequired,
    handleFetchLatLng: PropTypes.func.isRequired,
  },
  contextTypes:{
    router:PropTypes.object.isRequired,
  },
  handleRoadClick (roadId){
    if(this.mapElement) document.getElementById('contents').removeChild(this.mapElement)
    console.log(`/roads/${roadId}`)
    this.context.router.push(`/roads/${roadId}`)
  },
  componentDidMount () {
    const fetchies = [ 
      this.props.handleSetDingListener(),
      this.props.handleFetchingCommutes(),
      this.props.handleFetchingRoads(),
      this.props.handleFetchLatLng()
      ]

    Promise.all(fetchies)
    this.mapElement = document.createElement('div')
    this.mapElement.id = 'map'
    document.getElementById('contents').insertBefore(this.mapElement,document.getElementById('contents').firstChild)
    //this.mapElement.style.flex = '1 0'
    this.mapElement.style.height = this.mapElement.parentNode.getBoundingClientRect().height+'px'
  },
  shouldComponentUpdate(nextProps){
    if(nextProps.isFetching){
      return false
    }
    return true
  },
  componentWillUnmount(){
    if(this.mapElement) console.log(document.getElementById('contents'))
  },
  componentWillUpdate(){
  },
  render () {
    return this.props.isFetching 
    ? null 
    : (<MapVis 
        isFetching = {this.props.isFetching}
        dom = {this.mapElement}
        dings={this.props.dings} 
        roads={this.props.roads} 
        commutes={this.props.commutes} 
        latestLocation={this.props.latestLocation}
        roadClick={this.handleRoadClick}
      />)
  }
})

function mapStateToProps({dings, dingFeed, roads, commutes,record}){
  return {
    isFetching : dings.get('isFetching') || roads.get('isFetching') || commutes.get('isFetching'),
    dings,
    roads,
    commutes,
    latestLocation:record.get('latestLocation')
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    ...dingFeedActionCreators,
    ...roadActionCreators,
    ...commuteActionCreators,
    ...recordActionCreators,
  },dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(MapVisContainer)