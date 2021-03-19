"use strict";
var deviceMotionPhys;
(function (deviceMotionPhys) {
    class ThreeDim {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        reset() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    const startScreen = document.getElementById("start-screen");
    const startScreenText = startScreen.querySelector("div");
    let timeout = null;
    if (DeviceMotionEvent && DeviceOrientationEvent) {
        // device/browser seems to support device motion and orientation, check it out
        document.body.addEventListener("click", checkForDeviceMotion);
    }
    else {
        startScreenText.innerHTML = "device motion/orientation not available";
    }
    const ballDiv = document.getElementById("ball");
    const ball = new PhysBall(ballDiv);
    function frame() {
        ball.onFrame();
        window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
    function checkForDeviceMotion() {
        // screen click feedback
        startScreenText.innerHTML = "checking for device motion...";
        document.body.removeEventListener("click", checkForDeviceMotion);
        if (DeviceMotionEvent.requestPermission) {
            // ask device motion/orientation permission on iOS
            DeviceMotionEvent.requestPermission()
                .then((response) => {
                if (response == "granted") {
                    // got permission, hide start overrlay and listenm
                    startScreen.classList.add("hide");
                    window.addEventListener("devicemotion", onDeviceMotion);
                }
                else {
                    startScreenText.innerHTML = "no permission for device motion";
                }
            })
                .catch(console.error);
        }
        else {
            // no permission required but set timeout for the case that 
            timeout = setTimeout(() => {
                timeout = null;
                startScreenText.innerHTML = "no device motion data";
            }, 1000);
            window.addEventListener("devicemotion", onDeviceMotion);
        }
    }
    function onDeviceMotion(evt) {
        if (timeout) {
            // reset time out and hide start screen
            timeout = null;
            startScreen.classList.add("hide");
        }
        const accig = evt.accelerationIncludingGravity;
        ball.setAcc(accig.x, accig.y, accig.z);
    }
})(deviceMotionPhys || (deviceMotionPhys = {}));
//# sourceMappingURL=scripts.js.map