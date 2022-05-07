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

    public initialize(): void {
        // Anything?

        // TODO: Create the first scene as "void"?        
    }

    start() {
        this.scenes[0].show();
        
        // this.currentScene = this.scenes[0];
        // this.currentScene.show();

        //Manager.changeScreen(new SceneScreen(Manager.World.scenes[0]));
    }

    fromJSON(input: any) {
        this.title = input.title;
        for(let scene of input.scenes){
            this.scenes.push(new Scene().fromJSON(scene))
        }
        this.player = new Player().fromJSON(input.player);
        return this;
    }

    toJSON(): any {
        return { title: this.title, scenes: this.scenes, player: this.player } 
    }

    serialize(): string {
        //return JSON.stringify(this, ["title","scenes","player"]);
        //return JSON.stringify(this.currentScene);
        return JSON.stringify(this);
    }
}
