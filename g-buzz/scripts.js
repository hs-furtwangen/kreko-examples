"use strict";
/**
 * Code example using the Device Motion and Web Audio APIs
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var gBuzz;
(function (gBuzz) {
    const lightDiv = document.getElementById("light");
    let oPX = null;
    let oNX = null;
    let oPY = null;
    let oNY = null;
    let oPZ = null;
    let oNZ = null;
    // create web audio manager
    const audioManager = new WebAudioManager();
    // create device motion/orientation manager and register motion callback
    const motionManager = new DeviceMotionAndOrientationManager();
    motionManager.onAccelerationIncludingGravity = onAccelerationIncludingGravity;
    // create start screen and register device motion/orientation manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(audioManager);
    startScreen.addResourceManager(motionManager);
    startScreen.start().then(() => {
        startOscillators();
    });
    /*****************************************************
     *
     *  utilitiy functions
     *
     */
    class FilteredOscillator {
        constructor(type, frequency = 220, minCutoffFreq = 20, maxCutoffFreq = audioManager.context.sampleRate) {
            const audioContext = audioManager.context;
            const now = audioContext.currentTime;
            // create 2 detuned oscillators
            const osc1 = audioContext.createOscillator();
            osc1.type = type;
            osc1.frequency.value = frequency;
            osc1.detune.value = 4;
            osc1.start(now);
            const osc2 = audioContext.createOscillator();
            osc2.type = type;
            osc2.frequency.value = frequency;
            osc2.detune.value = -4;
            osc2.start(now);
            this.minCutoffFreq = minCutoffFreq;
            this.maxCutoffFreq = maxCutoffFreq;
            this.logCutoffRatio = Math.log(this.maxCutoffFreq / this.minCutoffFreq);
            // create and configure lowpass
            const lowpass = audioContext.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.value = this.minCutoffFreq;
            lowpass.Q.value = 0;
            // connect  both oscillators to lowpass and lowpass to audio output
            osc1.connect(lowpass);
            osc2.connect(lowpass);
            lowpass.connect(audioContext.destination);
            this.lowpass = lowpass;
        }
        setIntensity(value) {
            const audioContext = audioManager.context;
            const freqParam = this.lowpass.frequency;
            const now = audioContext.currentTime;
            const currentFreq = freqParam.value;
            freqParam.setValueAtTime(currentFreq, now);
            const nextFreq = this.minCutoffFreq * Math.exp(this.logCutoffRatio * value);
            freqParam.linearRampToValueAtTime(nextFreq, now + 0.010);
        }
    }
    function startOscillators() {
        oPX = new FilteredOscillator("sawtooth", 200, 50, 3000);
        oNX = new FilteredOscillator("sawtooth", 300, 50, 3000);
        oPY = new FilteredOscillator("sawtooth", 150, 50, 3000);
        oNY = new FilteredOscillator("sawtooth", 250, 50, 3000);
        oPZ = new FilteredOscillator("sawtooth", 100, 50, 3000);
        oNZ = new FilteredOscillator("sawtooth", 50, 50, 3000);
    }
    function onAccelerationIncludingGravity(x, y, z) {
        const pX = Math.min(1, Math.max(0, x / 9.81));
        const nX = Math.min(1, Math.max(0, -x / 9.81));
        const pY = Math.min(1, Math.max(0, y / 9.81));
        const nY = Math.min(1, Math.max(0, -y / 9.81));
        const pZ = Math.min(1, Math.max(0, z / 9.81));
        const nZ = Math.min(1, Math.max(0, -z / 9.81));
        const r = Math.floor(255 * (pX + nX));
        const g = Math.floor(255 * (pY + nY));
        const b = Math.floor(255 * (pZ + nZ));
        const colorStr = `rgb(${r}, ${g}, ${b})`;
        lightDiv.style.backgroundColor = colorStr;
        oPX.setIntensity(pX);
        oNX.setIntensity(nX);
        oPY.setIntensity(pY);
        oNY.setIntensity(nY);
        oPZ.setIntensity(pZ);
        oNZ.setIntensity(nZ);
    }
})(gBuzz || (gBuzz = {}));
//# sourceMappingURL=scripts.js.map