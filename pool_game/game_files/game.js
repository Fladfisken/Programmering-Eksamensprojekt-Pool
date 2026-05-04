import { setupTable, drawTable } from "./table.js";
import { setupBalls, drawBalls } from "./balls.js";
import { drawPhysics } from "./physics.js";
import { drawCue, mousePressedCue } from "./cue.js";

export function setupGame() {
  setupTable();
  setupBalls();
}

export function drawGame() {
  drawTable();
  drawPhysics();
  drawBalls();
  drawCue();
}

export function mousePressedGame() {
  mousePressedCue();
}
