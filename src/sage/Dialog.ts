import { Text, TextStyle } from "pixi.js";
import { SAGE } from "../Manager";

export class Dialog {
    public constructor() { /*this class is purely static. No constructor to see here*/ }
    
    private currentDialogText!: Text;
    
    public displayCounter: number = 0;

    public initialize(): void {
        // Anything?
    }
    
    public update() {
        // Update display duration
        // TODO: See whether this could/should be done as a timer or something instead?
        if (this.displayCounter > 0) {
            this.displayCounter--;
            //console.log(Dialog.displayCounter)
        }
        if (this.displayCounter <= 0) {
            this.clearMessage()
        }
    }
        
    public showMessage(message: string): void {
        // Show a white message
        this.showMessageCore(message, "#fff")
    }

    public showErrorMessage(errorMessage: string): void {
        // Show a white message
        this.showMessageCore(errorMessage, "#ff0000")
    }

    public clearMessage(): void {
        SAGE.app.stage.removeChild(this.currentDialogText);
        //this.currentDialogText = null;
    }

    private showMessageCore(message: string, col: string): void {
        // Are we already showing a message? If so, clear it
        if (this.displayCounter > 0) {
            this.clearMessage()
        }

        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: col || "#fff",
            fontSize: 48,
            strokeThickness: 6,
            lineJoin: "round",
        });
        this.currentDialogText = new Text(message, styly); // Text supports unicode!
        this.currentDialogText.anchor.set(0.5);
        this.currentDialogText.x = SAGE.width / 2;
        this.currentDialogText.y = SAGE.height - 75;
        //texty.text = "This is expensive to change, please do not abuse";
        this.displayCounter = 3 * SAGE.fps; 
        SAGE.app.stage.addChild(this.currentDialogText);
    }
    
}
