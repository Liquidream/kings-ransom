//import { Application } from "pixi.js";
import { Manager } from './Manager';
import { LoaderScene } from "./scenes/LoaderScene";

// current screen size
const gameWidth = 1920;
const gameHeight = 1080;

Manager.initialize(gameWidth, gameHeight, 0x6495ed);

// pass in the screen size to avoid "asking up"
const sceny: LoaderScene = new LoaderScene();

Manager.changeScene(sceny);