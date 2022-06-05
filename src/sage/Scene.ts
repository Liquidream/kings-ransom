import { SAGE } from "../Manager";
import { SceneScreen } from "../scenes/SceneScreen";
import { Serialization } from "../utils/Serialization";
import { IPropData, PropData } from "./PropData";
import { DoorData, IDoorData } from "./DoorData";

export class Scene implements ISceneData, Serialization<Scene> {
    public constructor() { 
        // Anything?
    }

    public id = "";
    public image = "";
    public name = "";
    public sound = "";
    // Key-Value pair to allow properties to be set/read
    public property: { [key: string]: string | number | boolean } = {};
    
    // Events
    public on_enter = "";

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
    show(skipFade = false) {
        // Clean up current scene "screen"
        SAGE.World.currentScene?.screen.tidyUp();
        // Create and switch to new "screen"
        this.screen = new SceneScreen(this)
        
        if (!skipFade) {
            SAGE.changeScreenFade(this.screen);
        } else {
            SAGE.changeScreen(this.screen);
        }
        
        // Remember the new scene
        // (happens in above function)
        SAGE.World.currentScene = this;
        
        // DEBUG
        //console.log(SAGE.World.serialize());

        // Run any OnEnter action?        /
        if (this.on_enter) {
            Function(this.on_enter)();
            return;
        }
    }

    addPropData(propData: PropData){
        // add to list of props
        this.props.push(propData);
    }

    removePropDataById(propId: string){
        // Remove data from prop list (no DisplayObject changes)
        this.props.splice(this.props.findIndex(item => item.id === propId),1);          
        // https://stackoverflow.com/a/67953394/574415
    }

    fromJSON(input: ISceneData) {
        //console.log(input)
        this.id =  input.id;
        this.image =  input.image || "";
        this.name =  input.name;
        this.sound =  input.sound;
        if (input.property) this.property = input.property;
        this.on_enter =  input.on_enter;
        for(const prop of input.props) {
            this.props.push(new PropData().fromJSON(prop))
        }
        for(const door of input.doors) {
            this.doors.push(new DoorData().fromJSON(door))
        }
        return this;
    }

    toJSON(): ISceneData {
        // exclude certain properties from serialisation
        return { 
            id: this.id, 
            image: this.image, 
            sound: this.sound, 
            name: this.name, 
            property: this.property,
            on_enter: this.on_enter,
            props: this.props, 
            doors: this.doors } 
    }
    
}

export interface ISceneData {
    id: string;
    image: string;
    name: string;
    sound: string;
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean };
    // Poss. event actions
    on_enter: string;
    props: Array<IPropData>;
    doors: Array<IDoorData>;
}
