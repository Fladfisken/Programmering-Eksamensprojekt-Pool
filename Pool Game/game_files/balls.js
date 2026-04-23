import { tableWidth } from "./table.js";
import { wallFric, feltFric } from "./physics.js";
import { ballTexture } from "../assets/configuration.js";

export let r = ((tableWidth / 103) * 2.25) / 2;
export let d = 2 * r;
export let balls = [];

let ballHitbox = false;

export function setupBalls() {
    let tri = sqrt(3) / 2;
    let rows = 5;

    let positions = [];

    let x0 = width - (d * (rows - 1) * tri + r + (height / 2) * tri);
    let y0 = height / 2;

    for (let row = 0; row < rows; row++) {
        let x = x0 + row * d * tri;

        for (let col = 0; col <= row; col++) {
            let y = y0 - (row * d) / 2 + col * d;
            positions.push({ x, y });
        }
    }

    let px = (height / 2) * tri;
    let py = height / 2;
    balls.push(new Ball(px, py, 0, 0));

    for (let pos of positions) {
        balls.push(new Ball(pos.x, pos.y, 0, 0));
    }
}

export function drawBalls() {
    for (let b of balls) {
        b.move();
        b.wall();
        b.show();
    }
}

export class Ball {
    constructor(x, y, vx, vy) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.angle = 0;
        this.axis = createVector(0, 1, 0);
        this.pocket = false;
    }

    move() {
        if (this.pocket) return;
        let speed = this.vel.mag();
        if (speed > 0.05) {
            this.angle += speed / r;
            this.axis = createVector(-this.vel.y, this.vel.x, 0).normalize();
        }
        this.pos.add(this.vel);
        this.vel.mult(feltFric);

        if (speed < 0.05) { this.vel.set(0, 0); }
    }

    wall() {
        if (this.pocket) return;

        if (this.pos.x < r) {
            this.vel.x *= -wallFric;
            this.pos.x = r;
        }
        if (this.pos.x > width - r) {
            this.vel.x *= -wallFric;
            this.pos.x = width - r;
        }
        if (this.pos.y < r) {
            this.vel.y *= -wallFric;
            this.pos.y = r;
        }
        if (this.pos.y > height - r) {
            this.vel.y *= -wallFric;
            this.pos.y = height - r;
        }
    }

    show() {
        if (this.pocket) return;

        if (!ballHitbox) {
            push();
            translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
            rotate(this.angle, this.axis);
            texture(ballTexture);
            noStroke();
            sphere(r);
            pop();
        }

        if (ballHitbox) {
            push();
            translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
            noFill();
            stroke(255, 0, 0); // ← red so it's visible against anything
            strokeWeight(1);
            circle(0, 0, d);   // ← draw at 0,0 since we already translated
            pop();
        }
    }
}
