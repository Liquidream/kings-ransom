import { Serialization } from "../utils/Serialization";

export class DoorData implements IDoorData, Serialization<DoorData> {
    
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
    // Poss. event actions
    on_action = "";

    constructor() { 
        // Anything?
    } 

    fromJSON(input: IDoorData) {
        Object.assign(this, input); 
        //console.log(typeof(this.x));
        return this;
    }

    toJSON(): IDoorData {
        return this;
    }

}

export enum DoorState {
    Unknown = "UNKNOWN",
    Locked = "LOCKED",
    Unlocked = "UNLOCKED",
}

export interface IDoorData {
    id: string;
    image: string;
    name: string;
    desc: string;
    desc_locked: string | undefined;
    target_scene_id: string;
    state: DoorState;
    key_prop_id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    // Key-Value pair to allow properties to be set/read
    property: { [key: string]: string | number | boolean };
    // Poss. event actions
    on_action: string;
}