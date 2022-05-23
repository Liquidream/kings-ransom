import { Serialization } from "../utils/Serialization";
import { IPlayerData, Player } from "./Player";
import { ISceneData, Scene } from "./Scene";
import { PropData } from "./PropData";
import { SAGE } from "../Manager";



export class World implements IWorldData, Serialization<World> {
    public constructor() { 
        // Anything?
    }
    public title: string | undefined;
    public player!: Player;
    public scenes: Array<Scene> = [];    
    public starting_scene_id: string | undefined;
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean } = {};

    public currentScene!: Scene;

    public initialize(data: IWorldData): void {        
        
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
        const startingScene = this.scenes.find((obj) => {
            return obj.id === this.starting_scene_id;
        });
        
        // ...and show it        
        if (startingScene) {
            startingScene.show();
        }
        else
        {
            SAGE.Dialog.showErrorMessage(`Error: Scene with ID '${this.starting_scene_id}' is invalid`);
        }

    }

    

    
    /** Find and return scene with specific id */
    getSceneById(sceneId: string) {
        // Find the specified scene...
        const scene = this.scenes.find((obj) => {
            return obj.id === sceneId;
        });
        return scene;
    }
    
    /** Find and return prop with specific id */
    getPropById(propId: string) {        
        // First, find scene that contains prop...
        const scene = this.scenes.filter(e => e.props.filter(c => c.id === propId)[0])[0]; 
        // Then get the propdata...
        const propData = scene ? scene.props.filter(c => c.id === propId)[0] : null;
        return propData;
    }

    /** Move prop to specfied scene id (at optional x,y position)  */
    revealPropAt(propId: string, targetSceneId: string) {
        this.putPropAt(propId,targetSceneId, undefined, undefined, true);
    }

    /** Move prop to specfied scene id (at optional x,y position)  */
    putPropAt(propId: string, targetSceneId: string, x?: number, y?: number, fadeIn?: boolean) {
        // Get prop data
        const propData = this.getPropById(propId);
        if (propData) {
            // Remove prop from its current scene...
            const sourceScene = this.scenes.find((scn) => {
                return scn.props.find((prp: PropData) => {
                    return prp.id === propId;
                });
            });
            if (sourceScene) {
                sourceScene.removePropDataById(propId);
            }
            
            // ..and place in target scene...
            const targetScene = this.getSceneById(targetSceneId);
            if (targetScene) {
                // data...
                targetScene.addPropData(propData);
                //targetScene.props.push(propData);

                // sprite... (if scene is active)
                if (targetScene === this.currentScene
                    && sourceScene != targetScene) {
                    this.currentScene.screen.addProp(propData, fadeIn);
                }
            }
            // (optionally, at position)
            if (x) propData.x = x;
            if (y) propData.y = y;
        }
    }


    // ----------------------------------------------------------
    // Serialisation related

    fromJSON(input: IWorldData) {
        this.title = input.title;
        if (input.property) this.property = input.property;
        for(const scene of input.scenes){
            this.scenes.push(new Scene().fromJSON(scene))
        }
        this.player = new Player().fromJSON(input.player);
        this.starting_scene_id = input.starting_scene_id;
        return this;
    }

    toJSON(): IWorldData {
        return { 
            title: this.title,
            property: this.property,
            scenes: this.scenes, 
            starting_scene_id: this.starting_scene_id, 
            player: this.player } 
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}

export interface IWorldData {
    title: string | undefined;
    player: IPlayerData;
    scenes: Array<ISceneData>;
    starting_scene_id: string | undefined;
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean };
    // Poss. event actions
    //on_enter: string;
}
