import { Text, TextStyle } from "pixi.js";
import { SAGE } from "../Manager";
//import { Script } from "./Script";

export class Dialog {
    // "constants" 
    // (perhaps overridable in config?)
    CHARS_PER_SEC: number = 10;
    MIN_DURATION_SEC: number = 2;
    MAX_DURATION_SEC: number = 7;

    // public constructor() {
    // }
    
    private currentDialogText!: Text | null;
    
    // public initialize(): void {
    //     // Anything?
    // }
    
    public update() {
        // Anything?
        // (was prev used when using display counter, rather than async/timer)
    }
        
    public async showMessage(message: string): Promise<void> {
        // Show a white message
        await this.showMessageCore(message, "#fff")
    }

    public async showErrorMessage(errorMessage: string): Promise<void> {
        // Show a white message
        await this.showMessageCore(errorMessage, "#ff0000")
    }

    public clearMessage(): void {
        if (this.currentDialogText) SAGE.app.stage.removeChild(this.currentDialogText);        
        this.currentDialogText = null;
    }

    private async showMessageCore(message: string, col: string): Promise<void> {
        // Are we already showing a message? If so, clear it
        if (this.currentDialogText) this.clearMessage()
        
        // Useful info:
        // https://www.3playmedia.com/learn/popular-topics/closed-captioning/
        // https://uxdesign.cc/a-guide-to-the-visual-language-of-closed-captions-and-subtitles-2fda5fa2a325
        // https://www.capitalcaptions.com/services/subtitle-services-2/capital-captions-standard-subtitling-guidelines/
        // https://www.w3.org/WAI/media/av/captions/

        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: col || "#fff",
            fontSize: 47,
            strokeThickness: 6,
            lineJoin: "round",
        });
        this.currentDialogText = new Text(message, styly); // Text supports unicode!
        this.currentDialogText.anchor.set(0.5);
        this.currentDialogText.x = SAGE.width / 2;
        this.currentDialogText.y = SAGE.height - 75;
        //texty.text = "This is expensive to change, please do not abuse";
        
        SAGE.app.stage.addChild(this.currentDialogText);
        
        // calc display duration (1 sec for every 7 chars, approx.)
        let duration = clamp(message.length / this.CHARS_PER_SEC, this.MIN_DURATION_SEC, this.MAX_DURATION_SEC);
        // wait for calc'd duration
        await SAGE.Script.wait(duration);
        // Remove message now duration over
        // TODO: Unlike counter method, this could create a bug where msg changed mid-show & thread clash?
        SAGE.app.stage.removeChild(this.currentDialogText);
    }
    
}

// Clamp number between two values with the following line:
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);