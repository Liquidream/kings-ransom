import { Tween, Group, Easing } from "tweedle.js";
import { Container, Sprite, InteractionEvent, filters } from "pixi.js";

import { IScene, Manager } from "../Manager";
import { CaveEntranceScene } from "./CaveEntranceScene";
import { Dialog } from "../Dialog";

export class BridgeScene extends Container implements IScene {
    
    private backdrop: Sprite;
    private lamp: Sprite;
    private foreground: Sprite;

    constructor() {
        super();

        // Backdrop
        this.backdrop = Sprite.from("Bridge");
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = Manager.width/2;
        this.backdrop.y = Manager.height/2;
        this.backdrop.on("pointertap", this.onClickBackdrop, this);        
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
        new Tween(this.backdrop.scale).to({ x: 1.05, y: 1.05 }, 1000).easing(Easing.Quadratic.Out).start()
        
        this.lamp = Sprite.from("Lamp");
        this.lamp.scale.x = 0.25;
        this.lamp.scale.y = 0.25;
        this.lamp.anchor.set(0.5);
        this.lamp.x = 1425;
        this.lamp.y = 780;
        this.lamp.on("pointertap", this.onClickLamp, this);        
        this.lamp.interactive = true;   // Super important or the object will never receive mouse events!
        //this.addChild(this.lamp);

        // Foreground
        this.foreground = Sprite.from("Foreground1");   
        this.foreground.y = 540;
        this.foreground.filters = [ new filters.BlurFilter(8) ]
        this.addChild(this.foreground);

        new Tween(this.foreground).to({ x: -100 }, 1000).easing(Easing.Quadratic.Out).start()
        new Tween(this.foreground.scale).to({ x: 1.1, y: 1.1 }, 1000).easing(Easing.Quadratic.Out).start()
    }

    public update(_framesPassed: number): void {
        // Do any movement here...
        
        //You need to update a group for the tweens to do something!
        Group.shared.update()
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    private onClickLamp(_e: InteractionEvent): void {
        console.log("You interacted with Lamp!!!!")
        // TODO: Pickup lamp
        
        new Tween(this.lamp).to({ alpha: 0 }, 1000).start()
        //new Tween(this.lamp).to({ x: 500 }, 1000).start()
        new Tween(this.lamp.scale).to({ x: 0.3, y: 0.3 }, 1000).start()
        .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any
            this.removeChild(this.lamp);    // remove when tween completes
            Dialog.clearMessage();
        })
        //this.removeChild(this.lamp);

        Dialog.showMessage("You picked up the lamp");
    }

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")

        // Change scene to the game scene!
        Manager.changeScene(new CaveEntranceScene());
    }
}