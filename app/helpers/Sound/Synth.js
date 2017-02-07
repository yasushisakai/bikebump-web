

export class VCO {
  constructor (audioContext,frequency=440) {
    this.context = audioContext
    this.oscillator = this.context.createOscillator()
    this.oscillator.type = this.oscillator.SAWTOOTH
    this.setFrequency(frequency)
  }

  setFrequency (frequency) {
    this.oscillator.frequency.setValueAtTime(frequency,this.context.currentTime)
  }

  connect (node) {
    if(node.hasOwnProperty('input')){
      this.output.connect(node.input)
    }else{
      this.outline.connect(node)
    }
  }

}

export class VCA {

  constructor (audioContext) {
    this.gain = audioContext.createGain()
    this.gain.gain.value = 0
    this.input = this.gain
    this.output = this.gain
    this.amplitude = this.gain.gain
  }

  connect (node) {
    if(node.hasOwnProperty('input')){
      this.output.connect(node.input)
    }else{
      this.outline.connect(node)
    }
  }

}

export class EnvelopeGenerator {

  constructor (audioContext) {
    this.context = audioContext
    this.attackTime = 0.5
    this.releaseTime = 0.5
  }

  trigger () {
    const now = this.context.currentTime
    this.param.cancelScheduledValues(now)
    this.param.setValueAtTime(0,now)
    this.param.linearRampToValueAtTime(1,now+this.attackTime)
    this.param.linearRampToValueAtTime(0,now+this.attackTime+this.releaseTime)
  }

}

export default play(audioContext,frequency=440){

  const vca = new VCA(audioContext)
  const vco = new VCO(audioContext,frequency)
  const env = new EnvelopeGenerator(audioContext)

  vco.connect(vca)
  env.connect(vca.amplitude)
  vca.connect(audioContext.destination)

}