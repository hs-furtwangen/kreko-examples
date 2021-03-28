"use strict";
var samplePads;
(function (samplePads) {
    const soundsFileNames = ["bd.wav", "sd.wav", "ch.wav", "oh.wav"];
    const audioBuffers = [];
    const buttons = document.querySelectorAll(".button");
    // load samples into audio buffers using XMLHttpRequest
    for (let i = 0; i < soundsFileNames.length; i++) {
        const request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", "sounds/" + soundsFileNames[i]);
        request.addEventListener("load", () => {
            const ac = new AudioContext();
            ac.decodeAudioData(request.response, (buffer) => audioBuffers[i] = buffer);
            buttons[i].classList.remove("hidden");
        });
        request.send();
    }
    // create web audio manager
    const audioManager = new WebAudioManager();
    // create start screen and register web audio manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(audioManager);
    // start (creates audio context )
    startScreen.start().then(() => {
        for (let button of buttons) {
            button.addEventListener("mousedown", onButton);
            button.addEventListener("touchstart", onButton);
        }
    });
    // play buffer by index
    function playSound(index) {
        const audioContext = audioManager.context;
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);
        source.buffer = audioBuffers[index];
        source.start(audioContext.currentTime);
    }
    // play audio buffer (sample)
    function onButton(evt) {
        const target = evt.target;
        const index = parseInt(target.dataset.index);
        // trigger sample
        playSound(index);
        // highlight button
        target.classList.add("active");
        setTimeout(() => target.classList.remove("active"), 200);
        evt.preventDefault(); // prevent mousedown emulation
    }
})(samplePads || (samplePads = {}));
//# sourceMappingURL=scripts.js.map