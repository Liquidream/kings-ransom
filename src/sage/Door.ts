import { Graphics, InteractionEvent } from "pixi.js";
import { SAGE } from "../Manager";
import { DoorData, DoorState } from "./DoorData";

export class Door {
    public data!: DoorData;    
    public graphics!: Graphics;
    
    
    public constructor(propData: any) { 
        // Initialise from data object
        this.data = propData;
        let graphics = new Graphics();
        // Make doors visible in debug
        if (SAGE.debugMode) {
            // Set the fill color
            this.graphics.beginFill(0xe74c3c, 125); // Red
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
        graphics.pivot.set(this.data.width/2, this.data.height/2);
        // Draw a rectangle
        graphics.drawRoundedRect(this.data.x, this.data.y, this.data.width, this.data.height, 30);
        // Draw a circle
        //graphics.drawCircle(this.data.x, this.data.y, this.data.width/2);
        // Applies fill to lines and shapes since the last call to beginFill.
        graphics.endFill();

        // Events
        graphics.on("pointertap", this.onClicked, this);
        graphics.interactive = true;   // Super important or the object will never receive mouse events!
        // https://pixijs.io/examples/#/interaction/custom-hitarea.js

        this.graphics = graphics;
    }
    
    public onClicked(_e: InteractionEvent): void {
        console.log(this.data.target_scene_id);

        let clickedDispObj = _e.currentTarget;
        console.log(clickedDispObj);
        
        console.log(this.data.state);

        // Check door state
        if (this.data.state == DoorState.Locked) {
            
            // Does player have the key?
            const key = SAGE.World.player.inventory.find((obj) => {
                return obj.id === this.data.key_prop_id;
            });
            if (key) {
                // Unlock the door
                this.data.state = DoorState.Unlocked;
            }
            else
            {
                SAGE.Dialog.showMessage(this.data.desc_locked || "It is locked");
                return;
            }
        }

        // TODO: Find the target door/scene
        // 👇️ const first: {id: number; language: string;} | undefined
        const targetScene = SAGE.World.scenes.find((obj) => {
            return obj.id === this.data.target_scene_id;
        });

        if (targetScene) {
            // Change scene to the game scene!
            targetScene.show();
            //Manager.changeScreen(new SceneScreen(targetScene));
        }
        else
        {
            SAGE.Dialog.showErrorMessage(`Error: Scene with ID '${this.data.target_scene_id}' is invalid`);
        }
    }
}