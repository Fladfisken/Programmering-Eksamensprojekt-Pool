import { balls, ballRadius } from "./balls.js";
import { pockets, cushions, pocketLinings, pocketDiameter, tableWidth, tableHeight } from "./table.js";

export let wallFric = 0.8;      // Friktion når bolde rammer kanten
export let feltFric = 0.99;     // Friktion når de ruller
export let restitution = 0.95;  // Friktion ved kollision
export let allStopped = true;   // Ligger alle bolde stille

// Antal fysik-understep per frame - giver mere præcis kollisionshåndtering
const SUBSTEPS = 4;

export function drawPhysics() {
  // Normalisere til 60 FPS
  let dt = constrain(deltaTime / (1000 / 60), 0, 3);
  let subDt = dt / SUBSTEPS;

  // Tjekker om alle bolde er stoppet
  allStopped = true;
  for (let b of balls) {
    if (b.vel.mag() > 0.05) {
      allStopped = false;
      break;
    }
  }

  for (let step = 0; step < SUBSTEPS; step++) {
    // Bevæger først kuglen
    for (let b of balls) {
      b.move(subDt);
    }
    // Så checkes kollision
    for (let b of balls) {
      wallCollision(b);
      pocketDetection(b);
      clampBall(b);
    }
    // Tjekker kollision mellem hvert par af bolde
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        touchingBalls(balls[i], balls[j]);
      }
    }
  }
}

// Beregner kollision mellem en bold og et linjestykke (kant eller hulkant)
function segmentCollision(ball, seg) {
  let bx = ball.pos.x - width / 2;
  let by = ball.pos.y - height / 2;

  let x1 = seg[0], y1 = seg[1];
  let x2 = seg[2], y2 = seg[3];

  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return;

  // Finder det nærmeste punkt på linjen til boldens center
  let t = ((bx - x1) * dx + (by - y1) * dy) / lenSq;
  t = constrain(t, 0, 1);

  let closestX = x1 + t * dx;
  let closestY = y1 + t * dy;

  let distX = bx - closestX;
  let distY = by - closestY;
  let dist = sqrt(distX * distX + distY * distY);

  if (dist < ballRadius && dist > 0) {
    // Beregner normalvektor væk fra kanten
    let nx = distX / dist;
    let ny = distY / dist;

    // Reflekterer hastighed og anvender kantfriktion kun hvis bolden bevæger sig mod kanten
    let dot = ball.vel.x * nx + ball.vel.y * ny;
    if (dot < 0) {
      ball.vel.x -= 2 * dot * nx;
      ball.vel.y -= 2 * dot * ny;
      ball.vel.mult(wallFric);
    }

    // Skubber bolden ud af kanten så den ikke overlapper
    let overlap = ballRadius - dist;
    ball.pos.x += nx * overlap;
    ball.pos.y += ny * overlap;
  }
}

// Tjekker kollision mod alle kanter og hulkanter
function wallCollision(ball) {
  if (ball.pocket) return;

  for (let c of cushions) {
    segmentCollision(ball, c);
  }
  for (let l of pocketLinings) {
    segmentCollision(ball, l);
  }
}

// Tjekker om en bold er tæt nok på et hul til at falde ned
function pocketDetection(ball) {
  if (ball.pocket) return;

  let bx = ball.pos.x - width / 2;
  let by = ball.pos.y - height / 2;

  for (let p of pockets) {
    let dx = bx - p[0];
    let dy = by - p[1];
    let dist = sqrt(dx * dx + dy * dy);

    if (dist < pocketDiameter / 2) {
      ball.pocket = true;
      ball.vel.set(0, 0);
    }
  }
}

// Sikring, skulle en bold på magisk vis ryge udenfor bordet
function clampBall(ball) {
  if (ball.pocket) return;

  let bx = ball.pos.x - width / 2;
  let by = ball.pos.y - height / 2;

  if (bx < -tableWidth / 2 + ballRadius) {
    ball.pos.x = width / 2 + (-tableWidth / 2 + ballRadius);
    ball.vel.x = abs(ball.vel.x);
  }
  if (bx > tableWidth / 2 - ballRadius) {
    ball.pos.x = width / 2 + (tableWidth / 2 - ballRadius);
    ball.vel.x = -abs(ball.vel.x);
  }
  if (by < -tableHeight / 2 + ballRadius) {
    ball.pos.y = height / 2 + (-tableHeight / 2 + ballRadius);
    ball.vel.y = abs(ball.vel.y);
  }
  if (by > tableHeight / 2 - ballRadius) {
    ball.pos.y = height / 2 + (tableHeight / 2 - ballRadius);
    ball.vel.y = -abs(ball.vel.y);
  }
}

// BALL FISIKS!!!!
// Hvis to bolde begge er på bordet og rører hinanden kolliderer de
function touchingBalls(ball1, ball2) {
  if (ball1.pocket || ball2.pocket) return;

  let dx = ball2.pos.x - ball1.pos.x;
  let dy = ball2.pos.y - ball1.pos.y;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist < 2 * ballRadius) {
    if (dist === 0) dist = 0.01; // Undgår division med nul hvis bolde er præcis samme sted

    // Normalvektor fra bold1 til bold2
    let nx = dx / dist;
    let ny = dy / dist;

    // Relativ hastighed langs normalvektoren
    let rvx = ball2.vel.x - ball1.vel.x;
    let rvy = ball2.vel.y - ball1.vel.y;

    let relVel = rvx * nx + rvy * ny;
    if (relVel > 0) return; // Boldene bevæger sig allerede fra hinanden

    // Beregner impuls ud fra restitutionskoefficienten
    let impulse = (-(1 + restitution) * relVel) / 2;

    let ix = impulse * nx;
    let iy = impulse * ny;

    ball1.vel.x -= ix;
    ball1.vel.y -= iy;

    ball2.vel.x += ix;
    ball2.vel.y += iy;

    // Skubber boldene fra hinanden så de ikke overlapper
    let overlap = 2 * ballRadius - dist;
    let correction = overlap * 0.8;

    ball1.pos.x -= (nx * correction) / 2;
    ball1.pos.y -= (ny * correction) / 2;

    ball2.pos.x += (nx * correction) / 2;
    ball2.pos.y += (ny * correction) / 2;
  }
}