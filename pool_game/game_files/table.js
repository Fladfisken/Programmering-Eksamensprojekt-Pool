import { gameScale, tableHitBox } from "../global_variables.js";
import { poolTable } from "../assets/configuration.js";

export let tableWidth = 816 * gameScale;
export let tableHeight = 464 * gameScale;
export let playWidth = 704 * gameScale;
export let playHeight = 352 * gameScale;
export let cushionWidth = 16 * gameScale;
export let pocketDiameter = 36 * gameScale;
export let sidePocketMouth = 42 * gameScale;
export let tableMargin = 200 * gameScale;
export let sidePocketLiningAngle;

export let pockets = [];
export let cushions = [];
export let pocketLinings = [];

export function setupTable() {
  createCanvas(tableWidth + tableMargin, tableHeight + tableMargin, WEBGL);

  sidePocketLiningAngle = atan((sidePocketMouth / 2) / (pocketDiameter / 2)) * 2 - PI / 2;

  setupPockets()
  setupCushions()
  setupPocketLinings()
}

function setupPockets() {
  pockets.push(
    [playWidth / 2 + pocketDiameter / 4, playHeight / 2 + pocketDiameter / 4],
    [playWidth / 2 + pocketDiameter / 4, -(playHeight / 2 + pocketDiameter / 4)],
    [0, -(playHeight / 2 + pocketDiameter / 2)],
    [0, playHeight / 2 + pocketDiameter / 2],
    [-(playWidth / 2 + pocketDiameter / 4), -(playHeight / 2 + pocketDiameter / 4)],
    [-(playWidth / 2 + pocketDiameter / 4), playHeight / 2 + pocketDiameter / 4]
  )
}

function setupCushions() {
  cushions.push(
    [sidePocketMouth / 2, playHeight / 2, playWidth / 2 - pocketDiameter / 2 * sqrt(2), playHeight / 2],
    [-sidePocketMouth / 2, playHeight / 2, -playWidth / 2 + pocketDiameter / 2 * sqrt(2), playHeight / 2],
    [sidePocketMouth / 2, -playHeight / 2, playWidth / 2 - pocketDiameter / 2 * sqrt(2), -playHeight / 2],
    [-sidePocketMouth / 2, -playHeight / 2, -playWidth / 2 + pocketDiameter / 2 * sqrt(2), -playHeight / 2],
    [playWidth / 2, playHeight / 2 - pocketDiameter / 2 * sqrt(2), playWidth / 2, -playHeight / 2 + pocketDiameter / 2 * sqrt(2)],
    [-playWidth / 2, playHeight / 2 - pocketDiameter / 2 * sqrt(2), -playWidth / 2, -playHeight / 2 + pocketDiameter / 2 * sqrt(2)]
  )
}

function setupPocketLinings() {
  pocketLinings.push(
    [playWidth / 2 - pocketDiameter / 2 * sqrt(2), playHeight / 2, (playWidth / 2 + pocketDiameter / 4) - cos(PI / 4) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 4) + sin(PI / 4) * pocketDiameter / 2],
    [playWidth / 2, playHeight / 2 - pocketDiameter / 2 * sqrt(2), (playWidth / 2 + pocketDiameter / 4) + cos(PI / 4) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 4) - sin(PI / 4) * pocketDiameter / 2],
    [playWidth / 2 - pocketDiameter / 2 * sqrt(2), -playHeight / 2, (playWidth / 2 + pocketDiameter / 4) - cos(PI / 4) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 4) - sin(PI / 4) * pocketDiameter / 2],
    [playWidth / 2, -playHeight / 2 + pocketDiameter / 2 * sqrt(2), (playWidth / 2 + pocketDiameter / 4) + cos(PI / 4) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 4) + sin(PI / 4) * pocketDiameter / 2],
    [sidePocketMouth / 2, playHeight / 2, cos(sidePocketLiningAngle) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 2) + sin(sidePocketLiningAngle) * pocketDiameter / 2],
    [-sidePocketMouth / 2, playHeight / 2, -cos(sidePocketLiningAngle) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 2) + sin(sidePocketLiningAngle) * pocketDiameter / 2],
    [sidePocketMouth / 2, -playHeight / 2, cos(sidePocketLiningAngle) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 2) - sin(sidePocketLiningAngle) * pocketDiameter / 2],
    [-sidePocketMouth / 2, -playHeight / 2, -cos(sidePocketLiningAngle) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 2) - sin(sidePocketLiningAngle) * pocketDiameter / 2],
    [-playWidth / 2 + pocketDiameter / 2 * sqrt(2), playHeight / 2, -(playWidth / 2 + pocketDiameter / 4) + cos(PI / 4) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 4) + sin(PI / 4) * pocketDiameter / 2],
    [-playWidth / 2, playHeight / 2 - pocketDiameter / 2 * sqrt(2), -(playWidth / 2 + pocketDiameter / 4) - cos(PI / 4) * pocketDiameter / 2, (playHeight / 2 + pocketDiameter / 4) - sin(PI / 4) * pocketDiameter / 2],
    [-playWidth / 2 + pocketDiameter / 2 * sqrt(2), -playHeight / 2, -(playWidth / 2 + pocketDiameter / 4) + cos(PI / 4) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 4) - sin(PI / 4) * pocketDiameter / 2],
    [-playWidth / 2, -playHeight / 2 + pocketDiameter / 2 * sqrt(2), -(playWidth / 2 + pocketDiameter / 4) - cos(PI / 4) * pocketDiameter / 2, -(playHeight / 2 + pocketDiameter / 4) + sin(PI / 4) * pocketDiameter / 2]
  )
}

export function drawTable() {
  background(120, 120, 120);

  if (!tableHitBox) {
    push();
    noStroke();
    texture(poolTable);
    plane(tableWidth, tableHeight);
    pop();
  }

  if (tableHitBox) {
    push();
    stroke(120);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
    rect(0, 0, tableWidth, tableHeight);
    rect(0, 0, playWidth, playHeight);
    rect(0, 0, playWidth + cushionWidth, playHeight + cushionWidth);
    stroke(255, 0, 0);
    for (let p = 0; p < pockets.length; p++) {
      circle(pockets[p][0], pockets[p][1], pocketDiameter);
    }
    for (let c = 0; c < cushions.length; c++) {
      line(cushions[c][0], cushions[c][1], cushions[c][2], cushions[c][3]);
    }
    for (let l = 0; l < pocketLinings.length; l++) {
      line(pocketLinings[l][0], pocketLinings[l][1], pocketLinings[l][2], pocketLinings[l][3]);
    }
    pop();
  }
}