/**
 * Code example using the Media Stream (gerUserMedia) and Web Audio APIs
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
namespace dancingSmiley {
  const smiley: HTMLDivElement = <HTMLDivElement>document.getElementById("smiley");
  let analyser: AnalyserNode = null;
  let analyserArray: Uint8Array = null;

  // create web audio manager and user media manager
  const audioManager: WebAudioManager = new WebAudioManager();
  const userMediaManager: UserMediaManager = new UserMediaManager({ video: false, audio: true });

  // create start screen and register resource managers
  const startScreen: StartScreen = new StartScreen("start-screen");
  startScreen.addResourceManager(audioManager);
  startScreen.addResourceManager(userMediaManager);

  // start (creates audio effect and starts animation)
  startScreen.start().then(() => {
    const audioContext: AudioContext = audioManager.context;
    const source: AudioNode = audioContext.createMediaStreamSource(userMediaManager.stream);

    // create audio analyser and array for calculation
    analyser = audioContext.createAnalyser();
    analyserArray = new Uint8Array(analyser.fftSize);

    // connect input source to analyser
    source.connect(analyser);

    // start animation
    requestAnimationFrame(displayIntensity);
  });

  function displayIntensity(): void {
    analyser.getByteTimeDomainData(analyserArray);

    // calculate intensity
    const analyserSize: number = analyser.fftSize;
    let sum: number = 0;

    for (let i: number = 0; i < analyserSize; i++) {
      const value: number = (analyserArray[i] - 128) / 128;
      sum += (value * value);
    }

    const intensity: number = Math.sqrt(sum / analyserSize); // raw intensity

    // map intensity to smiley size
    const smileySize: number = 50 + 400 * intensity;
    smiley.style.width = smiley.style.height = `${smileySize}px`;
    smiley.style.marginTop = smiley.style.marginLeft = `${-0.5 * smileySize}px`;

    // map intensity to smiley opacity
    const opacity: number = Math.min(1, 0.333 + 10 * intensity);
    smiley.style.opacity = opacity.toString();

    // continue animation
    requestAnimationFrame(displayIntensity);
  }
}

