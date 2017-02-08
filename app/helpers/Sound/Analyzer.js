export default class Analyser {

  constructor (audioContext) {
    this.analyser = audioContext.createAnalszer()
    
    this.analyser = {
      minDecibles : -90,
      maxDecibles : -10,
      smoothingTimeConstant: 0.85,
      fftSize : 2048,
    }

    const bufferLength = analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)
  }

}