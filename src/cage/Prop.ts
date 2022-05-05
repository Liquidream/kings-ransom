import { InteractionEvent } from "pixi.js";
import { Tween } from "tweedle.js";
import { Dialog } from "../Dialog";
import { Manager } from "../Manager";
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
            .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any
                
/* ============================================================================================
    TODO: Maybe the best to achieve both of these things is to raise custom event here?
          By raising custom event with ref to both DisplayObject AND Prop/Door/etc.
          then that could allow both/all layers to react accordingly.
          e.g. 
            - SceneScreen can worry about tweening and removing DisplayObj from scenegraph
            - Can also add item to Player's inventory
            - ..and also remove it from scene's prop list

        Either way, need to get a better/cleaner structure here (ideally a flexible one!)
   ============================================================================================ */

                // remove when tween completes
                //this.removeChild(this.lamp);  

                // remove from game data
                // https://stackoverflow.com/a/67953394/574415     
                //this.scene.props.splice(this.scene.props.findIndex(item => item.id === "pro01"),1);
            });

        Dialog.showMessage("You picked up the " + this.name);

        // Add to Player's inventory
        Manager.World.player.inventory.push(this);
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
