import { Serialization } from "../utils/Serialization";
import { Prop } from "./Prop";

export class Scene implements Serialization<Scene> {
    public constructor() { 
        // Anything?
    }

    public id: number | undefined;
    public image: string | undefined;
    public name: string | undefined;

    public props: Array<Prop> = [];
    //private actors: [];

    // public initialize(): void {
    //     // Anything?
    // }

    deserialize(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        for(let prop of input.props){
            this.props.push(new Prop().deserialize(prop))
        }
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
