
// you can't use setTimeOut because its a different thread
// TODO: scheduling sound >>> https://www.html5rocks.com/en/tutorials/audio/scheduling/

export class VCO {
  constructor (audioContext, frequency = 440) {
    this.context = audioContext;
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = this.oscillator.SAWTOOTH;
    this.setFrequency(frequency);
    this.oscillator.start(0);

    this.input = this.oscillator;
    this.output = this.oscillator;
  }

  setFrequency (frequency) {
    this.oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
  }

  connect (node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }
}

export class VCA {
  constructor (audioContext) {
    this.gain = audioContext.createGain();
    this.gain.gain.value = 0;
    this.input = this.gain;
    this.output = this.gain;
    this.amplitude = this.gain.gain;
  }

  connect (node) {
    if (node.hasOwnProperty('input')) {
      this.output.connect(node.input);
    } else {
      this.output.connect(node);
    }
  }
}

export class EnvelopeGenerator {
  constructor (audioContext) {
    this.context = audioContext;
    this.attackTime = 0.5;
    this.releaseTime = 0.5;
  }

  trigger () {
    const now = this.context.currentTime;
    this.param.cancelScheduledValues(now);
    this.param.setValueAtTime(0, now);
    this.param.linearRampToValueAtTime(1, now + this.attackTime);
    this.param.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime);
  }

  connect (param) {
    this.param = param;
  }
}

export default class TonePlayer {
  constructor (audioContext) {
    this.vca = new VCA(audioContext);
    this.vco = new VCO(audioContext, 440);
    this.env = new EnvelopeGenerator(audioContext);

    this.vco.connect(this.vca);
    this.env.connect(this.vca.amplitude);
    this.vca.connect(audioContext.destination);
  }

  play (frequency) {
    this.vco.setFrequency(frequency);
    this.env.trigger();
  }
}
