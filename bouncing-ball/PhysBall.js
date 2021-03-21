"use strict";
class ThreeDim {
    constructor(x = 0, y = 0, z = 0) {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    reset() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class BouncingBall {
    constructor(canvas) {
        // parameters
        this.inertiaScale = 1;
        this.frictionFactor = 0.97;
        this.rebounceFactor = 0.9;
        this.impactThreshold = 1;
        /* position, velocity, acceleration */
        this.pos = new ThreeDim();
        this.vel = new ThreeDim();
        this.acc = new ThreeDim();
        this.lastTime = null;
        this.isRunning = false;
        this.canvas = null;
        this.canvas = canvas;
        this.onAnimationFrame = this.onAnimationFrame.bind(this);
        this.setAcceleration = this.setAcceleration.bind(this);
        this.adaptCanvas = this.adaptCanvas.bind(this);
        window.addEventListener("resize", this.adaptCanvas);
        this.adaptCanvas();
    }
    reset() {
        this.pos.reset();
        this.vel.reset();
        this.acc.reset();
    }
    setAcceleration(x, y, z) {
        this.acc.set(x, y, z);
    }
    // set friction as loss factor 0 ... 1
    setFriction(value) {
        this.frictionFactor = Math.max(0, Math.min(1, 1 - value));
    }
    // set scaling reflection factor of radial velocity (Vr' = -Vr * f)
    setRebouncing(value) {
        this.rebounceFactor = Math.max(0, Math.min(1, value));
    }
    start() {
        this.isRunning = true;
        this.onAnimationFrame();
    }
    stop() {
        this.isRunning = false;
    }
    onAnimationFrame() {
        const ctx = this.canvas.getContext("2d");
        const width = this.canvas.width;
        const height = this.canvas.height;
        const now = 0.001 * performance.now();
        if (this.lastTime !== null) {
            const deltaTime = now - this.lastTime;
            let pos = this.pos;
            let vel = this.vel;
            let acc = this.acc;
            // increment position
            pos.x += deltaTime * this.vel.x;
            pos.y += deltaTime * this.vel.y;
            pos.z += deltaTime * this.vel.z;
            // rebounce at the borders of teh screen
            const rebounce = this.rebounceFactor;
            if (pos.x < -1) {
                pos.x = -1 - 0.5 * rebounce * (pos.x + 1);
                vel.x *= -1;
            }
            else if (pos.x > 1) {
                pos.x = 1 - 0.5 * rebounce * (pos.x - 1);
                vel.x *= -1;
            }
            if (pos.y < -1) {
                pos.y = -1 - 0.5 * rebounce * (pos.y + 1);
                vel.y *= -1;
            }
            else if (pos.y > 1) {
                pos.y = 1 - 0.5 * rebounce * (pos.y - 1);
                vel.y *= -1;
            }
            if (pos.z < -1) {
                pos.z = -1 - 0.5 * rebounce * (pos.z + 1);
                vel.z *= -1;
            }
            else if (pos.z > 1) {
                pos.z = 1 - 0.5 * rebounce * (pos.z - 1);
                vel.z *= -1;
            }
            // adapt to device orientation
            let normX, normY;
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
            const halfWidth = 0.5 * width;
            const halfHeight = 0.5 * height;
            const x = halfWidth - normX * halfWidth;
            const y = halfHeight + normY * halfHeight;
            const size = 20 - pos.z * 10;
            ctx.fillStyle = "#fff";
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.clearRect(0, 0, width, height);
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
            // apply external acc
            vel.x += this.inertiaScale * deltaTime * acc.x;
            vel.y += this.inertiaScale * deltaTime * acc.y;
            vel.z += this.inertiaScale * deltaTime * acc.z;
            /* apply air friction */
            vel.x *= this.frictionFactor;
            vel.y *= this.frictionFactor;
            vel.z *= this.frictionFactor;
        }
        this.lastTime = now;
        if (this.isRunning) {
            requestAnimationFrame(this.onAnimationFrame);
        }
    }
    adaptCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
//# sourceMappingURL=PhysBall.js.map