namespace shakeNFlash {
  const lightDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("light");
  let oPX: FilteredOscillator = null;
  let oNX: FilteredOscillator = null;
  let oPY: FilteredOscillator = null;
  let oNY: FilteredOscillator = null;
  let oPZ: FilteredOscillator = null;
  let oNZ: FilteredOscillator = null;

  // create web audio manager
  const audioManager: WebAudioManager = new WebAudioManager();

  // create device motion/orientation manager and register motion callback
  const motionManager: DeviceMotionAndOrientationManager = new DeviceMotionAndOrientationManager();
  motionManager.onAccelerationIncludingGravity = onAccelerationIncludingGravity;

  // create start screen and register device motion/orientation manager
  const startScreen: StartScreen = new StartScreen("start-screen");
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
    minCutoffFreq: number;
    maxCutoffFreq: number;
    logCutoffRatio: number;
    lowpass: BiquadFilterNode;

    constructor(type: OscillatorType, frequency: number = 220, minCutoffFreq: number = 20, maxCutoffFreq: number = audioManager.context.sampleRate) {
      const audioContext: AudioContext = audioManager.context;
      const now: number = audioContext.currentTime;

      // create 2 detuned oscillators
      const osc1: OscillatorNode = audioContext.createOscillator();
      osc1.type = type;
      osc1.frequency.value = frequency;
      osc1.detune.value = 4;
      osc1.start(now);

      const osc2: OscillatorNode = audioContext.createOscillator();
      osc2.type = type;
      osc2.frequency.value = frequency;
      osc2.detune.value = -4;
      osc2.start(now);

      this.minCutoffFreq = minCutoffFreq;
      this.maxCutoffFreq = maxCutoffFreq;
      this.logCutoffRatio = Math.log(this.maxCutoffFreq / this.minCutoffFreq);

      // create and configure lowpass
      const lowpass: BiquadFilterNode = audioContext.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = this.minCutoffFreq;
      lowpass.Q.value = 0;

      // connect  both oscillators to lowpass and lowpass to audio output
      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(audioContext.destination);

      this.lowpass = lowpass;
    }

    setIntensity(value: number): void {
      const audioContext: AudioContext = audioManager.context;
      const freqParam: AudioParam = this.lowpass.frequency;
      const now: number = audioContext.currentTime;

      const currentFreq: number = freqParam.value;
      freqParam.setValueAtTime(currentFreq, now);

      const nextFreq: number = this.minCutoffFreq * Math.exp(this.logCutoffRatio * value);
      freqParam.linearRampToValueAtTime(nextFreq, now + 0.010);
    }
  }

  function startOscillators(): void {
    oPX = new FilteredOscillator("sawtooth", 200, 50, 3000);
    oNX = new FilteredOscillator("sawtooth", 300, 50, 3000);
    oPY = new FilteredOscillator("sawtooth", 150, 50, 3000);
    oNY = new FilteredOscillator("sawtooth", 250, 50, 3000);
    oPZ = new FilteredOscillator("sawtooth", 100, 50, 3000);
    oNZ = new FilteredOscillator("sawtooth", 50, 50, 3000);
  }

  function onAccelerationIncludingGravity(x: number, y: number, z: number): void {
    const pX: number = Math.min(1, Math.max(0, x / 9.81));
    const nX: number = Math.min(1, Math.max(0, -x / 9.81));
    const pY: number = Math.min(1, Math.max(0, y / 9.81));
    const nY: number = Math.min(1, Math.max(0, -y / 9.81));
    const pZ: number = Math.min(1, Math.max(0, z / 9.81));
    const nZ: number = Math.min(1, Math.max(0, -z / 9.81));

    const r: number = Math.floor(255 * (pX + nX));
    const g: number = Math.floor(255 * (pY + nY));
    const b: number = Math.floor(255 * (pZ + nZ));
    const colorStr: string = `rgb(${r}, ${g}, ${b})`;
    lightDiv.style.backgroundColor = colorStr;

    oPX.setIntensity(pX);
    oNX.setIntensity(nX);
    oPY.setIntensity(pY);
    oNY.setIntensity(nY);
    oPZ.setIntensity(pZ);
    oNZ.setIntensity(nZ);
  }
}
