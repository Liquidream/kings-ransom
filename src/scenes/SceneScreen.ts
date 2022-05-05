import { Group } from "tweedle.js"; //Easing
import { Container, Sprite, InteractionEvent, Graphics} from "pixi.js"; //filters

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
                prop.anchor.set(0.5);
                prop.x = propData.x;
                prop.y = propData.y;
                // Events
                prop.on("pointertap", propData.onClicked, propData);   
                //prop.on("pointertap", this.onClickProp, this);   
                prop.interactive = true;   // Super important or the object will never receive mouse events!

                this.addChild(prop);
                this.propSprites.push(prop);
            }            
        }

        Dialog.clearMessage();
    }

    private buildDoorways() {        
        console.log(this.scene.doors);
        if (this.scene.doors.length > 0) {

            for (let doorData of this.scene.doors) {
                console.log(doorData); // 4, 5, 6
                
                //console.log(propData.image);
                
                // Initialize the pixi Graphics class
                let graphics = new Graphics();
                // Set the fill color
                graphics.beginFill(0xe74c3c, 125); // Red
                // Line/stroke style
                graphics.lineStyle(10, 0xFF0000);
                // Draw a circle
                //graphics.drawCircle(160, 185, 40); // drawCircle(x, y, radius)
                graphics.drawCircle(doorData.x, doorData.y, doorData.width/2); // drawCircle(x, y, radius)
                // Applies fill to lines and shapes since the last call to beginFill.
                graphics.endFill();
                // Events
                graphics.on("pointertap", doorData.onClicked, doorData);
                //graphics.on("pointertap", this.onClickDoor, this);   
                graphics.interactive = true;   // Super important or the object will never receive mouse events!

                this.addChild(graphics);
                //this.propSprites.push(prop);
            }            
        }

        Dialog.clearMessage();
    }

    // private onClickProp(_e: InteractionEvent): void {
    //     console.log("You interacted with a prop!")
        
    //     let clickedProp = _e.currentTarget;
    //     console.log(clickedProp)
        
    //     console.log(clickedProp.name)        

    //     new Tween(clickedProp).to({ alpha: 0 }, 1000).start()

    //     Dialog.showMessage("You picked up the lamp");
    // }

//     private onClickDoor(_e: InteractionEvent): void {
//         console.log("You interacted with a door!");
        
//         let clickedProp = _e.currentTarget;
//         console.log(clickedProp);
// //        console.log(this.target_scene_id);
        
//         console.log(clickedProp.name);

//         // TODO: Find the target door/scene
//         // 👇️ const first: {id: number; language: string;} | undefined
//         // const targetScene = Manager.World.scenes.find((obj) => {
//         //     return target_scene_id === clickedProp.tar;
//         // });

//         // Change scene to the game scene!
//         Manager.changeScreen(new SceneScreen(Manager.World.scenes[1]));
//     }

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

        // Test fullscreen (DISABLED for now)
        if (false) {
            Fullscreen.openFullscreen();
        }
        
    }
}