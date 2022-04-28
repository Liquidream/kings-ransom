import { Tween, Group } from "tweedle.js"; //Easing
import { Container, Sprite, InteractionEvent} from "pixi.js"; //filters

import { IScreen, Manager } from "../Manager";
import { Dialog } from "../Dialog";
import { Scene } from "../cage/Scene";
//import { CaveEntranceScene } from "./CaveEntranceScene";
import { Fullscreen } from "../utils/Fullscreen";



export class SceneScreen extends Container implements IScreen {
    private scene: Scene;
    private backdrop!: Sprite;
    //private lamp!: Sprite;
    private propSprites: Array<Sprite> = [];

    constructor(scene: Scene) {
        super();

        // Ref to scene data
        this.scene = scene;

        // Construct scene from data
        this.buildBackdrop();
        this.buildProps();
    }

    public update(_framesPassed: number): void {
        // Do any movement here...
        
        //You need to update a group for the tweens to do something!
        Group.shared.update()
    }

    public resize(_screenWidth: number, _screenHeight: number): void {

    }


    private buildBackdrop() {
        // Backdrop
        this.backdrop = Sprite.from(this.scene.image);
        this.backdrop.anchor.set(0.5);
        this.backdrop.x = Manager.width/2;
        this.backdrop.y = Manager.height/2;
        this.backdrop.on("pointertap", this.onClickBackdrop, this);        
        this.backdrop.interactive = true;   // Super important or the object will never receive mouse events!
        this.addChild(this.backdrop);
    }

    private buildProps() {        
        // Only create Lamp if not already "picked up"
        // TODO: Make this all dynamic/data-based eventually, this is just a crude example!
        if (this.scene.props.length > 0) {

            for (let propData of this.scene.props) {
                console.log(propData); // 4, 5, 6
                
                //console.log(propData.image);
                let prop = Sprite.from(propData.image);
                  prop.scale.x = 0.25;
                  prop.scale.y = 0.25;
                prop.anchor.set(0.5);
                prop.x = propData.x;
                prop.y = propData.y;
                prop.on("pointertap", this.onClickProp, this);   
                prop.interactive = true;   // Super important or the object will never receive mouse events!

                //prop.PropData = 

                this.addChild(prop);
                this.propSprites.push(prop);
            }            
        }

        Dialog.clearMessage();

        // this.lamp = Sprite.from("Lamp");
        // this.lamp.scale.x = 0.25;
        // this.lamp.scale.y = 0.25;
        // this.lamp.anchor.set(0.5);
        // this.lamp.x = 1425;
        // this.lamp.y = 780;
        // this.lamp.on("pointertap", this.onClickLamp, this);        
        // this.lamp.interactive = true;   // Super important or the object will never receive mouse events!
        // this.addChild(this.lamp);
    }

    private onClickProp(_e: InteractionEvent): void {
        console.log("You interacted with a prop!")
        
        let clickedProp = _e.currentTarget;
        console.log(clickedProp)
        
        console.log(clickedProp.name)        

        new Tween(clickedProp).to({ alpha: 0 }, 1000).start()
    }

    // private onClickLamp(_e: InteractionEvent): void {
    //     console.log("You interacted with Lamp!")
    //     // TODO: Pickup lamp
    //     new Tween(this.lamp).to({ alpha: 0 }, 1000).start()
    //     //new Tween(this.lamp).to({ x: 500 }, 1000).start()
    //     new Tween(this.lamp.scale).to({ x: 0.4, y: 0.4 }, 1000).start()
    //     .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any
    //         // remove when tween completes
    //         this.removeChild(this.lamp);  
    //         // remove from game data
    //         // https://stackoverflow.com/a/67953394/574415     
    //         this.scene.props.splice(this.scene.props.findIndex(item => item.id === "pro01"),1);

    //         // https://medium.com/swlh/a-game-any-web-dev-can-build-in-10-mins-using-pixijs-47f8bcd85700
    //         // remove() {
    //         //     app.stage.removeChild(this.circle);
    //         // }
    //         Dialog.clearMessage();
    //     })

    //     Dialog.showMessage("You picked up the lamp");

    //     console.log(Fullscreen.isFullScreen());
    // }

    

    private onClickBackdrop(_e: InteractionEvent): void {
        console.log("You interacted with Backdrop!")

        // Test fullscreen
        Fullscreen.openFullscreen();
        //openFullscreen(); 

        // Change scene to the game scene!
        Manager.changeScreen(new SceneScreen(Manager.World.scenes[1]));
    }
}