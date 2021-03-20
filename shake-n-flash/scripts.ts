namespace motionSensors {
  const motionManager: DeviceMotionAndOrientationManager = new DeviceMotionAndOrientationManager("start-screen");
  motionManager.onAcceleration = onAcceleration;
  motionManager.start();

  const flashDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("flash");

  function onAcceleration(x: number, y: number, z: number): void {
    const normX: number = Math.min(1, Math.max(0, 0.05 * x));
    const normY: number = Math.min(1, Math.max(0, 0.05 * y));
    const normZ: number = Math.min(1, Math.max(0, 0.05 * z));
    const accMag: number = normX * normX + normY * normY + normZ + normZ;

    flashDiv.style.opacity = Math.min(1, accMag).toString();
  }
}
