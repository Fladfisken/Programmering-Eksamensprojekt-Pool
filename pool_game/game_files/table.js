import { gameScale } from "../global_variables.js";

export let tableWidth = 816 * gameScale;
export let tableHeight = 454 * gameScale;

export function setupTable() {
  createCanvas(tableWidth, tableHeight, WEBGL);
}
