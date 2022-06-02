
// 
// https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line/47480429#47480429

//import { ListenerFn } from "eventemitter3";
import { SAGE } from "../Manager";

export class Script {
   // public constructor() {
   // }

   //private interactResolve!: ListenerFn;
   //private interactPromise!: Promise<void>;
   
   public initialize(): void {
      // Anything?
      //SAGE.Events.on("sceneinteract", this.onSceneInteract, this);
   }

   
   
   public wait(seconds: number): Promise<void> {
      return new Promise<void>(res => setTimeout(res, seconds * 1000))
   }

   // Help from @mkantor on TS Discord
   // https://www.typescriptlang.org/play?ssl=14&ssc=2&pln=5&pc=1#code/GYVwdgxgLglg9mABAdwIYygCgM4FMIIAm2AXImCALYBGuATgJRkAKdclMeAPAG5wyEAfIgDeAKESS6uKCDpIwuZIlbtOuXvyGZp2RAF5heKABUYlXHBBZdAGkR4CYYogBUiAIwAGHwwYBuMQBfMTFQSFgEFHQoADE4OgBpXABPAAddbEwmFTYObj4BYXFJSQlS6Vl5ciVctQKtQR1cPUNRctLS8Oh4JARk9Mzs9s7RipbswLGxwjgIKlwwKAA6aUo4HlwAUU2lgBlOKEX6TAByAGtUjJbsU-t+q8yAjtGQ6cRZ+Ysl5dRCQh2iygB2wR0UdDOl0GNzuiAe0Ow2GenSCzxCYlQ2BSkEQ3UiSDo4GGJVKTmwcAANrhlhS4ABzM4AeUguEQIDSUVQiFgFmWfNOyNKqDQGDq+WpdFQEFwmAA2iK4gkBtdEdl7ArMABmBgAXUFkjJlOptIZpxMAAt6KyKTBNoREFyMjAWXzlgKpkKFWL1KspTL5TF4klHjc1dEMFrdWjQoSwJMgA

   public waitSkippable(seconds: number): Promise<void> {
      const timedPromise = new Promise<void>(res => setTimeout(res, seconds * 1000))
      return Promise.race([timedPromise, this.waitForSkip()])
   }
   

   private waitForSkip(): Promise<void> {    
      return new Promise<void>(res => {
         function onSkip() {
            res();
            SAGE.Events.removeListener("sceneinteract", onSkip);
            //document.removeEventListener('keypress', onSkip);
         }
         SAGE.Events.on("sceneinteract", onSkip, this);
      });
   }
}