import { setupTable, drawTable } from "./table.js";
import { setupBalls, drawBalls, balls, ballRadius } from "./balls.js";
import { drawPhysics, allStopped } from "./physics.js";
import { drawCue, mousePressedCue, mouseReleasedCue, setupCue } from "./cue.js";
import { setState } from "./global_variables.js";

export function setupGame() {
  setupTable();
  setupBalls();
  setupCue();
}

// Tegn spillet
export function drawGame() {
  drawTable();
  drawPhysics();
  drawBalls();
  drawCue();
  checkPockets();
  drawPocketedTray();
}

// Boldene i hullerne bliver vist nederst på skærmen
function drawPocketedTray() {
  let pocketed = balls.filter((b, i) => b.pocket && i !== 0); // Filtrerer hvid bold fra
  if (pocketed.length === 0) return;

  push();
  ortho();

  let trayH = ballRadius * 3;
  let padding = ballRadius * 1.4;
  let trayY = height / 2 - trayH / 2 - 6; // Placeret langs bunden af skærmen
  let maxBalls = 15;
  let totalW = maxBalls * padding * 2 + ballRadius;
  let startX = -totalW / 2 + padding;

  // Mørk halvgennemsigtig baggrundsboks
  noStroke();
  fill(0, 0, 0, 120);
  rectMode(CENTER);
  rect(0, trayY, totalW + ballRadius, trayH, trayH / 2);

  // Tegner hver pocketeret bold som en lille 3D-kugle
  for (let i = 0; i < pocketed.length; i++) {
    let b = pocketed[i];
    let x = startX + i * padding * 2;
    let y = trayY;

    push();
    translate(x, y, 1);
    noStroke();
    texture(b.texture);
    sphere(ballRadius * 0.8);
    pop();
  }

  pop();
}

function checkPockets() {
  if (balls[0].pocket) { // Hvis hvid bold bliver skudt i hullet skal den placeres
    setState("placing");
  }

  if (balls[8].pocket && allStopped) {
    // Check om alle andre kugler er hullerne (fulde og stribede)
    let allSolidsPocketed = true;
    let allStripesPocketed = true;

    for (let i = 1; i < balls.length; i++) {
      if (i === 8) continue;

      // Fulde bolde
      if (i >= 1 && i <= 7) {
        if (!balls[i].pocket) {
          allSolidsPocketed = false;
        }
      }

      // Stribede bolde
      if (i >= 9 && i <= 15) {
        if (!balls[i].pocket) {
          allStripesPocketed = false;
        }
      }
    }

    // Win eller lose tilstand
    const validWin = allSolidsPocketed || allStripesPocketed;
    setState(validWin ? "win" : "lose");
  }
}

export function mousePressedGame() {
  mousePressedCue();
}

export function mouseReleasedGame() {
  mouseReleasedCue();
}