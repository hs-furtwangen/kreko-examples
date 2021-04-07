"use strict";
class AudioEffect {
    constructor(audioContext, source, destination) {
        this.audioContext = audioContext;
        this.source = source;
        this.destination = destination;
        this.input = audioContext.createGain();
        this.output = audioContext.createGain();
        this.output.gain.value = 0;
        this.startTime = null;
    }
    connect() {
        this.source.connect(this.input);
        this.output.connect(this.destination);
    }
    disconnect() {
        this.source.disconnect(this.input);
        this.output.connect(this.destination);
    }
    start() {
        if (this.startTime === null) {
            const time = this.audioContext.currentTime;
            const output = this.output;
            const fadeInDuration = 0.2;
            this.connect();
            this.startTime = time;
            output.gain.setValueAtTime(0, time);
            output.gain.linearRampToValueAtTime(1, time + fadeInDuration);
        }
    }
    stop() {
        if (this.startTime !== null) {
            const time = Math.max(this.audioContext.currentTime, this.startTime);
            const output = this.output;
            const fadeOutDuration = 0.2;
            output.gain.setValueAtTime(1, time);
            output.gain.linearRampToValueAtTime(0, time + fadeOutDuration);
            setTimeout(() => {
                this.destroy();
                this.disconnect();
            }, 1000 * fadeOutDuration + 0.1);
        }
    }
    destroy() { }
}
class AudioEffectNode {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.input = null;
        this.output = null;
    }
    destroy() { }
}
class FeedbackDelay extends AudioEffectNode {
    constructor(audioContext, maxDelayTime = 1) {
        super(audioContext);
        const delay = audioContext.createDelay(maxDelayTime);
        const gain = audioContext.createGain();
        delay.connect(gain);
        gain.connect(delay);
        this.delay = delay;
        this.gain = gain;
        this.input = delay;
        this.output = gain;
    }
    set delayTime(value) {
        this.delay.delayTime.value = value;
    }
    set feedbackGain(value) {
        this.gain.gain.value = value;
    }
}
class Modulator extends AudioEffectNode {
    constructor(audioContext) {
        super(audioContext);
        this._mean = 1;
        this._depth = 0;
        const constFactor = audioContext.createGain();
        constFactor.gain.value = 1;
        const constGen = audioContext.createBufferSource();
        constGen.connect(constFactor);
        constGen.buffer = createConstBuffer(audioContext);
        constGen.start(0);
        constGen.loop = true;
        const modFactor = audioContext.createGain();
        modFactor.gain.value = 0;
        const modOsc = audioContext.createOscillator();
        modOsc.connect(modFactor);
        modOsc.type = "sine";
        modOsc.frequency.value = 1;
        modOsc.start(0);
        const output = audioContext.createGain();
        constFactor.connect(output);
        modFactor.connect(output);
        this.constFactor = constFactor;
        this.constGen = constGen;
        this.modFactor = modFactor;
        this.modOsc = modOsc;
        this.output = output;
    }
    set mean(value) {
        this._mean = value;
        this.constFactor.gain.value = value;
        this.modFactor.gain.value = value * this._depth;
    }
    set depth(value) {
        this._depth = value;
        this.modFactor.gain.value = value * this._mean;
    }
    set freq(value) {
        this.modOsc.frequency.value = value;
    }
    destroy() {
        this.constGen.stop(0);
        this.modOsc.stop(0);
    }
}
class PingPong extends AudioEffectNode {
    constructor(audioContext, fxL = null, fxR = null) {
        super(audioContext);
        const delL = audioContext.createDelay(1);
        const delR = audioContext.createDelay(1);
        const gainL = audioContext.createGain();
        const gainR = audioContext.createGain();
        const merger = audioContext.createChannelMerger(2);
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
    set delayTime(value) {
        this.delL.delayTime.value = value;
        this.delR.delayTime.value = value;
    }
    set feedbackGain(value) {
        this.gainL.gain.value = value;
        this.gainR.gain.value = value;
    }
}
class ModPingPong extends PingPong {
    constructor(audioContext, fxL = null, fxR = null) {
        super(audioContext, fxL, fxR);
        const mod = new Modulator(audioContext);
        mod.output.connect(this.delL.delayTime);
        mod.output.connect(this.delR.delayTime);
        this.mod = mod;
    }
    set delayTime(value) {
        this.mod.mean = value;
    }
    set modFreq(value) {
        this.mod.freq = value;
    }
    set modDepth(value) {
        this.mod.depth = value;
    }
    destroy() {
        super.destroy();
        this.mod.destroy();
    }
}
class FractalPingPong extends ModPingPong {
    constructor(audioContext) {
        const fbdL = new FeedbackDelay(audioContext);
        const fbdR = new FeedbackDelay(audioContext);
        super(audioContext, fbdL, fbdR);
        this.fbdL = fbdL;
        this.fbdR = fbdR;
    }
    set innerDelayTime(value) {
        this.fbdL.delayTime = value;
        this.fbdR.delayTime = value;
    }
    set innerFeedbackGain(value) {
        this.fbdL.feedbackGain = value;
        this.fbdR.feedbackGain = value;
    }
    destroy() {
        super.destroy();
        this.fbdL.destroy();
        this.fbdR.destroy();
    }
}
class DoubleHelix extends AudioEffect {
    constructor(audioContext, source, destination, params) {
        super(audioContext, source, destination);
        const pp1 = new ModPingPong(audioContext);
        pp1.delayTime = params.delayTime || 0.1;
        pp1.feedbackGain = params.feedbackGain || 0.5;
        pp1.modFreq = params.modFreq || 0;
        pp1.modDepth = params.modDepth || 0;
        const pp2 = new ModPingPong(audioContext);
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
    destroy() {
        this.pp1.destroy();
        this.pp2.destroy();
    }
}
class FatalFractal extends AudioEffect {
    constructor(audioContext, source, destination, params) {
        super(audioContext, source, destination);
        const pp = new FractalPingPong(audioContext);
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
    destroy() {
        this.pp.destroy();
    }
}
function createConstBuffer(audioContext, duration = 0.1) {
    const sampleRate = audioContext.sampleRate;
    const bufferDuration = duration;
    const bufferSize = bufferDuration * sampleRate;
    const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++)
        channel[i] = 1;
    return buffer;
}
//# sourceMappingURL=audio-effects.js.map