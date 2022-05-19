import { Serialization } from "../utils/Serialization";

export class DoorData implements Serialization<DoorData> {
    
    id = "";
    image = "";
    name = "";
    desc = "";
    desc_locked: undefined;
    target_scene_id = "";
    state: DoorState = DoorState.Unknown;
    key_prop_id = "";
    x = 0;
    y = 0;
    width = 0;
    height = 0;
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