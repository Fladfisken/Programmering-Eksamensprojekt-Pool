import { setState, font } from "./global_variables.js";
import { setupGame } from "./game.js"; 
import { drawSettings, mousePressedSettings } from "./settings.js";
import { poolTable } from "./configuration.js";
import { tableWidth, tableHeight } from "./table.js";

// Tegn menu
export function drawMenu() {
  background(30);
  push();
  noStroke();
  // Viser bordteksturen som baggrund
  texture(poolTable);
  plane(tableWidth, tableHeight);
  ortho();
  textFont(font);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  noStroke();
  text("POOL", 0, -50);
  // Tegner "Play" knap
  fill(0, 180, 0);
  rectMode(CENTER);
  rect(0, 20, 160, 50, 8);
  fill(255);
  textSize(24);
  text("Play", 0, 20);
  pop();
}

// Hvis man trykker play ændres tilstand til "game"
export function mousePressedMenu() {
  let bx = mouseX - width / 2;
  let by = mouseY - height / 2;
  if (bx > -80 && bx < 80 && by > -5 && by < 45) {
    setupGame(); // Nulstiller spillet inden start
    setState("game");
  }
}