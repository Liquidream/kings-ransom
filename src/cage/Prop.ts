import { Serializable } from "./Serializable";

export class Prop implements Serializable<Prop> {
    public constructor() { 
        // Anything?
    }

    public id: number | undefined;
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
}
