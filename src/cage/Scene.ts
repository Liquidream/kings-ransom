import { Serializable } from "./Serializable";
import { Prop } from "./Prop";

export class Scene implements Serializable<Scene> {
    public constructor() { 
        // Anything?
    }

    public id: number | undefined;
    public image: string | undefined;

    public props: Array<Prop> = [];
    //private actors: [];

    // public initialize(): void {
    //     // Anything?
    // }

    deserialize(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        for(let prop of input.props){
            this.props.push(new Prop().deserialize(prop))
        }
        return this;
    }
}
