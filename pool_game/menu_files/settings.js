import { setState, getState, font } from "../global_variables.js";
import { setupBalls } from "../game_files/balls.js";

// button/box dimensions for hit testing
let boxW = 200;
let boxH = 150;
let boxX = -boxW / 2;
let boxY = -boxH / 2;

export function setupSettings() { }

export function drawSettings() {
  // NEW: draw settings button in top right corner during game
  if (getState() === "game") {
    push();
    ortho();
    textFont(font);
    fill(180);
    rectMode(CORNER);
    rect(width / 2 - 90, -height / 2 + 10, 80, 30, 6);
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Settings", width / 2 - 50, -height / 2 + 25);
    pop();
  }

  // hvis man åbner settings bliver det tegnet oven på poolbordet
  if (getState() === "settings") {
    push();
    ortho();
    // mørk gennemsigtig baggrund
    fill(0, 0, 0, 150);
    noStroke();
    rectMode(CORNER);
    rect(-width / 2, -height / 2, width, height);

    // settings knap
    fill(50);
    rectMode(CENTER);
    rect(0, 0, boxW, boxH, 10);
    textFont(font);

    // continue knap
    fill(0, 180, 0);
    rect(0, -30, 160, 40, 6);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Continue", 0, -30);

    // menu knap
    fill(180, 0, 0);
    rect(0, 30, 160, 40, 6);
    fill(255);
    text("Back to Menu", 0, 30);
    pop();
  }
}

export function mousePressedSettings() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  // check om der bliver trykket "settings" undervejs i spillet
  if (getState() === "game") {
    if (mx > width / 2 - 90 && mx < width / 2 - 10 && my > -height / 2 + 10 && my < -height / 2 + 40) {
      setState("settings");
      return;
    }
  }

  if (getState() === "settings") {
    // Hvis man trykker uden for settings kommer man tilbage til game
    if (mx < boxX || mx > boxX + boxW || my < boxY || my > boxY + boxH) {
      setState("game");
      return;
    }
    // continue knap
    if (mx > -80 && mx < 80 && my > -50 && my < -10) {
      setState("game");
      return;
    }
    // "back to menu" knap
    if (mx > -80 && mx < 80 && my > 10 && my < 50) {
      setupBalls(); // nulstil boldene
      setState("menu");
      return;
    }
  }
}