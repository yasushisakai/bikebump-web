import React, { PropTypes } from 'react'
import { RecordSound } from 'components'
import { connect } from 'react-redux'
import { Recorder } from 'helpers/Sound'
import { storeBlob } from 'helpers/storage'
import { bindActionCreators } from 'redux'
import * as recordSoundActionCreators from 'modules/recordSound'

const RecordSoundContainer = React.createClass({
  propTypes: {
    isRecording: PropTypes.bool.isRequired,
    lastStart: PropTypes.number.isRequired,

    setRecording: PropTypes.func.isRequired,
  },
  componentDidMount () {
    // audio
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {audio: true},
        (stream) => {
          let source = this.audioContext.createMediaStreamSource(stream)
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
  },
  handleRecord () {
    if (!this.props.isRecording) {
      this.props.setRecording(true)
      this.recorder.exportWAV((blob) => {
        const filename = 'testRecording.wav'
        storeBlob(filename, blob)
          .then(() => this.props.setRecording(false))
      })
    }
  },
  render () {
    return (
     <RecordSound
      isRecording={this.props.isRecording}
      handleRecord={this.handleRecord}/>
    )
  },
})

function mapStateToProps ({recordSound}) {
  return {
    isRecording: recordSound.get('isRecording'),
    lastStart: recordSound.get('lastStart'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(recordSoundActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordSoundContainer)
