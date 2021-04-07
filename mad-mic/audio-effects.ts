class AudioEffect {
  audioContext: AudioContext;
  source: AudioNode;
  destination: AudioNode;
  input: AudioNode;
  output: GainNode;
  startTime: number;

  constructor(audioContext: AudioContext, source: AudioNode, destination: AudioNode) {
    this.audioContext = audioContext;
    this.source = source;
    this.destination = destination;

    this.input = audioContext.createGain();
    this.output = audioContext.createGain();
    this.output.gain.value = 0;

    this.startTime = null;
  }

  connect(): void {
    this.source.connect(this.input);
    this.output.connect(this.destination);
  }

  disconnect(): void {
    this.source.disconnect(this.input);
    this.output.connect(this.destination);
  }

  start(): void {
    if (this.startTime === null) {
      const time: number = this.audioContext.currentTime;
      const output: GainNode = this.output;
      const fadeInDuration: number = 0.2;

      this.connect();
      this.startTime = time;

      output.gain.setValueAtTime(0, time);
      output.gain.linearRampToValueAtTime(1, time + fadeInDuration);
    }
  }

  stop(): void {
    if (this.startTime !== null) {
      const time: number = Math.max(this.audioContext.currentTime, this.startTime);
      const output: GainNode = this.output;
      const fadeOutDuration: number = 0.2;

      output.gain.setValueAtTime(1, time);
      output.gain.linearRampToValueAtTime(0, time + fadeOutDuration);

      setTimeout(() => {
        this.destroy();
        this.disconnect();
      }, 1000 * fadeOutDuration + 0.1);
    }
  }

  destroy(): void { }
}

class AudioEffectNode {
  audioContext: AudioContext;
  input: AudioNode;
  output: AudioNode;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.input = null;
    this.output = null;
  }

  destroy(): void { }
}

class FeedbackDelay extends AudioEffectNode {
  delay: DelayNode;
  gain: GainNode;

  constructor(audioContext: AudioContext, maxDelayTime: number = 1) {
    super(audioContext);

    const delay: DelayNode = audioContext.createDelay(maxDelayTime);
    const gain: GainNode = audioContext.createGain();

    delay.connect(gain);
    gain.connect(delay);

    this.delay = delay;
    this.gain = gain;

    this.input = delay;
    this.output = gain;
  }

  set delayTime(value: number) {
    this.delay.delayTime.value = value;
  }

  set feedbackGain(value: number) {
    this.gain.gain.value = value;
  }
}

class Modulator extends AudioEffectNode {
  _mean: number;
  _depth: number;
  constFactor: GainNode;
  constGen: AudioBufferSourceNode;
  modFactor: GainNode;
  modOsc: OscillatorNode;
  output: GainNode;

  constructor(audioContext: AudioContext) {
    super(audioContext);

    this._mean = 1;
    this._depth = 0;

    const constFactor: GainNode = audioContext.createGain();
    constFactor.gain.value = 1;

    const constGen: AudioBufferSourceNode = audioContext.createBufferSource();
    constGen.connect(constFactor);
    constGen.buffer = createConstBuffer(audioContext);
    constGen.start(0);
    constGen.loop = true;

    const modFactor: GainNode = audioContext.createGain();
    modFactor.gain.value = 0;

    const modOsc: OscillatorNode = audioContext.createOscillator();
    modOsc.connect(modFactor);
    modOsc.type = "sine";
    modOsc.frequency.value = 1;
    modOsc.start(0);

    const output: GainNode = audioContext.createGain();
    constFactor.connect(output);
    modFactor.connect(output);

    this.constFactor = constFactor;
    this.constGen = constGen;
    this.modFactor = modFactor;
    this.modOsc = modOsc;
    this.output = output;
  }

  set mean(value: number) {
    this._mean = value;
    this.constFactor.gain.value = value;
    this.modFactor.gain.value = value * this._depth;
  }

  set depth(value: number) {
    this._depth = value;
    this.modFactor.gain.value = value * this._mean;
  }

  set freq(value: number) {
    this.modOsc.frequency.value = value;
  }

  destroy(): void {
    this.constGen.stop(0);
    this.modOsc.stop(0);
  }
}

class PingPong extends AudioEffectNode {
  fxL: AudioEffectNode;
  fxR: AudioEffectNode;
  delL: DelayNode;
  delR: DelayNode;
  gainL: GainNode;
  gainR: GainNode;
  merger: ChannelMergerNode;

  constructor(audioContext: AudioContext, fxL: AudioEffectNode = null, fxR: AudioEffectNode = null) {
    super(audioContext);

    const delL: DelayNode = audioContext.createDelay(1);
    const delR: DelayNode = audioContext.createDelay(1);
    const gainL: GainNode = audioContext.createGain();
    const gainR: GainNode = audioContext.createGain();
    const merger: ChannelMergerNode = audioContext.createChannelMerger(2);

    delL.connect(gainL);

    if (fxL !== null) {
      delL.connect(fxL.input);
      fxL.output.connect(gainL);
    }

    gainL.connect(delR);
    delR.connect(gainR);

    if (fxR !== null) {
      delR.connect(fxR.input);
      fxR.output.connect(gainR);
    }

    gainR.connect(delL);

    gainL.connect(merger, 0, 0);
    gainR.connect(merger, 0, 1);

    this.fxL = fxL;
    this.fxR = fxR;

    this.delL = delL;
    this.delR = delR;
    this.gainL = gainL;
    this.gainR = gainR;
    this.merger = merger;

    this.input = delL;
    this.output = merger;
  }

