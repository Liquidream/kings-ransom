import { DropShadowFilter } from "pixi-filters";
import { Container, Sprite } from "pixi.js";
import { SAGE } from "../../Manager";
import { Fullscreen } from "../../utils/Fullscreen";


export class SAGE_UI {
  // "constants" 
  // (perhaps overridable in config?)
  ICON_ALPHA_INACTIVE =  0.5;
  ICON_ALPHA_ACTIVE =  0.85;
  ICON_HINT_TEXT = "Open/Close Inventory";

  // Fields
  private parentLayer: Container;
  private settingsIcon!: Sprite;
  private iconYPos = (SAGE.width / 13) / 2;
  
  public constructor(parentLayer: Container) {
    // initialise the inventory
    this.parentLayer = parentLayer;
    this.initialise();
  }

  private initialise() {
    // Settings icon
    this.settingsIcon = Sprite.from("UI-Settings");
    this.settingsIcon.anchor.set(0.5);
    this.settingsIcon.x = this.iconYPos;
    this.settingsIcon.y = this.iconYPos;
    this.settingsIcon.anchor.set(0.5);
    this.settingsIcon.alpha = this.ICON_ALPHA_INACTIVE;
    const dropShadow = new DropShadowFilter();
    dropShadow.alpha = 1;
    this.settingsIcon.filters = [ dropShadow ]
    this.settingsIcon.interactive = true;
    this.settingsIcon.buttonMode = true;
    this.settingsIcon.on("pointertap", this.onSettingsTap, this);
    this.parentLayer.addChild(this.settingsIcon);   
  }

  onSettingsTap() {
    // Toggle fullscreen (for now)
    Fullscreen.toggleFullScreen();
  }

  public showSettings() {
    throw new Error("Method not implemented.");
  }
  
  closeSettings() {
    throw new Error("Method not implemented.");
  }
  
}