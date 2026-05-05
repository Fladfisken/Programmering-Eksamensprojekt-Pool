import { setupTable, drawTable } from "./table.js";
import { setupBalls, drawBalls, balls } from "./balls.js";
import { drawPhysics, allStopped } from "./physics.js";
import { drawCue, mousePressedCue, mouseReleasedCue, mouseMovedCue } from "./cue.js";
import { setState } from "../global_variables.js";

export function setupGame() {
  setupTable();
  setupBalls();
}

// tegn spillet
export function drawGame() {
  drawTable();
  drawPhysics();
  drawBalls();
  drawCue();
  checkPockets();
}

function checkPockets() {
  if (balls[0].pocket) { // hvis hvid bold bliver skudt i hullet skal den placeres
    setState("placing");
  }
  if (balls[8].pocket && allStopped) {
    // check om alle andre kugler er hullerne
    let allOtherPocketed = true;
    for (let i = 1; i < balls.length; i++) {
      if (i === 8) continue; // spring over 8-ball
      if (!balls[i].pocket) {
        allOtherPocketed = false;
        break;
      }
    }
    // win eller lose tilstand
    setState(allOtherPocketed ? "win" : "lose");
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