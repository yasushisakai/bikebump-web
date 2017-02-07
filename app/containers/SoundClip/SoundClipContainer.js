import React, { PropTypes } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { storeBlob } from 'helpers/storage'
import { recordDuration, waitDuration } from 'config/constants'

import { SoundClip } from 'components'
import Recorder from 'helpers/Sound/Recorder'
import { fetchGeoLocation, formatWavFileName } from 'helpers/utils'
import {startCapture, stopCapture, uploadingClip, uploadingClipSuccess} from 'modules/record'


const SoundClipContainer = React.createClass({
  propTypes:{
    isUploading:PropTypes.bool.isRequired,
  },
  handleClick (){
    if(this.props.isCapturing !== true){
      setTimeout(this.startRecord,waitDuration)
    }
  },
  startRecord () {
    setTimeout(this.upload,recordDuration)
  },
  upload () {
    this.props.dispatch(uploadingClip())
    this.recorder.exportWAV((blob)=>{
      this.isCapturing = false
      fetchGeoLocation()
        .then((coordinate)=>{
          const now = new Date()
          return formatWavFileName(now,coordinate)
        })
        .then((filename)=>{
          storeBlob(filename,blob)
        })
        .then(()=>{
          return this.props.dispatch(uploadingClipSuccess())
        })
    })
  },
  componentDidMount () {
    this.isCapturing = false
    const audio_context = new AudioContext()
    if(navigator.getUserMedia) {
      navigator.getUserMedia(
          { audio:true },
          (stream) =>{
            const input = audio_context.createMediaStreamSource(stream)
            this.recorder = new Recorder(input)
            // this.recorder.init()
            this.recorder.record() // starts the bin filling
          },
          (error)=>{
            // error callback
          }
        )
    }else{
      console.log('getUserMedia not supported on your browser!')
    }
  },
  componentWillUnmount () {
    this.recorder.stop()
  },
  render () {
    return (
      <SoundClip onClick={this.handleClick} isUploading={this.props.isUploading}/>
    )
  },
})

function mapStateToProps (state) {
  return {
    isUploading:state.record.get('isUploading'),
  }
}

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

 export default connect(mapStateToProps)(SoundClipContainer)
//export default SoundClipContainer