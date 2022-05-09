import { InteractionEvent, Sprite } from "pixi.js";
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
        console.log(`You interacted with a prop! (${this.data.name})`);
        
        //let clickedSprite = _e.currentTarget;        
        //console.log(clickedSprite)        

        console.log(this.data.name)        

        // Can prop be picked up?
        if (this.data.pickupable) {
            Dialog.showMessage("You picked up the " + this.data.name);

            // Remove prop from scene
            Manager.World.currentScene.removeProp(this);

            // Add to Player's inventory
            Manager.World.player.inventory.push(this.data);
        }
        // Run code snippet (stored in string)?
        //https://stackoverflow.com/questions/64426501/how-to-execute-strings-of-expression-in-an-array-with-ramda/64426855#64426855

        // DEBUG
        //console.log(Manager.World.serialize());
    }

}
