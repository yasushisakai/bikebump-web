import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Pen from 'helpers/Pen'
import { fitCanvas } from 'helpers/utils'
import { Record } from 'components'
import NoSleep from 'nosleep'
import { Analyser, Recorder } from 'helpers/Sound'
import { updateCycleDuration } from 'config/constants'

import * as userSettingsActionCreators from 'modules/userSettings'
import * as recordActionCreators from 'modules/record'
import * as dingsActionCreators from 'modules/dings'
import * as dingFeedActionCreators from 'modules/dingFeed'
import * as userDingActionCreators from 'modules/userDings'

const RecordContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
    isRecording: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
    latestLocation: PropTypes.object.isRequired,
    currentCommuteId: PropTypes.string,
    latestFetch: PropTypes.number.isRequired,
    lastDetection: PropTypes.number.isRequired,
    targetFrequency: PropTypes.number,

    handleSetDingListener: PropTypes.func.isRequired,
    handleFetchingUserSettings: PropTypes.func.isRequired,
    handleFetchingUserDings: PropTypes.func.isRequired,
    toggleRecording: PropTypes.func.isRequired,
    handleFetchLatLng: PropTypes.func.isRequired,
    handleComplieDing: PropTypes.func.isRequired,
    uploadingClip: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
    handleDetection: PropTypes.func.isRequired,
  },
  componentDidMount () {
    // setting dom elements
    this.canvas = document.createElement('canvas')
    this.recordElement = document.getElementById('record')
    this.recordElement.appendChild(this.canvas)
    fitCanvas(this.canvas)

    // fetching data
    this.props.handleSetDingListener()
    this.props.handleFetchingUserSettings(this.props.authedId)
    this.props.handleFetchingUserDings(this.props.authedId)
    this.latLngInterval = null

    this.pen = new Pen(this.canvas)
    // plot to html5 canvas (p5 replacement) this.pen = new Pen(this.canvas)

    // audio
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = new Analyser(this.audioContext)
    this.analyser.setIsInFocus(true)

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {audio: true},
        (stream) => {
          let source = this.audioContext.createMediaStreamSource(stream)
          source.connect(this.analyser.input)
          this.analyser.connect()
          this.recorder = new Recorder(source)
          this.recorder.record()
        },
        (error) => {
          console.error(error)
        }
      )
    } else {
      console.error('user get media error')
      // switch to button mode
    }

    // library that prevents the phone to goto sleep mode
    this.noSleep = new NoSleep()
    this.noSleep.enable()

    // canvas functions
    this.setup()
    this.draw() // 'endless loop'
  },
  componentWillUnmount () {
    window.cancelAnimationFrame(this.animation)

    if (this.latLngInterval !== null) {
      window.clearInterval(this.latLngInterval)
      this.latLngInterval = null
    }

    // stop recording
    if (this.props.isRecording === true) {
      this.props.toggleRecording()
    }
  },
  setup () {
    const dataArray = this.analyser.updateDataArray()
    this.binWidth = this.canvas.width / dataArray.length
    this.circleRadius = this.canvas.width * 0.325

    //
    // Detection
    //
    this.firstFlag = false
    this.secondFlag = false
    this.isDing = false
    this.previousSpike = Date.now()

    this.canvas.onclick = this.mousePressed
    this.canvas.addEventListener('mousemove', this.mouseMoved)
  },
  draw () {
    this.animation = requestAnimationFrame(this.draw)

    if (this.props.isFetching) {
      return
    }

    this.pen.clear()

    if (this.props.isRecording) {
      // draw the polyline
      const dataArray = this.analyser.updateDataArray()
      this.pen.stroke('white')
      this.pen.ctx.beginPath()
      dataArray.map((bin, index) => {
        const x = index * this.binWidth
        const y = this.canvas.height * (1 - bin / 256)
        this.pen.ctx.lineTo(x, y)
      })
      this.pen.ctx.stroke()

      // draw current target frequency
      const freqIndex = this.analyser.frequencyToIndex(this.props.targetFrequency)
      this.pen.stroke('red')
      this.pen.drawVerticalAxis(freqIndex * this.binWidth, this.canvas.height)

      //
      // Detection
      // climbing up the stairs
      //

      this.props.handleDetection(this.analyser.getSlopes(freqIndex))

      /*
      const freqSlope = this.analyser.getSlopes(freqIndex)
      if (detectionGap(this.previousSpike)) {
        this.isDing = false
      }

      if ((freqSlope[0] > 10 || freqSlope[1] > 10) && !this.firstFlag && detectionGap(this.previousSpike)) {
        console.log('1', freqSlope)
        this.firstFlag = true
        this.previousSpike = Date.now()
      }

      if (this.firstFlag && detectionGap(this.previousSpike) && !this.secondFlag) {
        console.log('2', freqSlope)
        if (freqSlope[0] > 10 || freqSlope[1] > 10) this.secondFlag = true
        else { this.firstFlag = false }
        this.previousSpike = Date.now()
      }

      if (this.secondFlag && detectionGap(this.previousSpike)) {
        console.log('3', freqSlope)
        this.firstFlag = this.secondFlag = false
        if (freqSlope[0] > 5 && freqSlope[1] > 5) {
          console.log('ding')
          this.isDing = true

          // save/upload the ding, will not upload if its already 'isUploading'
          // timestamp and latlng will be used to tie it to the ding
          this.props.handleUpload(
            this.recorder,
            this.props.latestLocation,
            this.props.latestFetch
          )
          window.navigator.vibrate(100)

          // assign ding to firebase
          this.props.handleComplieDing(
            this.props.authedId,
            this.props.latestLocation,
            this.props.currentCommuteId,
            this.props.latestFetch,
            10,
            0
          )
        }

        this.previousSpike = Date.now()
      } // detection ends
      */

      this.pen.noStroke()
      this.pen.fill('white')
      this.pen.text('push again to stop recording', this.canvas.width / 2, this.canvas.height / 4)

      this.pen.noStroke()
      this.pen.fill('red')
    } else {
      this.pen.noStroke()
      this.pen.fill('white')
      this.pen.text('push to record your commute', this.canvas.width / 2, this.canvas.height / 4)
      this.pen.noFill()
      this.pen.stroke('white')
    }
    this.pen.drawCircle(this.canvas.width / 2, this.canvas.height / 2, this.circleRadius)
  },
  updatePosition (commuteId) {
    // window.navigator.vibrate(100)
    this.props.handleFetchLatLng()
  },
  mousePressed (event) {
    const distanceFromCenter = this.pen.distance(
      this.pen.mouseX,
      this.pen.mouseY,
      this.canvas.width / 2.0,
      this.canvas.height / 2.0
      )

    if (distanceFromCenter < this.circleRadius) {
      window.navigator.vibrate(50)
      this.props.toggleRecording()
      .then(response => {
        if (response.isRecording) {
          const fetchFunc = this.updatePosition.bind(this, response.commuteId)
          fetchFunc()
          this.latLngInterval = window.setInterval(fetchFunc, updateCycleDuration)
        } else {
          if (this.latLngInterval !== null) {
            window.clearInterval(this.latLngInterval)
          }
          this.latLngInterval = null
        }
      })
    }
  },
  mouseMoved (event) {
    this.pen.updateMouse(event)
  },

  render () {
    return (
      <Record/>
    )
  },
})

function mapStateToProps (state) {
  const authedId = state.users.get('authedId')
  return {
    isAuthed: state.users.get('isAuthed'),
    authedId,
    isFetching:
      state.users.get('isFetching') ||
      state.userSettings.get('isFetching') ||
      state.dingFeed.get('isFetching'),
    isRecording: state.record.get('isRecording'),
    currentCommuteId: state.record.get('currentCommuteId'),
    isUploading: state.record.get('isUploading'),
    latestLocation: state.record.get('latestLocation').toJS(),
    latestFetch: state.record.get('latestFetch'),
    lastDetection: state.record.get('lastDetection'),
    targetFrequency: state.userSettings.getIn([authedId, 'targetFrequency']),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...userSettingsActionCreators,
    ...recordActionCreators,
    ...dingsActionCreators,
    ...dingFeedActionCreators,
    ...userDingActionCreators,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordContainer)
// export default RecordContainer
