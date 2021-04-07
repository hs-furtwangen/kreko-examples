"use strict";
/**
 * Code example using the Device Motion API
 * (based on the StartScreen and ResourceManager abstractions)
 * Norbert Schnell, 2021
 */
var shakeNFlash;
(function (shakeNFlash) {
    const flashDiv = document.getElementById("flash");
    // create device motion/orientation manager and register motion callback
    const motionManager = new DeviceMotionAndOrientationManager();
    motionManager.onAcceleration = onAcceleration;
    // create start screen and register device motion/orientation manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(motionManager);
    startScreen.start();
    function onAcceleration(x, y, z) {
        const normX = Math.min(1, Math.max(0, 0.05 * x));
        const normY = Math.min(1, Math.max(0, 0.05 * y));
        const normZ = Math.min(1, Math.max(0, 0.05 * z));
        const accMag = normX * normX + normY * normY + normZ + normZ;
        flashDiv.style.opacity = Math.min(1, accMag).toString();
    }
})(shakeNFlash || (shakeNFlash = {}));
//# sourceMappingURL=scripts.js.map