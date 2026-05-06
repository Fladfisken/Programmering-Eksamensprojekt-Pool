import { setupGame, drawGame, mousePressedGame, mouseReleasedGame } from "./game.js";
import { drawMenu, mousePressedMenu } from "./menu.js";
import { drawEnd, mousePressedEnd } from "./end.js";
import { preloadAssets } from "./configuration.js";
import { getState, setFont } from "./global_variables.js";
import { drawSettings, mousePressedSettings, setupSettings } from "./settings.js";

// Indlæs billeder og font inden spillet starter
window.preload = function () {
  preloadAssets();
  setFont(loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf"));
};

// Opsætning køres én gang ved start
window.setup = function () {
  setupGame();
  setupSettings();
};

// Tegner den rigtige skærm pr. spiltilstand
window.draw = function () {
  if (getState() === "menu") { drawMenu(); drawSettings(); }
  else if (getState() === "game") { drawGame(); drawSettings(); } // Settingsknap tegnes oven på spillet
  else if (getState() === "placing") { drawGame(); drawSettings(); }
  else if (getState() === "settings") { drawGame(); drawSettings(); } // Spillet tegnes under settings
  else if (getState() === "win" || getState() === "lose") { drawEnd(); drawSettings(); }
};

// Tjekker hvilken state der skal agere når museklik sker
window.mousePressed = function () {
  if (getState() === "menu") mousePressedMenu();
  else if (getState() === "game") { mousePressedSettings(); mousePressedGame(); }
  else if (getState() === "placing") mousePressedGame();
  else if (getState() === "settings") mousePressedSettings(); // Kun settings håndterer klik her
  else if (getState() === "win" || getState() === "lose") mousePressedEnd();
};

// Tjekker om mussen slippes (kun relevant under spillet)
window.mouseReleased = function () {
  if (getState() === "game") mouseReleasedGame();
};