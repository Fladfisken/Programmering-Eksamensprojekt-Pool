import { setupGame, drawGame, mousePressedGame, mouseReleasedGame, mouseMovedGame } from "./game_files/game.js";
import { setupMenu, drawMenu, mousePressedMenu } from "./menu_files/menu.js";
import { setupEnd, drawEnd, mousePressedEnd } from "./game_files/end.js";
import { preloadAssets } from "./assets/configuration.js";
import { getState } from "./global_variables.js";
import { drawSettings, mousePressedSettings, setupSettings } from "./menu_files/settings.js";


let font;
window.preload = function () {
  preloadAssets();
  font = loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf");
};

window.setup = function () {
  setupGame();
  setupMenu();
  setupSettings();
  textFont(font);
};

window.draw = function () {
  if (getState() === "menu") { drawMenu(); drawSettings(); }
  else if (getState() === "game") { drawGame(); drawSettings(); } // overlay on game
  else if (getState() === "placing") { drawGame(); drawSettings(); }
  else if (getState() === "settings") { drawGame(); drawSettings(); } // game underneath
  else if (getState() === "win" || getState() === "lose") { drawEnd(); drawSettings(); }
};

window.mousePressed = function () {
  if (getState() === "menu") mousePressedMenu();
  else if (getState() === "game") { mousePressedSettings(); mousePressedGame(); }
  else if (getState() === "placing") mousePressedGame();
  else if (getState() === "settings") mousePressedSettings(); // only settings handles clicks
  else if (getState() === "win" || getState() === "lose") mousePressedEnd();
};

window.mouseReleased = function () {
  if (getState() === "game") mouseReleasedGame();
};

window.mouseMoved = function () {
  if (getState() === "game") mouseMovedGame();
};
