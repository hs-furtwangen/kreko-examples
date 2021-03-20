"use strict";
var motionSensors;
(function (motionSensors) {
    const motionManager = new DeviceMotionAndOrientationManager("start-screen");
    motionManager.onAcceleration = onAcceleration;
    motionManager.start();
    const flashDiv = document.getElementById("flash");
    function onAcceleration(x, y, z) {
        const normX = Math.min(1, Math.max(0, 0.05 * x));
        const normY = Math.min(1, Math.max(0, 0.05 * y));
        const normZ = Math.min(1, Math.max(0, 0.05 * z));
        const accMag = normX * normX + normY * normY + normZ + normZ;
        flashDiv.style.opacity = Math.min(1, accMag).toString();
    }
})(motionSensors || (motionSensors = {}));
//# sourceMappingURL=scripts.js.map