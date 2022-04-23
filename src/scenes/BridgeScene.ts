import { Tween, Group } from "tweedle.js"; //Easing
import { Container, Sprite, InteractionEvent} from "pixi.js"; //filters

import { IScene, Manager } from "../Manager";
import { Dialog } from "../Dialog";
import { Scene } from "../cage/Scene";
import { CaveEntranceScene } from "./CaveEntranceScene";
import { Fullscreen } from "../utils/Fullscreen";



export class BridgeScene extends Container implements IScene {
    private scene: Scene;
    private backdrop: Sprite;
    private lamp!: Sprite;

    constructor(scene: Scene) {
        super();

        // Ref to scene data
        this.scene = scene;

        // Backdrop
        this.backdrop = Sprite.from("Bridge");
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = Manager.width/2;
        this.backdrop.y = Manager.height/2;
        this.backdrop.on("pointertap", this.onClickBackdrop, this);        
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
        
        //new Tween(this.backdrop.scale).to({ x: 1.05, y: 1.05 }, 1000).easing(Easing.Quadratic.Out).start()
        //this.foreground.filters = [ new filters.BlurFilter(8) ]
        
        // Only create Lamp if not already "picked up"
        // TODO: Make this all dynamic/data-based eventually, this is just a crude example!
        if (scene.props.length > 0) {
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
    }

    public update(_framesPassed: number): void {
        // Do any movement here...
        
        //You need to update a group for the tweens to do something!
        Group.shared.update()
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }

    private onClickLamp(_e: InteractionEvent): void {
        console.log("You interacted with Lamp!")
        // TODO: Pickup lamp
        new Tween(this.lamp).to({ alpha: 0 }, 1000).start()
        //new Tween(this.lamp).to({ x: 500 }, 1000).start()
        new Tween(this.lamp.scale).to({ x: 0.4, y: 0.4 }, 1000).start()
        .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any
            // remove when tween completes
            this.removeChild(this.lamp);  
            // remove from game data
            // https://stackoverflow.com/a/67953394/574415     
            this.scene.props.splice(this.scene.props.findIndex(item => item.id === "pro01"),1);

            // https://medium.com/swlh/a-game-any-web-dev-can-build-in-10-mins-using-pixijs-47f8bcd85700
            // remove() {
            //     app.stage.removeChild(this.circle);
            // }
            Dialog.clearMessage();
        })
        //this.removeChild(this.lamp);

        Dialog.showMessage("You picked up the lamp");

        //closeFullscreen();

        console.log(Fullscreen.isFullScreen());
    }

    

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")

        // Test fullscreen
        Fullscreen.openFullscreen();
        //openFullscreen(); 

        // Change scene to the game scene!
        Manager.changeScene(new CaveEntranceScene(Manager.World.scenes[1]));
    }
}