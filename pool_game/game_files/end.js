import { setState } from "../global_variables.js";
import { setupBalls } from "./balls.js";

export function setupEnd() { }

export function drawEnd() {
  background(30);
  push();
  ortho();
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Game Over", 0, -50);
  fill(180, 0, 0);
  rectMode(CENTER);
  rect(0, 20, 200, 50, 8);
  fill(255);
  textSize(24);
  text("Back to Menu", 0, 20);
  pop();
}

export function mousePressedEnd() {
  let bx = mouseX - width / 2;
  let by = mouseY - height / 2;
  if (bx > -100 && bx < 100 && by > -5 && by < 45) {
    setupBalls(); // reset balls for next game
    setState("menu");
  }
}