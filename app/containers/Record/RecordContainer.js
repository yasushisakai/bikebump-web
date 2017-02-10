import React, {PropTypes} from 'react'
import { Record } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { refreshLatLng, getSlopes } from 'helpers/utils'
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
    dispatch:PropTypes.func.isRequired,
    isCapturing:PropTypes.bool.isRequired,
    isUploading:PropTypes.bool.isRequired,
  },

  componentDidMount () {
    console.clear()

    this.noSleep = new NoSleep()
    this.noSleep.enable()

    // listen to dings if not already
    this.props.handleSetDingListener()
    this.interval = null
    this.latestDing = null
    this.props.handleFetchLatLng()

    this.latestDing = null


    this.props.handleFetchLatLng()

    this.slopes = [0,0]
    this.flag1 = false
    this.previousSpike = Date.now()

    //audio Context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = audioContext.createAnalyser()
    this.analyser.fftsize = 2048
    console.log(audioContext.sampleRate/this.analyser.fftsize)

    this.highpassFilter = audioContext.createBiquadFilter();
    this.highpassFilter.type = 'highpass';
    this.highpassFilter.frequency.value = 2600;
    this.highpassFilter.Q.value = 10;

    this.analyser.minDecibels = -80;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(this.dataArray)

    if(navigator.getUserMedia){
      navigator.getUserMedia(
        {audio:true},
        (stream) => {
          let source = audioContext.createMediaStreamSource(stream)
          // apply filters here
          source.connect(this.highpassFilter)
          this.highpassFilter.connect(this.analyser)

        },
        (error) => {
            console.error(error)
        }
        )
    }else{
      console.error('cannot access to microphone')
    }

    // canvas for visualization
    const app = document.getElementById('app')
    // const canvasContainer = document.createElement('div')
    // canvasContainer.id = 'canvasContainer'
    this.canvas = document.createElement('canvas')
    app.appendChild(this.canvas)
    this.canvas.style.width='100%'
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.id = 'freqVis'

    canvas.width = app.offsetWidth
    canvas.style.marginLeft = 'auto'
    canvas.style.marginRight = 'auto'
    app.appendChild(canvas)
    this.canvasContext = canvas.getContext('2d')

  },
  draw () {
    window.requestAnimationFrame(this.draw)

    const width = this.canvasContext.canvas.clientWidth
    const height = this.canvasContext.canvas.clientHeight

    this.canvasContext.clearRect(0,0,width,height)

    function getIndexFromFreq (frequency,analyser) {
      // 23 comes from sampleRate/fftsize
      return Math.round(frequency/(23.4375))
    }

    function getFreqFromIndex (index,analyser) {
      return index*23.4375 
    }

    this.analyser.getByteFrequencyData(this.dataArray)
    
    const minRange = getIndexFromFreq(2000)
    const maxRange = getIndexFromFreq(4000)
    const newDataArray = this.dataArray.slice(minRange,maxRange)


    const binWidth = width / newDataArray.length
    this.canvasContext.strokeStyle = 'white'
    this.canvasContext.lineWidth = 1.0

    this.canvasContext.beginPath()
    for(let i=0; i<newDataArray.length ;i++){
      // console.log(this.dataArray)
      const x = binWidth * i + binWidth/2.0
      const y = height - (newDataArray[i]/256)*height
      this.canvasContext.lineTo(x,y)
    }

    this.canvasContext.stroke()

    const peakIndex = newDataArray.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

    this.canvasContext.strokeStyle = 'red'
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(peakIndex*binWidth+binWidth*0.5,0)
    this.canvasContext.lineTo(peakIndex*binWidth+binWidth*0.5,height)

    this.canvasContext.stroke()

    this.canvasContext.strokeStyle = 'blue'
    this.canvasContext.beginPath()
    this.canvasContext.moveTo((peakIndex-2)*binWidth+binWidth*0.5,0)
    this.canvasContext.lineTo((peakIndex-2)*binWidth+binWidth*0.5,height)
    this.canvasContext.stroke()

    this.canvasContext.beginPath()
    this.canvasContext.moveTo((peakIndex+2)*binWidth+binWidth*0.5,0)
    this.canvasContext.lineTo((peakIndex+2)*binWidth+binWidth*0.5,height)

    this.canvasContext.stroke()

    this.canvasContext.fillStyle = 'white'
    this.canvasContext.textAlign = 'center'
    this.canvasContext.textBaseline = 'bottom'
    this.canvasContext.font='12px sans-serif'
    this.canvasContext.fillText(getFreqFromIndex(peakIndex+minRange),peakIndex*binWidth+binWidth*0.5,height*0.1)


    //console.log(getSlopes(newDataArray,peakIndex))
    this.slopes = getSlopes(newDataArray,peakIndex)
    // if(slopes[0] > this.slopes[0]){
    //   this.slopes[0] = slopes[0]
    //   console.log(this.slopes)
    // }

    // if(slopes[1] > this.slopes[1]){
    //   this.slopes[1] = slopes[1]
    //   console.log(this.slopes)
    // }

    // detection
    if (this.slopeTest(Date.now()+'#01') && !this.flag1 && (Date.now()-this.previousSpike)> 300){
      console.log('#01',getFreqFromIndex(peakIndex+minRange),this.slopes)
      this.flag1 = true
      this.recentSlopeIndex = peakIndex
      this.previousSpike = Date.now()
    }

    if(this.flag1 === true && (Date.now() - this.previousSpike) > 200) {
        const sameIndexSlope = getSlopes(newDataArray,this.recentSlopeIndex)
        console.log('#02',getFreqFromIndex(this.recentSlopeIndex+minRange),sameIndexSlope)
        this.flag1 = false
        this.previousSpike = Date.now()
    }

  },
  slopeTest(id=0){
    const result = this.slopes[0] > 25 && this.slopes[1] > 25
    // if(result) console.log(id,this.slopes)
    return result
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
    //this.props.dispatch(this.props.stopCapture())
    this.SoundClip.stopAndUpload();
    this.SoundClip.record();
    //this.props.dispatch(this.props.startCapture());

    return this.props.handleComplieDing(
        this.props.uid,
        this.props.latestLocation.toJS(),
        this.props.latestFetch,
        10,
        0
    );

    /*this.duplicateLatestDing = this.latestDing
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
     */
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
    this.noSleep.disable()
    // todo move this to main?
    if(this.props.isRecording === true) {
      this.props.toggleRecording()
    }
    window.clearInterval(this.interval)
    this.interval = null

    // remove the freqVis canvas
    const app = document.getElementById('app')
    app.removeChild(document.getElementById('freqVis'))

  },

  render () {
    if(this.canvasContext) this.draw()
    return <div></div>
  },
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
