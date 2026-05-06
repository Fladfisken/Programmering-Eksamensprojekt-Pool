// Export teksturvariabler til boldene og bordet
export let cueBall;
export let yellowFull;
export let blueFull;
export let redFull;
export let purpleFull;
export let orangeFull;
export let greenFull;
export let maroonFull;
export let eightBall;
export let yellowStripe;
export let blueStripe;
export let redStripe;
export let purpleStripe;
export let orangeStripe;
export let greenStripe;
export let maroonStripe;
export let poolTable;
export let obama;

// Indlæser alle billeder. Kaldes i preload, så de er klar inden setup
export function preloadAssets() {
  cueBall = loadImage('./0CueBall.png');
  yellowFull = loadImage('./1YellowFull.png');
  blueFull = loadImage('./2BlueFull.png');
  redFull = loadImage('./3RedFull.png');
  purpleFull = loadImage('./4PurpleFull.png');
  orangeFull = loadImage('./5OrangeFull.png');
  greenFull = loadImage('./6GreenFull.png');
  maroonFull = loadImage('./7MaroonFull.png');
  eightBall = loadImage('./8Ball.png');
  yellowStripe = loadImage('./9YellowStripe.png');
  blueStripe = loadImage('./10BlueStripe.png');
  redStripe = loadImage('./11RedStripe.png');
  purpleStripe = loadImage('./12PurpleStripe.png');
  orangeStripe = loadImage('./13OrangeStripe.png');
  greenStripe = loadImage('./14GreenStripe.png');
  maroonStripe = loadImage('./15MaroonStripe.png');
  poolTable = loadImage('./poolTable.png')
  obama = loadImage('./Obama.png')
}