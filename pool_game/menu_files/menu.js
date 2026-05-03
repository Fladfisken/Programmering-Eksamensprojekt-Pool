import { drawSettings } from "./settings.js";
import { drawSelector } from "./selector.js";

export function setupMenu() { }

export function drawMenu() {
  background(30);

  drawSettings();
  drawSelector();
}