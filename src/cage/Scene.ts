import { Tween } from "tweedle.js";
import { Manager } from "../Manager";
import { SceneScreen } from "../scenes/SceneScreen";
import { Serialization } from "../utils/Serialization";
import { Prop } from "./Prop";
import { PropData } from "./PropData";
import { DoorData } from "./DoorData";

export class Scene implements Serialization<Scene> {
    public constructor() { 
        // Anything?
    }

    public id: string = "";
    public image: string = "";
    public name: string = "";

    public props: Array<PropData> = [];
    public doors: Array<DoorData> = [];
    
    screen!: SceneScreen;
 
    // public initialize(): void {
    //     // Anything?
    // }

    /**
     * Create scene and change display to it
     * 
     * (also destroy/release previous screen objects)
     */
    show() {
        this.screen = new SceneScreen(this)
        Manager.changeScreen(this.screen);
        Manager.World.currentScene = this;

        console.log(Manager.World.serialize());
    }

    /**
     * Removes a Prop from a scene (default = fade out).     
     */
    removeProp(prop: Prop){
        new Tween(prop.sprite).to({ alpha: 0 }, 1000).start()
            .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any                
                // remove when tween completes
                this.screen.removeChild(prop.sprite);  

                // remove from game data
                // https://stackoverflow.com/a/67953394/574415     
                this.props.splice(this.props.findIndex(item => item.id === prop.data.id),1);
            });
    }

    fromJSON(input: any) {
        console.log(input)
        this.id =  input.id;
        this.image =  input.image || "";
        this.name =  input.name;
        for(let prop of input.props){
            this.props.push(new PropData().fromJSON(prop))
        }
        for(let door of input.doors){
            this.doors.push(new DoorData().fromJSON(door))
        }
        return this;
    }

    toJSON(): any {
        return { id: this.id, image: this.image, name: this.name, props: this.props, doors: this.doors } 
    }
    // serialize(): string {
    //     return JSON.stringify(this, ["id","image","name","props","doors"]);
    //     //return "";
    // }
}
