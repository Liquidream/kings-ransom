import { Dialog } from "../Dialog";
import { Serialization } from "../utils/Serialization";
import { Player } from "./Player";
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
        //return JSON.stringify(this, ["title","scenes","player"]);
        //return JSON.stringify(this.currentScene);
        return JSON.stringify(this);
    }
}
