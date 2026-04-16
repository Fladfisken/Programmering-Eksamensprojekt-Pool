
function touchingBalls(b1, b2) {
  if (b1.pocketed || b2.pocketed) return;

  let dx = b2.pos.x - b1.pos.x;
  let dy = b2.pos.y - b1.pos.y;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist < 2 * r) {
    if (dist === 0) dist = 0.01;

    // normal
    let nx = dx / dist;
    let ny = dy / dist;

    // relative velocity
    let rvx = b2.vel.x - b1.vel.x;
    let rvy = b2.vel.y - b1.vel.y;

    // velocity along normal
    let relVel = rvx * nx + rvy * ny;

    // do NOT resolve if separating
    if (relVel > 0) return;

    // impulse (equal mass)
    let impulse = (-(1 + restitution) * relVel) / 2;

    let ix = impulse * nx;
    let iy = impulse * ny;

    b1.vel.x -= ix;
    b1.vel.y -= iy;
    
    b2.vel.x += ix;
    b2.vel.y += iy;

    // positional correction (reduced to avoid jitter)
    let overlap = 2 * r - dist;
    let correction = overlap * 0.8;

    b1.pos.x -= (nx * correction) / 2;
    b1.pos.y -= (ny * correction) / 2;

    b2.pos.x += (nx * correction) / 2;
    b2.pos.y += (ny * correction) / 2;
  }
}

