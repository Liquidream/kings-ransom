import { Application } from "@pixi/app";
import { Container, DisplayObject } from "@pixi/display";
import { filters } from "pixi.js";
import { Tween } from "tweedle.js";
import { IWorldData, World } from "./sage/World";
import { Dialog } from "./sage/ui/Dialog";
import { Script } from "./sage/Script";
import { Events } from "./sage/Events";
import { Actions } from "./gameactions";
import { Sound } from "./sage/ui/Sound";
import { InventoryScreen } from "./sage/ui/InventoryScreen";

import gamedataJSON from './gamedata.json';
import { SAGE_UI } from "./sage/ui/UI_Screen";
const gamedata: IWorldData = <unknown>gamedataJSON as IWorldData;

export class SAGE {
  private constructor() {
    /*this class is purely static. No constructor to see here*/
  }

  private static _app: Application;
  private static _width: number;
  private static _height: number;
  private static _fps: number;
  private static backLayer: Container;
  private static midLayer: Container;
  private static topLayer: Container;
  private static currentScreen: IScreen;
  

  public static debugMode = true;
  public static enableFullscreen = false;

  public static World: World;
  public static Dialog: Dialog;
  public static Actions: Actions;
  public static Script: Script;
  public static Events: Events;
  public static Sound: Sound;
  public static UI: SAGE_UI;

  public static get width(): number {
    return SAGE._width;
  }
  public static get height(): number {
    return SAGE._height;
  }
  public static get fps(): number {
    return SAGE._fps;
  }

  // PN: Expose the Application object (for now)
  // TODO: Prob come up with a better structure so top "cage" class creates it, then nested classes uses it (e.g. cage.dialog)
  public static get app(): Application {
    return SAGE._app;
  }

