import { Serialization } from "../utils/Serialization";

export class DoorData implements Serialization<DoorData> {
    
    public id: string = "";
    public image: string = "";
    public name: string = "";
    public desc: string = "";
    public desc_locked: undefined;
    public target_scene_id: string = "";
    public state: DoorState = DoorState.Unknown;
    public key_prop_id: string = "";
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor() { 
        // Anything?
    } 

    fromJSON(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.desc =  input.desc;
        this.key_prop_id =  input.key_prop_id;
        this.desc_locked =  input.desc_locked;
        this.target_scene_id =  input.target_scene_id;
        this.state =  input.state;
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);

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