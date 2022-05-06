import { Serialization } from "../utils/Serialization";
import { PropData } from "./PropData";



export class Player implements Serialization<Player> {
    public constructor() { 
        // Anything?
    }
    public name: string | undefined;
    public inventory: Array<PropData> = [];

    // public initialize(input:any): void {        
    //     this.deserialize(input);
    //     //World.scenes[0] = new Scene();
    // }

    deserialize(input: any) {
        this.name = input.name;
        for(let prop of input.inventory){
            this.inventory.push(new PropData().deserialize(prop))
        }
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
