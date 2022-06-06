import { Container, Graphics } from "pixi.js";
import { SAGE } from "../../Manager";
import { Prop } from "../Prop";

export class InventoryScreen {
  // "constants" 
  // (perhaps overridable in config?)
  SIDE_MARGIN = 150;

  // Fields
  private parentLayer: Container;
  private inventoryContainer: Container;
  private inventoryBackground: Graphics;
  
  public constructor(parentLayer: Container) {
    //SAGE.Events.on("sceneinteract", this.onSceneInteract, this);
    //console.log(SAGE.World.player.inventory.length);

    // initialise the inventory
    this.parentLayer = parentLayer;
    this.inventoryContainer = new Container();
    this.parentLayer.addChild(this.inventoryContainer)
    // Background
    this.inventoryBackground = new Graphics();
    this.inventoryBackground.beginFill(0x0);
    this.inventoryBackground.alpha = 0.6;
    this.inventoryBackground.drawRect(this.SIDE_MARGIN, 0, SAGE.width - (this.SIDE_MARGIN*2), 100);
    this.inventoryBackground.endFill();
    this.inventoryContainer.addChild(this.inventoryBackground);

    // Build initial inventory 
    // (will be empty, unless starting with items - e.g. by loading game)
    this.refresh();
  }

  refresh() {
    //
    let xOff = 50;
    for(const propData of SAGE.World.player.inventory) {
      const prop = new Prop(propData);
      prop.sprite.scale.x = 0.3;
      prop.sprite.scale.y = 0.3;
      prop.sprite.x = this.SIDE_MARGIN + xOff;
      prop.sprite.y = 40;
      this.inventoryContainer.addChild(prop.sprite);
      xOff += 100;
    }
  }
}