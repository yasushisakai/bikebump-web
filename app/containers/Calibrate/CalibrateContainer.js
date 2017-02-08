import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Calibrate } from 'components'
import { toJS, Map } from 'immutable'
import { getSlopes ,frequencyToIndex, indexToFrequency } from 'helpers/utils'
import * as userSettingsActionCreators from 'modules/userSettings'

const CalibrateContainer = React.createClass({
  propTypes:{
    uid: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isCalibrating:PropTypes.bool.isRequired,
    noSettings:PropTypes.bool.isRequired,
    settings:PropTypes.object.isRequired,
    handleFetchingUserSettings:PropTypes.func.isRequired,
    toggleCalibration:PropTypes.func.isRequired,
  },
  componentDidMount(){
    if(this.props.noSettings){
      this.props.handleFetchingUserSettings(this.props.uid)
    }

    this.slopes = [0,0]

    const audioContext = new AudioContext()

    this.analyser = audioContext.createAnalyser()
    this.analyser.fftsize = 2048
    this.analyser.minDecibels = -80
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(this.dataArray)
    this.analyser.binUnit = audioContext.sampleRate/this.analyser.fftsize

    const highpass = audioContext.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 2600
    highpass.Q.value = 10

    if(navigator.getUserMedia){
      navigator.getUserMedia(
        {audio:true},
        (stream)=>{
          let source = audioContext.createMediaStreamSource(stream)
          source.connect(highpass)
          highpass.connect(this.analyser)
        },
        (error)=>{
          console.error(error)
        }
        )
      }else{
        console.error('user get media error')
      }

      const app = document.getElementById('app')
      this.canvas = document.createElement('canvas')
      app.appendChild(this.canvas)

      this.canvas.style.width = '100%'
      this.canvas.width=this.canvas.offsetWidth
      this.canvasContext = this.canvas.getContext('2d')

      this.minRange = frequencyToIndex(2000,this.analyser)
      this.maxRange = frequencyToIndex(4000,this.analyser)
      this.binWidth = this.canvas.width / (this.maxRange-this.minRange)

  },
  toggleCalibration () {
    this.props.toggleCalibration()
    console.log(this.props.isCalibrating)
    if(!this.props.isCalibrating){
      this.slopes = [0,0] // reset slopes
    }else{
      this.props.handleUpdateTargetFrequency(this.props.uid,this.targetFrequency)
    }
  },
  setup(){
    this.targetFrequency = this.props.settings.get('targetFrequency')
  },
  draw(){
    this.animation = window.requestAnimationFrame(this.draw)
    
    this.analyser.getByteFrequencyData(this.dataArray)
    const focusedDataArray = this.dataArray.slice(this.minRange,this.maxRange)
    this.canvasContext.clearRect(0,0,this.canvas.width,this.canvas.height)
    this.canvasContext.lineWidth = 1.5


    // draw current
    const currentFreqIndex = frequencyToIndex(this.targetFrequency,this.analyser)-this.minRange
    this.canvasContext.strokeStyle='red'
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(currentFreqIndex*this.binWidth,0)
    this.canvasContext.lineTo(currentFreqIndex*this.binWidth,this.canvas.height)
    this.canvasContext.stroke()

    // show freqvalue
    this.canvasContext.fillStyle = 'white'
    this.canvasContext.textAlign = 'center'
    this.canvasContext.textBaseline = 'bottom'
    this.canvasContext.font='12px sans-serif'
    this.canvasContext.fillText(this.targetFrequency,currentFreqIndex*this.binWidth,this.canvas.height*0.5)


    // draw max
    const maxIndex = focusedDataArray.reduce(
      (iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0
    )
    this.canvasContext.strokeStyle='blue'
    this.canvasContext.beginPath()
    this.canvasContext.moveTo(maxIndex*this.binWidth,0)
    this.canvasContext.lineTo(maxIndex*this.binWidth,this.canvas.height)
    this.canvasContext.stroke()

    if(this.props.isCalibrating){
    const tempSlope = getSlopes(focusedDataArray,maxIndex,4)
      if(tempSlope[0] > this.slopes[0] && tempSlope[1] > this.slopes[1]){
        this.slopes = tempSlope
        console.log(this.slopes)
        this.targetFrequency = indexToFrequency(maxIndex+this.minRange,this.analyser)
        console.log(this.targetFrequency)
      }
    }

    this.canvasContext.strokeStyle='white'
    this.canvasContext.beginPath()
    focusedDataArray.map((value,index)=>{
      const x = this.binWidth*index
      const y = this.canvas.height * (1-(value/256))
      this.canvasContext.lineTo(x,y)
    })
    this.canvasContext.stroke()

  },
  componentWillUnmount () {
    console.log('hello')
    const app = document.getElementById('app')
    //document.cancelAnimationFrame(this.animation)
    app.removeChild(this.canvas)
  },
  render () {
    this.setup()
    if(this.analyser) {this.draw()}
    return this.props.isFetching === true 
    ? null
    : (
      <Calibrate 
        isCalibrating={this.props.isCalibrating}
        toggleCalibration={this.toggleCalibration}
        targetFrequency={this.props.settings.get('targetFrequency')}
      />
    )
  },
})

function mapStateToProps (state,props) {
  const uid = props.params.uid
  return {
    uid,
    isCalibrating : state.userSettings.get('isCalibrating'),
    isFetching : state.users.get('isFetching') || state.userSettings.get('isFetching') || !state.users.get('isAuthed'),
    noSettings : !state.userSettings.get(uid),
    settings: state.userSettings.get(uid) || new Map()
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(userSettingsActionCreators,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(CalibrateContainer)