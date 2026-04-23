import { balls, r } from "./balls.js";

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

function touchingBalls(b1, b2) {
    if (b1.pocket || b2.pocket) return;

    let dx = b2.pos.x - b1.pos.x;
    let dy = b2.pos.y - b1.pos.y;
    let dist = sqrt(dx * dx + dy * dy);

    if (dist < 2 * r) {
        if (dist === 0) dist = 0.01;

        let nx = dx / dist;
        let ny = dy / dist;

        let rvx = b2.vel.x - b1.vel.x;
        let rvy = b2.vel.y - b1.vel.y;

        let relVel = rvx * nx + rvy * ny;
        if (relVel > 0) return;

        let impulse = (-(1 + restitution) * relVel) / 2;

        let ix = impulse * nx;
        let iy = impulse * ny;

        b1.vel.x -= ix;
        b1.vel.y -= iy;

        b2.vel.x += ix;
        b2.vel.y += iy;

        let overlap = 2 * r - dist;
        let correction = overlap * 0.8;

        b1.pos.x -= (nx * correction) / 2;
        b1.pos.y -= (ny * correction) / 2;

        b2.pos.x += (nx * correction) / 2;
        b2.pos.y += (ny * correction) / 2;
    }
}
