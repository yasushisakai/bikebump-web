import React, { PropTypes, Component } from 'react'
import { button, recordContainer } from './styles.css'
import { Map } from 'immutable'
import P5 from 'p5'





export default class Record extends Component {
    constructor(props) {
      super(props);
      this.onReportGood = this.onReportGood.bind(this);
      this.onReportBad = this.onReportBad.bind(this);
    }

    componentDidMount() {
      this.buttonStyle = {
        backgroundColor : this.props.isRecording ? '#ff0000' : '#444444'
      }

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

      //Constants
      this.targetIndex = this.getIndexFromFrequency(3050);
      this.lowIndex = this.getIndexFromFrequency(1000);
      this.highIndex = this.getIndexFromFrequency(5000);
      this.frequencyDiff = 2000;
      this.threshold= 100;
    }

    getIndexFromFrequency(frequency) {
      let nyquist = 44100 / 2.0;
      let index = Math.round(frequency / nyquist * this.analyzer.frequencyBinCount);
      return index;
    }

     //single ding
    onReportGood() {
    //console.log(e);
    //e.preventDefault()
      this.props.onReportButtonClick()
    }
    //double ding
    onReportBad() {
    //console.log(event);

    //e.preventDefault()
      this.props.onReportButtonClick()
      this.props.onReportButtonClick();
    } 

    getFrequencyFromIndex(index) {
      return (index * (44100 / 2.0)) / this.analyzer.frequencyBinCount;
    }

  /**
  *sketch
  *this is the p5js chunk
  *@param p
  */

    sketch = (p)=> {
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
         * slope threshold
         *
         *1. Find slope of low frequency side
         *2. Find slope of high frequency side
         *3. Compare each slope to a threshold
         */

         let lowSlope = this.dataArray[this.targetIndex] - this.dataArray[this.lowIndex]/(this.frequencyDiff)
         let highSlope = this.dataArray[this.targetIndex] - this.dataArray[this.highIndex]/(this.frequencyDiff)

         /**
         * average threshold
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
                }) / (this.dataArray.length)

          let targetRange = 3;
          let targetValue = this.dataArray.slice(this.targetIndex-targetRange,this.targetIndex+targetRange+1).reduce((a,c)=>{return a+c})/(3*2+1)

          //console.log(targetValue);

          p.noFill();
          p.stroke(0,128,128);
          p.line(0, p.windowHeight - (average * this.unitHeight), p.windowWidth, p.windowHeight - (average * this.unitHeight));
          p.stroke(0,0,128);
          p.line(0, p.windowHeight - (targetValue * this.unitHeight), p.windowWidth, p.windowHeight - (targetValue * this.unitHeight));


          /**
          * Detecthing the "ding"
          */
          if (highSlope > this.threshold && lowSlope > this.threshold) {
            this.onReportGood();
            console.log(lowSlope,highSlope);
            p.background(255, 0, 0);
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
          let frequencyIndex = p.mousex/this.unitWidth;
          let frequency = this.getFrequencyFromIndex(frequencyIndex);
          console.log(frequency+', '+frequencyIndex);
        };

        p.windowResized= ()=> {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

    }
    onRecordButtonClick = ()=> {
      this.props.onRecordButtonClick();
      if(!this.props.isRecording) {
        const root = document.getElementById('root');
        new P5(this.sketch, root);
      }
      else {
        let element = document.getElementById("defaultCanvas0");
        element.parentNode.removeChild(element);
      }
    }
    buttonColor(color,float) {
      return {
        backgroundColor: color,
        float : float,
      }
    }
    render() {
    return (
      <div className={recordContainer}>
       <div className={mainButton} style={this.buttonStyle} onClick={this.onRecordButtonClick}>
       </div>
       {this.props.isRecording === true && this.props.isFetchingLatLng === false
       ? (<div>
         <div className={smallButton} style={this.buttonColor('#0055ff','right')} onClick={this.onReportGood}></div>
         <div className={smallButton} style={this.buttonColor('#ff5500','left')} onClick={this.onReportBad}></div>
         </div>
         )
       : null
       }
       <div className={detailText}>
         {
         this.props.isRecording === true && this.props.isFetchingLatLng === false
           ?(`location: lat=${this.props.location.get('lat')}, lat=${this.props.location.get('lng')}`)
           :null
         }
       </div>
       </div>
   );
  }
}

Record.propTypes = {
    isRecording : PropTypes.bool.isRequired,
    isFetchingLatLng : PropTypes.bool.isRequired,
    onRecordButtonClick: PropTypes.func.isRequired,
    onReportButtonClick: PropTypes.func.isRequired,
    location : PropTypes.instanceOf(Map)
};



