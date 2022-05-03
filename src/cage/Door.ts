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
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);

        console.log(typeof(this.x));
        
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
