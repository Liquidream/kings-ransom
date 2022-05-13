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
    let treeProp = SAGE.World.getPropById('prp_tree');
    if (treeProp && !treeProp.property["key-collected"]) {
      SAGE.World.putPropAt('prp_key','scn_promontory');
      treeProp.property["key-collected"] = true;
      SAGE.Dialog.showMessage('A Key fell out of the tree');
      console.log(treeProp.property["key-collected"]);
    }
  }
}
 