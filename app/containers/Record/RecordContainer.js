// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import Pen, { type Point2D } from 'helpers/Pen';
import FrequencyGraph from 'helpers/FrequencyGraph';
import { fitCanvas, extractActionCreators } from 'helpers/utils';
import { Record } from 'components';
import { Analyser, Recorder } from 'helpers/Sound';
import { updateCycleDuration } from 'config/constants';
import * as userSettingsActionCreators from 'modules/userSettings';
import * as recordActionCreators from 'modules/record';
import * as dingsActionCreators from 'modules/dings';
import * as dingFeedActionCreators from 'modules/dingFeed';
import * as userDingActionCreators from 'modules/userDings';
import type { LatLng } from 'types';

class RecordContainer extends React.Component {
  constructor (props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.setup = this.setup.bind(this);
    this.mouseMoved = this.mouseMoved.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.mousePressed = this.mousePressed.bind(this);
  }

  componentDidMount () {
    // setting dom elements
    this.canvas = document.createElement('canvas');
    this.recordElement = ((document.getElementById('record'): any): HTMLElement);
    this.recordElement.appendChild(this.canvas);
    fitCanvas(this.canvas);

    // fetching data
    this.props.handleSetDingListener();
    this.props.handleFetchingUserSettings(this.props.authedId);
    this.props.handleFetchingUserDings(this.props.authedId);
    this.latLngInterval = null;

    this.pen = new Pen(this.canvas);
    // plot to html5 canvas (p5 replacement) this.pen = new Pen(this.canvas)

    // audio
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = new Analyser(this.audioContext);
    this.analyser.setIsInFocus(true);

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {audio: true},
        (stream) => {
          let source = this.audioContext.createMediaStreamSource(stream);
          source.connect(this.analyser.input);
          this.analyser.connect();
          this.recorder = new Recorder(source);
          this.recorder.record();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('user get media error');
      // switch to button mode
    }

    // canvas functions
    this.setup();
    this.draw(); // 'endless loop'
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.animation);

    if (this.latLngInterval !== null) {
      window.clearInterval(this.latLngInterval);
      this.latLngInterval = null;
    }

