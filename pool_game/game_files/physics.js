import { balls, ballRadius } from "./balls.js";
import { pockets, cushions, pocketLinings, pocketDiameter } from "./table.js";

export let wallFric = 0.8;
export let feltFric = 0.99;
export let restitution = 0.95;
export let ballFric = 0.95;
export let allStopped = true;

export function drawPhysics() {
  allStopped = true;

  for (let b of balls) {
    if (b.vel.mag() > 0.05) {
      allStopped = false;
      break;
    }
  }

  for (let b of balls) {
    wallCollision(b);
    pocketDetection(b);
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      touchingBalls(balls[i], balls[j]);
    }
  }
}

function segmentCollision(ball, seg) {
  let bx = ball.pos.x - width / 2;  // ← add these two lines
  let by = ball.pos.y - height / 2;

  let x1 = seg[0], y1 = seg[1];
  let x2 = seg[2], y2 = seg[3];

  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return;

  let t = ((bx - x1) * dx + (by - y1) * dy) / lenSq;  // ← bx/by
  t = constrain(t, 0, 1);

  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;

  let distX = bx - closestX;  // ← bx/by
  let distY = by - closestY;
  let dist = sqrt(distX * distX + distY * distY);

  if (dist < ballRadius && dist > 0) {
    let nx = distX / dist;
    let ny = distY / dist;

    let dot = ball.vel.x * nx + ball.vel.y * ny;
    if (dot < 0) {
      ball.vel.x -= 2 * dot * nx;
      ball.vel.y -= 2 * dot * ny;
      ball.vel.mult(wallFric);
    }

    // Write back in screen space ← unchanged
    let overlap = ballRadius - dist;
    ball.pos.x += nx * overlap;
    ball.pos.y += ny * overlap;
  }
}

function wallCollision(ball) {
  if (ball.pocket) return;

  for (let c of cushions) {
    segmentCollision(ball, c);
  }
  for (let l of pocketLinings) {
    segmentCollision(ball, l);
  }
}

function pocketDetection(ball) {
  if (ball.pocket) return;

  let bx = ball.pos.x - width / 2;  // ← add these two lines
  let by = ball.pos.y - height / 2;

  for (let p of pockets) {
    let dx = bx - p[0];  // ← bx/by
    let dy = by - p[1];
    let dist = sqrt(dx * dx + dy * dy);

    if (dist < pocketDiameter / 2) {
      ball.pocket = true;
      ball.vel.set(0, 0);
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
