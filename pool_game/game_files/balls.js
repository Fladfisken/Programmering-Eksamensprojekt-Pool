import { gameScale } from "../global_variables.js";
import { ballHitBox } from "../global_variables.js";
import { playWidth, playHeight } from "./table.js";
import { wallFric, feltFric } from "./physics.js";
import {
  cueBall, yellowFull, blueFull, redFull,
  purpleFull, orangeFull, greenFull, maroonFull,
  eightBall, yellowStripe, blueStripe, redStripe,
  purpleStripe, orangeStripe, greenStripe, maroonStripe
} from "../assets/configuration.js";

export let ballRadius = 9 * gameScale;
export let ballDiameter = 2 * ballRadius;
export let balls = [];

let ballTextures = [];

export function setupBalls() {
  ballTextures = [
    cueBall, yellowFull, blueFull, redFull,
    purpleFull, orangeFull, greenFull, maroonFull,
    eightBall, yellowStripe, blueStripe, redStripe,
    purpleStripe, orangeStripe, greenStripe, maroonStripe
  ];

  let triangleLatticeRelation = sqrt(3) / 2;
  let ballRows = 5;

  let ballPositions = [];

  let ox = width / 2;
  let oy = height / 2;

  let ballx0 = ox + playWidth / 4
  let bally0 = oy;

  for (let ballRow = 0; ballRow < ballRows; ballRow++) {
    let ballx = ballx0 + ballRow * ballDiameter * triangleLatticeRelation;

    for (let ballColumn = 0; ballColumn <= ballRow; ballColumn++) {
      let bally = bally0 - (ballRow * ballDiameter) / 2 + ballColumn * ballDiameter;
      ballPositions.push({ ballx, bally });
    }
  }

  let cueBallx = ox - playWidth / 4; // roughly quarter way from left cushion
  let cueBally = oy;

  balls.push(new Ball(cueBallx, cueBally, 0, 0, 0));

  for (let i = 0; i < ballPositions.length; i++) {
    balls.push(new Ball(ballPositions[i].ballx, ballPositions[i].bally, 0, 0, i + 1));
  }
}

export function drawBalls() {
  for (let b of balls) {
    b.move();
    b.show();
  }
}

export class Ball {
  constructor(ballx, bally, vx, vy, texture) {
    this.pos = createVector(ballx, bally);
    this.vel = createVector(vx, vy);
    this.angle = 0;
    this.axis = createVector(0, 1, 0);
    this.pocket = false;
    this.texture = ballTextures[texture];
  }

  move() {
    if (this.pocket) return;
    let speed = this.vel.mag();
    if (speed > 0.05) {
      this.angle += speed / ballRadius;
      this.axis = createVector(-this.vel.y, this.vel.x, 0).normalize();
    }
    this.pos.add(this.vel);
    this.vel.mult(feltFric);

    if (speed < 0.05) { this.vel.set(0, 0); }
  }

  show() {
    if (this.pocket) return;

    if (!ballHitBox) {
      push();
      translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
      rotate(this.angle, this.axis);
      texture(this.texture);
      noStroke();
      sphere(ballRadius);
      pop();
    }

    if (ballHitBox) {
      push();
      translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
      noFill();
      stroke(255, 0, 0);
      strokeWeight(1);
      circle(0, 0, ballDiameter);
      pop();
    }
  }
}
