import { Dialog } from "../Dialog";
import { Serialization } from "../utils/Serialization";
import { Player } from "./Player";
import { Prop } from "./Prop";
import { Scene } from "./Scene";



export class World implements Serialization<World> {
    public constructor() { 
        // Anything?
    }
    public title: string | undefined;
    public player!: Player;
    public scenes: Array<Scene> = [];    
    public starting_scene_id: string | undefined;

    public currentScene!: Scene;

    public initialize(): void {
        // Anything?

        // TODO: Create the first scene as "void"?        
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
            Dialog.showErrorMessage(`Error: Scene with ID '${this.starting_scene_id}' is invalid`);
        }

    }

    
    /** Find and return scene with specifid id */
    getSceneById(sceneId: string) {
        // Find the specified scene...
        let scene = this.scenes.find((obj) => {
            return obj.id === sceneId;
        });
        return scene;
    }
    
    /** Find and return prop with specifid id */
    getPropById(propId: string) {
        // Find the specified prop...
        let propData = this.scenes.find((scn) => {
            return scn.props.some((prp: any) => {
                return prp.id === propId;
            });
        });
        let prop = new Prop(propData);
        return prop;
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
