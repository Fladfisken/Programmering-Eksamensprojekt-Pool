import { setupTable, drawTable } from "./table.js";
import { setupBalls, drawBalls, balls } from "./balls.js";
import { drawPhysics } from "./physics.js";
import { drawCue, mousePressedCue, mouseReleasedCue, mouseMovedCue } from "./cue.js";
import { setState } from "../global_variables.js";

export function setupGame() {
  setupTable();
  setupBalls();
}

export function drawGame() {
  drawTable();
  drawPhysics();
  drawBalls();
  drawCue();
  checkPockets();
}

// if white ball pocketed switch to placing mode, if 8 ball pocketed go to end
function checkPockets() {
  if (balls[0].pocket) {
    setState("placing");
  }
  if (balls[8].pocket) {
    setState("end");
  }
}

export function mousePressedGame() {
  mousePressedCue();
}

export function mouseReleasedGame() {
  mouseReleasedCue();
}

export function mouseMovedGame() {
  mouseMovedCue(); 
}