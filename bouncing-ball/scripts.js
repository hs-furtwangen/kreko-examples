"use strict";
var deviceMotionPhysics;
(function (deviceMotionPhysics) {
    const canvas = document.getElementById("canvas");
    const bouncingBall = new BouncingBall(canvas);
    // create device motion/orientation manager and register motion callback
    const motionManager = new DeviceMotionAndOrientationManager();
    motionManager.onAccelerationIncludingGravity = bouncingBall.setAcceleration;
    // create start screen and register device motion/orientation manager
    const startScreen = new StartScreen("start-screen");
    startScreen.addResourceManager(motionManager);
    startScreen.start();
    bouncingBall.start();
})(deviceMotionPhysics || (deviceMotionPhysics = {}));
//# sourceMappingURL=scripts.js.map