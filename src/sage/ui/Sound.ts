import { IMediaInstance, sound } from "@pixi/sound";
import { Tween } from "tweedle.js";

export class Sound {
  public constructor() {
    //   
  }

  public play(soundName: string) {
    this.playCore(soundName, false);
  }

  public playLoop(soundName: string, fadeIn: boolean) {
    if (fadeIn) {
      const sfx = sound.play(soundName, { loop: true, volume: 0 }) as IMediaInstance
      new Tween(sfx).to({ volume: 1 }, 500).start()
    } 
    else {
      this.playCore(soundName, true);
    }    
  }

  public stop(soundName: string, fadeOut: boolean) {
    if (fadeOut) {
      const sfx = sound.find(soundName)
      new Tween(sfx).to({ volume: 0 }, 500).start()
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