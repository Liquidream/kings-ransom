import { Serialization } from "../utils/Serialization";
import { PropData } from "./PropData";



export class Player implements Serialization<Player> {
    public constructor() { 
        // Anything?
    }
    public name: string | undefined;
    public inventory: Array<PropData> = [];
    // Key-Value pair to allow properties to be set/read
    public property: { [key: string]: string | number | boolean } = {};

    /** Returns whether or not the specified prop id is in player's inventory */
    public inInventory(propId: string): boolean {        
        return this.inventory.some(prop => prop.id === propId)
    }

    /** Remove (and return) the specified prop, if present */
    public removeFromInventory(propId: string): PropData | undefined {        
        let prop = this.inventory.find(prop => prop.id === propId)
        return prop;
    }

    fromJSON(input: any) {
        this.name = input.name;
        if (input.property) this.property = input.property;
        for(let prop of input.inventory){
            this.inventory.push(new PropData().fromJSON(prop))
        }
        return this;
    }
    
    toJSON(): any {
        return this;
    }

    // serialize(): string {
    //     return JSON.stringify(this);
    // }

}
