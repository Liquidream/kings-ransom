import { Scene } from "./Scene";

export class World {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    private static scenes: Array<Scene>;

    public static initialize(): void {
        // Anything?

        World.scenes[0] = new Scene();
    }

    
    // public static showMessage(message: string): void {
    //     const styly: TextStyle = new TextStyle({
    //         align: "center",
    //         fill: "#fff",
    //         fontSize: 48,
    //         dropShadow: true
    //     });
    //     this.currentDialogText = new Text(message, styly); // Text supports unicode!
    //     this.currentDialogText.anchor.set(0.5);
    //     this.currentDialogText.x = Manager.width / 2;
    //     this.currentDialogText.y = Manager.height - 75;
    //     //texty.text = "This is expensive to change, please do not abuse";
        
    //     Manager.app.stage.addChild(this.currentDialogText);
    // }
    
    // public static clearMessage(): void {
    //     Manager.app.stage.removeChild(this.currentDialogText);
    //     //this.currentDialogText = null;
    // }
}
