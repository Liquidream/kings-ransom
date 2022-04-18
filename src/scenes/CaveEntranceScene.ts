import { Container, Sprite, InteractionEvent } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { BridgeScene } from "./BridgeScene";

export class CaveEntranceScene extends Container implements IScene {
    private backdrop: Sprite;
    constructor() {
        super();

        // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
        this.backdrop = Sprite.from("Cave-Entrance");

        this.backdrop.anchor.set(0.5);
        this.backdrop.x = Manager.width / 2;
        this.backdrop.y = Manager.height / 2;
        this.addChild(this.backdrop);

        this.backdrop.on("pointertap", this.onClicky, this);
        // Super important or the object will never receive mouse events!
        this.backdrop.interactive = true;
    }
    public update(_framesPassed: number): void {
        // Lets move clampy!
        // this.clampy.x += this.clampyVelocity * framesPassed;

        // if (this.clampy.x > Manager.width) {
        //     this.clampy.x = Manager.width;
        //     this.clampyVelocity = -this.clampyVelocity;
        // }

        // if (this.clampy.x < 0) {
        //     this.clampy.x = 0;
        //     this.clampyVelocity = -this.clampyVelocity;
        // }
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    private onClicky(e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")
        console.log("The data of your interaction is super interesting", e)

        // Global position of the interaction
        // e.data.global

        // Local (inside clampy) position of the interaction
        // e.data.getLocalPosition(this.clampy) 
        // Remember Clampy has the 0,0 in its center because we set the anchor to 0.5!

        // Change scene to the game scene!
        Manager.changeScene(new BridgeScene());
    }
}