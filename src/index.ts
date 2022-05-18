//import { Application } from "pixi.js";
import { SAGE } from './Manager';
import { LoaderScreen } from "./scenes/LoaderScreen";

// current screen size
const gameWidth = 1920;
const gameHeight = 1080;

SAGE.initialize(gameWidth, gameHeight, 0x6495ed);

// Expose to JavaScript/Browser console
(window as any).SAGE = SAGE;

// pass in the screen size to avoid "asking up"
const sceny: LoaderScreen = new LoaderScreen();

SAGE.changeScreen(sceny);


// prevent right click contextBox
document.addEventListener('contextmenu', e => {
  e.preventDefault();
}); 