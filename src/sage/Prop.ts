import { InteractionEvent, Sprite, Texture } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { SAGE } from "../Manager";
import { DialogType } from "./ui/Dialog";
import { InputEventEmitter } from "./ui/InputEventEmitter";
import { IPropData } from "./PropData";

export class Prop {
  // "constants" 
  // (perhaps overridable in config?)
  TOUCH_DURATION = 500;
  DRAG_SENSDIST = 25;
  DRAG_ALPHA = 0.75;

  public data!: IPropData;
  public sprite!: Sprite;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (ignore the "declared but never used" for now)
  private propInputEvents!: InputEventEmitter;
  public dragging = false;
  public restXPos!: number;
  public restYPos!: number;

  public constructor(propData: IPropData) {
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
    // Drag+Drop
    this.sprite.on("pointerdown", this.onPointerDown, this);
    this.sprite.on("pointermove", this.onPointerMove, this);
    this.sprite.on("pointerup", this.onPointerUp, this);

    SAGE.Events.on("scenehint", this.onSceneHint, this);

    // visible state
    this.sprite.visible = propData.visible;
  }

  tidyUp() {
    // Unsubscribe from events, etc.
    this.sprite.removeAllListeners();
    SAGE.Events.off("scenehint", this.onSceneHint, this);
  }

  /** Returns whether or not the this prop is in player's inventory */
  public get inInventory(): boolean {
    return SAGE.World.player.inventory.some(prop => prop.id === this.data.id)
  }

  private onSceneHint() {
    //console.log(`TODO: attrack tween for ${this.data.name}`);
    const attractShine: Sprite = Sprite.from("Shine");
    attractShine.anchor.set(0.5);
    attractShine.x = this.data.x
    attractShine.y = this.data.y
    attractShine.alpha = 0;

    this.sprite.parent.addChild(attractShine);

    new Tween(attractShine)
      .to({ alpha: 1 }, 500)
      .easing(Easing.Quadratic.InOut)
      .yoyo(true).repeat(1)
      .start()
      .onComplete(() => {
        this.sprite.parent.removeChild(attractShine);
      });
  }

  // private checkPointerCollisions(xPos: number, yPos: number) {
  //   // Check selected/dragged Prop with
  //   //  > Other Props in inventory
  //   //  > Other Props in current scene
  //   //  > Doors in current scene

  //   console.log(`pos=${xPos},${yPos}`);

  //   // If collision, then highlight source AND target 
  //   // (...and remember if "dropped" on it)
  // }

  private onPointerDown() { //_e: InteractionEvent
    // On an inventory (or draggable) item?
    if (this.inInventory || this.data.draggable) {
      // Start of drag...
      this.dragging = true;
      SAGE.World.currentScene.screen.draggedProp = this;
      this.sprite.alpha = this.DRAG_ALPHA;
      SAGE.Dialog.clearMessage();
    }
  }

  private onPointerMove(_e: InteractionEvent) {
    //if (SAGE.debugMode) console.log(`${this.data.name}::onPointerMove()`);
    // if (this.dragging) {
    //   // Temp remove interaction to "dragged" Prop
    //   this.sprite.interactive = false
    //   // Update pos
    //   this.sprite.x = _e.data.global.x;
    //   this.sprite.y = _e.data.global.y;
    //   // Check for valid "drop"
    //   this.checkPointerCollisions(
    //     _e.data.global.x,
    //     _e.data.global.y
    //   );
    // }
  }

  private onPointerUp() { //_e: InteractionEvent
    if (SAGE.debugMode) console.log(`${this.data.name}::onPointerUp()`);
    // if (this.dragging) {
    //   console.log(`>>>> ${this.data.name}`)
    //   this.dragging = false;
    //   SAGE.World.currentScene.screen.draggedProp = undefined;
    //   // Restore interaction to "dragged" Prop
    //   this.sprite.interactive = true
    //   // Dropped prop...
    //   this.sprite.alpha = 1;
    //   // Was it dropped on a valid target (Prop/Door)?

    //   // Otherwise, put it back to inventory
    //   SAGE.World.player.invScreen.update();
    //}
  }

  private onPointerOver() { //_e: InteractionEvent
    // If not dragging this Prop
    //if (!this.dragging) {
    SAGE.Dialog.showMessage(this.data.name, DialogType.Caption, -1);
    //}
  }

  private onPointerOut() { //_e: InteractionEvent
    // If dialog being displayed is name "on hover"...
    // (AND not dragging this Prop)
    if (SAGE.Dialog.currentDialogType === DialogType.Caption
      && !this.dragging) {
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
    // (...and not already in inventory)?
    if (this.data.pickupable
      && !this.inInventory) {
      SAGE.Dialog.showMessage(`You picked up the ${this.data.name}`);
      // Remove prop from scene
      SAGE.World.currentScene.screen.removeProp(this);
      // Play sound
      SAGE.Sound.play("Pick-Up")
      // Auto-open player inventory
      SAGE.World.player.invScreen.open(true);
      return;
    }

    // Interacted while in player inventory?
    // ...if so, perform secondary action (describe)
    if (this.inInventory) {
      this.onSecondaryAction();
      // Disable auto-close of inventory          
      SAGE.World.player.invScreen.autoClose = false;
      return;
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
