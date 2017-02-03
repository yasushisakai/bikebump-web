import React, { PropTypes } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { storeBlob } from 'helpers/storage'
import { recordDuration, waitDuration } from 'config/constants'

import { SoundClip } from 'components'
import Recorder from 'helpers/Recorder'
import { fetchGeoLocation, formatWavFileName } from 'helpers/utils'
import {startCapture, stopCapture, uploadingClip, uploadingClipSuccess} from 'modules/record'

class SoundClip {

<<<<<<< 5123c74855109eff20632a8960210ad1362c1504
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
=======
  constructor() {
    this.isCapturing = false
    const audio_context = new AudioContext()

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


>>>>>>> Blob code done; need to debug
    if(navigator.getUserMedia) {
      navigator.getUserMedia(
          { audio:true },
          (stream) =>{
<<<<<<< 5123c74855109eff20632a8960210ad1362c1504
            const input = audio_context.createMediaStreamSource(stream)
            this.recorder = new Recorder(input)
            // this.recorder.init()
            this.recorder.record() // starts the bin filling
=======
            //Recorder
            const input = audio_context.createMediaStreamSource(stream);
            this.recorder = new Recorder(input);
            console.log('recording...')
            record();

            //Ding Detection
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.source.connect(this.highpassFilter);
            this.highpassFilter.connect(this.analyzer);

>>>>>>> Blob code done; need to debug
          },
          (error)=>{
            // error callback
            console.error(error)
          }
        )
      }
      else{
      console.log('getUserMedia not supported on your browser!')
    }
<<<<<<< 5123c74855109eff20632a8960210ad1362c1504
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
=======
    this.a_indexies = [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080].map(v=> {
        return this.getIndexFromFrequency(v);
    })

    //Constants
    const TARGET_INDEX = this.getIndexFromFrequency(3050);
    const LOW_INDEX = this.getIndexFromFrequency(1000);
    const HIGH_INDEX = this.getIndexFromFrequency(5000);
    const FREQUENCY_DIFF = 2000;
    const THRESHOLD = 100;
  }
  
  getAnalyzer() {
    return this.analyzer;
  }

  getDataArray() {
    return this.dataArray;
>>>>>>> Blob code done; need to debug
  }

  getIndexFromFrequency(frequency) {
    let nyquist = 44100 / 2.0;
    let index = Math.round(frequency / nyquist * this.analyzer.frequencyBinCount);
    return index;
  }

  getFrequencyFromIndex(index) {
    return (index * (44100 / 2.0)) / this.analyzer.frequencyBinCount;
  }

  record() {
    this.recorder.record()
    this.isCapturing = true;
  }

  stopAndUpload() {
    this.recorder.stop()
    this.recorder.exportWAV((blob)=>{
      this.isCapturing = false
      fetchGeoLocation()
        .then((coordinate)=>{
          const now = new Date()
          return formatWavFileName(now,coordinate)
        })
        .then((filename)=>{
          this.props.dispatch(uploadingClip())
          storeBlob(filename,blob)})
        .then(()=>this.props.dispatch(uploadingClipSuccess()))
    })
    record();
  }

}
