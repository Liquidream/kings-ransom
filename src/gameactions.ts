import { SAGE } from "./Manager";

export class Actions {

  onCaveTunnelEnter(): void {
    //console.log("TODO: onEnterCaveTunnel()");
    if (SAGE.World.player.inInventory("prp_rat")) {
      console.log("TODO: Safe! Snake ate the rat...");
      SAGE.Dialog.showMessage('A snake strikes and eats the rat & leaves');
    } else {
      console.log("TODO: DEAD!...");
      /* 
      A small snake is sleeping in its favourite cranny.
      The serpent awakes, and vents its anger on you by biting you.
      The venom is swift and painless in its fatal effect.
      */
      SAGE.Dialog.showErrorMessage('A hungry snake strikes and bites you - YOU DIED');
      // TODO: Add pause here...
      // Restart game
      SAGE.loadWorld();
      SAGE.startGame();
    }    
  }

  onTreeAction = async () => {    
    let treeProp = SAGE.World.getPropById('prp_tree');
    // If not collected key already...
    if (treeProp && !treeProp.property["key-collected"]) {
      SAGE.Dialog.showMessage('You give the tree a push...');
      await SAGE.Script.wait(3000);
      SAGE.World.putPropAt('prp_key','scn_promontory');
      treeProp.property["key-collected"] = true;
      await SAGE.Script.wait(1000);
      SAGE.Dialog.showMessage('A Key fell out of the tree');
      //console.log(treeProp.property["key-collected"]);
    }
  }
}

// sample delay code
//const wait = (n: number) => new Promise<void>(res => setTimeout(res, n))

