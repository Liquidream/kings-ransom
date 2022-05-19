import { Text, TextStyle } from "pixi.js";
import { SAGE } from "../Manager";
//import { Script } from "./Script";

export class Dialog {
    // "constants" 
    // (perhaps overridable in config?)
    CHARS_PER_SEC = 15;
    MIN_DURATION_SEC = 1.5;
    MAX_DURATION_SEC = 7;

    // public constructor() {
    // }
    
    public currentDialogText!: Text | null;
    public currentDialogType!: DialogType | null;
    
    // public initialize(): void {
    //     // Anything?
    // }
    
    public update() {
        // Anything?
        // (was prev used when using display counter, rather than async/timer)
    }
        
    public async showMessage(message: string, type?: DialogType, durationInSecs?: number): Promise<void> {
        // Show a white message
        return this.showMessageCore(message, "#fff", type, durationInSecs)
    }

    public async showErrorMessage(errorMessage: string): Promise<void> {
        // Show a white message
        return this.showMessageCore(errorMessage, "#ff0000")
    }

    public clearMessage(): void {
        if (this.currentDialogText) SAGE.app.stage.removeChild(this.currentDialogText);        
        this.currentDialogText = null;
        this.currentDialogType = null;
    }

    private async showMessageCore(message: string, col: string, type: DialogType = DialogType.Description, durationInSecs?: number): Promise<void> {
        let waitDuration = 0;
        // Are we already showing a message? 
        if (this.currentDialogText) {
            // If so, is incoming message low priority? (e.g. hover)
            if (type === DialogType.NameOnHover) {
                // Abort, leave current dialog up, as is higher priority
                // (player can always hover again, else may lose important message)
                return;
            }
            // clear existing message
            this.clearMessage()
        }
        
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
            wordWrap: true,
            wordWrapWidth: SAGE.width,
        });
        const newDialogText = new Text(message, styly); // Text supports unicode!
        newDialogText.anchor.set(0.5);
        newDialogText.x = SAGE.width / 2;
        newDialogText.y = SAGE.height - 75;
        //texty.text = "This is expensive to change, please do not abuse";
        
        SAGE.app.stage.addChild(newDialogText);

        // Set here, so if another dialog comes before this expires, it'll be removed
        this.currentDialogText = newDialogText;
        this.currentDialogType = type;
        
        // How long to display?
        if (durationInSecs) {
            // Duration specified, so use it
            waitDuration = durationInSecs;
        }
        else {
            // calc display duration (1 sec for every 7 chars, approx.)        
            waitDuration = clamp(message.length / this.CHARS_PER_SEC, this.MIN_DURATION_SEC, this.MAX_DURATION_SEC);
        }        
        //console.log(`Duration = ${waitDuration}`)
        
        // Wait for duration
        // ...or leave on display (e.g. if duration = -1)
        if (waitDuration > 0) {
            // wait for calc'd duration
            await SAGE.Script.wait(waitDuration);
            // Remove message now duration over
            // TODO: Unlike counter method, this could create a bug where msg changed mid-show & thread clash?
            SAGE.app.stage.removeChild(newDialogText);
            
            // Only clear dialog if we're the last message 
            // (could have been an overlap)
            if (newDialogText === this.currentDialogText) {
                this.clearMessage();
            }
        }
    }
    
}

export enum DialogType {
    Description,
    NameOnHover,
    Dialog,
}

// Clamp number between two values with the following line:
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);