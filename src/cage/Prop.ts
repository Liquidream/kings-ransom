import { Serialization } from "../utils/Serialization";

export class Prop implements Serialization<Prop> {
    public constructor() { 
        // Anything?
    }
    
    public id: string | undefined;
    public image: string | undefined;
    public x: number | undefined;
    public y: number | undefined;
    public width: number | undefined;
    public height: number | undefined;
    
    //private props: [];
    //private actors: [];
    
    // public initialize(): void {
        //     // Anything?
    // }
    
    deserialize(input: any) {
        this.id =  input.id;
        this.x = input.x;
        this.y = input.y;
        this.width = input.width;
        this.height = input.height;
        this.image =  input.image;       
        
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
