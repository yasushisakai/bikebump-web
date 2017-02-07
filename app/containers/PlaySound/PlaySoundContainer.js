import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PlaySound } from 'components'

const PlaySoundContainer = React.createClass({
  playSound () {
    console.log('play sound')
  },
  componentDidMount () {

    this.isPlaying = false
    
    // VCO
    const audio_context = new AudioContext()
    this.vco = audio_context.createOscillator()
    this.vco.type = this.vco.SINE
    this.vco.frequency.value = 440
    this.vco.start(0)

    // VCA
    this.vca = audio_context.createGain()
    this.vca.gain.value = 0

    // connection
    this.vco.connect(this.vca)
    this.vca.connect(audio_context.destination);
    
    this.isPlaying = false

  },
  togglePlay () {

    console.log(this.isPlaying)

    if(this.isPlaying){
      this.vca.gain.value = 0
      this.isPlaying = false
    }else{
      this.vca.gain.value = 1
      this.isPlaying = true
    }
  },
  render () {
    return (
  <PlaySound onClickPlaySound={this.togglePlay.bind(this)}/>
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
// mapDispatchToProps)(PlaySoundContainer)
export default PlaySoundContainer