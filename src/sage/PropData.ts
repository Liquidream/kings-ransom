import { Serialization } from "../utils/Serialization";

export class PropData implements Serialization<PropData> {
    constructor() { 
        // Anything?
    } 
    
    id = "";
    image = "";
    name = "";
    desc = "";
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    pickupable = false;
    visible = true;    
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean } = {};
    // Poss. event actions
    on_action = "";
        
    // public initialize(): void {
        //     // Anything?
    // }
    
    fromJSON(input: any) {
        Object.assign(this, input);        
        return this;
    }

    toJSON(): any {
        return this;
    }
}
