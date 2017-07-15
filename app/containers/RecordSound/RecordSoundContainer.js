// @flow
import React from 'react';
import { RecordSound } from 'components';
import { connect } from 'react-redux';
import { Recorder } from 'helpers/Sound';
import { storeBlob } from 'helpers/storage';
import { bindActionCreators, type Dispatch } from 'redux';
import * as recordSoundActionCreators from 'modules/recordSound';
import { AudioContext } from 'config/constants';

type Props = {
    isRecording: boolean;
    lastStart: number;
    setRecording: Function;
  }

class RecordSoundContainer extends React.Component<void, Props, void> {
    componentDidMount () {
    // audio
        this.audioContext = new AudioContext();

        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                let source = this.audioContext.createMediaStreamSource(stream);
                const config = {
                    recordDuration: 6000,
                    numChannels: 1, // mono
                };
                this.recorder = new Recorder(source, config);
                this.recorder.record();
            }).catch((error) => console.error(error));
    }

  // FIXME: resove any things
  audioContext: any;
  recorder: any;

  handleRecord () {
        if (!this.props.isRecording) {
            this.props.setRecording(true);
            this.recorder.exportWAV((blob) => {
                const filename = `test/testRecord_${Date.now()}.wav`;
                storeBlob(filename, blob)
                    .then(() => this.props.setRecording(false));
            });
        }
    }

  render () {
        return (
            <RecordSound
                isRecording={this.props.isRecording}
                handleRecord={this.handleRecord}/>
        );
    }
}

function mapStateToProps ({recordSound}) {
    return {
        isRecording: recordSound.get('isRecording'),
        lastStart: recordSound.get('lastStart'),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators(recordSoundActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordSoundContainer);
