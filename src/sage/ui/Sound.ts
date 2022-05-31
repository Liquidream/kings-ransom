import { sound } from "@pixi/sound";

export class Sound {
  public constructor() {
    //   
  }

  public play(soundName: string) {
    this.playCore(soundName, false);
  }

  public playLoop(soundName: string) {
    this.playCore(soundName, true);
  }

  public stop(soundName: string) {
    sound.stop(soundName);
  }
  
  public toggleMute() {
    sound.toggleMuteAll();
  }



  private playCore(soundName: string, loop: boolean) {
    sound.play(soundName, { loop: loop });  
  }
}