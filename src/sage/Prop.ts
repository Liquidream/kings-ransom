import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { Manager } from "../Manager";
import { PropData } from "./PropData";

export class Prop { //implements Serialization<Prop> {
    
    public data!: PropData;    
    public sprite!: Sprite;
    
    public constructor(propData: any) { 
        // Initialise from data object
        let sprite = undefined;
        if (propData.image) {
            sprite = Sprite.from(propData.image);
        }
        else {
            sprite = new Sprite(Texture.EMPTY);
            sprite.width = propData.width;
            sprite.height = propData.height;
        }
        this.data = propData;
        this.sprite = sprite;
        sprite.anchor.set(0.5);
        sprite.x = propData.x;
        sprite.y = propData.y;

        // Events
        this.sprite.interactive = true;   // Super important or the object will never receive mouse events!
        this.sprite.on("pointertap", this.onClicked, this);

        // visible state
        this.sprite.visible = propData.visible;
    } 
    
    public onClicked(_e: InteractionEvent): void {
        console.log(`You interacted with a prop! (${this.data.name})`);     
        //console.log(_e.currentTarget)

        // Custom action?
        if (this.data.on_action) {
            Function(this.data.on_action)();
            return;
        }

        // Can prop be picked up?
        if (this.data.pickupable) {
            Manager.Dialog.showMessage(`You picked up the ${this.data.name}`);

            // Remove prop from scene
            Manager.World.currentScene.removeProp(this);

            // Add to Player's inventory
            Manager.World.player.inventory.push(this.data);
        }
        // Run code snippet (stored in string)?
        //https://stackoverflow.com/questions/64426501/how-to-execute-strings-of-expression-in-an-array-with-ramda/64426855#64426855
        // Function("console.log('hi there!!!!!!!!!!!');")();

        // DEBUG
        //console.log(Manager.World.serialize());
    }

}
