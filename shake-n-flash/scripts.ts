namespace shakeNFlash {
  const flashDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("flash");

  // create device motion/orientation manager and register motion callback
  const motionManager: DeviceMotionAndOrientationManager = new DeviceMotionAndOrientationManager();
  motionManager.onAcceleration = onAcceleration;

  // create start screen and register device motion/orientation manager
  const startScreen: StartScreen = new StartScreen("start-screen");
  startScreen.addResourceManager(motionManager);
  startScreen.start();

  function onAcceleration(x: number, y: number, z: number): void {
    const normX: number = Math.min(1, Math.max(0, 0.05 * x));
    const normY: number = Math.min(1, Math.max(0, 0.05 * y));
    const normZ: number = Math.min(1, Math.max(0, 0.05 * z));
    const accMag: number = normX * normX + normY * normY + normZ + normZ;

    flashDiv.style.opacity = Math.min(1, accMag).toString();
  }
}
