import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { World } from "./cage/World";
import gamedata from './gamedata.json';
//import { BridgeScene } from "./scenes/BridgeScene";
//import { SceneScreen } from "./scenes/SceneScreen";

export class Manager {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    private static _app: Application;
    private static _width: number;
    private static _height: number;
    private static currentScreen: IScreen;
    
    public static World: World;
    public static _fps: number;

    public static get width(): number {
        return Manager._width;
    }
    public static get height(): number {
        return Manager._height;
    }

    // PN: Expose the Application object (for now)
    // TODO: Prob come up with a better structure so top "cage" class creates it, then nested classes uses it (e.g. cage.dialog)
    public static get app(): Application {
        return Manager._app;
    }

    public static initialize(width: number, height: number, background: number): void {

        Manager._width = width;
        Manager._height = height;

        Manager._app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            //resolution: window.devicePixelRatio || 1, // This distorts/wrong on mobile
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height
        });

        Manager._app.ticker.add(Manager.update)
        
        // Lock to 30fps (for cinematic effect)
        Manager._fps = 30;
        Manager._app.ticker.maxFPS = Manager._fps;

        // listen for the browser telling us that the screen size changed
        window.addEventListener("resize", Manager.resize);

        // call it manually once so we are sure we are the correct size after starting
        Manager.resize();

        Manager.World = new World().fromJSON(gamedata);

        console.log(Manager.World.title);
        console.log(Manager.World.scenes[0].image);
        console.log("------------------");
        //console.log(Manager.World.serialize());
    }

    public static resize(): void {
        // current screen size
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // uniform scale for our game
        const scale = Math.min(screenWidth / Manager.width, screenHeight / Manager.height);

        // the "uniformly englarged" size for our game
        const enlargedWidth = Math.floor(scale * Manager.width);
        const enlargedHeight = Math.floor(scale * Manager.height);

        // margins for centering our game
        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;

        // now we use css trickery to set the sizes and margins
        Manager._app.view.style.width = `${enlargedWidth}px`;
        Manager._app.view.style.height = `${enlargedHeight}px`;
        Manager._app.view.style.marginLeft = Manager._app.view.style.marginRight = `${horizontalMargin}px`;
        Manager._app.view.style.marginTop = Manager._app.view.style.marginBottom = `${verticalMargin}px`;
    }

    /* More code of your Manager.ts like `changeScene` and `update`*/
    
    public static startGame(): void {
        Manager.World.start();
        //Manager.changeScreen(new SceneScreen(Manager.World.scenes[0]));
    }

    // Call this function when you want to go to a new scene
    public static changeScreen(newScene: IScreen): void {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScreen) {
            Manager._app.stage.removeChild(Manager.currentScreen);
            Manager.currentScreen.destroy();
        }

        // Add the new one
        Manager.currentScreen = newScene;
        Manager._app.stage.addChild(Manager.currentScreen);
    }

    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(framesPassed: number): void {
        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (Manager.currentScreen) {
            Manager.currentScreen.update(framesPassed);
        }

        // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
    }
}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScreen extends DisplayObject {
    update(framesPassed: number): void;

    // we added the resize method to the interface
    resize(screenWidth: number, screenHeight: number): void;
}