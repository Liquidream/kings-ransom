//import { Application } from "pixi.js";
import { SAGE } from './Manager';
import { LoaderScreen } from "./scenes/LoaderScreen";

// current screen size
const gameWidth = 1920;
const gameHeight = 1080;

// Initialise Pixi (with a "black" default bg color)
SAGE.initialize(gameWidth, gameHeight, 0x0);

// Expose to JavaScript/Browser console
window.SAGE = SAGE;

// pass in the screen size to avoid "asking up"
const sceny: LoaderScreen = new LoaderScreen();

SAGE.changeScreen(sceny);


// prevent right click contextBox
document.addEventListener('contextmenu', e => {
  e.preventDefault();
}); 
