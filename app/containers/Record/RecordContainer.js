import React, {PropTypes} from 'react'
import { Record } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { refreshLatLng } from 'helpers/utils'
import { Map } from 'immutable'
import { updateCycleDuration } from 'config/constants'
import * as recordActionCreators from 'modules/record'
import * as dingsActionCreators from 'modules/dings'
import * as dingFeedActionCreators from 'modules/dingFeed'
import NoSleep from 'nosleep'
import SoundClip from 'helpers/SoundClip'

const RecordContainer = React.createClass({
  propTypes:{
    uid:PropTypes.string.isRequired,
    isRecording:PropTypes.bool.isRequired,
    isFetchingLatLng:PropTypes.bool.isRequired,
    latestLocation: PropTypes.instanceOf(Map).isRequired,
    latestFetch : PropTypes.number.isRequired,
    latestFetchAttempt : PropTypes.number.isRequired,
    location: PropTypes.instanceOf(Map).isRequired,
    handleFetchLatLng: PropTypes.func.isRequired,
    toggleRecording: PropTypes.func.isRequired,
    handleCreateDing : PropTypes.func.isRequired,
    handleSetDingListener : PropTypes.func.isRequired,
    handleComplieDing : PropTypes.func.isRequired,
    //dispatch:PropTypes.func.isRequired,
    isCapturing:PropTypes.bool.isRequired,
    isUploading:PropTypes.bool.isRequired,
  },

  componentDidMount () {
    //Constants
    this.DOUBLECLICK = 500;
    this.GOOD = 0;
    this.BAD = 1;
    this.soundClip = new SoundClip();
    this.dataArray = this.soundClip.getDataArray();
    this.analyzer = this.soundClip.getAnalyzer();
    console.clear()

    const noSleep = new NoSleep()
    noSleep.enable()

    // listen to dings if not already
    this.props.handleSetDingListener()

    this.interval = null

    this.latestDing = null


    this.props.handleFetchLatLng()

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
  },

  shouldComponentUpdate (nextProps, nextState) {
    if(this.props.isFetchingLatLng !== nextProps.isFetchingLatLng){
      if(nextProps.isFetchingLatLng===false) return true
      else return false
    }
    return true
  },

  componentWillUnmount (){
    this.props.dispatch(this.props.stopRecording())
  },

  updateLatLng () {
    if(this.props.isRecording === false && this.interval !== null) {
      window.clearInterval(this.interval)
      this.interval = null
    }

    if(refreshLatLng(this.props.latestFetchAttempt) === true && this.props.isFetchingLatLng === false){
      this.props.handleFetchLatLng()
    }

  },

  handleReport () {

    // send blob
    console.log("stopAndUpload");
    this.props.dispatch(stopCapture())
    this.soundClip.stopAndUpload();
    this.soundClip.record();
    this.props.dispatch(startCapture());

    this.duplicateLatestDing = this.latestDing
    this.latestDing = {
          location:this.props.latestLocation.toJS(),
          timeStamp:this.props.latestFetch
      }

    //ding logic
    if(this.duplicateLatestDing) {
      let value = 0;
      if(this.props.latestFetch- this.duplicateLatestDing.timeStamp <=this.DOUBLECLICK) {
        value = 0;
        this.latestDing = null;
        console.log(this.props.latestFetch, this.duplicateLatestDing.timeStamp);
      }
      else{
        value = 1;
      }
      return this.props.handleComplieDing(
        this.props.uid,
        this.props.latestLocation.toJS(),
        this.props.latestFetch,
        10,
        value
      )
   }

   //save latest ding
   this.latestDing = {
         location:this.props.latestLocation.toJS(),
         timeStamp:this.props.latestFetch
     }
  },

  componentDidUpdate () {
    if(this.props.isRecording === false && this.interval !== null){
      window.clearInterval(this.interval)
      this.interval = null
    }

    if(this.props.isRecording === true && this.interval === null){
      this.updateLatLng()
      this.interval = window.setInterval(this.updateLatLng, updateCycleDuration)
    }
  },

  componentWillUnmount () {
    noSleep.disable()
    // todo move this to main?
    if(this.props.isRecording === true) {
      this.props.toggleRecording()
    }
    window.clearInterval(this.interval)
    this.interval = null
  },

  render () {
      return (<div>
      <Record dataArray ={this.dataArray} analyzer ={this.analyzer} isRecording={this.props.isRecording} isFetchingLatLng={this.props.isFetchingLatLng} onRecordButtonClick={this.props.toggleRecording} onReportButtonClick={this.handleReport} location={this.props.location}/>
      </div>
    )
  }
})

function mapState({record,users}){
  return {
  uid:users.get('authedId'),
  isRecording : record.get('isRecording'),
  isFetchingLatLng : record.get('isFetchingLatLng'),
  latestLocation: record.get('latestLocation'),
  latestFetch : record.get('latestFetch'),
  latestFetchAttempt : record.get('latestFetchAttempt'),
  location : record.get('latestLocation'),
  isCapturing:record.get('isCapturing'),
  isUploading:record.get('isUploading'),
  }
}

function mapDispatch(dispatch){
  return bindActionCreators({...recordActionCreators,...dingsActionCreators, ...dingFeedActionCreators},dispatch)
}


export default connect(mapState,mapDispatch)(RecordContainer)
