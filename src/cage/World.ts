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

    // public initialize(input:any): void {        
    //     this.deserialize(input);
    //     //World.scenes[0] = new Scene();
    // }

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
