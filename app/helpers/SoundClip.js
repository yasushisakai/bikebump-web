import { storeBlob } from 'helpers/storage';

import Recorder from 'helpers/Recorder';
import { fetchGeoLocation, formatWavFileName } from 'helpers/utils';
import { AudioContext } from 'config/constants';

export default class SoundClip {
    constructor () {
        this.isCapturing = false;
        const audioContext = new AudioContext();

        // the thing to see the frequencies
        this.analyzer = audioContext.createAnalyser();
        this.analyzer.minDecibels = -90;
        this.analyzer.maxDecibels = -10;
        this.analyzer.smoothingTimeConstant = 0.85;
        this.analyzer.fftSize = 1024;
        // this.analyzer.getByteFrequencyData.bind(this)l

        this.highpassFilter = audioContext.createBiquadFilter();
        this.highpassFilter.type = 'highpass';
        this.highpassFilter.frequency.value = 2600;
        this.highpassFilter.Q.value = 15;

        this.bandpassFilter = audioContext.createBiquadFilter();
        this.bandpassFilter.type = 'bandpass';
        this.bandpassFilter.frequency.value = 3000;
        this.bandpassFilter.Q.value = 15;

        // removed peaking fetchingLatLngError

        // holds the actual frequency data
        this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount); // half of fft size

        // mic test
        navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { audio: true },
                (stream) => {
                    // Recorder
                    const input = audioContext.createMediaStreamSource(stream);
                    this.recorder = new Recorder(input);
                    this.record();
                    console.log('recording...');

                    // Ding Detection
                    this.source = audioContext.createMediaStreamSource(stream);
                    this.source.connect(this.bandpassFilter);
                    this.bandpassFilter.connect(this.highpassFilter);
                    this.highpassFilter.connect(this.analyzer);
                },
                (error) => {
                    // error callback
                    console.error(error);
                }
            );
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
        this.a_indexies = [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080].map(v => {
            return this.getIndexFromFrequency(v);
        });
    }

    getAnalyzer () {
        return this.analyzer;
    }

    getDataArray () {
        return this.dataArray;
    }

    getIndexFromFrequency (frequency) {
        let nyquist = 44100 / 2.0;
        let index = Math.round(frequency / nyquist * this.analyzer.frequencyBinCount);
        return index;
    }

    getFrequencyFromIndex (index) {
        return (index * (44100 / 2.0)) / this.analyzer.frequencyBinCount;
    }

    record () {
        this.recorder.record();
        this.isCapturing = true;
    }

    stopAndUpload () {
        this.recorder.stop();
        this.recorder.exportWAV((blob) => {
            this.isCapturing = false;
            fetchGeoLocation()
                .then((coordinate) => {
                    const now = new Date();
                    return formatWavFileName(now, coordinate);
                })
                .then((filename) => {
                    // this.props.dispatch(uploadingClip())
                    storeBlob(filename, blob);
                });
            // .then(()=>//this.props.dispatch(uploadingClipSuccess()))
        });
        this.record();
    }
}
