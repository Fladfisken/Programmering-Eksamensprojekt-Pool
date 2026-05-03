import { balls, ballRadius } from "./balls.js";

export let wallFric = 0.9;
export let feltFric = 0.99;
export let restitution = 0.95;
export let ballFric = 0.99;
export let allStopped = true;

export function drawPhysics() {
  allStopped = true;

  for (let b of balls) {
    if (b.vel.mag() > 0.05) {
      allStopped = false;
      break;
    }
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      touchingBalls(balls[i], balls[j]);
    }
  }
}

function touchingBalls(ball1, ball2) {
  if (ball1.pocket || ball2.pocket) return;

  let dx = ball2.pos.x - ball1.pos.x;
  let dy = ball2.pos.y - ball1.pos.y;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist < 2 * ballRadius) {
    if (dist === 0) dist = 0.01;

    let nx = dx / dist;
    let ny = dy / dist;

    let rvx = ball2.vel.x - ball1.vel.x;
    let rvy = ball2.vel.y - ball1.vel.y;

    let relVel = rvx * nx + rvy * ny;
    if (relVel > 0) return;

    let impulse = (-(1 + restitution) * relVel) / 2;

    let ix = impulse * nx;
    let iy = impulse * ny;

    ball1.vel.x -= ix;
    ball1.vel.y -= iy;

    ball2.vel.x += ix;
    ball2.vel.y += iy;

    let overlap = 2 * ballRadius - dist;
    let correction = overlap * 0.8;

    ball1.pos.x -= (nx * correction) / 2;
    ball1.pos.y -= (ny * correction) / 2;

    ball2.pos.x += (nx * correction) / 2;
    ball2.pos.y += (ny * correction) / 2;
  }
}
