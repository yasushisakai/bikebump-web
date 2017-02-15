import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Calibrate } from 'components'
import { toJS, Map } from 'immutable'
import { getSlopes ,frequencyToIndex, indexToFrequency, insertAfter, fitCanvas} from 'helpers/utils'
import * as userSettingsActionCreators from 'modules/userSettings'
import { Analyser } from 'helpers/Sound'
import Pen from 'helpers/Pen'

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
    this.calibrateElement = document.getElementById('calibrate')
    this.canvas = document.createElement('canvas')
    this.calibrateElement.insertBefore(this.canvas,this.calibrateElement.firstChild)
    fitCanvas(this.canvas)

    this.pen = new Pen(this.canvas)

    if(this.props.noSettings){
      this.props.handleFetchingUserSettings(this.props.uid)
    }

    this.maxSlopes = [0,0]

    this.audioContext = new AudioContext()
    this.analyser = new Analyser(this.audioContext)
    this.analyser.setIsInFocus(true) 
    // this sets will splice the raw data 
    // into a specific range to 2k - 4k

    if(navigator.getUserMedia){
      navigator.getUserMedia(
        {audio:true},
        (stream)=>{
          let source = this.audioContext.createMediaStreamSource(stream)
          source.connect(this.analyser.input)
          this.analyser.connect()
        },
        (error)=>{
          console.error(error)
        }
        )
      }else{
        console.error('user get media error')
      }

      this.setup()
      this.draw()

  },
  toggleCalibration () {
    this.props.toggleCalibration()
    if(!this.props.isCalibrating){
      this.slopes = [0,0] // reset slopes
    }else{
      this.props.handleUpdateTargetFrequency(this.props.uid,this.targetFrequency)
    }
  },
  setup(){
    const dataArray = this.analyser.updateDataArray()
    this.binWidth = this.canvas.width / dataArray.length
  },
  draw(){
    window.requestAnimationFrame(this.draw)
    this.pen.clear()

    // update dataArray
    const dataArray = this.analyser.updateDataArray()

    // draw polyline
    this.pen.stroke('white')
    this.pen.ctx.beginPath()
    dataArray.map((bin,index)=>{
      const x = index * this.binWidth
      const y = (this.canvas.height)*(1-bin/256)
      this.pen.ctx.lineTo(x,y)
    })
    this.pen.ctx.stroke()
   
    // draw peak
    if(this.props.isCalibrating){
      const peakIndex = this.analyser.getPeakIndex()
      this.pen.stroke('yellow')
      this.pen.drawVerticalAxis(peakIndex*this.binWidth, this.canvas.height)

      const tempSlope = this.analyser.getSlopes(peakIndex)
      if(tempSlope[0] > this.maxSlopes[0] && tempSlope[1] > this.maxSlopes[1]){
        this.maxSlopes = tempSlope
        this.targetFrequency = this.analyser.indexToFrequency(peakIndex)
      }
    }

    // draw current frequency setting
    const currentFreqIndex = this.analyser.frequencyToIndex(this.targetFrequency)
    this.pen.stroke('red')
    this.pen.drawVerticalAxis(currentFreqIndex*this.binWidth,this.canvas.height)

    this.pen.fill('white')
    this.pen.noStroke()
    this.pen.ctx.fillText(
      this.targetFrequency,
      currentFreqIndex*this.binWidth,
      this.canvas.height*0.5
      )
  },
  render () {
    return(
      <Calibrate
        isFetching={this.props.isFetching} 
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