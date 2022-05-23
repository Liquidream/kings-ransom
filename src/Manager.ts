import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { IWorldData, World } from "./sage/World";
import { Dialog } from "./sage/ui/Dialog";
import { Script } from "./sage/Script";
import { Events } from "./sage/Events";
import { Actions } from "./gameactions";


import gamedataJSON from './gamedata.json';
const gamedata: IWorldData = <unknown>gamedataJSON as IWorldData;
//const gamedata: IWorldData = {};
//Object.assign(gamedata, gamedataJSON);

export class SAGE {
    private constructor() {        
        /*this class is purely static. No constructor to see here*/ 
    }

    private static _app: Application;
    private static _width: number;
    private static _height: number;
    private static _fps: number;
    private static currentScreen: IScreen;
    
    public static debugMode = false;
    
    public static World: World;
    public static Dialog: Dialog;
    public static Actions: Actions;
    public static Script: Script;
    public static Events: Events;

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
        SAGE._fps = 30;
        SAGE._app.ticker.maxFPS = SAGE._fps;

        // listen for the browser telling us that the screen size changed
        window.addEventListener("resize", SAGE.resize);

        // call it manually once so we are sure we are the correct size after starting
        SAGE.resize();

        // Load and start the game
        SAGE.loadWorld();
        //console.log(Manager.World.serialize());
    }

    public static loadWorld(): void {
        
        //const gamedata = require("./gamedata.json");
        //import * as gamedata from "./gamedata.json";
        //let gamedata = JSON.parse(fs.readFileSync("./gamedata.json", "utf-8"));
        
        // Create and initialise game world
        SAGE.World = new World();
        SAGE.World.initialize(gamedata);
        //Manager.World = new World().fromJSON(gamedata);

        // ...and game actions
        SAGE.Actions = new Actions();

        // ...and dialog
        SAGE.Dialog = new Dialog();

        // ...and script
        SAGE.Script = new Script();

        // ...and events
        SAGE.Events = new Events();

        // console.log(Manager.World.title);
        // console.log(Manager.World.scenes[0].image);
        // console.log("------------------");
    }
    
    public static startGame(): void {
        SAGE.World.start();
        //Manager.changeScreen(new SceneScreen(Manager.World.scenes[0]));
    }

    /** Restart the game 
     * (+reset game data) */
    public static restartGame(): void {
        console.log("Restarting game...")
        SAGE.loadWorld();
        SAGE.startGame();
    }

    public static resize(): void {
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
    public static changeScreen(newScene: IScreen): void {
        // Remove and destroy old scene... if we had one..
        if (SAGE.currentScreen) {
            // remove all event subscriptions            
            SAGE._app.stage.removeChild(SAGE.currentScreen);            
            SAGE.currentScreen.destroy();
        }

        // Add the new one
        SAGE.currentScreen = newScene;
        SAGE._app.stage.addChild(SAGE.currentScreen);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(framesPassed: number): void {
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