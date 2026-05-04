import { gameScale, getState, setState } from "../global_variables.js";
import { balls, ballRadius } from "./balls.js";
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

//let placePos = { x: width / 4, y: height / 2 };

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

// check if placement position overlaps any other ball
function isValidPlacement(x, y) {
  for (let i = 1; i < balls.length; i++) {
    if (balls[i].pocket) continue;
    let dx = (x + width / 2) - balls[i].pos.x;
    let dy = (y + height / 2) - balls[i].pos.y;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist < ballRadius * 2) return false;
  }
  return true;
}

export function drawCue() {
  let { bx, by, mx, my } = getPositions();

  if (getState() === "placing") {
    push();
    ortho();
    let valid = isValidPlacement(mx, my);
    stroke(valid ? color(0, 255, 0) : color(255, 0, 0));
    strokeWeight(2);
    noFill();
    circle(mx, my, ballRadius * 2);
    fill(255);
    textSize(14);
    noStroke();
    textAlign(LEFT, TOP);
    text("Click to place cue ball", -width / 2 + 10, -height / 2 + 10);
    pop();
    return; // skip normal cue drawing
  }

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

  if(getState() === "settings") return;

  if (getState() === "placing") {
    if (isValidPlacement(mx, my)) {
      balls[0].pos.x = mx + width / 2;
      balls[0].pos.y = my + height / 2;
      balls[0].vel.set(0, 0);
      balls[0].pocket = false; // bring it back
      setState("game");
    }
    return;
  }

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

export function mouseMovedCue() { }
