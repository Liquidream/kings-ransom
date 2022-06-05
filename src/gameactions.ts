import { SAGE } from "./Manager";
import { DialogOption } from "./sage/ui/Dialog";

// "Stream, Water, C.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
// "Pick up Item 1.wav" by SilverIllusionist of Freesound.org
// "Water drips in the cave HQ.wav" by tosha73
// "SnakeAttackVerbPuls.wav" by Jamius
// "bush11.wav" by schademans
// "Jingle_Win_00.wav" by LittleRobotSoundFactory
export class Actions {

  onCaveTunnelEnter = async () => {
    //console.log("TODO: onEnterCaveTunnel()");
    if (!SAGE.World.currentScene.property["snake-done"]) {      
      SAGE.World.currentScene.property["snake-done"] = true;
      await SAGE.Script.wait(1);
      SAGE.Sound.play("Snake-Attack");
      await SAGE.Script.wait(1);
      if (SAGE.World.player.inInventory("prp_rat")) {
        if (SAGE.debugMode) console.log("Safe! Snake ate the rat...");
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
      SAGE.Sound.play("Bush-Rustle");
      await SAGE.Dialog.showMessage('You give the tree a shake...');
      SAGE.Sound.play("Key-Clink");
      SAGE.World.revealPropAt('prp_key','scn_promontory');
      await SAGE.Script.wait(1);
      SAGE.Dialog.showMessage('A Key fell out of the tree');
    }
  }

  onBridgeEnter = async () => {
    //console.log("TODO: onBridgeEnter()");    
      if (SAGE.World.player.inInventory("prp_gold")) {
        if (SAGE.debugMode) console.log("Got gold out - game won!");
        SAGE.gameWon("You paid the King's Ransom!");        
      }
      
      //SAGE.Sound.playLoop("Test-Loop", false);

      if (!SAGE.World.property["intro-done"]) {
        SAGE.World.property["intro-done"] = true;
        await SAGE.Script.wait(3);
        await SAGE.Dialog.say("Narrator", "The King has been kidnapped by marauders, who are keeping him hostage", "#00ff00", "Intro-1");
        await SAGE.Dialog.say("Narrator", "Your task is a simple one...", undefined, "Intro-2")
        await SAGE.Dialog.say("Narrator", "Retrieve the gold\nthat will pay the King's Ransom!", undefined, "Intro-3")
      }

      await SAGE.Dialog.showOptions([
        new DialogOption("why did you stop me?", async () => {
          await SAGE.Dialog.say("Tentacle", "I'm lonely...", undefined, "Intro-2");
        }),
        new DialogOption("where am i?", async () => {
          //
        }),
        new DialogOption("who are you?", async () => {
          //
        }),
        new DialogOption("nevermind", async () => {
          //
        })
      ]);
  }

}

// sample delay code
//const wait = (n: number) => new Promise<void>(res => setTimeout(res, n))

