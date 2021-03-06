"use strict";
/**
 * Code example using the Media Stream (gerUserMedia) and Web Audio APIs
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var madMic;
(function (madMic) {
    const circle = document.getElementById("circle");
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
        const destination = audioContext.destination;
        // create audio analyser and array for calculation
        analyser = audioContext.createAnalyser();
        analyserArray = new Uint8Array(analyser.fftSize);
        // create audio effect
        const effect = new DoubleHelix(audioContext, source, destination, {
            delayTime: 0.1,
            feedbackGain: 0.9,
            modFreq: 0.1,
            modDepth: 0.3,
        });
        // connect analyser and start effect
        effect.output.connect(analyser);
        effect.start();
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
        // map intensity to circle size
        const circleSize = 50 + 400 * intensity;
        circle.style.width = circle.style.height = `${circleSize}px`;
        circle.style.marginTop = circle.style.marginLeft = `${-0.5 * circleSize}px`;
        // map intensity to circle opacity
        const opacity = Math.min(1, 0.333 + 10 * intensity);
        circle.style.opacity = opacity.toString();
        // continue animation
        requestAnimationFrame(displayIntensity);
    }
})(madMic || (madMic = {}));
//# sourceMappingURL=scripts.js.map