  set delayTime(value: number) {
    this.delL.delayTime.value = value;
    this.delR.delayTime.value = value;
  }

  set feedbackGain(value: number) {
    this.gainL.gain.value = value;
    this.gainR.gain.value = value;
  }
}

class ModPingPong extends PingPong {
  mod: Modulator;

  constructor(audioContext: AudioContext, fxL: AudioEffectNode = null, fxR: AudioEffectNode = null) {
    super(audioContext, fxL, fxR);

    const mod: Modulator = new Modulator(audioContext);
    mod.output.connect(this.delL.delayTime);
    mod.output.connect(this.delR.delayTime);

    this.mod = mod;
  }

  set delayTime(value: number) {
    this.mod.mean = value;
  }

  set modFreq(value: number) {
    this.mod.freq = value;
  }

  set modDepth(value: number) {
    this.mod.depth = value;
  }

  destroy(): void {
    super.destroy();
    this.mod.destroy();
  }
}

class FractalPingPong extends ModPingPong {
  fbdL: FeedbackDelay;
  fbdR: FeedbackDelay;

  constructor(audioContext: AudioContext) {
    const fbdL: FeedbackDelay = new FeedbackDelay(audioContext);
    const fbdR: FeedbackDelay = new FeedbackDelay(audioContext);
    super(audioContext, fbdL, fbdR);

    this.fbdL = fbdL;
    this.fbdR = fbdR;
  }

  set innerDelayTime(value: number) {
    this.fbdL.delayTime = value;
    this.fbdR.delayTime = value;
  }
  set innerFeedbackGain(value: number) {
    this.fbdL.feedbackGain = value;
    this.fbdR.feedbackGain = value;
  }

  destroy(): void {
    super.destroy();
    this.fbdL.destroy();
    this.fbdR.destroy();
  }
}

interface DoubleHelixParams {
  delayTime?: number;
  feedbackGain?: number;
  modFreq?: number;
  modDepth?: number;
}

class DoubleHelix extends AudioEffect {
  pp1: ModPingPong;
  pp2: ModPingPong;

  constructor(audioContext: AudioContext, source: AudioNode, destination: AudioNode, params: DoubleHelixParams) {
    super(audioContext, source, destination);

    const pp1: ModPingPong = new ModPingPong(audioContext);
    pp1.delayTime = params.delayTime || 0.1;
    pp1.feedbackGain = params.feedbackGain || 0.5;
    pp1.modFreq = params.modFreq || 0;
    pp1.modDepth = params.modDepth || 0;

    const pp2: ModPingPong = new ModPingPong(audioContext);
    pp2.delayTime = params.delayTime || 0.1;
    pp2.feedbackGain = params.feedbackGain || 0.5;
    pp2.modFreq = -params.modFreq || 0;
    pp2.modDepth = params.modDepth || 0;

    this.input.connect(pp1.input);
    this.input.connect(pp2.input);
    pp1.output.connect(this.output);
    pp2.output.connect(this.output);

    this.pp1 = pp1;
    this.pp2 = pp2;
  }

  destroy(): void {
    this.pp1.destroy();
    this.pp2.destroy();
  }
}

interface FatalFractalParams {
  delayTime?: number;
  feedbackGain?: number;
  innerDelayTime?: number;
  innerFeedbackGain?: number;
  modFreq?: number;
  modDepth?: number;
}

class FatalFractal extends AudioEffect {
  pp: FractalPingPong;
  
  constructor(audioContext: AudioContext, source: AudioNode, destination: AudioNode, params: FatalFractalParams) {
    super(audioContext, source, destination);

    const pp: FractalPingPong = new FractalPingPong(audioContext);
    pp.delayTime = params.delayTime || 0.2;
    pp.feedbackGain = params.feedbackGain || 0.4;
    pp.innerDelayTime = params.innerDelayTime || 0.05;
    pp.innerFeedbackGain = params.innerFeedbackGain || 0.7;
    pp.modFreq = params.modFreq || 0.05;
    pp.modDepth = params.modDepth || 0.25;

    this.pp = pp;
    this.input = pp.input;
    pp.output.connect(this.output);
  }

  destroy(): void {
    this.pp.destroy();
  }
}

function createConstBuffer(audioContext: AudioContext, duration: number = 0.1): AudioBuffer {
  const sampleRate: number = audioContext.sampleRate;
  const bufferDuration: number = duration;
  const bufferSize: number = bufferDuration * sampleRate;
  const buffer: AudioBuffer = audioContext.createBuffer(1, bufferSize, sampleRate);

  const channel: Float32Array = buffer.getChannelData(0);
  for (let i: number = 0; i < bufferSize; i++)
    channel[i] = 1;

  return buffer;
}

