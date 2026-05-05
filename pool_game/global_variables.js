// Debug tingeling:
export let ballHitBox = false;
export let tableHitBox = false;
 
// Globale variabler:
export let gameScale = 1;
 
// Obamium mode:
export let obamium = false;
export function setObamium(val) { obamium = val; }
 
// Font til tekst
export let font;
export function setFont(f) { font = f; }

let _state = "menu";
export function getState() { return _state; }
export function setState(newState) { _state = newState; }
