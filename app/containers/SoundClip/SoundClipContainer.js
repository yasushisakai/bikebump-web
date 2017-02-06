import React, { PropTypes } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { storeBlob } from 'helpers/storage'
import { recordDuration, waitDuration } from 'config/constants'

import { SoundClip } from 'components'
import Recorder from 'helpers/Recorder'
import { fetchGeoLocation, formatWavFileName } from 'helpers/utils'
import {startCapture, stopCapture, uploadingClip, uploadingClipSuccess} from 'modules/record'


const SoundClipContainer = React.createClass({
  propTypes:{
    //dispatch:PropTypes.func.isRequired,
    isCapturing:PropTypes.bool.isRequired,
    isUploading:PropTypes.bool.isRequired,
  },
  handleClick (e){
    if(this.props.isCapturing !== true){
      setTimeout(this.startRecord,waitDuration)
      e.preventDefault() 
    }
  },
  startRecord () {
    this.recorder.clear()
    this.recorder.record()
    console.log('recording...')
    this.props.dispatch(startCapture())
    setTimeout(this.stopAndUpload,recordDuration)
  },
  stopAndUpload () {
    console.log('stopAndUpload')
    this.recorder.stop()
    this.props.dispatch(stopCapture())
    this.recorder.exportWAV((blob)=>{
      this.isCapturing = false
      fetchGeoLocation()
        .then((coordinate)=>{
          const now = new Date()
          return formatWavFileName(now,coordinate)
        })
        .then((filename)=>{
          //storeBlob(filename,blob)})
          this.recorder.getBuffer((buf)=>{
            this.bufferSize = buf[0].length
            this.props.dispatch(uploadingClip())
          })
        })
        .then(()=>{
          return this.props.dispatch(uploadingClipSuccess())
        })
    })
  },
  componentDidMount () {
    this.isCapturing = false
    const audio_context = new AudioContext()
    this.bufferSize = 0
    if(navigator.getUserMedia) {
      navigator.getUserMedia(
          { audio:true },
          (stream) =>{
            const input = audio_context.createMediaStreamSource(stream)
            this.recorder = new Recorder(input)
          },
          (error)=>{
            // error callback
          }
        )
    }else{
      console.log('getUserMedia not supported on your browser!')
    }
  },
  render () {
    return (
      <SoundClip onClick={this.handleClick} isCapturing={this.props.isCapturing} bufferSize={this.bufferSize}/>
    )
  },
})

function mapStateToProps (state) {
  return {
    isCapturing:state.record.get('isCapturing'),
    isUploading:state.record.get('isUploading'),
  }
}

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

 export default connect(mapStateToProps)(SoundClipContainer)
//export default SoundClipContainer