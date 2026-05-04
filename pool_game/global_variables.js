// Debug tingeling:
export let ballHitBox = false;
export let tableHitBox = false;

// Globale variabler:
export let gameScale = 1;

let _state = "menu";
export function getState() { return _state; }
export function setState(newState) { _state = newState; }