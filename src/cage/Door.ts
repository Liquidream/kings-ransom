import { InteractionEvent } from "pixi.js";
import { Dialog } from "../Dialog";
import { Manager } from "../Manager";
//import { SceneScreen } from "../scenes/SceneScreen";
import { Serialization } from "../utils/Serialization";

export class Door implements Serialization<Door> {
    public constructor() { 
        // Anything?
    }
    
    public id: string = "";
    public image: string = "";
    public name: string = "";
    public desc: string = "";
    public desc_locked: undefined;
    public target_scene_id: string = "";
    public state: DoorState = DoorState.Unknown;
    public key_prop_id: string = "";
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    
    // public initialize(): void {
        //     // Anything? 
    // }
    
    public onClicked(_e: InteractionEvent): void {
        console.log(this.target_scene_id);

        let clickedDispObj = _e.currentTarget;
        console.log(clickedDispObj);
        
        console.log(this.state);

        // Check door state
        if (this.state == DoorState.Locked) {
            
            // Does player have the key?
            const key = Manager.World.player.inventory.find((obj) => {
                return obj.id === this.key_prop_id;
            });
            if (key) {
                // Unlock the door
                this.state = DoorState.Unlocked;
            }
            else
            {
                Dialog.showMessage(this.desc_locked || "It is locked");
                return;
            }
        }

        // TODO: Find the target door/scene
        // 👇️ const first: {id: number; language: string;} | undefined
        const targetScene = Manager.World.scenes.find((obj) => {
            return obj.id === this.target_scene_id;
        });

        if (targetScene) {
            // Change scene to the game scene!
            targetScene.show();
            //Manager.changeScreen(new SceneScreen(targetScene));
        }
    }


    fromJSON(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.desc =  input.desc;
        this.key_prop_id =  input.key_prop_id;
        this.desc_locked =  input.desc_locked;
        this.target_scene_id =  input.target_scene_id;
        this.state =  input.state;
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);

        //console.log(typeof(this.x));
        
        return this;
    }

    toJSON(): any {
        return this;
    }

    // serialize(): string {
    //     return JSON.stringify(this);
    // }

}

enum DoorState {
    Unknown = "UNKNOWN",
    Locked = "LOCKED",
    Unlocked = "UNLOCKED",
}