namespace deviceMotionPhys {
  class ThreeDim {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    reset(): void {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    set(x: number, y: number, z: number): void {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  const startScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("start-screen");
  const startScreenText: HTMLDivElement = <HTMLDivElement>startScreen.querySelector("div");
  let timeout: NodeJS.Timeout = null;

  if (DeviceMotionEvent && DeviceOrientationEvent) {
    // device/browser seems to support device motion and orientation, check it out
    document.body.addEventListener("click", checkForDeviceMotion);
  } else {
    startScreenText.innerHTML = "device motion/orientation not available";
  }

  const ballDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("ball");
  const ball: PhysBall = new PhysBall(ballDiv);

  function frame(): void {
    ball.onFrame();
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);

  function checkForDeviceMotion(): void {
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
          } else {
            startScreenText.innerHTML = "no permission for device motion";
          }
        })
        .catch(console.error);
    } else {
      // no permission required but set timeout for the case that 
      timeout = setTimeout(() => {
        timeout = null;
        startScreenText.innerHTML = "no device motion data";
      }, 1000);

      window.addEventListener("devicemotion", onDeviceMotion);
    }
  }

  function onDeviceMotion(evt: DeviceMotionEvent): void {
    if (timeout) {
      // reset time out and hide start screen
      timeout = null;
      startScreen.classList.add("hide");
    }

    const accig: DeviceMotionEventAcceleration = evt.accelerationIncludingGravity;
    ball.setAcc(accig.x, accig.y, accig.z);
  }
}
