import { SAGE } from "./Manager";

export class Actions {

  onCaveTunnelEnter(): void {
    //console.log("TODO: onEnterCaveTunnel()");
    if (SAGE.World.player.inInventory("prp_rat")) {
      console.log("TODO: Safe! Snake ate the rat...");
    } else {
      console.log("TODO: DEAD!...");
    }    
  }

  onTreeAction(): void {
    SAGE.World.putPropAt('prp_key','scn_promontory');
    SAGE.Dialog.showMessage('A Key fell out of the tree');
  }
}
 