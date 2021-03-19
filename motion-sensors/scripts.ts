namespace motionSensors {
  const startScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("start-screen");
  const startScreenText: HTMLDivElement = <HTMLDivElement>startScreen.querySelector("div");
  let timeout: NodeJS.Timeout = null;

  const accigBars: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#accig-x .bar"),
    <HTMLDivElement>document.querySelector("#accig-y .bar"),
    <HTMLDivElement>document.querySelector("#accig-z .bar"),
  ];

  const accBars: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#acc-x .bar"),
    <HTMLDivElement>document.querySelector("#acc-y .bar"),
    <HTMLDivElement>document.querySelector("#acc-z .bar"),
  ];

  const rotBars: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#rot-alpha .bar"),
    <HTMLDivElement>document.querySelector("#rot-beta .bar"),
    <HTMLDivElement>document.querySelector("#rot-gamma .bar"),
  ];

  const oriBars: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#ori-alpha .bar"),
    <HTMLDivElement>document.querySelector("#ori-beta .bar"),
    <HTMLDivElement>document.querySelector("#ori-gamma .bar"),
  ];

  const accigNumbers: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#accig-x .number"),
    <HTMLDivElement>document.querySelector("#accig-y .number"),
    <HTMLDivElement>document.querySelector("#accig-z .number"),
  ];

  const accNumbers: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#acc-x .number"),
    <HTMLDivElement>document.querySelector("#acc-y .number"),
    <HTMLDivElement>document.querySelector("#acc-z .number"),
  ];

  const rotNumbers: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#rot-alpha .number"),
    <HTMLDivElement>document.querySelector("#rot-beta .number"),
    <HTMLDivElement>document.querySelector("#rot-gamma .number"),
  ];

  const oriNumbers: HTMLDivElement[] = [
    <HTMLDivElement>document.querySelector("#ori-alpha .number"),
    <HTMLDivElement>document.querySelector("#ori-beta .number"),
    <HTMLDivElement>document.querySelector("#ori-gamma .number"),
  ];

  const intervalNumber: HTMLDivElement = <HTMLDivElement>document.querySelector("#interval");

  if (DeviceMotionEvent && DeviceOrientationEvent) {
    // device/browser seems to support device motion and orientation, check it out
    document.body.addEventListener("click", checkForDeviceMotionAndOrientation);
  } else {
    startScreenText.innerHTML = "device motion/orientation not available";
  }

  function checkForDeviceMotionAndOrientation(): void {
    // screen click feedback
    startScreenText.innerHTML = "checking for device motion/orientation...";
    document.body.removeEventListener("click", checkForDeviceMotionAndOrientation);

    if (DeviceMotionEvent.requestPermission && DeviceOrientationEvent.requestPermission) {
      // ask device motion/orientation permission on iOS
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            // got permission, hide start overrlay and listenm
            startScreen.classList.add("hide");
            window.addEventListener("devicemotion", onDeviceMotion);
          } else {
            startScreenText.innerHTML = "no permission for device motion";
          }
        })
        .catch(console.error);

      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            window.addEventListener("deviceorientation", onDeviceOrientation);
            startScreen.classList.add("hide");
          } else {
            startScreenText.innerHTML = "no permission for device orientation";
          }
        })
        .catch(console.error);
    } else {
      // no permission required but set timeout for the case that 
      timeout = setTimeout(() => {
        timeout = null;
        startScreenText.innerHTML = "no device motion/orientation data";
      }, 1000);

      window.addEventListener("devicemotion", onDeviceMotion);
      window.addEventListener("deviceorientation", onDeviceOrientation);
    }
  }
  function onDeviceMotion(evt: DeviceMotionEvent): void {
    if (timeout) {
      // reset time out and hide start screen
      timeout = null;
      startScreen.classList.add("hide");
    }

    const accig: DeviceMotionEventAcceleration = evt.accelerationIncludingGravity;
    setBiBar(accigBars[0], accig.x / 20);
    setBiBar(accigBars[1], accig.y / 20);
    setBiBar(accigBars[2], accig.z / 20);
    setNumber(accigNumbers[0], accig.x);
    setNumber(accigNumbers[1], accig.y);
    setNumber(accigNumbers[2], accig.z);

    const acc: DeviceMotionEventAcceleration = evt.acceleration;
    setBiBar(accBars[0], acc.x / 20);
    setBiBar(accBars[1], acc.y / 20);
    setBiBar(accBars[2], acc.z / 20);
    setNumber(accNumbers[0], acc.x);
    setNumber(accNumbers[1], acc.y);
    setNumber(accNumbers[2], acc.z);

    const rot: DeviceMotionEventRotationRate = evt.rotationRate;
    setBiBar(rotBars[0], rot.alpha / 360);
    setBiBar(rotBars[1], rot.beta / 360);
    setBiBar(rotBars[2], rot.gamma / 360);
    setNumber(rotNumbers[0], rot.alpha);
    setNumber(rotNumbers[1], rot.beta);
    setNumber(rotNumbers[2], rot.gamma);

    const interval: number = evt.interval;
    setNumber(intervalNumber, interval, 6);
  }

  function onDeviceOrientation(evt: DeviceOrientationEvent): void {
    if (timeout) {
      // reset timeout and hide start screen
      timeout = null;
      startScreen.classList.add("hide");
    }

    setBar(oriBars[0], evt.alpha / 360);
    setBiBar(oriBars[1], evt.beta / 180);
    setBiBar(oriBars[2], evt.gamma / 90);
    setNumber(oriNumbers[0], evt.alpha);
    setNumber(oriNumbers[1], evt.beta);
    setNumber(oriNumbers[2], evt.gamma);
  }

  function setBar(bar: HTMLDivElement, value: number): void {
    if (value >= 0) {
      bar.style.left = "0";
      bar.style.width = `${100 * value}%`;
    }
  }

  function setNumber(div: HTMLDivElement, value: number, numDec: number = 2): void {
    div.innerHTML = value.toFixed(numDec);
  }

  function setBiBar(div: HTMLDivElement, value: number): void {
    if (value >= 0) {
      div.style.left = "50%";
      div.style.width = `${50 * value}%`;
    } else {
      div.style.left = `${50 * (1 + value)}%`;
      div.style.width = `${50 * -value}%`;
    }
  }
}
