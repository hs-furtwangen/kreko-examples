class ThreeDim {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

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

class BouncingBall {
  // parameters
  inertiaScale: number = 1;
  frictionFactor: number = 0.97;
  rebounceFactor: number = 0.9;
  impactThreshold: number = 1;

  /* position, velocity, acceleration */
  pos: ThreeDim = new ThreeDim(); // 3D relative position (-1 ... 1)
  vel: ThreeDim = new ThreeDim(); // v3D eleoity
  acc: ThreeDim = new ThreeDim(); // 3D accelertion
  isRunning: boolean = false; /// whether the animation is still running
  lastTime: number = null; // time of last animation frame

  canvas: HTMLCanvasElement = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.setAcceleration = this.setAcceleration.bind(this);
    this.adaptCanvas = this.adaptCanvas.bind(this);

    window.addEventListener("resize", this.adaptCanvas);
    this.adaptCanvas();

  }

  reset(): void {
    this.pos.reset();
    this.vel.reset();
    this.acc.reset();
  }

  setAcceleration(x: number, y: number, z: number): void {
    this.acc.set(x, y, z);
  }

  // set friction as loss factor 0 ... 1
  setFriction(value: number): void {
    this.frictionFactor = Math.max(0, Math.min(1, 1 - value));
  }

  // set scaling reflection factor of radial velocity (Vr' = -Vr * f)
  setRebouncing(value: number): void {
    this.rebounceFactor = Math.max(0, Math.min(1, value));
  }

  start(): void {
    this.isRunning = true;
    this.onAnimationFrame();
  }

  stop(): void {
    this.isRunning = false;
  }

  onAnimationFrame(): void {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    const width: number = this.canvas.width;
    const height: number = this.canvas.height;
    const now: number = 0.001 * performance.now();

    if (this.lastTime !== null) {
      const deltaTime: number = now - this.lastTime;
      let pos: ThreeDim = this.pos;
      let vel: ThreeDim = this.vel;
      let acc: ThreeDim = this.acc;

      // increment position
      pos.x += deltaTime * this.vel.x;
      pos.y += deltaTime * this.vel.y;
      pos.z += deltaTime * this.vel.z;

      // rebounce at the borders of teh screen
      const rebounceFactor: number = this.rebounceFactor;

      if (pos.x < -1) {
        pos.x = -1 - 0.5 * rebounceFactor * (pos.x + 1);
        vel.x *= -1;
      } else if (pos.x > 1) {
        pos.x = 1 - 0.5 * rebounceFactor * (pos.x - 1);
        vel.x *= -1;
      }

      if (pos.y < -1) {
        pos.y = -1 - 0.5 * rebounceFactor * (pos.y + 1);
        vel.y *= -1;
      } else if (pos.y > 1) {
        pos.y = 1 - 0.5 * rebounceFactor * (pos.y - 1);
        vel.y *= -1;
      }

      if (pos.z < -1) {
        pos.z = -1 - 0.5 * rebounceFactor * (pos.z + 1);
        vel.z *= -1;
      } else if (pos.z > 1) {
        pos.z = 1 - 0.5 * rebounceFactor * (pos.z - 1);
        vel.z *= -1;
      }

      // adapt physics to device orientation
      let normX: number, normY: number;

      switch (window.orientation) {
        case 0:
          normX = pos.x;
          normY = pos.y;
          break;
        case 90:
          normX = -pos.y;
          normY = pos.x;
          break;
        case 180:
          normX = -pos.x;
          normY = -pos.y;
          break;
        case -90:
          normX = pos.y;
          normY = -pos.x;
          break;
      }

      // paint on canvas
      const halfWidth: number = 0.5 * width;
      const halfHeight: number = 0.5 * height;
      const x: number = halfWidth - normX * halfWidth;
      const y: number = halfHeight + normY * halfHeight;
      const size: number = 20 - pos.z * 10;

      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.clearRect(0, 0, width, height);
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // apply acceleration to velocity
      vel.x += this.inertiaScale * deltaTime * acc.x;
      vel.y += this.inertiaScale * deltaTime * acc.y;
      vel.z += this.inertiaScale * deltaTime * acc.z;

      // apply air friction to velocity
      vel.x *= this.frictionFactor;
      vel.y *= this.frictionFactor;
      vel.z *= this.frictionFactor;
    }

    this.lastTime = now;

    // request next animation frame if still running
    if (this.isRunning) {
      requestAnimationFrame(this.onAnimationFrame);
    }
  }

  // adapt canvas to current screen size
  adaptCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}
