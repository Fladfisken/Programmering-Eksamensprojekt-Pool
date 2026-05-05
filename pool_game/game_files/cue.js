import { gameScale, getState, setState } from "../global_variables.js";
import { balls, ballRadius } from "./balls.js";
import { allStopped } from "./physics.js";

let aimLength = 200 * gameScale;
let aimAngle = 0;
let isAiming = false;
let isDragging = false; 
let savedAimAngle = 0;
let savedMouseAngle = 0;
let dragDistance = 0;             // Længde køen er trukket tilbage
let maxDrag = 100 * gameScale;     // Længde man kan trække køen tilbage
let cueLength = 576 * gameScale;
let dragStartPos = null;

function getPositions() {
  return {
    bx: balls[0].pos.x - width / 2,
    by: balls[0].pos.y - height / 2,
    mx: mouseX - width / 2,
    my: mouseY - height / 2,
  };
}

function mouseIsNearCue(bx, by, mx, my) {
  // vektor fra kugle til musen
  let dx = mx - bx;
  let dy = my - by;

  // poolkøens retning er modsat af hvad man sigter
  let cueDirX = -cos(aimAngle);
  let cueDirY = -sin(aimAngle);

  // Fortæller om musen er bagved kuglen
  let dot = dx * cueDirX + dy * cueDirY;
  if (dot < 0) return false; // mus er foran kuglen, ikke bagved

  // punkt-til-linje distance fra mus til kø
  let dist = abs(dx * sin(aimAngle) - dy * cos(aimAngle));

  return dist < 20 * gameScale;
}

// checker om man placerer den hvide kugle oven i en anden
function isValidPlacement(x, y) {
  for (let i = 1; i < balls.length; i++) {
    if (balls[i].pocket) continue;
    let dx = (x + width / 2) - balls[i].pos.x;
    let dy = (y + height / 2) - balls[i].pos.y;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist < ballRadius * 2 || !allStopped) return false; // hvis der er overlap må an ikke placere kuglen
  }
  return true;
}

// tegner poolkøen
export function drawCue() {
  let { bx, by, mx, my } = getPositions();

  if (getState() === "placing") {
    push();
    ortho();
    let valid = isValidPlacement(mx, my);
    stroke(valid ? color(0, 255, 0) : color(255, 0, 0)); // rød eller grøn afhængig af om placering er valid
    strokeWeight(2);
    noFill();
    circle(mx, my, ballRadius * 2);
    fill(255);
    textSize(14);
    noStroke();
    textAlign(LEFT, TOP);
    text("Click to place cue ball", -width / 2 + 10, -height / 2 + 10);
    pop();
    return;
  }

  // Sigtelinjen følger ikke musen, men roterer med den (man trækker sigtelinjen)
  if (isAiming) {
    let currentMouseAngle = atan2(my - by, mx - bx);
    aimAngle = savedAimAngle + (currentMouseAngle - savedMouseAngle);
  }

  // opdaterer drag-distance når isDragging == true
  if (isDragging) {
    let dx = mx - dragStartPos.x;
    let dy = my - dragStartPos.y;
    // projekterer musens ændring på køens retning
    let cueDirX = -cos(aimAngle);
    let cueDirY = -sin(aimAngle);
    let projected = dx * cueDirX + dy * cueDirY;
    dragDistance = constrain(projected, 0, maxDrag);
  }

  // tegner køen rykket aftstanden den trækkes tilbage
  let cueStartX = bx - (10 + dragDistance) * cos(aimAngle);
  let cueStartY = by - (10 + dragDistance) * sin(aimAngle);
  
  //Hvis boldene ligger stille skal sigtelinje og kø tegnes
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

  // cheker om musen er tæt på køen for at afgøre tilstand - sigte eller skyde med kø
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

// når musen slippes lægges force til kuglens hastighed
export function mouseReleasedCue() {
  if (isDragging && dragDistance > 0) {
    let power = dragDistance / maxDrag;
    let maxForce = 30 * gameScale;
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
