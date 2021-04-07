"use strict";
/**
 * Code example using the Media Stream (gerUserMedia) and Web Audio APIs
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var dancingSmiley;
(function (dancingSmiley) {
    const smiley = document.getElementById("smiley");
    let analyser = null;
    let analyserArray = null;
    // create web audio manager and user media manager
    const audioManager = new WebAudioManager();
    const userMediaManager = new UserMediaManager({ video: false, audio: true });
    // create start screen and register resource managers
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(audioManager);
    startScreen.addResourceManager(userMediaManager);
    // start (creates audio effect and starts animation)
    startScreen.start().then(() => {
        const audioContext = audioManager.context;
        const source = audioContext.createMediaStreamSource(userMediaManager.stream);
        // create audio analyser and array for calculation
        analyser = audioContext.createAnalyser();
        analyserArray = new Uint8Array(analyser.fftSize);
        // connect input source to analyser
        source.connect(analyser);
        // start animation
        requestAnimationFrame(displayIntensity);
    });
    function displayIntensity() {
        analyser.getByteTimeDomainData(analyserArray);
        // calculate intensity
        const analyserSize = analyser.fftSize;
        let sum = 0;
        for (let i = 0; i < analyserSize; i++) {
            const value = (analyserArray[i] - 128) / 128;
            sum += (value * value);
        }
        const intensity = Math.sqrt(sum / analyserSize); // raw intensity
        // map intensity to smiley size
        const smileySize = 50 + 400 * intensity;
        smiley.style.width = smiley.style.height = `${smileySize}px`;
        smiley.style.marginTop = smiley.style.marginLeft = `${-0.5 * smileySize}px`;
        // map intensity to smiley opacity
        const opacity = Math.min(1, 0.333 + 10 * intensity);
        smiley.style.opacity = opacity.toString();
        // continue animation
        requestAnimationFrame(displayIntensity);
    }
})(dancingSmiley || (dancingSmiley = {}));
//# sourceMappingURL=scripts.js.map