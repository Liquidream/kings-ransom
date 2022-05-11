import { Container, Sprite, InteractionEvent } from "pixi.js";
import { Scene } from "../sage/Scene";
import { IScreen, Manager } from "../Manager";
import { BridgeScene } from "./BridgeScene";

export class CaveEntranceScene extends Container implements IScreen {
    private scene: Scene;
    private backdrop: Sprite;

    constructor(scene: Scene) {
        super();

        // Ref to scene data        
        this.scene = scene;
        console.log(this.scene.id);

        // Inside assets.ts we have a line that says `{ name: "Clampy from assets.ts!", url: "./clampy.png" }`
        this.backdrop = Sprite.from("Cave-Entrance");
        this.addChild(this.backdrop);

        this.backdrop.on("pointertap", this.onClickBackdrop, this);
        // Super important or the object will never receive mouse events!
        this.backdrop.interactive = true;
    }

    public update(_framesPassed: number): void {
        // Do any movement here...
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!!")
        console.log("The data of your interaction is super interesting", _e)

        // Change scene to the game scene!
        Manager.changeScreen(new BridgeScene(Manager.World.scenes[0]));
    }
}