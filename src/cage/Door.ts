import { InteractionEvent } from "pixi.js";
import { Manager } from "../Manager";
import { SceneScreen } from "../scenes/SceneScreen";
import { Serialization } from "../utils/Serialization";

export class Door implements Serialization<Door> {
    public constructor() { 
        // Anything?
    }
    
    public id: string = "";
    public image: string = "";
    public name: string = "";
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    public target_scene_id: string = "";
    
    // public initialize(): void {
        //     // Anything? 
    // }
    
    public onClicked(_e: InteractionEvent): void {
        console.log(this.target_scene_id);

        let clickedDispObj = _e.currentTarget;
        console.log(clickedDispObj);

        // TODO: Find the target door/scene
        // 👇️ const first: {id: number; language: string;} | undefined
        const targetScene = Manager.World.scenes.find((obj) => {
            return obj.id === this.target_scene_id;
        });

        if (targetScene) {
            // Change scene to the game scene!
            Manager.changeScreen(new SceneScreen(targetScene));
        }
    }


    deserialize(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);
        this.target_scene_id =  input.target_scene_id;

        //console.log(typeof(this.x));
        
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }

}
