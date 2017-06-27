// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Calibrate } from 'components';
import { Map } from 'immutable';
import { fitCanvas } from 'helpers/utils';
import * as userSettingsActionCreators from 'modules/userSettings';
import { Analyser } from 'helpers/Sound';
import Pen from 'helpers/Pen';
import { updateUserSettings } from 'helpers/api';

type Props = {
    uid: string;
    isFetching: boolean;
    isCalibrating: boolean;
    noSettings: boolean;
    settings: any;
    enableRingBellMode: Function;
    disableRingBellMode: Function;
    handleFetchingUserSettings: Function;
    handleUpdateTargetFrequency: Function;
    toggleCalibration: Function;
};

class CalibrateContainer extends React.Component<void, Props, void> {
  constructor (props) {
    super(props);
    this.toggleCalibration = this.toggleCalibration.bind(this);
    this.toggleRingBell = this.toggleRingBell.bind(this);
    this.setup = this.setup.bind(this);
    this.draw = this.draw.bind(this);
  }
  componentDidMount () {
    this.calibrateElement = ((document.getElementById('calibrate'):any): HTMLElement);
    this.canvas = document.createElement('canvas');
    this.calibrateElement.insertBefore(this.canvas, this.calibrateElement.firstChild);
    fitCanvas(this.canvas);
    this.pen = new Pen(this.canvas);
    if (this.props.noSettings) {
      this.props.handleFetchingUserSettings(this.props.uid);
    }

    this.maxSlopes = [0, 0];
    this.audioContext = new AudioContext();
    this.analyser = new Analyser(this.audioContext);
    this.analyser.setIsInFocus(true);
    // this sets will splice the raw data
    // into a specific range to 2k - 4k

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        (stream) => {
          let source = this.audioContext.createMediaStreamSource(stream);
          source.connect(this.analyser.input);
          this.analyser.connect();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('user get media error');
    }

    this.setup();
    this.draw();
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.animation);
  }

  // FIXME: clear any types up
  calibrateElement: HTMLElement;
  canvas: HTMLCanvasElement;
  pen: any;
  slopes: Array<number>;
  maxSlopes: Array<number>;
  audioContext: any;
  analyser: any;
  animation: ?number;
  targetFrequency: number;
  binWidth: number;

  toggleCalibration () {
    this.props.toggleCalibration();
    if (!this.props.isCalibrating) {
      this.slopes = [0, 0]; // reset slopes
    } else {
      this.props.handleUpdateTargetFrequency(this.props.uid, this.targetFrequency);
    }
  }

  toggleRingBell (value: boolean) {
    if (value) {
      this.props.disableRingBellMode(this.props.uid);
    } else {
      this.props.enableRingBellMode(this.props.uid);
    }

    updateUserSettings(this.props.uid, 'useRingBell', !value);
  }

  //
  // p5.js functions
  //

  setup () {
    const dataArray = this.analyser.updateDataArray();
    this.binWidth = this.canvas.width / dataArray.length;
  }

  draw () {
    this.animation = window.requestAnimationFrame(this.draw);
    this.pen.clear();

    // update dataArray
    const dataArray = this.analyser.updateDataArray();

    // draw polyline
    this.pen.stroke('white');
    this.pen.ctx.beginPath();
    dataArray.map((bin, index) => {
      const x = index * this.binWidth;
      const y = (this.canvas.height) * (1 - bin / 256);
      this.pen.ctx.lineTo(x, y);
    });
    this.pen.ctx.stroke();

    // draw peak
    if (this.props.isCalibrating) {
      const peakIndex = this.analyser.getPeakIndex();
      this.pen.stroke('yellow');
      this.pen.drawVerticalAxis(peakIndex * this.binWidth, this.canvas.height);

      const tempSlope = this.analyser.getSlopes(peakIndex);
      if (tempSlope[0] > this.maxSlopes[0] && tempSlope[1] > this.maxSlopes[1]) {
        this.maxSlopes = tempSlope;
        this.targetFrequency = this.analyser.indexToFrequency(peakIndex);
      }
    }

    // draw current frequency setting
    const currentFreqIndex = this.analyser.frequencyToIndex(this.targetFrequency);
    this.pen.stroke('red');
    this.pen.drawVerticalAxis(currentFreqIndex * this.binWidth, this.canvas.height);

    this.pen.fill('white');
    this.pen.noStroke();
    this.pen.ctx.fillText(
      this.targetFrequency,
      currentFreqIndex * this.binWidth,
      this.canvas.height * 0.5
    );
  }

  render () {
    return (
      <Calibrate
        isFetching={this.props.isFetching}
        isCalibrating={this.props.isCalibrating}
        toggleCalibration={this.toggleCalibration}
        targetFrequency={this.props.settings.get('targetFrequency')}
        isRingBellEnabled={this.props.settings.get('useRingBells')}
        toggleRingBell={this.toggleRingBell} />
    );
  }
}

function mapStateToProps (state, props) {
  const uid: string = props.params.uid;
  return {
    uid,
    isCalibrating: state.userSettings.get('isCalibrating'),
    // isRingBellEnabled : state.userSettings.getIn([uid,'useRingBells']),
    isFetching: state.users.get('isFetching') || state.userSettings.get('isFetching') || !state.users.get('isAuthed'),
    noSettings: !state.userSettings.get(uid),
    settings: state.userSettings.get(uid) || new Map(),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(userSettingsActionCreators, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(CalibrateContainer);
