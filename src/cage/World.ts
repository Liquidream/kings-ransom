import { Scene } from "./Scene";

// interface Serializable<T> {
//     deserialize(input : Object) : T;
// }

export class World { //implements Serializable<World> {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    public static scenes: Array<Scene>;
    public static title: string | undefined;

    private static deserialize(input:any) {
        World.title = input.title;
        //return this;
    }

    public static initialize(input:any): void {
        
        World.deserialize(input);

        //World.scenes[0] = new Scene();
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
