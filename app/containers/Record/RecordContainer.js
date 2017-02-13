import React, {PropTypes} from 'react'
import { Record } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { refreshLatLng, getSlopes, getMouseCoordinates, detectionGap, formatWavFileName } from 'helpers/utils'
import { Map } from 'immutable'
import { updateCycleDuration } from 'config/constants'
import * as recordActionCreators from 'modules/record'
import * as dingsActionCreators from 'modules/dings'
import * as dingFeedActionCreators from 'modules/dingFeed'
import * as userSettingsActionCreators from 'modules/userSettings'
import Pen from 'helpers/Pen'
import { Analyser, Recorder } from 'helpers/Sound'
import { firebaseAuth} from 'config/constants'
import { getCurrentUser } from 'helpers/auth'
import { storeBlob } from 'helpers/storage'
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
    handleFetchingUserSettings : PropTypes.func.isRequired,
    uploadingClip : PropTypes.func.isRequired,
    uploadingClipSuccess : PropTypes.func.isRequired, 
  },

  componentDidMount () {
    // console.clear()
    if(this.props.uid === '' && this.props.settings == new Map()){
      getCurrentUser().then(user=>{
        // console.log(user)
        this.props.handleFetchingUserSettings(user.uid)
          .then(action=>{
            this.targetFrequency = action.settings.targetFrequency
          })
      })
    }

    this.contents = document.getElementById('contents')
    this.canvas = document.createElement('canvas')
    this.contents.appendChild(this.canvas)

    this.canvas.style.width = '100%'
    this.canvas.style.flex='1 0'
    this.canvas.width =  contents.offsetWidth
    this.canvas.height = contents.offsetHeight 

    this.noSleep = new NoSleep()
    this.noSleep.enable()

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = new Analyser(this.audioContext)
    this.analyser.setIsInFocus(true)
    const dataArray = this.analyser.updateDataArray()
    this.binWidth = this.canvas.width / dataArray.length

    // listen to server dings if not already
    this.props.handleSetDingListener()
    this.interval = null
    this.latestDing = null
    this.props.handleFetchLatLng()

    this.latestDing = null


    this.props.handleFetchLatLng()

    this.slopes = [0,0]
    this.flag = false
    this.secondFlag = false
    this.isDing = false
    this.previousSpike = Date.now()

    if(navigator.getUserMedia){
      navigator.getUserMedia(
        {audio:true},
        (stream) => {

                    // const dataArray = this.analyser.updateDataArray()

          let source = this.audioContext.createMediaStreamSource(stream)
          // apply filters here
          source.connect(this.analyser.input)
          this.analyser.connect()

          this.recorder = new Recorder(source)
          this.recorder.record()
        },
        (error) => {
            console.error(error)
        }
        )
    }else{
      console.error('cannot access to microphone')
    }


  },
  componentWillUpdate () { // this is like 'setup' in p5

    // canvas for visualization

    // contents.appendChild(this.canvas)

    this.canvas.style.width = '100%'
    // this.canvas.style.height = '100%'
    // this.canvas.style.flex='1 0'
    this.canvas.width =  contents.offsetWidth
    this.canvas.height = contents.offsetHeight

    this.canvas.style.display = 'flex'

    this.circleRadius = this.canvas.width/3 

    this.canvas.onclick = this.mousePressed
    this.canvas.addEventListener('mousemove',this.mouseMoved)



    this.pen = new Pen(this.canvas)
    this.canvasContext = this.canvas.getContext('2d')

    this.draw()

  },
  draw () {
      this.animation = window.requestAnimationFrame(this.draw)
      this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height)

      if(!this.analyser) return

    // draw a circle 
    if(!this.props.isRecording){
      this.pen.noFill()
        this.pen.stroke('#ffffff')
    }else{
      this.pen.noStroke()
      if(this.isDing){
        this.pen.fill('red')
      }else{
        this.pen.fill('orange')
      }
    }
    this.pen.drawCircle(
    this.canvas.width/2.0,
    this.canvas.height/2.0,
    this.circleRadius)

    // update dataArray
    if(this.props.isRecording){
      const dataArray = this.analyser.updateDataArray()

      // draw polyline
      this.pen.stroke('white')
      this.canvasContext.beginPath()
      dataArray.map((bin,index)=>{
        const x = index * this.binWidth
        const y = (this.canvas.height)*(1-bin/256)
        this.canvasContext.lineTo(x,y)
      })
      this.canvasContext.stroke()
    }
   
    // draw current frequency setting
    const currentFreqIndex = this.analyser.frequencyToIndex(this.targetFrequency)
    // this.pen.stroke('red')
    // this.pen.drawVerticalAxis(currentFreqIndex*this.binWidth,this.canvas.height)

    // this.pen.fill('white')
    // this.pen.noStroke()
    // this.pen.text(
    //   this.targetFrequency,
    //   currentFreqIndex*this.binWidth,
    //   this.canvas.height*0.5
    //   )

    const freqSlope = this.analyser.getSlopes(currentFreqIndex)

    if(detectionGap(this.previousSpike)){
      this.isDing = false
      // console.log(freqSlope)
    }

    if((freqSlope[0]>10 || freqSlope[1]>10) && !this.flag && detectionGap(this.previousSpike)) {
      console.log('1',freqSlope)
      this.flag = true
      this.previousSpike = Date.now()
    }

    if(this.flag && detectionGap(this.previousSpike) && !this.secondFlag){
      console.log('2',freqSlope)
      if (freqSlope[0]>10 || freqSlope[1]>10) this.secondFlag = true
      else{this.flag = false}
      this.previousSpike = Date.now()
    } 

    if(this.secondFlag && detectionGap(this.previousSpike)){
     console.log('3',freqSlope)
      this.flag = false
      this.secondFlag = false
      if(freqSlope[0]>5 && freqSlope[1]>5){
        if(this.props.isRecording){
          this.handleReport(0) 
          this.upload()
        }
        console.log('ding')
        this.isDing = true
      }
      this.previousSpike = Date.now()
    } 

  },
  mousePressed(event){
    const distanceFromCenter = this.pen.distance(
      this.pen.mouseX,
      this.pen.mouseY,
      this.canvas.width/2.0,
      this.canvas.height/2.0
      )
    if(distanceFromCenter<this.circleRadius){
      this.props.toggleRecording()
    }
  },
  mouseMoved(event){
    this.pen.updateMouse(event)
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
  handleReport (value) {
    // add a ding
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
  upload () {
    if(this.props.isUploading) return

    this.props.uploadingClip()
    this.recorder.exportWAV((blob)=>{
      const now = new Date(this.props.latestFetchAttempt)
      const coordinate = this.props.latestLocation.toJS()
      const filename = formatWavFileName(now,coordinate)
      console.log(filename)
      storeBlob(filename,blob)
        .then(()=>this.props.uploadingClipSuccess())
    })
    
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
    // this.recorder.stop()

    this.contents.removeChild(this.canvas)
    if (this.audioContext) this.audioContext.close()

  },

  render () {
    return null
  },
})

function mapState({record,users,userSettings}){
  const uid = users.get('authedId')
  return {
  uid,
  isRecording : record.get('isRecording'),
  isFetchingLatLng : record.get('isFetchingLatLng'),
  latestLocation: record.get('latestLocation'),
  latestFetch : record.get('latestFetch'),
  latestFetchAttempt : record.get('latestFetchAttempt'),
  location : record.get('latestLocation'),
  settings : userSettings.get(uid) || new Map(), 
  isUploading : record.get('isUploading'),
  }
}

function mapDispatch(dispatch){
  return bindActionCreators({
    ...recordActionCreators,
    ...dingsActionCreators, 
    ...dingFeedActionCreators,
    ...userSettingsActionCreators
  },dispatch)
}


export default connect(mapState,mapDispatch)(RecordContainer)
