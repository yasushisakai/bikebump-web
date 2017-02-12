import React, {PropTypes} from 'react'
import { Roads } from 'components'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import {bindActionCreators} from 'redux'
import * as userActionCreators from 'modules/users'
import * as recordActionCreators from 'modules/record'
import * as roadActionCreators from 'modules/roads'

const RoadsContainer = React.createClass({
  propTypes:{
    isFetching:PropTypes.bool.isRequired,
    road:PropTypes.instanceOf(Map),
    roadId:PropTypes.string.isRequired,
    latestLocation:PropTypes.object.isRequired,
    handleFetchSingleRoad:PropTypes.func.isRequired,
  },
  componentDidMount(){
    this.contents = document.getElementById('contents')

    this.props.handleFetchLatLng()
    // this.props.handleFetchSingleRoad(this.props.roadId)
  },
  componentWillUnmount(){
    // document.getElementById('contents').removeChild(this.mapElement) 
  },
  render () {
    this.mapElement = document.createElement('div')
    this.mapElement.id ='map'
    this.contents.appendChild(this.mapElement) 
    return this.props.isFetching
    ? null
    : (
      <Roads
      dom={this.mapElement}
      road={this.props.road}
      latestLocation={this.props.latestLocation}
      />
    )
  },
})


function mapStateToProps({roads,record},props){
  const road = roads.get(props.params.roadId) || new Map()
  return {
    isFetching: record.get('isFetchingLatLng'),
    roadId : props.params.roadId,
    road,
    latestLocation: record.latestLocation || new Map(),
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    ...userActionCreators,
    ...recordActionCreators,
    ...roadActionCreators}
    ,dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(RoadsContainer)