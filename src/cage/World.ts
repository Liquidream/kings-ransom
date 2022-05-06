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

    public currentScene!: Scene;

    // public initialize(): void {
        //     // Anything?
    // }

    start() {
        this.scenes[0].show();
        
        // this.currentScene = this.scenes[0];
        // this.currentScene.show();

        //Manager.changeScreen(new SceneScreen(Manager.World.scenes[0]));
    }

    deserialize(input: any) {
        this.title = input.title;
        for(let scene of input.scenes){
            this.scenes.push(new Scene().deserialize(scene))
        }
        this.player = new Player().deserialize(input.player);
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
