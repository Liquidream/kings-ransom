//import { Application } from "pixi.js";
import { Manager } from './Manager';
import { LoaderScreen } from "./scenes/LoaderScreen";

// current screen size
const gameWidth = 1920;
const gameHeight = 1080;

Manager.initialize(gameWidth, gameHeight, 0x6495ed);

// Expose to JavaScript/Browser console
(window as any).Manager = Manager;

// pass in the screen size to avoid "asking up"
const sceny: LoaderScreen = new LoaderScreen();

Manager.changeScreen(sceny);