  public static initialize(width: number, height: number, background: number): void {

    SAGE._width = width;
    SAGE._height = height;

    SAGE._app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      //resolution: window.devicePixelRatio || 1, // This distorts/wrong on mobile
      autoDensity: true,
      backgroundColor: background,
      width: width,
      height: height
    });

    SAGE._app.ticker.add(SAGE.update)

    // Lock to 30fps (for cinematic effect) 
    // ## REMOVED as made inventory jerky (+no longer CAGE/Cinematic engine anyway)
    // SAGE._fps = 30;
    // SAGE._app.ticker.maxFPS = SAGE._fps;

    // listen for the browser telling us that the screen size changed
    window.addEventListener("resize", SAGE.resize);

    // call it manually once so we are sure we are the correct size after starting
    SAGE.resize();

    // initialise stage "layers"
    SAGE.createLayers();
  }

  static createLayers() {
    // Background layer
    SAGE.backLayer = new Container();
    SAGE._app.stage.addChild(SAGE.backLayer);
    // Mid-ground layer
    SAGE.midLayer = new Container();
    SAGE._app.stage.addChild(SAGE.midLayer);
    // Foreground/UI layer
    SAGE.topLayer = new Container();
    SAGE._app.stage.addChild(SAGE.topLayer);
  }

  static emptyLayers() {
    // Background layer
    SAGE.backLayer.removeChildren();
    // Mid-ground layer
    SAGE.midLayer.removeChildren();
    // Foreground/UI layer
    SAGE.topLayer.removeChildren();
  }
  
  public static loadWorld(): void {

    //const gamedata = require("./gamedata.json");
    //import * as gamedata from "./gamedata.json";
    //let gamedata = JSON.parse(fs.readFileSync("./gamedata.json", "utf-8"));

    // Initialise UI
    SAGE.UI = new SAGE_UI(SAGE.topLayer);

    // Create and initialise game world
    SAGE.World = new World();
    SAGE.World.initialize(gamedata);
    //Manager.World = new World().fromJSON(gamedata);

    // ...and inventory (UI)
    SAGE.World.player.invScreen = new InventoryScreen(SAGE.topLayer);

    // ...and game actions
    SAGE.Actions = new Actions();

    // ...and events
    SAGE.Events = new Events();

    // ...and dialog
    SAGE.Dialog = new Dialog();

    // ...and script
    SAGE.Script = new Script();
    SAGE.Script.initialize();

    // ...and sounds
    SAGE.Sound = new Sound();

    // console.log(Manager.World.title);
    // console.log(Manager.World.scenes[0].image);
    // console.log("------------------");
  }

  public static startGame() {
    SAGE.World.start();
    //Manager.changeScreen(new SceneScreen(Manager.World.scenes[0]));

    // DEBUG
    //SAGE.inventoryScreen.getLength();
  }

  /** Restart the game 
   * (+reset game data) */
  public static restartGame() {
    console.log("Restarting game...")
    SAGE.Sound.stopAll()
    SAGE.emptyLayers();
    SAGE.loadWorld();
    SAGE.startGame();
  }

  public static gameOver(message: string) {
    SAGE.Sound.play("Game-Lost");
    SAGE.World.player.invScreen.close();
    SAGE.World.currentScene.screen.showGameOver(message);
  }

  public static gameWon(message: string) {
    SAGE.Sound.play("Game-Won");
    SAGE.World.player.invScreen.close();
    SAGE.World.currentScene.screen.showGameWon(message);
  }

  public static resize() {
    // current screen size
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // uniform scale for our game
    const scale = Math.min(screenWidth / SAGE.width, screenHeight / SAGE.height);

    // the "uniformly englarged" size for our game
    const enlargedWidth = Math.floor(scale * SAGE.width);
    const enlargedHeight = Math.floor(scale * SAGE.height);

    // margins for centering our game 
    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    // now we use css trickery to set the sizes and margins
    SAGE._app.view.style.width = `${enlargedWidth}px`;
    SAGE._app.view.style.height = `${enlargedHeight}px`;
    SAGE._app.view.style.marginLeft = SAGE._app.view.style.marginRight = `${horizontalMargin}px`;
    SAGE._app.view.style.marginTop = SAGE._app.view.style.marginBottom = `${verticalMargin}px`;
  }


  // Call this function when you want to go to a new scene
  public static changeScreen(newScene: IScreen) {
    // Remove and destroy old scene... if we had one..
    if (SAGE.currentScreen) {
      // remove all event subscriptions            
      SAGE.midLayer.removeChild(SAGE.currentScreen);
      //SAGE._app.stage.removeChild(SAGE.currentScreen);
      SAGE.currentScreen.destroy();
    }

    // Add the new one
    SAGE.currentScreen = newScene;
    SAGE.midLayer.addChild(SAGE.currentScreen);
    //SAGE._app.stage.addChild(SAGE.currentScreen);
  }

  public static changeScreenFade(newScene: IScreen) {
    const oldScreen = SAGE.currentScreen;
    // Fade out
    // https://github.com/pixijs/pixijs/issues/4334
    const fadeOutAlphaMatrix = new filters.AlphaFilter();
    fadeOutAlphaMatrix.alpha = 1;
    oldScreen.filters = [fadeOutAlphaMatrix];

    const fadeOutTween = new Tween(fadeOutAlphaMatrix)
      .to({ alpha: 0 }, 500);

    // Fade in
    const fadeInAlphaMatrix = new filters.AlphaFilter();
    fadeInAlphaMatrix.alpha = 0;
    newScene.filters = [fadeInAlphaMatrix];
    const fadeInTween = new Tween(fadeInAlphaMatrix)
      .to({ alpha: 1 }, 500)
      .onComplete(() => {
        // Add the new one
        // Remove and destroy old scene... if we had one..
        if (oldScreen) {
          // remove all event subscriptions            
          SAGE.midLayer.removeChild(oldScreen);
          //SAGE._app.stage.removeChild(oldScreen);
          oldScreen.destroy();
        }
      });

    SAGE.currentScreen = newScene;
    SAGE.midLayer.addChild(newScene);
    //SAGE._app.stage.addChild(newScene);

    // Start the fade out+in animation
    fadeOutTween.chain(fadeInTween).start();

    // If inventory open, auto-collapse it
    if (SAGE.World.player.invScreen.isOpen) SAGE.World.player.invScreen.close();
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number) {
    // Let the current scene know that we updated it...
    // Just for funzies, sanity check that it exists first.
    if (SAGE.currentScreen) {
      SAGE.currentScreen.update(framesPassed);
    }

    // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
  }
}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScreen extends DisplayObject {
  update(framesPassed: number): void;

  // we added the resize method to the interface
  //resize(screenWidth: number, screenHeight: number): void;
}