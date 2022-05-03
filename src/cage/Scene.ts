import { Serialization } from "../utils/Serialization";
import { Door } from "./Door";
import { Prop } from "./Prop";

export class Scene implements Serialization<Scene> {
    public constructor() { 
        // Anything?
    }

    public id: string = "";
    public image: string = "";
    public name: string = "";

    public props: Array<Prop> = [];
    public doors: Array<Door> = [];
    //private actors: [];

    // public initialize(): void {
    //     // Anything?
    // }

    deserialize(input: any) {
        console.log(input)
        this.id =  input.id;
        this.image =  input.image || "";
        this.name =  input.name;
        for(let prop of input.props){
            this.props.push(new Prop().deserialize(prop))
        }
        for(let door of input.doors){
            this.doors.push(new Door().deserialize(door))
        }
        return this;
    }

    serialize(): string {
        return JSON.stringify(this);
    }
}
