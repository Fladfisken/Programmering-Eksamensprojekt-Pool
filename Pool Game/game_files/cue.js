import { balls } from "./balls.js";

let aimLenght = 200;

export function drawCue() {
    let cueX = balls[0].pos.x - width / 2;
    let cueY = balls[0].pos.y - height / 2;
    let aimAngle = atan2(
        (mouseY - height / 2) - cueY,
        (mouseX - width / 2) - cueX
    );
    line(
        cueX, cueY,
        cueX - aimLenght * cos(aimAngle),
        cueY - aimLenght * sin(aimAngle)
    );
}

export function mousePressedCue() {
    let cue = balls[0];
    let force = createVector(cue.pos.x - mouseX, cue.pos.y - mouseY);
    cue.vel.add(force.mult(0.2));
}
