// @flow

import React from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { PlaySound } from 'components';
import { AudioContext } from 'config/constants';

import TonePlayer from 'helpers/Sound/Synth';

class PlaySoundContainer extends React.Component {
    componentDidMount () {
        const audioContext = new AudioContext();
        this.tonePlayer = new TonePlayer(audioContext);
    }

  tonePlayer: any;

  playSound () {
        console.log('play sound');
    }

  togglePlay () {
        this.tonePlayer.play(440);
    // setTimeout(this.tonePlayer.play(880),2000)
    }

  render () {
        return (
            <PlaySound onClickPlaySound={this.togglePlay}/>
        );
    }
}

// function mapStateToProps (state) {
//   return {

//   }
// }

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

// export default connect(mapStateToProps,
// mapDispatchToProps)(PlaySoundContainer)
export default PlaySoundContainer;