    // stop recording
    if (this.props.isRecording === true) {
      this.props.toggleRecording();
    }
  }

  // FIXME: fix any stuff
  recordElement: HTMLElement;
  canvas: HTMLCanvasElement;
  pen: Pen;
  frequencyGraph: FrequencyGraph;
  audioContext: any;
  analyser: any;
  recorder: any;
  animation: number;
  latLngInterval: ?number;
  binWidth: number;
  circleRadius: number;

  transitionParameter: number;
  transitionDirection: number;

  firstFlag: boolean;
  secondFlag: boolean;
  isDing: boolean;
  previousSpike: number;

  msStarted: number;
  singleCycleDuration: number;
  snakeLength: number;
  snakePointList: Array<Point2D>;

  props:{
    isFetching: bool;
    isAuthed: bool;
    authedId: string;
    isRecording: bool;
    isUploading: bool;
    isInside: bool;
    whichDing: string;
    latestLocation: LatLng;
    currentCommuteId: string;
    latestFetch: number;
    lastDetection: number;
    targetFrequency: number;

    handleSetDingListener: Function;
    handleFetchingUserSettings: Function;
    handleFetchingUserDings: Function;
    toggleRecording: Function;
    handleFetchLatLng: Function;
    handleComplieDing: Function;
    uploadingClip: Function;
    handleUpload: Function;
    handleDetection: Function;
  }

  setup () {
    const dataArray = this.analyser.updateDataArray();
    this.binWidth = this.canvas.width / dataArray.length;
    this.circleRadius = this.canvas.width * 0.3;

    this.transitionParameter = 0.0;

    const freqStart: Point2D = {
      x: this.canvas.width * 0.5 - this.circleRadius,
      y: this.canvas.height * 0.5 + this.circleRadius + this.canvas.height * 0.15,
    };

    const freqSize: Point2D = {
      x: this.circleRadius * 2, // width
      y: this.canvas.height * 0.05,
    };

    this.frequencyGraph = new FrequencyGraph(this.pen, freqStart, freqSize);
    this.frequencyGraph.addLabel(2000, '2k');
    this.frequencyGraph.addLabel(3000, '3k');
    this.frequencyGraph.addLabel(4000, '4k');

    //
    // Detection
    //
    this.firstFlag = false;
    this.secondFlag = false;
    this.isDing = false;
    this.previousSpike = Date.now();

    this.canvas.onclick = this.mousePressed;
    this.canvas.addEventListener('mousemove', this.mouseMoved);

    this.msStarted = 0;
    this.singleCycleDuration = 10 * 1000; // ms (1min)
    this.snakeLength = 1000;
    this.snakePointList = [];
  }

  draw () {
    this.animation = requestAnimationFrame(this.draw);
    if (this.props.isFetching) {
      return;
    }
    this.pen.clear();

    if (this.props.isRecording) {
      const timeElapsed = Date.now() - this.msStarted;

      if (this.props.isInside) {
        const start = {x: 15, y: 15};
        const size = {x: this.canvas.width - 30, y: this.canvas.height - 30};
        this.pen.stroke('white');
        this.pen.drawRectangle(start, size);
      }

      // draw the polyline
      const dataArray = this.analyser.updateDataArray();
      const freqIndex: number = this.analyser.frequencyToIndex(this.props.targetFrequency);

      this.frequencyGraph.update(dataArray);
      this.frequencyGraph.draw(this.props.targetFrequency);

      // draw current target frequency
      // this.pen.stroke('red');
      // this.pen.drawVerticalAxis(freqIndex * this.binWidth, this.canvas.height);
      const cyclePosition = (timeElapsed % this.singleCycleDuration) / this.singleCycleDuration;
      const rad = (cyclePosition * 360) / 180 * Math.PI - 0.5 * Math.PI;
      const slopes: Array<number> = this.analyser.getSlopes(freqIndex).map((v) => Math.max(0, v));

      this.pen.stroke('white');

      const inner: Point2D = {
        x: Math.cos(rad) * (this.circleRadius - slopes[0]) + this.pen.width * 0.5,
        y: Math.sin(rad) * (this.circleRadius - slopes[0]) + this.pen.height * 0.5,
      };

      const outer: Point2D = {
        x: Math.cos(rad) * (this.circleRadius + slopes[1]) + this.pen.width * 0.5,
        y: Math.sin(rad) * (this.circleRadius + slopes[1]) + this.pen.height * 0.5,
      };
      this.pen.drawCircle(inner.x, inner.y, 2);
      this.pen.drawCircle(outer.x, outer.y, 2);

      this.pen.drawLinePoints(inner, outer);

      /*
      if (this.snakePointList.length >= this.snakeLength) {
        this.snakePointList.splice(0, 2);
      }
      */

      if (this.snakePointList.length !== 0) {
        this.snakePointList.splice(Math.floor(this.snakePointList.length / 2) + 1, 0, outer, inner);
      } else {
        this.snakePointList = [outer, inner];
      }

      if (this.snakePointList.length >= this.snakeLength) {
        this.snakePointList.pop();
        this.snakePointList.shift();
      }
      // this.fill('rgba(0,0,0,0)');
      this.pen.stroke('rgba(255, 255, 255, 0.1)');
      this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius - slopes[0]);
      this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius + slopes[1]);

      this.pen.noFill();
      this.pen.stroke('rgba(255, 255, 255, 0.3)');
      this.pen.drawPolyline(this.snakePointList);
      this.pen.ctx.stroke();
      //
      // Detection
      // climbing up the stairs
      //

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

      this.props.handleDetection(slopes);
      this.pen.stroke('rgba(255, 0, 0, 0.3)');
      // this.pen.fill('red');
    } else {
      this.pen.stroke('white');
    }
    // this.pen.stroke('white');
    this.pen.fill('rgba(0.0, 0.0, 0.0, 0.0)');
    this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius);
    this.pen.noStroke();
    // this.pen.fill('white');
    const status = this.props.isRecording ? 'push to stop' : 'push to start';
    this.pen.text(status, this.canvas.width * 0.5, this.canvas.height * 0.5 - this.circleRadius - 75);
  }

  updatePosition (commuteId: string) {
    // window.navigator.vibrate(100)
    this.props.handleFetchLatLng();
  }

  mousePressed (event: MouseEvent) {
    const distanceFromCenter = this.pen.distance(
      this.pen.mouseX,
      this.pen.mouseY,
      this.canvas.width / 2.0,
      this.canvas.height / 2.0
    );

    if (distanceFromCenter < this.circleRadius) {
      window.navigator.vibrate(50);
      this.props.toggleRecording()
        .then(response => {
          if (response.isRecording) { // takes change immediately
            const fetchFunc = this.updatePosition.bind(this, response.commuteId);
            fetchFunc();
            this.latLngInterval = window.setInterval(fetchFunc, updateCycleDuration);
            this.snakePointList = [];
            this.msStarted = Date.now();
          } else {
            if (this.latLngInterval !== null) {
              window.clearInterval(this.latLngInterval);
            }
            this.latLngInterval = null;
            // this.msStarted = 0;
          }
        });
    }
  }

  mouseMoved (event: MouseEvent) {
    this.pen.updateMouse(event);
  }

  render () {
    return (
      <Record/>
    );
  }
}

function mapStateToProps (state) {
  const authedId = state.users.get('authedId');
  return {
    isAuthed: state.users.get('isAuthed'),
    authedId,
    isFetching:
      state.users.get('isFetching') ||
      state.userSettings.get('isFetching') ||
      state.dingFeed.get('isFetching'),
    isRecording: state.record.get('isRecording'),
    isInside: state.record.get('isInside'),
    whichDing: state.record.get('whichDing'),
    currentCommuteId: state.record.get('currentCommuteId'),
    isUploading: state.record.get('isUploading'),
    latestLocation: state.record.get('latestLocation').toJS(),
    latestFetch: state.record.get('latestFetch'),
    lastDetection: state.record.get('lastDetection'),
    targetFrequency: state.userSettings.getIn([authedId, 'targetFrequency']),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...extractActionCreators(userSettingsActionCreators),
    ...extractActionCreators(recordActionCreators),
    ...extractActionCreators(dingsActionCreators),
    ...extractActionCreators(dingFeedActionCreators),
    ...extractActionCreators(userDingActionCreators),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordContainer);
// export default RecordContainer
