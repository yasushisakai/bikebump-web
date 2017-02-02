import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { storeBlob } from 'helpers/storage'

import { SoundClip } from 'components'

const SoundClipContainer = React.createClass({
  handleClick (){
    console.log('click')
  },
  handleStart (){
    this.chunks = []
    this.mediaRecorder.start()
    console.log(this.mediaRecorder.state)
  },
  handleStop (){
      this.mediaRecorder.stop()
      console.log(this.mediaRecorder.state)
  },
  componentDidMount () {
    if(navigator.getUserMedia) {
      navigator.getUserMedia(
          { audio:true },
          (stream) =>{
            // success callback
            const options = {mimeType:'audio/wav'}
            this.mediaRecorder = new MediaRecorder(stream,options)

            this.mediaRecorder.onstop = (e)=>{
              console.log('onstop')
              const blob = new Blob(this.chunks,{'type':'audio/wav'})
              storeBlob('test.wav',blob)
              console.log(window.URL.createObjectURL(blob))
              this.chunks = []
              console.log('stopped')
            }

            this.mediaRecorder.ondataavailable = (e) =>{
              this.chunks.push(e.data)
            }

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