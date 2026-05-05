import { gameScale, ballHitBox, obamium } from "../global_variables.js";
import { playWidth, playHeight } from "./table.js";
import { wallFric, feltFric } from "./physics.js";
import {
  cueBall, yellowFull, blueFull, redFull,
  purpleFull, orangeFull, greenFull, maroonFull,
  eightBall, yellowStripe, blueStripe, redStripe,
  purpleStripe, orangeStripe, greenStripe, maroonStripe,
  obama
} from "../assets/configuration.js";

export let ballRadius = 9 * gameScale;
export let ballDiameter = 2 * ballRadius;
// Liste over all bolde
export let balls = [];
// Liste over alle boldeteksturer i spillet
let ballTextures = [];

export function setupBalls() {
  balls.length = 0; // Undgår bolde ikke slettes efter et spil

  // Sætter teksturer op i rækkefølge svarende til bold-numre
  ballTextures = [
    cueBall, yellowFull, blueFull, redFull,
    purpleFull, orangeFull, greenFull, maroonFull,
    eightBall, yellowStripe, blueStripe, redStripe,
    purpleStripe, orangeStripe, greenStripe, maroonStripe
  ];

  // Trekantsgitter forhold bruges til at placere bolde i trekant-formation
  let triangleLatticeRelation = sqrt(3) / 2;
  let ballRows = 5;
  let ballPositions = [];

  /* Midtpunkt af bordet. Disse skal defineres, eftersom WEBGL bruges.
  WEBGL flytter origo af koordinatsystemet til centrum af hele canvas.
  Normalt ligger origo i det øverste venstre hjørne. 
  Nogle ting beregnes med WEBGL og uden WEBGL. 
  Derfor kræves et offset for de beregninger, der laves uden WEBGL, 
  inden der bruges/renders med WEBGL */
  let ox = width / 2;
  let oy = height / 2;

  // Startposition for trekant-formationen en kvart bane fra højre kant
  let ballx0 = ox + playWidth / 4
  let bally0 = oy;

  // Beregner position for hver bold i trekant-formationen
  for (let ballRow = 0; ballRow < ballRows; ballRow++) {
    let ballx = ballx0 + ballRow * ballDiameter * triangleLatticeRelation;

    for (let ballColumn = 0; ballColumn <= ballRow; ballColumn++) {
      let bally = bally0 - (ballRow * ballDiameter) / 2 + ballColumn * ballDiameter;
      ballPositions.push({ ballx, bally });
    }
  }

  // Placerer hvid bold en kvart bane fra venstre kant
  let cueBallx = ox - playWidth / 4;
  let cueBally = oy;
  balls.push(new Ball(cueBallx, cueBally, 0, 0, 0));

  // Tilføjer resten af boldene i trekant-formationen
  for (let i = 0; i < ballPositions.length; i++) {
    balls.push(new Ball(ballPositions[i].ballx, ballPositions[i].bally, 0, 0, i + 1));
  }
}

// Opdaterer og tegner alle bolde hver frame
export function drawBalls() {
  for (let b of balls) {
    b.show();
  }
}

export class Ball {
  constructor(ballx, bally, vx, vy, texture) {
    this.pos = createVector(ballx, bally);  // Position
    this.vel = createVector(vx, vy);        // Hastighed
    this.angle = 0;                         // Rotationsvinkel
    this.axis = createVector(0, 1, 0);      // Rotationsakse
    this.pocket = false;                    // Om bolden er i et hul
    this.texture = ballTextures[texture];   // Bold-tekstur
  }

  move(dt) {
    if (this.pocket) return;
    let speed = this.vel.mag();

    // Opdaterer rotationsvinkel og -akse baseret på bevægelsesretning
    if (speed > 0.05) {
      this.angle += speed * dt / ballRadius;
      this.axis = createVector(-this.vel.y, this.vel.x, 0).normalize();
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.vel.mult(pow(feltFric, dt)); // Anvender rullefriktion hver frame

    if (speed < 0.05) { this.vel.set(0, 0); } // Stopper bolden ved meget lav hastighed (vi gider ikke at vente på bolden stopper efter uendelig tid)
  }

  show() {
    // Tegner ikke bolden på banen hvis den er i et hul
    if (this.pocket) return;

    // Tegner bold med 3D tekstur
    if (!ballHitBox) {
      push();
      translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
      rotate(this.angle, this.axis);
      texture(obamium ? obama : this.texture); // Brug obama tekstur i obamium mode
      noStroke();
      sphere(ballRadius);
      pop();
    }

    // Tegner kun hitbox (til debug)
    if (ballHitBox) {
      push();
      translate(this.pos.x - width / 2, this.pos.y - height / 2, 0);
      noFill();
      stroke(255, 0, 0);
      strokeWeight(1);
      circle(0, 0, ballDiameter);
      pop();
    }
  }
}