import React, {PropTypes} from 'react'
import { Record } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { refreshLatLng } from 'helpers/utils'
import { Map } from 'immutable'
import { updateCycleDuration } from 'config/constants'
import * as recordActionCreators from 'modules/record'
import * as dingsActionCreators from 'modules/dings'
import * as dingFeedActionCreators from 'modules/dingFeed'
import P5 from 'p5';

const RecordContainer = React.createClass({
  propTypes:{
    uid:PropTypes.string.isRequired,
    isRecording:PropTypes.bool.isRequired,
    isFetchingLatLng:PropTypes.bool.isRequired,
    latestLocation: PropTypes.instanceOf(Map).isRequired,
    latestFetch : PropTypes.number.isRequired,
    latestFetchAttempt : PropTypes.number.isRequired,
    location: PropTypes.instanceOf(Map).isRequired,
    handleFetchLatLng: PropTypes.func.isRequired,
    toggleRecording: PropTypes.func.isRequired,
    handleCreateDing : PropTypes.func.isRequired,
    handleSetDingListener : PropTypes.func.isRequired,
    handleComplieDing : PropTypes.func.isRequired,
  },

  initDingDetecton() {

    this.audioContext = new AudioContext();

    //the thing to see the frequencies
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.minDecibels = -90;
    this.analyzer.maxDecibels = -10;
    this.analyzer.smoothingTimeConstant = 0.85;
    this.analyzer.fftSize = 1024;
    //this.analyzer.getByteFrequencyData.bind(this)l

    this.highpassFilter = this.audioContext.createBiquadFilter();
    this.highpassFilter.type = 'highpass';
    this.highpassFilter.frequency.value = 2600;
    this.highpassFilter.Q.value = 15;

    //removed peaking fetchingLatLngError

    //holds the actual frequency data
    this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount); //half of fft size
    this.sketch = this.sketch.bind(this);
},

initMic() {

    //mic test
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if (navigator.getUserMedia) {

        navigator.getUserMedia(
          {audio: true},
          stream=> {
              let source = this.audioContext.createMediaStreamSource(stream);
              source.connect(this.highpassFilter);
              //this.peakingFilter.connect(this.bandpassFilter)
              //this.bandpassFilter.connect(this.highpassFilter);
              this.highpassFilter.connect(this.analyzer);
          },
          error=> {
              console.error(error);
          }
      )
    } else {
        console.error('getUserMedia inaccessible');
    }
    //octave frequencies
    this.a_indexies = [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080].map(v=> {
        return this.getIndexFromFrequency(v);
    });
    this.targetIndex = this.getIndexFromFrequency(3050);
  },

  getIndexFromFrequency(frequency) {
    let nyquist = 44100 / 2.0;
    let index = Math.round(frequency / nyquist * this.analyzer.frequencyBinCount);
    return index;
  },

  getFrequencyFromIndex(index) {
    return (index * (44100 / 2.0)) / this.analyzer.frequencyBinCount;
  },

  /**
  *sketch
  *this is the p5js chunk
  *@param p
  */

  sketch(p) {
    p.setup= ()=> {
      p.createCanvas(p.windowWidth, p.windowHeight);
      p.textAlign(p.CENTER);
      p.textSize(9);
      this.unitWidth = p.windowWidth / this.dataArray.length;
      this.unitHeight = p.windowHeight / 256;
    };

    p.draw = ()=> {
       p.background(250);


       this.analyzer.getByteFrequencyData(this.dataArray); //the meat

       /**
       * threshold
       *
       * 1. get the most highest bind
       * 2. see if thats in a close enough range to the
       * 3. get the slope of adjacent readings and have make a threshold out of that
       *
       */

       let averageRangeRadius = 30;
       let average = this.dataArray
              .slice(this.targetIndex - averageRangeRadius, this.targetIndex + averageRangeRadius + 1)
              .reduce((a, c)=> {
                return a + c;
              }) / (this.dataArray.length);

        let targetRange = 3;
        let targetValue = this.dataArray.slice(this.targetIndex-targetRange,this.targetIndex+targetRange+1).reduce((a,c)=>{return a+c})/(3*2+1)

        //console.log(targetValue);

        p.noFill();
        p.stroke(0,128,128);
        p.line(0, p.windowHeight - (average * this.unitHeight), p.windowWidth, p.windowHeight - (average * this.unitHeight));
        p.stroke(0,0,128);
        p.line(0, p.windowHeight - (targetValue * this.unitHeight), p.windowWidth, p.windowHeight - (targetValue * this.unitHeight));


        /**
        * Detecthing the "ring"
        */
        if (targetValue - average > 75) {
          console.log(targetValue - average);
          p.background(255, 0, 0);
          if(this.props.isRecording) {
            this.handleReport(1);

          }
        }

        p.fill(0);
        p.noStroke();
        this.dataArray.map((v,index) => {
               if (index % 50 == 0)
                  p.text(this.getFrequencyFromIndex(index).toFixed(2), index * this.unitWidth, p.windowHeight - 50);
            }
        );

        p.stroke(0, 0, 255);
        p.line(this.unitWidth * this.targetIndex, 0, this.unitWidth * this.targetIndex, p.windowHeight);

        //draw the frequencies
        p.stroke(20);
        p.beginShape();
        this.dataArray.map((v,index)=> {
          p.vertex(index * this.unitWidth, p.windowHeight - this.unitHeight * v);
        });
        p.endShape();

      };

      p.mouseMoved = ()=> {

      };

      p.mousePressed = ()=> {
        let frequencyIndex = p.mouseX/this.unitWidth;
        let frequency = this.getFrequencyFromIndex(frequencyIndex);
        console.log(frequency+', '+frequencyIndex);
      };

      p.windowResized= ()=> {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

    },

  componentDidMount () {

    // listen to dings if not already
    this.props.handleSetDingListener()

    this.interval = null

    this.props.handleFetchLatLng()

    this.initDingDetecton();
    this.initMic();

    const root = document.getElementById('root');
    new P5(this.sketch, root);

    let testDing = {
      radius : 10,
      roadId : 92038402,
      coordinates:{
        lng:-71.087264,
        lat:42.360357
      },
      timestamps:{}
      }

      const timestamp = Date.now()

    testDing.timestamps[timestamp]={
      timestamp:timestamp,
      uid:this.props.uid,
      value:0,
    }


    //this.props.handleCreateDing(testDing)

  },

  shouldComponentUpdate (nextProps, nextState) {
    if(this.props.isFetchingLatLng !== nextProps.isFetchingLatLng){
      if(nextProps.isFetchingLatLng===false) return true
      else return false
    }
    return true
  },

  componentWillUnmount (){
    this.props.dispatch(this.props.stopRecording())
  },
  updateLatLng () {
    if(this.props.isRecording === false && this.interval !== null) {
      window.clearInterval(this.interval)
      this.interval = null
    }

    if(refreshLatLng(this.props.latestFetchAttempt) === true && this.props.isFetchingLatLng === false){
      this.props.handleFetchLatLng()
    }

  },

  handleReport (value) {
    // add a ding
    return this.props.handleComplieDing(
      this.props.uid,
      this.props.latestLocation.toJS(),
      this.props.latestFetch,
      10,
      value
      )

  },

  componentDidUpdate () {
    if(this.props.isRecording === true && this.interval===null){
      this.updateLatLng()
      this.interval = window.setInterval(this.updateLatLng, updateCycleDuration)
    }
  },

  componentWillUnmount () {
    window.clearInterval(this.interval)
    this.interval = null
  },

  render () {
      return (<div>
      <Record isRecording={this.props.isRecording} isFetchingLatLng={this.props.isFetchingLatLng} onRecordButtonClick={this.props.toggleRecording} onReportButtonClick={this.handleReport} location={this.props.location}/>
      </div>
    )
  },
})

function mapState({record,users}){
  return {
  uid:users.get('authedId'),
  isRecording : record.get('isRecording'),
  isFetchingLatLng : record.get('isFetchingLatLng'),
  latestLocation: record.get('latestLocation'),
  latestFetch : record.get('latestFetch'),
  latestFetchAttempt : record.get('latestFetchAttempt'),
  location : record.get('latestLocation')
  }
}

function mapDispatch(dispatch){
  return bindActionCreators({...recordActionCreators,...dingsActionCreators, ...dingFeedActionCreators},dispatch)
}


export default connect(mapState,mapDispatch)(RecordContainer)
