import { Group, Tween } from "tweedle.js"; //Easing
import { Container, Sprite, Graphics, Text, TextStyle } from "pixi.js"; //filters

import { IScreen, SAGE } from "../Manager";
import { Scene } from "../sage/Scene";
import { Fullscreen } from "../utils/Fullscreen";
import { Prop } from "../sage/Prop";
import { Door } from "../sage/Door";
import { PropData } from "../sage/PropData";
import { InputEventEmitter } from "../sage/InputEventEmitter";



export class SceneScreen extends Container implements IScreen {
    private scene: Scene;
    private backdrop!: Sprite;
    // @ts-ignore (ignore the "declared bu never used" for now)
    private backdropInputEvents!: InputEventEmitter;

    constructor(scene: Scene) {
        super();

        // Ref to scene data
        this.scene = scene;

        // Construct scene from data
        this.buildBackdrop();
        this.buildProps();
        this.buildDoorways();
    }

    public update(_framesPassed: number): void {
        // Do any movement here...

        //You need to update a group for the tweens to do something!
        Group.shared.update()

        SAGE.Dialog.update();
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    /**
     * Start the player death/game over sequence
     * @param message The message to display to player
     */
    public showGameOver(message: string): void {
        // Red overlay
        const overlay = new Graphics();
        overlay.beginFill(0xDE3249);
        overlay.alpha = 0;
        overlay.drawRect(0, 0, SAGE.width, SAGE.height);
        overlay.endFill();
        overlay.interactive = true;   // Super important or the object will never receive mouse events!
        overlay.on("pointertap", this.onClickGameOver, this);
        this.addChild(overlay);
        new Tween(overlay).to({ alpha: 0.8 }, 1000).start()
            .onComplete( ()=> { 
                // anything
                // "Press to Restart"
                const style = new TextStyle({
                    fill: "white",
                    fontFamily: "Impact",
                    fontSize: 48,
                    padding: 4,
                    trim: true
                });
                const text = new Text("Press to Restart", style);
                text.anchor.set(0.5);
                text.x = SAGE.width / 2;
                text.y = SAGE.height / 1.5;
                overlay.addChild(text);
            });
        // "Game Over"
        const style = new TextStyle({
            fill: "white",
            fontFamily: "Impact",
            fontSize: 120,
            padding: 4,
            trim: true
        });
        const text = new Text(message, style);
        text.anchor.set(0.5);
        text.x = SAGE.width / 2;
        text.y = SAGE.height / 2;
        overlay.addChild(text);

        console.log(message);
    }

    private onClickGameOver() { //_e: InteractionEvent
        //console.log("You interacted with game over ...overlay!")
        // Restart game
        SAGE.restartGame();
    }

    private buildBackdrop() {
        // Backdrop
        this.backdrop = Sprite.from(this.scene.image);
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = SAGE.width / 2;
        this.backdrop.y = SAGE.height / 2;
        //this.backdrop.on("pointertap", this.onClickBackdrop, this);
        //this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);

        
        // Events
        this.backdropInputEvents = new InputEventEmitter(this.backdrop);
        this.backdrop.on("primaryaction", this.onTestEvent, this);  
        this.backdrop.on("secondaryaction", this.onSecondaryAction, this); 
        //SAGE.Events.on("bgClick", this.onTestEvent, this);
    }

    private buildProps() {
        // Only create Lamp if not already "picked up"
        // TODO: Make this all dynamic/data-based eventually, this is just a crude example!
        if (this.scene.props.length > 0) {

            for (const propData of this.scene.props) {
                this.addProp(propData);
            }
        }

        SAGE.Dialog.clearMessage();
    }

    public addProp(data: PropData, fadeIn = false) {
        // Create new component obj (contains data + view)
        const prop = new Prop(data);
        this.addChild(prop.sprite);

        // Fade in?
        if (fadeIn) {
            prop.sprite.alpha = 0;
            new Tween(prop.sprite).to({ alpha: 1 }, 500).start()
            .onComplete( ()=> { 
                // ??
            });
        }

        // DEBUG?
        if (SAGE.debugMode) {
            const graphics = new Graphics();
            graphics.beginFill(0xe74c3c, 125); // Red
            graphics.lineStyle(10, 0xFF0000);
            graphics.pivot.set(prop.sprite.width/2, prop.sprite.height/2);
            graphics.drawRoundedRect(0,0, prop.sprite.width, prop.sprite.height, 30);
            graphics.endFill();
            prop.sprite.addChild(graphics);
        }
    }

    /**
     * Removes a Prop from a scene (default = fade out).     
     */
     removeProp(prop: Prop){
        new Tween(prop.sprite).to({ alpha: 0 }, 500).start()
            .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any                
                // remove when tween completes
                this.removeChild(prop.sprite);  

                // remove from game data
                // https://stackoverflow.com/a/67953394/574415
                this.scene.props.splice(this.scene.props.findIndex(item => item.id === prop.data.id),1);
            });
        new Tween(prop.sprite.scale).to({ x: 1.5, y: 1.5 }, 500).start()
    }

    private buildDoorways() {
        //console.log(this.scene.doors);
        if (this.scene.doors.length > 0) {
            for (const doorData of this.scene.doors) {
                // Create new component obj (contains data + view)
                const door = new Door(doorData);                
                this.addChild(door.graphics);
            }
        }
        SAGE.Dialog.clearMessage();
    }

    private onSecondaryAction() { //_e: InteractionEvent
        console.log("You interacted with Backdrop!")
        throw new Error("TODO: Make all interactive objects flash (by raising 'global' event)");

        // Test dynamic JS code
        //Function("Manager.World.scenes[0].show();")();

        // Test fullscreen (DISABLED for now)
        if (false) {
            Fullscreen.openFullscreen();
        }
        
        // somewhere, when the time is right... Fire the clamp!
        SAGE.Events.emit("bgClick");
    }
    
    private onTestEvent() {
        console.log("test event was fired!");
    }
}