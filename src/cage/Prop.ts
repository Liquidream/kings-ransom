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
        console.log("You interacted with a prop!")
        
        let clickedSprite = _e.currentTarget;        
        console.log(clickedSprite)        
        console.log(this.data.name)        

        Dialog.showMessage("You picked up the " + this.data.name);

        // Remove prop from scene
        Manager.World.currentScene.removeProp(this);

        // Add to Player's inventory
        Manager.World.player.inventory.push(this.data);
    }

}
