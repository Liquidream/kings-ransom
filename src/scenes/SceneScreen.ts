import { Group } from "tweedle.js"; //Easing
import { Container, Sprite, InteractionEvent, Graphics } from "pixi.js"; //filters

import { IScreen, SAGE } from "../Manager";
import { Scene } from "../sage/Scene";
import { Fullscreen } from "../utils/Fullscreen";
import { Prop } from "../sage/Prop";
import { Door } from "../sage/Door";
import { PropData } from "../sage/PropData";



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

        SAGE.Dialog.update();
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }


    private buildBackdrop() {
        // Backdrop
        this.backdrop = Sprite.from(this.scene.image);
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = SAGE.width / 2;
        this.backdrop.y = SAGE.height / 2;
        this.backdrop.on("pointertap", this.onClickBackdrop, this);
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
    }

    private buildProps() {
        // Only create Lamp if not already "picked up"
        // TODO: Make this all dynamic/data-based eventually, this is just a crude example!
        if (this.scene.props.length > 0) {

            for (let propData of this.scene.props) {
                this.addProp(propData);
            }
        }

        SAGE.Dialog.clearMessage();
    }

    public addProp(data: PropData) {
        // Create new component obj (contains data + view)
        let prop = new Prop(data);
        this.addChild(prop.sprite);

        // DEBUG?
        if (SAGE.debugMode) {
            let graphics = new Graphics();
            graphics.beginFill(0xe74c3c, 125); // Red
            graphics.lineStyle(10, 0xFF0000);
            graphics.pivot.set(prop.sprite.width/2, prop.sprite.height/2);
            graphics.drawRoundedRect(0,0, prop.sprite.width, prop.sprite.height, 30);
            graphics.endFill();
            prop.sprite.addChild(graphics);
        }
    }

    public removeProp(data: PropData) {
        console.log(`TODO: remove prop with id ${data.id}`);
    }

    private buildDoorways() {
        //console.log(this.scene.doors);
        if (this.scene.doors.length > 0) {
            for (let doorData of this.scene.doors) {
                // Create new component obj (contains data + view)
                let door = new Door(doorData);                
                this.addChild(door.graphics);
            }
        }
        SAGE.Dialog.clearMessage();
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