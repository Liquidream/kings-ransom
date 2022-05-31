import { sound, SoundLibrary } from "@pixi/sound";
import { Tween } from "tweedle.js";

export class Sound {
  public constructor() {
    //   
  }

  public get soundLibrary(): SoundLibrary {
    return sound;
  }

  public play(soundName: string) {
    this.playCore(soundName, false);
  }

  public playLoop(soundName: string, fadeIn: boolean) {
    //fadeIn = false
    if (fadeIn) {
      const sfx = sound.find(soundName)
      sfx.volume = 0              // Doing this in one hit doesn't work??? (stays 0 volume)
      sfx.play({ loop: true })    // 
      new Tween(sfx).to({ volume: 1 }, 1000).start()
    } 
    else {
      this.playCore(soundName, true);
    }    
  }

  public stop(soundName: string, fadeOut: boolean) {
    //fadeOut = false
    if (fadeOut) {
      const sfx = sound.find(soundName)
      new Tween(sfx).to({ volume: 0 }, 1000).start()
        .onComplete( ()=> { 
          sound.stop(soundName);
        });
    } 
    else {
      sound.stop(soundName);
    }    
  }
  
  public toggleMute() {
    sound.toggleMuteAll();
  }



  private playCore(soundName: string, loop: boolean) {
    sound.play(soundName, { loop: loop });
  }
}