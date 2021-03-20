"use strict";
var deviceMotionPhys;
(function (deviceMotionPhys) {
    const canvas = document.getElementById("canvas");
    const bouncingBall = new BouncingBall(canvas);
    const motionManager = new DeviceMotionAndOrientationManager("start-screen");
    motionManager.onAccelerationIncludingGravity = bouncingBall.setAcceleration;
    bouncingBall.start();
    motionManager.start();
})(deviceMotionPhys || (deviceMotionPhys = {}));
//# sourceMappingURL=scripts.js.map