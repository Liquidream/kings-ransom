import { Sprite, Texture } from "pixi.js";
import { SAGE } from "../Manager";
import { DialogType } from "./Dialog";
import { InputEventEmitter } from "./InputEventEmitter";
import { PropData } from "./PropData";

export class Prop {
    // "constants" 
    // (perhaps overridable in config?)
    TOUCH_DURATION = 500;
    
    public data!: PropData;    
    public sprite!: Sprite;
    // @ts-ignore (ignore the "declared but never used" for now)
    private propInputEvents!: InputEventEmitter;
    
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
        this.propInputEvents = new InputEventEmitter(this.sprite);
        this.sprite.on("primaryaction", this.onPrimaryAction, this);  
        this.sprite.on("secondaryaction", this.onSecondaryAction, this);

        this.sprite.on("pointerover", this.onPointerOver, this);
        this.sprite.on("pointerout", this.onPointerOut, this);

        SAGE.Events.on("scenehint", this.onSceneHint, this);

        // visible state
        this.sprite.visible = propData.visible;
    } 

    private onSceneHint() {
        console.log(`TODO: attrack tween for ${this.data.name}`);
    }


    private onPointerOver() { //_e: InteractionEvent
        SAGE.Dialog.showMessage(this.data.name, DialogType.NameOnHover, -1);
    }

    private onPointerOut() { //_e: InteractionEvent
        // If dialog being displayed is name "on hover"...
        if (SAGE.Dialog.currentDialogType === DialogType.NameOnHover) {
            SAGE.Dialog.clearMessage();
        }
    }
    
    private onPrimaryAction() {
        if (SAGE.debugMode) console.log(`You interacted with a prop! (${this.data.name})`);     
        //console.log(_e.currentTarget)

        // Custom action?
        if (this.data.on_action) {
            Function(this.data.on_action)();
            return;
        }

        // Can prop be picked up?
        if (this.data.pickupable) {
            SAGE.Dialog.showMessage(`You picked up the ${this.data.name}`);

            // Remove prop from scene
            SAGE.World.currentScene.screen.removeProp(this);

            // Add to Player's inventory
            SAGE.World.player.inventory.push(this.data);
        }
        // Run code snippet (stored in string)?
        //https://stackoverflow.com/questions/64426501/how-to-execute-strings-of-expression-in-an-array-with-ramda/64426855#64426855
        // Function("console.log('hi there!!!!!!!!!!!');")();

        // DEBUG
        //console.log(Manager.World.serialize());
    }

    private onSecondaryAction() {
        console.log("onSecondaryAction...");
        SAGE.Dialog.showMessage(this.data.desc);
    }

}
