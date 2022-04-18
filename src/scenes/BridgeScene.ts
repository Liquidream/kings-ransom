import { Container, Sprite, InteractionEvent } from "pixi.js";
import { IScene, Manager } from "../Manager";
import { CaveEntranceScene } from "./CaveEntranceScene";

export class BridgeScene extends Container implements IScene {
    
    private backdrop: Sprite;
    private lamp: Sprite;
    
    constructor() {
        super();

        // Backdrop
        this.backdrop = Sprite.from("Bridge");
        this.backdrop.on("pointertap", this.onClickBackdrop, this);        
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
        
        this.lamp = Sprite.from("Lamp");
        this.lamp.scale.x = 0.25;
        this.lamp.scale.y = 0.25;
        this.lamp.anchor.set(0.5);
        this.lamp.x = 1425;
        this.lamp.y = 780;
        this.lamp.on("pointertap", this.onClickLamp, this);        
        this.lamp.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.lamp);
    }

    public update(_framesPassed: number): void {
        // Do any movement here...
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    private onClickLamp(_e: InteractionEvent): void {
        console.log("You interacted with Lamp!")
        // TODO: Pickup lamp
        this.removeChild(this.lamp);
    }

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")

        // Change scene to the game scene!
        Manager.changeScene(new CaveEntranceScene());
    }
}