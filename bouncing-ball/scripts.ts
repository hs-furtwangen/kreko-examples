namespace deviceMotionPhysics {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
  const bouncingBall: BouncingBall = new BouncingBall(canvas);

  // create device motion/orientation manager and register motion callback
  const motionManager: DeviceMotionAndOrientationManager = new DeviceMotionAndOrientationManager();
  motionManager.onAccelerationIncludingGravity = bouncingBall.setAcceleration;

  // create start screen and register device motion/orientation manager
  const startScreen: StartScreen = new StartScreen("start-screen");
  startScreen.addResourceManager(motionManager);
  startScreen.start();

  bouncingBall.start();
}
