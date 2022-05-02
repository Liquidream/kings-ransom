import { Serialization } from "../utils/Serialization";

export class Door implements Serialization<Door> {
    public constructor() { 
        // Anything?
    }
    
    public id: string = "";
    public image: string = "";
    public name: string = "";
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    
    // public initialize(): void {
        //     // Anything?
    // }
    
    deserialize(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.x = input.x;
        this.y = input.y;
        this.width = input.width;
        this.height = input.height;
        
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
