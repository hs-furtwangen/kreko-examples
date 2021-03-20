namespace deviceMotionPhys {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
  const bouncingBall: BouncingBall = new BouncingBall(canvas);

  const motionManager: DeviceMotionAndOrientationManager = new DeviceMotionAndOrientationManager("start-screen");
  motionManager.onAccelerationIncludingGravity = bouncingBall.setAcceleration;

  bouncingBall.start();
  motionManager.start();
}
