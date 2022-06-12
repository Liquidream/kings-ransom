import { DisplayObject } from "pixi.js";

export class Collision {
  private constructor() { /*this class is purely static. No constructor to see here*/ }

  /** Check collision between two objects (e.g. Prop>Prop, Prop>Door, etc.) */
  public static isColliding(objA: DisplayObject | undefined, objB: DisplayObject): boolean {
    // Check we have objects to test,
    // Also check that they are not the same object
    if (objA && objB
      && objA !== objB) {
      const a = objA.getBounds();
      const b = objB.getBounds();

      const rightmostLeft = a.left < b.left ? b.left : a.left;
      const leftmostRight = a.right > b.right ? b.right : a.right;

      if (leftmostRight <= rightmostLeft) {
        return false;
      }

      const bottommostTop = a.top < b.top ? b.top : a.top;
      const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom;

      return topmostBottom > bottommostTop;
    }
    else return false;
  }

  public static dist(x1: number, y1: number, x2: number, y2: number): number {    
    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  }
}