export default class Analyser {
  constructor (
    audioContext,
    fftSize = 1024,
    minDecibels = -80,
    maxDecibels = -10,
    highpassFrequency = 2200,
    lowRange = 2000,
    highRange = 4000,
    nAverage = 5
  ) {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = fftSize;
    this.analyser.minDecibels = minDecibels;
    this.analyser.maxDecibels = maxDecibels;
    this.analyser.smoothingTimeConstant = 0.5;
    this.unitFrequency = audioContext.sampleRate / this.analyser.fftSize;

    this.bufferLength = this.analyser.frequencyBinCount;
    const rawDataArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(rawDataArray);
    this.dataArray = rawDataArray;

    // * filter *
    this.highpass = audioContext.createBiquadFilter();
    this.highpass.type = 'highpass';
    this.highpass.frequency.value = highpassFrequency;
    this.highpass.Q.value = 10;

    this.isInFocus = false;
    this.lowRangeIndex = this.frequencyToIndex(lowRange);
    this.highRangeIndex = this.frequencyToIndex(highRange);

    this.input = this.analyser;
  }

  connect () {
    // this.highpass.connect(this.analyser)
  }

  getAnalyserNode () {
    return this.analyser;
  }

  getFilterNode () {
    return this.highpass;
  }

  setIsInFocus (isInFocus) {
    this.isInFocus = isInFocus;
  }

  getPeakIndex (start = 0, end) {
    return this.dataArray
      .slice(start, end)
      .reduce(
        (maxIndex, currentValue, index, array) =>
          currentValue > array[maxIndex] ? index : maxIndex, 0
      ) + start;
  }

  getSlopes (target, range = 2) {
    const targetValue = this.dataArray[target];
    let result = [
      this.dataArray[target - range - 1], // TODO: why -1?
      this.dataArray[target + range],
    ];
    return result.map((value) => (targetValue - value) / range);
  }

  indexToFrequency (index) {
    const adjustedIndex = this.isInFocus
      ? index + this.lowRangeIndex
      : index;
    return adjustedIndex * this.unitFrequency;
  }

  frequencyToIndex (frequency) {
    const index = Math.round(frequency / this.unitFrequency);
    return this.isInFocus ? index - this.lowRangeIndex : index;
  }

  updateDataArray () {
    const rawDataArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteFrequencyData(rawDataArray);
    this.dataArray = rawDataArray;
    if (this.isInFocus) {
      this.dataArray = rawDataArray.slice(
        this.lowRangeIndex,
        this.highRangeIndex
      );
    }
    return this.dataArray;
  }
}
