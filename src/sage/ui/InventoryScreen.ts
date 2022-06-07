import { Container, Graphics } from "pixi.js";
import { SAGE } from "../../Manager";
import { Prop } from "../Prop";

export class InventoryScreen {
  // "constants" 
  // (perhaps overridable in config?)
  HEIGHT = 150;
  SIDE_MARGIN = 150;
  SPACING = 20

  // Fields
  private parentLayer: Container;
  private inventoryContainer: Container;
  private inventoryBackground!: Graphics;
  private propsList: Array<Prop>
  
  public constructor(parentLayer: Container) {
    // initialise the inventory
    this.parentLayer = parentLayer;
    this.inventoryContainer = new Container();
    this.parentLayer.addChild(this.inventoryContainer);
    this.propsList = new Array<Prop>();
    // Background
    this.createBackground();
    // Build initial inventory 
    // (will be empty, unless starting with items - e.g. by loading game)
    this.update();
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
  }

  public removeProp(propId: string): Prop | undefined {
    const prop = this.propsList.splice(this.propsList.findIndex(item => item.data.id === propId), 1);
    if (prop) this.inventoryContainer.removeChild(prop[0].sprite);
    this.update();
    return prop[0];
  }

  update() {
    let xOff = this.HEIGHT / 2;    
    // Add each item        
    for(const prop of this.propsList) {      
      const propSprite = prop.sprite;
      propSprite.x = this.SIDE_MARGIN + xOff;
      propSprite.y = this.HEIGHT / 2;
      xOff += this.HEIGHT;
    }
  }

  private createBackground() {
    this.inventoryBackground = new Graphics();
    this.inventoryBackground.beginFill(0x0);
    this.inventoryBackground.alpha = 0.6;
    this.inventoryBackground.drawRect(this.SIDE_MARGIN, 0, SAGE.width - (this.SIDE_MARGIN*2), this.HEIGHT);
    this.inventoryBackground.endFill();
    this.inventoryContainer.addChild(this.inventoryBackground);
  }

}