import { Serialization } from "../utils/Serialization";

export class PropData implements Serialization<PropData> {
    constructor() { 
        // Anything?
    } 
    
    id: string = "";
    image: string = "";
    name: string = "";
    desc: string = "";
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    pickupable: boolean = false;
    visible: boolean = true;    
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean } = {};
    // Poss. event actions
    on_action: string = "";
        
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
