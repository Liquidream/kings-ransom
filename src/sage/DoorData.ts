import { Serialization } from "../utils/Serialization";

export class DoorData implements Serialization<DoorData> {
    
    id: string = "";
    image: string = "";
    name: string = "";
    desc: string = "";
    desc_locked: undefined;
    target_scene_id: string = "";
    state: DoorState = DoorState.Unknown;
    key_prop_id: string = "";
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean } = {};

    constructor() { 
        // Anything?
    } 

    fromJSON(input: any) {
        Object.assign(this, input); 
        //console.log(typeof(this.x));        
        return this;
    }

    toJSON(): any {
        return this;
    }

}

export enum DoorState {
    Unknown = "UNKNOWN",
    Locked = "LOCKED",
    Unlocked = "UNLOCKED",
}