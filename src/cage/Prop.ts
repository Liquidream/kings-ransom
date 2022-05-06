import { InteractionEvent, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";
import { Dialog } from "../Dialog";
import { Manager } from "../Manager";
import { PropData } from "./PropData";

export class Prop { //implements Serialization<Prop> {
    public constructor() { 
        // Anything?
    } 
    
    public data!: PropData;
    
    public sprite!: Sprite;
    
    //private props: [];
    //private actors: [];
    
    // public initialize(): void {
        //     // Anything?
    // }

    public onClicked(_e: InteractionEvent): void {
        console.log("You interacted with a prop!")
        
        let clickedSprite = _e.currentTarget;
        console.log(clickedSprite)
        
        console.log(this.data.name)

        new Tween(this.sprite).to({ alpha: 0 }, 1000).start()
            .onComplete( ()=> { // https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any                
                // remove when tween completes
                //this.removeChild(this.lamp);  

                // remove from game data
                // https://stackoverflow.com/a/67953394/574415     
                //this.scene.props.splice(this.scene.props.findIndex(item => item.id === "pro01"),1);
            });

        Dialog.showMessage("You picked up the " + this.data.name);

        // Add to Player's inventory
        Manager.World.player.inventory.push(this.data);
    }

}
