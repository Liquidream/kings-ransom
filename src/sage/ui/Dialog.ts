import { Graphics, Text, TextStyle } from "pixi.js";
import { SAGE } from "../../Manager";

export class Dialog {
    // "constants" 
    // (perhaps overridable in config?)
    CHARS_PER_SEC = 15;
    MIN_DURATION_SEC = 1.5;
    MAX_DURATION_SEC = 7;
    BACKGROUND_MARGIN = 20;

    private dialogBackground!: Graphics | null;
    //private dialogContainer!: Container | null;
    private dialogTextList: Array<Text> = [];

    // poss options
    // - https://github.com/fireveined/pixi-flex-layout
    
    public constructor() {
        //
        
    }
    
    //public currentDialogText!: Text | null;
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
        if (this.dialogBackground) {
            SAGE.app.stage.removeChild(this.dialogBackground);
            SAGE.app.stage.removeChild(this.dialogTextList[0]);
            this.dialogTextList.pop();
            //SAGE.app.stage.removeChild(this.dialogContainer);
        }
        this.dialogBackground = null;
        //this.dialogContainer = null;
        this.currentDialogType = null;
    }

    private async showMessageCore(message: string, col: string, type: DialogType = DialogType.Description, durationInSecs?: number): Promise<void> {
        let waitDuration = 0;
        // Are we already displaying something? 
        if (this.dialogBackground) {
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
        // https://www.gamedeveloper.com/audio/how-to-do-subtitles-well-basics-and-good-practices
        // https://80.lv/articles/10-golden-rules-on-subtitles-for-games/
        // https://gameanalytics.com/blog/adding-subtitles-to-your-mobile-game-dos-and-donts/
        // https://www.gamedeveloper.com/audio/subtitles-increasing-game-accessibility-comprehension
        // https://gritfish.net/assets/Documents/Best-practice-Game-Subtitles.pdf
        // ---
        // https://www.capitalcaptions.com/services/subtitle-services-2/capital-captions-standard-subtitling-guidelines/
        // https://uxdesign.cc/a-guide-to-the-visual-language-of-closed-captions-and-subtitles-2fda5fa2a325
        // https://www.3playmedia.com/learn/popular-topics/closed-captioning/
        // https://www.w3.org/WAI/media/av/captions/
        // https://bbc.github.io/subtitle-guidelines/


        // Subtitle/caption
        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: col || "#fff",
            fontSize: 47,
            strokeThickness: 6,
            lineJoin: "round",
            wordWrap: true,
            wordWrapWidth: SAGE.width / 2,
        });
        const newDialogText = new Text(message, styly); // Text supports unicode!
        newDialogText.x = SAGE.width / 2;
        newDialogText.y = SAGE.height - 88 - this.BACKGROUND_MARGIN;
        newDialogText.anchor.set(0.5);
        // newDialogText.x = SAGE.width / 2;
        // newDialogText.y = SAGE.height - 88 - this.BACKGROUND_MARGIN;
        // .text = "This is expensive to change, please do not abuse";
        this.dialogTextList.push(newDialogText);
        
        // Background for all dialog
        this.dialogBackground = new Graphics();
        this.dialogBackground.beginFill(0x0);
        this.dialogBackground.alpha = 0.6;
        this.dialogBackground.drawRect(
            newDialogText.x, 
            newDialogText.y, 
            newDialogText.width + (2*this.BACKGROUND_MARGIN),
            newDialogText.height + (2*this.BACKGROUND_MARGIN));
        this.dialogBackground.endFill();
        // Make a center point of origin (anchor)
        this.dialogBackground.pivot.set(this.dialogBackground.width/2, this.dialogBackground.height/2);

        // this.dialogContainer.addChild(newDialogText);
        // SAGE.app.stage.addChild(this.dialogContainer);

        SAGE.app.stage.addChild(this.dialogBackground);
        SAGE.app.stage.addChild(this.dialogTextList[0]);

        // Set here, so if another dialog comes before this expires, it'll be removed
        //this.currentDialogText = newDialogText;
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
            SAGE.app.stage.removeChild(this.dialogBackground);
            SAGE.app.stage.removeChild(this.dialogTextList[0]);
            
            // Only clear dialog if we're the last message 
            // (could have been an overlap)
            if (newDialogText === this.dialogTextList[0]) {
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