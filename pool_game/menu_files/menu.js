import { setState } from "../global_variables.js";
import { drawSettings, mousePressedSettings } from "./settings.js";

export function setupMenu() { }

// tegn menu
export function drawMenu() {
  background(30);
  push();
  ortho();
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  noStroke();
  text("POOL", 0, -50);
  fill(0, 180, 0);
  rectMode(CENTER);
  rect(0, 20, 160, 50, 8);
  fill(255);
  textSize(24);
  text("Play", 0, 20);
  pop();
}

// hvis man trykker play ændres tilstand til "game"
export function mousePressedMenu() {
  let bx = mouseX - width / 2;
  let by = mouseY - height / 2;
  if (bx > -80 && bx < 80 && by > -5 && by < 45) {
    setState("game");
  }
}