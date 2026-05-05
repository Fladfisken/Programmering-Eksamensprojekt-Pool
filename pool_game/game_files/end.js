import { setState, getState, font } from "../global_variables.js";
import { setupBalls } from "./balls.js";

export function setupEnd() { }

// viser om man har vundet, eller om man er dårlig til pool
export function drawEnd() {
  background(30);
  push();
  ortho();
  rectMode(CENTER);
  textFont(font);
  noStroke();
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);

  // tegner en grøn "You Win!" eller rød "You Lose!" knap
  if (getState() === "win") {
    fill(255, 215, 0);
    text("You Win!", 0, -50);
    fill(0, 180, 0);
  } else {
    fill(255);
    text("You Lose!", 0, -50);
    fill(180, 0, 0);
  }

  rect(0, 20, 200, 50, 8);
  fill(255);
  textSize(24);
  text("Back to Menu", 0, 20);
  pop();
}

// trykker man på knappen kommer man tilbage til menu
export function mousePressedEnd() {
  let bx = mouseX - width / 2;
  let by = mouseY - height / 2;
  if (bx > -100 && bx < 100 && by > -5 && by < 45) {
    setupBalls(); // nulstiller kugler til næste spil
    setState("menu");
  }
}
