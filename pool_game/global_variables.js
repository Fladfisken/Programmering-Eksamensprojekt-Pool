// Debug tingeling:
export let ballHitBox = false;
export let tableHitBox = false;
 
// Globale variabler:
export let gameScale = 1;
 
// Obamium mode:
export let obamium = false;
export function setObamium(val) { obamium = val; }
 
let _state = "menu";
export function getState() { return _state; }
export function setState(newState) { _state = newState; }
