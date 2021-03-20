class DeviceMotionAndOrientationManager {
  timeout: NodeJS.Timeout = null;
  screenDiv: HTMLDivElement = null;
  textDiv: HTMLDivElement = null;

  interval: number = 0;
  scaleAcc: number = 1; // scale factor to re-invert iOS acceleration

  onAccelerationIncludingGravity: Function = null;
  onAcceleration: Function = null;
  onRotationRate: Function = null;
  onOrientation: Function = null;

  constructor(id: string) {
    this.screenDiv = <HTMLDivElement>document.getElementById(id);
    this.textDiv = <HTMLDivElement>this.screenDiv.querySelector(".start-screen-text");

    this.setText("touch screen to start");

    this.check = this.check.bind(this);
    this.onDeviceMotion = this.onDeviceMotion.bind(this);
    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
  }

  setText(text: string): void {
    this.textDiv.innerHTML = text;
  }

  start(): void {
    this.screenDiv.style.display = "block";

    if (DeviceMotionEvent || DeviceOrientationEvent) {
      // device/browser seems to support device motion and orientation, check it out
      this.screenDiv.addEventListener("click", this.check);
    } else {
      this.setText("device motion/orientation not available");
    }
  }

  close(): void {
    this.screenDiv.style.display = "none";
  }

  setTimeout(text: string, durationInMs: number = 1): void {
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.setText(text);
    }, 1000 * durationInMs);
  }

  terminate(): void {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;

      this.close();
    }
  }

  check(): void {
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
          } else {
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
          } else {
            this.setText("no permission for device orientation");
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("devicemotion", this.onDeviceMotion);
      window.addEventListener("deviceorientation", this.onDeviceOrientation);
    }
  }

  onDeviceMotion(evt: DeviceMotionEvent): void {
    this.close();

    if (this.onAccelerationIncludingGravity !== null) {
      const accig: DeviceMotionEventAcceleration = evt.accelerationIncludingGravity;
      this.onAccelerationIncludingGravity(this.scaleAcc * accig.x, this.scaleAcc * accig.y, this.scaleAcc * accig.z, evt.interval);
    }

    if (this.onAcceleration !== null) {
      const acc: DeviceMotionEventAcceleration = evt.acceleration;
      this.onAcceleration(this.scaleAcc * acc.x, this.scaleAcc * acc.y, this.scaleAcc * acc.z, evt.interval);
    }

    if (this.onRotationRate !== null) {
      const rot: DeviceMotionEventRotationRate = evt.rotationRate;
      this.onRotationRate(rot.alpha, rot.beta, rot.gamma, evt.interval);
    }
  }

  onDeviceOrientation(evt: DeviceOrientationEvent): void {
    this.close();

    if (this.onOrientation !== null) {
      this.onOrientation(evt.alpha, evt.beta, evt.gamma);
    }
  }
}
