namespace samplePads {
  const soundsFileNames: string[] = ["bd.wav", "sd.wav", "ch.wav", "oh.wav"];
  const audioBuffers: AudioBuffer[] = [];
  const buttons: NodeListOf<HTMLDivElement> = document.querySelectorAll(".button");

  // load samples into audio buffers using XMLHttpRequest
  for (let i: number = 0; i < soundsFileNames.length; i++) {
    const request: XMLHttpRequest = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.open("GET", "sounds/" + soundsFileNames[i]);
    request.addEventListener("load", () => {
      const ac: AudioContext = new AudioContext();
      ac.decodeAudioData(request.response, (buffer) => audioBuffers[i] = buffer);
      buttons[i].classList.remove("hidden");
    });

    request.send();
  }

  // create web audio manager
  const audioManager: WebAudioManager = new WebAudioManager();

  // create start screen and register web audio manager
  const startScreen: StartScreen = new StartScreen("start-screen");  
  startScreen.addResourceManager(audioManager);

  // start (creates audio context )
  startScreen.start().then(() => {
    for (let button of buttons) {
      button.addEventListener("mousedown", onButton);
      button.addEventListener("touchstart", onButton);
    }
  });

  // play buffer by index
  function playSound(index: number): void {
    const audioContext: AudioContext = audioManager.context;
    const source: AudioBufferSourceNode = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.buffer = audioBuffers[index];
    source.start(audioContext.currentTime);
  }

  // play audio buffer (sample)
  function onButton(evt: Event): void {
    const target: HTMLElement = <HTMLElement>evt.target;
    const index: number = parseInt(target.dataset.index);

    // trigger sample
    playSound(index);

    // highlight button
    target.classList.add("active");
    setTimeout(() => target.classList.remove("active"), 200);

    evt.preventDefault(); // prevent mousedown emulation with iOS touch
  }
}
