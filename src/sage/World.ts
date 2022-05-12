import { Serialization } from "../utils/Serialization";
import { Player } from "./Player";
import { Scene } from "./Scene";
import { PropData } from "./PropData";
import { Manager } from "../Manager";



export class World implements Serialization<World> {
    public constructor() { 
        // Anything?
    }
    public title: string | undefined;
    public player!: Player;
    public scenes: Array<Scene> = [];    
    public starting_scene_id: string | undefined;

    public currentScene!: Scene;

    public initialize(data: any): void {        
        
        // (Done in gamedata - else can't define hidden props)
        // Create the first scene as "void"?
        // let voidScene = Object.assign( new Scene(), {
        //     id: "scn_void",
        //     name: "The Void"
        // });        
        // this.scenes.push(voidScene);

        // Now restore the rest from data
        this.fromJSON(data);
    }

    // Start the adventure!
    start() {
        // Find the starting scene...
        let startingScene = this.scenes.find((obj) => {
            return obj.id === this.starting_scene_id;
        });
        
        // ...and show it        
        if (startingScene) {
            startingScene.show();
        }
        else
        {
            Manager.Dialog.showErrorMessage(`Error: Scene with ID '${this.starting_scene_id}' is invalid`);
        }

    }

    
    /** Find and return scene with specific id */
    getSceneById(sceneId: string) {
        // Find the specified scene...
        let scene = this.scenes.find((obj) => {
            return obj.id === sceneId;
        });
        return scene;
    }
    
    /** Find and return prop with specific id */
    getPropById(propId: string) {
        
        // First, find scene that contains prop...
        let scene = this.scenes.filter(e => e.props.filter(c => c.id === propId)[0])[0]; 
        // Then get the propdata...
        let propData = scene ? scene.props.filter(c => c.id === propId)[0] : null;
        // Finally, create & return "full" pop, based on data
        //let prop = new Prop(propData);
        // https://stackoverflow.com/a/57398236/574415

        // (abandoned attempt to do in one go)----------
        // let propData = this.scenes.find((scn) => {
        //     return scn.props.find((prp: any) => {
        //         return prp.id === propId;
        //     });
        // });
        return propData; //prop;
    }

    /** Move prop to specfied scene id (at optional x,y position)  */
    putPropAt(propId: string, targetSceneId: string, x?: number, y?: number) {
        // Get prop data
        let propData = this.getPropById(propId);
        if (propData) {
            // Remove prop from its current scene...
            let scene = this.scenes.find((scn) => {
                return scn.props.find((prp: PropData) => {
                    return prp.id === propId;
                });
            });
            scene?.removePropDataById(propId);
            
            // ..and place in target scene...
            let targetScene = this.getSceneById(targetSceneId);
            if (targetScene) {
                // data...
                targetScene.props.push(propData);

                // sprite... (if scene is active)
                if (targetScene === this.currentScene
                    && scene != targetScene) {
                    this.currentScene.screen.addProp(propData);
                }
            }
            // (optionally, at position)
            if (x) propData.x = x;
            if (y) propData.y = y;
        }
    }


    // ----------------------------------------------------------
    // Serialisation related

    fromJSON(input: any) {
        this.title = input.title;
        for(let scene of input.scenes){
            this.scenes.push(new Scene().fromJSON(scene))
        }
        this.player = new Player().fromJSON(input.player);
        this.starting_scene_id = input.starting_scene_id;
        return this;
    }

    toJSON(): any {
        return { 
            title: this.title, 
            scenes: this.scenes, 
            starting_scene_id: this.starting_scene_id, 
            player: this.player } 
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
