import { SAGE } from "./Manager";

export class Actions {

  onCaveTunnelEnter(): void {
    console.log("TODO: onEnterCaveTunnel()");
  }

  onTreeAction(): void {
    SAGE.World.putPropAt('prp_key','scn_promontory');
    SAGE.Dialog.showMessage('A Key fell out of the tree');
  }
}
 