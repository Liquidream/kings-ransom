import { SAGE } from "./Manager";
import { DialogChoice } from "./sage/ui/Dialog";

// "Stream, Water, C.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
// "Pick up Item 1.wav" by SilverIllusionist of Freesound.org
// "Water drips in the cave HQ.wav" by tosha73
// "SnakeAttackVerbPuls.wav" by Jamius
// "bush11.wav" by schademans
// "Jingle_Win_00.wav" by LittleRobotSoundFactory
export class Actions {

  onCaveTunnelEnter = async () => {
    //console.log("onEnterCaveTunnel()");
    if (SAGE.World.currentScene.firstVisit) {
      await SAGE.Script.wait(1);
      SAGE.Sound.play("Snake-Attack");
      await SAGE.Script.wait(1);
      if (SAGE.World.player.inInventory("prp_rat")) {
        if (SAGE.debugMode) console.log("Safe! Snake ate the rat...");
        SAGE.Dialog.showMessage('A snake strikes and eats the rat & leaves');
      } else {
        if (SAGE.debugMode) console.debug("Player died...");
        SAGE.Dialog.showMessage('A hungry snake strikes and bites you');
        await SAGE.Script.wait(1);
        SAGE.gameOver("You Died!");
      }
    }
  }

  onPitAction = async () => {
    //console.log("onPitAction()");    
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
      SAGE.World.revealPropAt('prp_key', 'scn_promontory');
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

    // if (!SAGE.World.property["intro-done"]) {
    //   SAGE.World.property["intro-done"] = true;
    //   await SAGE.Script.wait(3);
    //   await SAGE.Dialog.say("Narrator", "The King has been kidnapped by marauders, who are keeping him hostage", "#00ff00", "Intro-1");
    //   await SAGE.Dialog.say("Narrator", "Your task is a simple one...", undefined, "Intro-2")
    //   await SAGE.Dialog.say("Narrator", "Retrieve the gold\nthat will pay the King's Ransom!", undefined, "Intro-3")
    // }

    await SAGE.Dialog.showChoices([
      new DialogChoice("Why did you stop me something important here no doubt?", async () => {
        await SAGE.Dialog.say("Tentacle", "I'm lonely...", "Lime");
      }),
      new DialogChoice("Where am i?", async () => {
        await SAGE.Dialog.say("Tentacle", "You're in Paul's demo adventure", "Lime");
      }),
      new DialogChoice("Who are you?", async () => {
        await SAGE.Dialog.say("Tentacle", "I'm Tentacle, of course!", "Lime");
      }),
      new DialogChoice("Nevermind", async () => {
        await SAGE.Dialog.say("Tentacle", "Fine, be like that!", "Lime");
        SAGE.Dialog.end();
      })
    ]);
  }

}

// sample delay code
//const wait = (n: number) => new Promise<void>(res => setTimeout(res, n))

