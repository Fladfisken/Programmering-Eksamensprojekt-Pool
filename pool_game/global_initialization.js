import {
  setupGame,
  drawGame,
  mousePressedGame,
  mouseReleasedGame,
} from "./game_files/game.js";
import { setupMenu, drawMenu } from "./menu_files/menu.js";
import { preloadAssets } from "./assets/configuration.js";

let state = "game";

window.preload = function () {
  preloadAssets();
};

window.setup = function () {
  if (state === "game") {
    setupGame();
  } else {
    setupMenu();
  }
};

window.draw = function () {
  if (state === "game") {
    drawGame();
  } else {
    drawMenu();
  }
};

window.mousePressed = function () {
  if (state === "game") {
    mousePressedGame();
  }
};

window.mouseReleased = function () {
  if (state === "game") mouseReleasedGame();
};