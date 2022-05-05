import { InteractionEvent } from "pixi.js";
import { Tween } from "tweedle.js";
import { Dialog } from "../Dialog";
import { Serialization } from "../utils/Serialization";

export class Prop implements Serialization<Prop> {
    public constructor() { 
        // Anything?
    } 
    
    public id: string = "";
    public image: string = "";
    public name: string = "";
    public desc: string = "";
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    
    //private props: [];
    //private actors: [];
    
    // public initialize(): void {
        //     // Anything?
    // }

    public onClicked(_e: InteractionEvent): void {
        console.log("You interacted with a prop!")
        
        let clickedProp = _e.currentTarget;
        console.log(clickedProp)
        
        console.log(clickedProp.name)

        new Tween(clickedProp).to({ alpha: 0 }, 1000).start()

        Dialog.showMessage("You picked up the " + this.name);
    }
    
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
