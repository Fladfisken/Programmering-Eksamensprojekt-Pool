import { setState, font } from "../global_variables.js";
import { setupGame } from "../game_files/game.js"; 
import { drawSettings, mousePressedSettings } from "./settings.js";
import { poolTable } from "../assets/configuration.js";
import { tableWidth, tableHeight } from "../game_files/table.js";

export function setupMenu() { }

// tegn menu
export function drawMenu() {
  background(30);
  push();
  noStroke();
  texture(poolTable);
  plane(tableWidth, tableHeight);
  ortho();
  textFont(font);
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
    setupGame();
    setState("game");
  }
}