
// 
// https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line/47480429#47480429

export class Script {
   // public constructor() {
   // }
   
   // public initialize(): void {
   //    // Anything?
   // }


public wait(n: number): Promise<void> {
   return new Promise<void>(res => setTimeout(res, n))
}

//const delay = (n: number) => new Promise<void>(res => setTimeout(res, n))

/*
  onTreeAction = async () => {    
     SAGE.Dialog.showMessage('You give the tree a push...');
     await delay(3000);
     SAGE.Dialog.showMessage('A Key fell out of the tree');
  }
 */

}