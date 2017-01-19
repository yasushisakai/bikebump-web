import React, {PropTypes} from 'react'
import { Record } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {refreshLatLng} from 'helpers/utils'

import {Map} from 'immutable'
import * as recordActionCreators from 'modules/record'
import * as dingsActionCreators from 'modules/dings'

const RecordContainer = React.createClass({
  propTypes:{
    uid:PropTypes.string.isRequired,
    isRecording:PropTypes.bool.isRequired,
    isFetchingLatLng:PropTypes.bool.isRequired,
    latestLocation: PropTypes.instanceOf(Map).isRequired,
    latestFetch : PropTypes.number.isRequired,
    location: PropTypes.instanceOf(Map).isRequired,
    handleFetchLatLng: PropTypes.func.isRequired,
    toggleRecording: PropTypes.func.isRequired, 
    handleCreateDing : PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.renderTime = 0
    this.props.handleFetchLatLng()
    this.interval = null

    let testDing = {
      radius : 10,
      roadId : 92038402,
      coordinates:{
        lng:-71.087264,
        lat:42.360357
      },
      timestamps:{}
      }

      const timestamp = Date.now()

    testDing.timestamps[timestamp]={     
      timestamp:timestamp,
      uid:this.props.uid,
      value:0,
    }


    this.props.handleCreateDing(testDing)

  },
  shouldComponentUpdate (nextProps, nextState) {
    if(this.props.isFetchingLatLng !== nextProps.isFetchingLatLng){
      if(nextProps.isFetchingLatLng===false) return true
      else return false
    }
    return true
  },
  updateLatLng () {

    if(this.props.isRecording === false && this.interval !== null) {
      window.clearInterval(this.interval)
      this.interval = null
    }

    if(refreshLatLng(this.props.latestFetch) === true && this.props.isFetchingLatLng === false){
      this.props.handleFetchLatLng()
    }

  },
  componentDidUpdate () {
    if(this.props.isRecording === true && this.interval===null){
      this.interval = window.setInterval(this.updateLatLng, 10000)
    }
  },
  componentWillUnmount () {
    window.clearInterval(this.interval)
    this.interval = null
  },
  render () {
    return (<div>
      <Record isRecording={this.props.isRecording} onRecordButtonClick={this.props.toggleRecording} location={this.props.location}/>
      <div>{`RecordContainer:${this.renderTime}`}</div>
      </div>
    )
  },
})

function mapState({record,users}){
  return {
  uid:users.get('authedId'),
  isRecording : record.get('isRecording'),
  isFetchingLatLng : record.get('isFetchingLatLng'),
  latestLocation: record.get('latestLocation'),
  latestFetch : record.get('latestFetch'),
  location : record.get('latestLocation')
  }
}

function mapDispatch(dispatch){
  return bindActionCreators({...recordActionCreators,...dingsActionCreators},dispatch)
}


export default connect(mapState,mapDispatch)(RecordContainer)