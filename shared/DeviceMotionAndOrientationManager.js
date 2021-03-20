"use strict";
class DeviceMotionAndOrientationManager {
    constructor(id) {
        this.timeout = null;
        this.screenDiv = null;
        this.textDiv = null;
        this.interval = 0;
        this.scaleAcc = 1; // scale factor to re-invert iOS acceleration
        this.onAccelerationIncludingGravity = null;
        this.onAcceleration = null;
        this.onRotationRate = null;
        this.onOrientation = null;
        this.screenDiv = document.getElementById(id);
        this.textDiv = this.screenDiv.querySelector(".start-screen-text");
        this.setText("touch screen to start");
        this.check = this.check.bind(this);
        this.onDeviceMotion = this.onDeviceMotion.bind(this);
        this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
    }
    setText(text) {
        this.textDiv.innerHTML = text;
    }
    start() {
        this.screenDiv.style.display = "block";
        if (DeviceMotionEvent || DeviceOrientationEvent) {
            // device/browser seems to support device motion and orientation, check it out
            this.screenDiv.addEventListener("click", this.check);
        }
        else {
            this.setText("device motion/orientation not available");
        }
    }
    close() {
        this.screenDiv.style.display = "none";
    }
    setTimeout(text, durationInMs = 1) {
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.setText(text);
        }, 1000 * durationInMs);
    }
    terminate() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
            this.close();
        }
    }
    check() {
        // set click feedback text and remove listener
        this.setText("checking for device motion/orientation...");
        this.screenDiv.removeEventListener("click", this.check);
        // set timeout in case that the API response, but no data is sent
        this.setTimeout("no device motion/orientation data");
        // ask device motion/orientation permission on iOS
        if (DeviceMotionEvent.requestPermission || DeviceOrientationEvent.requestPermission) {
            DeviceMotionEvent.requestPermission()
                .then((response) => {
                if (response == "granted") {
                    // got permission, hide start overrlay and listenm
                    this.close();
                    if (this.onAccelerationIncludingGravity !== null ||
                        this.onAcceleration !== null ||
                        this.onRotationRate) {
                        window.addEventListener("devicemotion", this.onDeviceMotion);
                    }
                    // re-invert inverted iOS acceleration values
                    this.scaleAcc = -1;
                }
                else {
                    this.setText("no permission for device motion");
                }
            })
                .catch(console.error);
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                if (response == "granted") {
                    if (this.onOrientation !== null) {
                        window.addEventListener("deviceorientation", this.onDeviceOrientation);
                    }
                    this.close();
                }
                else {
                    this.setText("no permission for device orientation");
                }
            })
                .catch(console.error);
        }
        else {
            window.addEventListener("devicemotion", this.onDeviceMotion);
            window.addEventListener("deviceorientation", this.onDeviceOrientation);
        }
    }
    onDeviceMotion(evt) {
        this.close();
        if (this.onAccelerationIncludingGravity !== null) {
            const accig = evt.accelerationIncludingGravity;
            this.onAccelerationIncludingGravity(this.scaleAcc * accig.x, this.scaleAcc * accig.y, this.scaleAcc * accig.z, evt.interval);
        }
        if (this.onAcceleration !== null) {
            const acc = evt.acceleration;
            this.onAcceleration(this.scaleAcc * acc.x, this.scaleAcc * acc.y, this.scaleAcc * acc.z, evt.interval);
        }
        if (this.onRotationRate !== null) {
            const rot = evt.rotationRate;
            this.onRotationRate(rot.alpha, rot.beta, rot.gamma, evt.interval);
        }
    }
    onDeviceOrientation(evt) {
        this.close();
        if (this.onOrientation !== null) {
            this.onOrientation(evt.alpha, evt.beta, evt.gamma);
        }
    }
}
//# sourceMappingURL=DeviceMotionAndOrientationManager.js.map