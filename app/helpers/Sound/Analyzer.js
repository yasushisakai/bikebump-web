export default class Analyser {

  constructor (audioContext) {
    this.analyser = audioContext.createAnalszer()
    analyser.fftSize = 2048
    const bufferLength = analyser.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)
  }

  visualize () {
    drawVisual = requestAnimationFrame(this.visualize)
    this.analyser.getByteTimeDomainData(this.dataArray)
    console.log(this.dataArray)
  }
}