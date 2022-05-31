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
        SAGE.gameOver("You Died!");
        //SAGE.World.currentScene.screen.showGameOver("You Died!");
      }
    }
  }

  onPitAction = async () => {
    //console.log("TODO: onEnterCaveTunnel()");    
    SAGE.Dialog.showMessage('You fall into the bottomless pit...');
    await SAGE.Script.wait(1);
    SAGE.gameOver("You Died!");
  }

  onTreeAction = async () => {    
    const treeProp = SAGE.World.getPropById('prp_tree');
    // If not collected key already...
    if (treeProp && !treeProp.property["key-dropped"]) {
      treeProp.property["key-dropped"] = true;
      await SAGE.Dialog.showMessage('You give the tree a push...');
      SAGE.World.revealPropAt('prp_key','scn_promontory');
      await SAGE.Script.wait(1);
      SAGE.Dialog.showMessage('A Key fell out of the tree');
    }
  }

  onBridgeEnter = async () => {
    //console.log("TODO: onBridgeEnter()");    
      if (SAGE.World.player.inInventory("prp_gold")) {
        console.log("Got gold out - game won!");
        SAGE.gameWon("You paid the King's Ransom!");        
      }
      
      if (!SAGE.World.property["intro-done"]) {
        SAGE.World.property["intro-done"] = true;
        await SAGE.Dialog.say("Narrator", "Welcome to this simple adventure", "#00ff00");
        await SAGE.Dialog.say("Narrator", "Find gold to pay the King's Ransom", "#00ff00");       
      }
  }

}

// sample delay code
//const wait = (n: number) => new Promise<void>(res => setTimeout(res, n))

