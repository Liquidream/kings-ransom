import { Container, Graphics, Sprite } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import { Tween } from "tweedle.js";
import { SAGE } from "../../Manager";
import { Prop } from "../Prop";
import { DialogType } from "./Dialog";

export class InventoryScreen {
  // "constants" 
  // (perhaps overridable in config?)
  HEIGHT = SAGE.width / 13; //150;
  SIDE_MARGIN = this.HEIGHT; //150;
  SPACING = 20
  ROUNDED_EDGE = 50
  CLOSED_YPOS = -(this.HEIGHT + this.ROUNDED_EDGE);
  OPEN_YPOS = -this.ROUNDED_EDGE;
  ICON_ALPHA_INACTIVE =  0.5;
  ICON_ALPHA_ACTIVE =  0.85;
  ICON_HINT_TEXT = "Open/Close Inventory";

  // Fields
  private parentLayer: Container;
  private inventoryContainer: Container;
  private inventoryBackground!: Graphics;
  private inventoryIcon!: Sprite;
  private propsList: Array<Prop>
  private isOpen = false;

  public constructor(parentLayer: Container) {
    // initialise the inventory
    this.parentLayer = parentLayer;
    this.inventoryContainer = new Container();
    this.parentLayer.addChild(this.inventoryContainer);
    this.propsList = new Array<Prop>();
    // Icon
    this.createIcon();
    // Background
    this.createBackground();
    // Build initial inventory 
    // (will be empty, unless starting with items - e.g. by loading game)
    this.update();

    // Start inventory in "closed" state
    this.inventoryContainer.y = this.CLOSED_YPOS;
  }

  public addProp(prop: Prop) {
    // Prep the sprite for the inventory
    // TODO: Use "Inventory" image, if specified
    const propSprite = prop.sprite;
    // Resize against longest edge
    if (propSprite.height > propSprite.width) {
      propSprite.height = this.HEIGHT;
      propSprite.scale.x = propSprite.scale.y;
    } else {
      propSprite.width = this.HEIGHT;
      propSprite.scale.y = propSprite.scale.x;
    }
    this.inventoryContainer.addChild(propSprite);
    // Now add to list and update the display
    this.propsList.push(prop);
    this.update();
    // Animate it
    propSprite.alpha = 0
    new Tween(propSprite).to({ alpha: 1 }, 500).start()
    // .onComplete( ()=> {
    //     // 
    // });
  }

  public removeProp(propId: string): Prop | undefined {
    const prop = this.propsList.splice(this.propsList.findIndex(item => item.data.id === propId), 1)[0];
    if (prop) {
      const propSprite = prop.sprite;
      // Animate it
      propSprite.alpha = 1
      new Tween(propSprite).to({ alpha: 0 }, 500).start()
        .onComplete(() => {
          this.inventoryContainer.removeChild(prop.sprite);
          this.update();
        });
      return prop;
    }
    return;
  }

  public open() {
    new Tween(this.inventoryContainer).to({ y: 0 }, 500).start()
      .onComplete(() => {
        //
      });
    this.inventoryIcon.alpha = this.ICON_ALPHA_ACTIVE;
    this.isOpen = true;
  }

  public close() {
    new Tween(this.inventoryContainer).to({ y: this.CLOSED_YPOS }, 500).start()
      .onComplete(() => {
        //
      });
    this.inventoryIcon.alpha = this.ICON_ALPHA_INACTIVE;
    this.isOpen = false;
  }

  // Updates position of inventory items
  update() {
    let xOff = this.HEIGHT / 2;
    // Add each item        
    for (const prop of this.propsList) {
      const propSprite = prop.sprite;
      propSprite.x = this.SIDE_MARGIN + xOff;
      propSprite.y = this.HEIGHT / 2;
      xOff += this.HEIGHT;
    }
  }

  private createIcon() {
    this.inventoryIcon = Sprite.from("UI-Inventory");
    this.inventoryIcon.anchor.set(0.5);
    this.inventoryIcon.x = SAGE.width - (this.HEIGHT / 2);
    this.inventoryIcon.y = this.HEIGHT / 2;
    this.inventoryIcon.anchor.set(0.5);
    this.inventoryIcon.alpha = this.ICON_ALPHA_INACTIVE;
    const dropShadow = new DropShadowFilter();
    dropShadow.alpha = 1;
    this.inventoryIcon.filters = [ dropShadow ]
    this.inventoryIcon.interactive = true;
    this.inventoryIcon.on("pointertap", this.onPointerTap, this);
    this.inventoryIcon.on("pointerover", () => {
      this.inventoryIcon.alpha = this.ICON_ALPHA_ACTIVE;
      SAGE.Dialog.showMessage(this.ICON_HINT_TEXT, DialogType.Caption, -1);
    });
    this.inventoryIcon.on("pointerout", () => {
      this.inventoryIcon.alpha = this.ICON_ALPHA_INACTIVE;
      // If dialog being displayed is name "on hover"...
      if (SAGE.Dialog.currentDialogType === DialogType.Caption) {
        SAGE.Dialog.clearMessage();
    }
    });
    this.parentLayer.addChild(this.inventoryIcon);    
  }

  private onPointerTap() {
    if (this.isOpen)
      this.close();
    else
      this.open();
  }

  private createBackground() {
    this.inventoryBackground = new Graphics();
    this.inventoryBackground.beginFill(0x0);
    this.inventoryBackground.alpha = 0.6;
    this.inventoryBackground.drawRoundedRect(this.SIDE_MARGIN, this.OPEN_YPOS, SAGE.width - (this.SIDE_MARGIN * 2), this.HEIGHT + this.ROUNDED_EDGE, this.ROUNDED_EDGE);
    this.inventoryBackground.endFill();
    this.inventoryContainer.addChild(this.inventoryBackground);
    // Make bg receive input, so that can't be clicked "through"
    this.inventoryBackground.interactive = true;
  }

}