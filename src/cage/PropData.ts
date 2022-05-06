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
        
    // public initialize(): void {
        //     // Anything?
    // }
    
    deserialize(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.desc =  input.desc;
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);
        
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
