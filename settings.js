import { setState, getState, obamium, setObamium, font } from "./global_variables.js";
import { setupBalls } from "./balls.js";

// Dimensioner på settings-boksen. Bruges til kollisionstjek for knapklik
let boxW = 200;
let boxH = 200;
let boxX = -boxW / 2;
let boxY = -boxH / 2;

let secretInput;
const SECRET_CODE = "obamium";

// Opretter det skjulte tekstfelt til "hemmelig" kode
export function setupSettings() {
  secretInput = createInput("");
  secretInput.attribute("placeholder", "enter code...");
  secretInput.style("position", "absolute");
  secretInput.style("width", "140px");
  secretInput.style("font-size", "14px");
  secretInput.style("text-align", "center");
  secretInput.style("border-radius", "6px");
  secretInput.style("border", "1px solid #888");
  secretInput.style("padding", "4px");
  secretInput.hide();

  // Tjekker input-ændringer og aktiverer/deaktiverer obamium mode
  secretInput.input(() => {
    if (secretInput.value().toLowerCase() === SECRET_CODE) {
      setObamium(true);
      secretInput.value("ACCESS GRANTED");
    } else if (obamium && secretInput.value().toLowerCase() !== "ACCESS GRANTED") {
      setObamium(false);
    }
  });
}

// Placerer HTML-inputfeltet ovenpå canvas i den rigtige position
function positionInput() {
  let cx = width / 2;
  let cy = height / 2;
  let canvas = document.querySelector("canvas");
  let rect = canvas.getBoundingClientRect();
  secretInput.position(rect.left + cx - 75, rect.top + cy + 45);
}

export function drawSettings() {
  // Tegner settings-knap i øverste højre hjørne under spillet
  if (getState() === "game") {
    secretInput.hide();
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

  // Hvis man åbner settings bliver det tegnet oven på poolbordet
  if (getState() === "settings") {
    positionInput();
    secretInput.show();

    push();
    ortho();
    // Mørk gennemsigtig baggrund
    fill(0, 0, 0, 150);
    noStroke();
    rectMode(CORNER);
    rect(-width / 2, -height / 2, width, height);

    // Settings-boks
    fill(50);
    rectMode(CENTER);
    rect(0, 0, boxW, boxH, 10);
    textFont(font);

    // Continue knap
    fill(0, 180, 0);
    rect(0, -50, 160, 40, 6);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Continue", 0, -50);

    // Menu knap
    fill(180, 0, 0);
    rect(0, 10, 160, 40, 6);
    fill(255);
    text("Back to Menu", 0, 10);

    // Label over secret code input
    fill(180);
    textSize(12);
    text("Enter code:", 0, 52);
    pop();
  } else {
    secretInput.hide(); // Skjul input i alle andre tilstande (menu, win, lose, placing)
  }
}

export function mousePressedSettings() {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  // Check om der bliver trykket "settings" undervejs i spillet
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
    // Continue knap
    if (mx > -80 && mx < 80 && my > -70 && my < -30) {
      setState("game");
      return;
    }
    // "back to menu" knap
    if (mx > -80 && mx < 80 && my > -10 && my < 30) {
      setupBalls(); // Nulstiller boldene (så de sidder det rette sted og ikke duplikeres når man starter igen)
      setState("menu");
      return;
    }
  }
}