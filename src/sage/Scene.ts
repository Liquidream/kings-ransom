import { Tween } from "tweedle.js";
import { SAGE } from "../Manager";
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
    // Key-Value pair to allow properties to be set/read
    public property: { [key: string]: string | number | boolean } = {};
    
    // Events
    public on_enter: string = "";

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
        // Create and switch to new "screen"
        this.screen = new SceneScreen(this)
        SAGE.changeScreen(this.screen);
        // Remember the new scene
        SAGE.World.currentScene = this;
        
        // DEBUG
        console.log(SAGE.World.serialize());

        // Run any OnEnter action?        /
        if (this.on_enter) {
            Function(this.on_enter)();
            return;
        }
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

    removePropDataById(propId: string){
        // Remove data from prop list (no DisplayObject changes)
        this.props.splice(this.props.findIndex(item => item.id === propId),1);          
        // https://stackoverflow.com/a/67953394/574415
    }

    fromJSON(input: any) {
        //console.log(input)
        this.id =  input.id;
        this.image =  input.image || "";
        this.name =  input.name;
        if (input.property) this.property = input.property;
        this.on_enter =  input.on_enter;
        for(let prop of input.props){
            this.props.push(new PropData().fromJSON(prop))
        }
        for(let door of input.doors){
            this.doors.push(new DoorData().fromJSON(door))
        }
        return this;
    }

    toJSON(): any {
        // exclude certain properties from serialisation
        return { 
            id: this.id, 
            image: this.image, 
            name: this.name, 
            property: this.property,
            on_enter: this.on_enter,
            props: this.props, 
            doors: this.doors } 
    }
    // serialize(): string {
    //     return JSON.stringify(this, ["id","image","name","props","doors"]);
    //     //return "";
    // }
}
