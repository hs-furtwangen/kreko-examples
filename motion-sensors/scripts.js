"use strict";
var motionSensors;
(function (motionSensors) {
    const startButton = document.getElementById("start");
    const display = document.getElementById("display");
    const accigBars = [
        document.querySelector("#accig-x .bar"),
        document.querySelector("#accig-y .bar"),
        document.querySelector("#accig-z .bar"),
    ];
    const accBars = [
        document.querySelector("#acc-x .bar"),
        document.querySelector("#acc-y .bar"),
        document.querySelector("#acc-z .bar"),
    ];
    const rotBars = [
        document.querySelector("#rot-alpha .bar"),
        document.querySelector("#rot-beta .bar"),
        document.querySelector("#rot-gamma .bar"),
    ];
    const oriBars = [
        document.querySelector("#ori-alpha .bar"),
        document.querySelector("#ori-beta .bar"),
        document.querySelector("#ori-gamma .bar"),
    ];
    const accigNumbers = [
        document.querySelector("#accig-x .number"),
        document.querySelector("#accig-y .number"),
        document.querySelector("#accig-z .number"),
    ];
    const accNumbers = [
        document.querySelector("#acc-x .number"),
        document.querySelector("#acc-y .number"),
        document.querySelector("#acc-z .number"),
    ];
    const rotNumbers = [
        document.querySelector("#rot-alpha .number"),
        document.querySelector("#rot-beta .number"),
        document.querySelector("#rot-gamma .number"),
    ];
    const oriNumbers = [
        document.querySelector("#ori-alpha .number"),
        document.querySelector("#ori-beta .number"),
        document.querySelector("#ori-gamma .number"),
    ];
    const intervalNumber = document.querySelector("#interval");
    window.addEventListener("touchmove", (e) => e.preventDefault());
    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission &&
        DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
        document.body.addEventListener("click", () => {
            DeviceMotionEvent.requestPermission()
                .then((response) => {
                if (response == "granted") {
                    window.addEventListener("devicemotion", onDeviceMotion);
                    startButton.classList.add("hide");
                    display.classList.remove("hide");
                }
            })
                .catch(console.error);
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                if (response == "granted") {
                    window.addEventListener("deviceorientation", onDeviceOrientation);
                }
            })
                .catch(console.error);
        });
    }
    else {
        window.addEventListener("devicemotion", onDeviceMotion);
        window.addEventListener("deviceorientation", onDeviceOrientation);
    }
    function setBar(bar, value) {
        if (value >= 0) {
            bar.style.left = "0";
            bar.style.width = `${100 * value}%`;
        }
    }
    function setNumber(div, value, numDec = 2) {
        div.innerHTML = value.toFixed(numDec);
    }
    function setBiBar(div, value) {
        if (value >= 0) {
            div.style.left = "50%";
            div.style.width = `${50 * value}%`;
        }
        else {
            div.style.left = `${50 * (1 + value)}%`;
            div.style.width = `${50 * -value}%`;
        }
    }
    function onDeviceMotion(evt) {
        const accig = evt.accelerationIncludingGravity;
        setBiBar(accigBars[0], accig.x / 20);
        setBiBar(accigBars[1], accig.y / 20);
        setBiBar(accigBars[2], accig.z / 20);
        setNumber(accigNumbers[0], accig.x);
        setNumber(accigNumbers[1], accig.y);
        setNumber(accigNumbers[2], accig.z);
        const acc = evt.acceleration;
        setBiBar(accBars[0], acc.x / 20);
        setBiBar(accBars[1], acc.y / 20);
        setBiBar(accBars[2], acc.z / 20);
        setNumber(accNumbers[0], acc.x);
        setNumber(accNumbers[1], acc.y);
        setNumber(accNumbers[2], acc.z);
        const rot = evt.rotationRate;
        setBiBar(rotBars[0], rot.alpha / 360);
        setBiBar(rotBars[1], rot.beta / 360);
        setBiBar(rotBars[2], rot.gamma / 360);
        setNumber(rotNumbers[0], rot.alpha);
        setNumber(rotNumbers[1], rot.beta);
        setNumber(rotNumbers[2], rot.gamma);
        const interval = evt.interval;
        setNumber(intervalNumber, interval, 6);
    }
    function onDeviceOrientation(evt) {
        setBar(oriBars[0], evt.alpha / 360);
        setBiBar(oriBars[1], evt.beta / 180);
        setBiBar(oriBars[2], evt.gamma / 90);
        setNumber(oriNumbers[0], evt.alpha);
        setNumber(oriNumbers[1], evt.beta);
        setNumber(oriNumbers[2], evt.gamma);
    }
})(motionSensors || (motionSensors = {}));
//# sourceMappingURL=scripts.js.map