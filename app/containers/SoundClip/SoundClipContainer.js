import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { storeBlob } from 'helpers/storage'

import { SoundClip } from 'components'
import Recorder from 'helpers/Recorder'
import { fetchGeoLocation, formatWavFileName } from 'helpers/utils'


const SoundClipContainer = React.createClass({
  handleClick (){
    console.log('click')
  },
  handleStart (){
    this.recorder.record()
    console.log('recording...')
  },
  handleStop (){
    this.recorder.stop()
    console.log('stopped')
    this.recorder.exportWAV((blob)=>{

      fetchGeoLocation()
        .then((coordinate)=>{
          console.log('got latlng')
          const now = new Date()
          return formatWavFileName(now,coordinate)
        })
        .then((filename)=>storeBlob(filename,blob))
        .then(console.log('uploaded'))
    })
  },
  componentDidMount () {

    const audio_context = new AudioContext();

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
      <SoundClip onClickStart={this.handleStart} onClickStop={this.handleStop}/>
    )
  },
})

// function mapStateToProps (state) {
//   return {

//   }
// }

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

// export default connect(mapStateToProps, 
// mapDispatchToProps)(SoundClipContainer)
export default SoundClipContainer