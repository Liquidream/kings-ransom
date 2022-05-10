import { Group } from "tweedle.js"; //Easing
import { Container, Sprite, InteractionEvent, Graphics, Texture } from "pixi.js"; //filters

import { IScreen, Manager } from "../Manager";
import { Dialog } from "../Dialog";
import { Scene } from "../cage/Scene";
//import { CaveEntranceScene } from "./CaveEntranceScene";
import { Fullscreen } from "../utils/Fullscreen";
import { Prop } from "../cage/Prop";



export class SceneScreen extends Container implements IScreen {
    private scene: Scene;
    private backdrop!: Sprite;
    //private lamp!: Sprite;
    //private propSprites: Array<Sprite> = [];

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

        Dialog.update();
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }


    private buildBackdrop() {
        // Backdrop
        this.backdrop = Sprite.from(this.scene.image);
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = Manager.width / 2;
        this.backdrop.y = Manager.height / 2;
        this.backdrop.on("pointertap", this.onClickBackdrop, this);
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
    }

    private buildProps() {
        // Only create Lamp if not already "picked up"
        // TODO: Make this all dynamic/data-based eventually, this is just a crude example!
        if (this.scene.props.length > 0) {

            for (let propData of this.scene.props) {
                //console.log(propData);

                // Create new component obj (contains data + view)
                let prop = new Prop();

                let sprite = undefined;
                if (propData.image) {
                    sprite = Sprite.from(propData.image);
                }
                else {
                    sprite = new Sprite(Texture.EMPTY);
                    sprite.width = propData.width;
                    sprite.height = propData.height;
                }
                prop.sprite = sprite;
                sprite.anchor.set(0.5);
                sprite.x = propData.x;
                sprite.y = propData.y;

                prop.data = propData;
                // Events
                prop.sprite.interactive = true;   // Super important or the object will never receive mouse events!
                prop.sprite.on("pointertap", prop.onClicked, prop);

                // visible state
                prop.sprite.visible = propData.visible;

                this.addChild(prop.sprite);

                // DEBUG?
                if (Manager.debugMode) {
                    let graphics = new Graphics();
                    graphics.beginFill(0xe74c3c, 125); // Red
                    graphics.lineStyle(10, 0xFF0000);
                    graphics.pivot.set(prop.sprite.width/2, prop.sprite.height/2);
                    graphics.drawRoundedRect(0,0, prop.sprite.width, prop.sprite.height, 30);
                    graphics.endFill();
                    prop.sprite.addChild(graphics);
                }
            }
        }

        Dialog.clearMessage();
    }

    private buildDoorways() {
        console.log(this.scene.doors);
        if (this.scene.doors.length > 0) {

            for (let doorData of this.scene.doors) {
                //console.log(doorData);
                //console.log(propData.image);

                // Initialize the pixi Graphics class
                let graphics = new Graphics();
                // Make doors visible in debug
                if (Manager.debugMode) {
                    // Set the fill color
                    graphics.beginFill(0xe74c3c, 125); // Red
                    // Line/stroke style
                    graphics.lineStyle(10, 0xFF0000);
                }
                else {
                    // Set the fill color to barely visible 
                    // (else won't get collision hit)
                    // TODO: find a nicer solution to this!
                    graphics.beginFill(0xccc, 0.00000000000001); // "Invisible"
                }
                // Make a center point of origin (anchor)
                graphics.pivot.set(doorData.width/2, doorData.height/2);
                // Draw a rectangle
                graphics.drawRoundedRect(doorData.x, doorData.y, doorData.width, doorData.height, 30);
                // Draw a circle
                //graphics.drawCircle(doorData.x, doorData.y, doorData.width/2);
                // Applies fill to lines and shapes since the last call to beginFill.
                graphics.endFill();

                // Events
                graphics.on("pointertap", doorData.onClicked, doorData);
                graphics.interactive = true;   // Super important or the object will never receive mouse events!
                // https://pixijs.io/examples/#/interaction/custom-hitarea.js

                this.addChild(graphics);
            }
        }

        Dialog.clearMessage();
    }

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")

        // Test dynamic JS code
        //Function("Manager.World.scenes[0].show();")();

        // Test fullscreen (DISABLED for now)
        if (false) {
            Fullscreen.openFullscreen();
        }

    }
}