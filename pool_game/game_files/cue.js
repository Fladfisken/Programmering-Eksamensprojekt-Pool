import { gameScale } from "../global_variables.js";
import { balls } from "./balls.js";
import { allStopped } from "./physics.js";

let aimLength = 200 * gameScale;
let aimAngle = 0;

let isAiming = false;
let isDragging = false;

let savedAimAngle = 0;
let savedMouseAngle = 0;

let dragDistance = 0;
let maxDrag = 80 * gameScale;
let cueLength = 150 * gameScale;
let dragStartPos = null;

//avoid repeating these calculations
function getPositions() {
  return {
    bx: balls[0].pos.x - width / 2,
    by: balls[0].pos.y - height / 2,
    mx: mouseX - width / 2,
    my: mouseY - height / 2,
  };
}

function mouseIsNearCue(bx, by, mx, my) {
  // vector from ball to mouse
  let dx = mx - bx;
  let dy = my - by;

  // cue direction is opposite to aim
  let cueDirX = -cos(aimAngle);
  let cueDirY = -sin(aimAngle);

  // dot product tells if mouse is behind the ball
  let dot = dx * cueDirX + dy * cueDirY;
  if (dot < 0) return false; // mouse is in front of ball, not behind

  // point-to-line distance from mouse to cue line
  let dist = abs(dx * sin(aimAngle) - dy * cos(aimAngle));

  return dist < 20 * gameScale;
}

export function drawCue() {
  let { bx, by, mx, my } = getPositions();

  if (isAiming) {
    let currentMouseAngle = atan2(my - by, mx - bx);
    aimAngle = savedAimAngle + (currentMouseAngle - savedMouseAngle);
  }

  //update drag distance when dragging
  if (isDragging) {
    let dx = mx - dragStartPos.x;
    let dy = my - dragStartPos.y;
    // project mouse movement onto cue direction (behind ball)
    let cueDirX = -cos(aimAngle);
    let cueDirY = -sin(aimAngle);
    let projected = dx * cueDirX + dy * cueDirY;
    dragDistance = constrain(projected, 0, maxDrag);
  }

  // draw cue stick offset by drag distance
  let cueStartX = bx - (10 + dragDistance) * cos(aimAngle);
  let cueStartY = by - (10 + dragDistance) * sin(aimAngle);
  
  if(allStopped){
    stroke(255);
    strokeWeight(1);
    line(bx, by, bx + aimLength * cos(aimAngle), by + aimLength * sin(aimAngle));

    stroke(180, 120, 60);
    strokeWeight(4);
    line(cueStartX, cueStartY,
    cueStartX - cueLength * cos(aimAngle),
    cueStartY - cueLength * sin(aimAngle));

  }

  let power = round((dragDistance / maxDrag) * 100);
  
}

export function mousePressedCue() {
  let { bx, by, mx, my } = getPositions();

  // check if mouse is near cue to decide mode
  if(allStopped){
    if (mouseIsNearCue(bx, by, mx, my)) {
      isDragging = true;
      isAiming = false;
      dragDistance = 0;
      dragStartPos = { x: mx, y: my };
    } else {
      isAiming = true;
      isDragging = false;
      savedAimAngle = aimAngle;
      savedMouseAngle = atan2(my - by, mx - bx);
    }
  }
}

export function mouseReleasedCue() {
  if (isDragging && dragDistance > 0) {
    let power = dragDistance / maxDrag;
    let maxForce = 18 * gameScale;
    let force = power * maxForce;
    balls[0].vel.x += force * cos(aimAngle);
    balls[0].vel.y += force * sin(aimAngle);
  }

  isAiming = false;
  isDragging = false;
  dragDistance = 0;
  dragStartPos = null;
}

/*
export function drawCue() {
  let cueX = balls[0].pos.x - width / 2;
  let cueY = balls[0].pos.y - height / 2;
  let aimAngle = atan2(
    (mouseY - height / 2) - cueY,
    (mouseX - width / 2) - cueX
  );
  line(
    cueX, cueY,
    cueX - aimLenght * cos(aimAngle),
    cueY - aimLenght * sin(aimAngle)
  );
}

export function mousePressedCue() {
  let cue = balls[0];
  let force = createVector(cue.pos.x - mouseX, cue.pos.y - mouseY);
  cue.vel.add(force.mult(0.2));
}
*/
