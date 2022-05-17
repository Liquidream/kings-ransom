import { SAGE } from "./Manager";

export class Actions {

  onCaveTunnelEnter = async () => {
    //console.log("TODO: onEnterCaveTunnel()");
    if (!SAGE.World.currentScene.property["snake-done"]) {      
      SAGE.World.currentScene.property["snake-done"] = true;
      await SAGE.Script.wait(1);
      if (SAGE.World.player.inInventory("prp_rat")) {
        console.log("Safe! Snake ate the rat...");
        SAGE.Dialog.showMessage('A snake strikes and eats the rat & leaves');
      } else {
        if (SAGE.debugMode) console.debug("Player died...");
        /* 
        A small snake is sleeping in its favourite cranny.
        The serpent awakes, and vents its anger on you by biting you.
        The venom is swift and painless in its fatal effect.
        */        
        SAGE.Dialog.showMessage('A hungry snake strikes and bites you');
        await SAGE.Script.wait(1);
        SAGE.World.currentScene.screen.showGameOver("You Died!");
      }
    }
  }

  onTreeAction = async () => {    
    let treeProp = SAGE.World.getPropById('prp_tree');
    // If not collected key already...
    if (treeProp && !treeProp.property["key-dropped"]) {
      treeProp.property["key-dropped"] = true;
      await SAGE.Dialog.showMessage('You give the tree a push...');
      SAGE.World.revealPropAt('prp_key','scn_promontory');
      await SAGE.Script.wait(1);
      SAGE.Dialog.showMessage('A Key fell out of the tree');
    }
  }
}

// sample delay code
//const wait = (n: number) => new Promise<void>(res => setTimeout(res, n))

