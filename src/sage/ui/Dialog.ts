//import { Sound } from "@pixi/sound";
//import { IMediaInstance } from "@pixi/sound";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { SAGE } from "../../Manager";

export class Dialog {
    // "constants" 
    // (perhaps overridable in config?)
    CHARS_PER_SEC = 15;
    MIN_DURATION_SEC = 1.5;
    MAX_DURATION_SEC = 7;
    BACKGROUND_MARGIN = 20;

    private dialogContainer!: Container | null;
    private dialogBackground!: Graphics | null;
    private dialogText!: Text | null;
    private speakerCols: { [id: string]: string; } = {};
    private dialogSoundName!: string;



    // poss options
    // - https://github.com/fireveined/pixi-flex-layout
    
    public constructor() {
        //
        
        //SAGE.Events.on("sceneinteract", this.onSceneInteract, this);
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

    public async say(speaker: string, message: string, speakerCol?: string, soundName?: string, durationInSecs?: number): Promise<void> {
        // Show dialog for speaker        
        return this.showMessageCore( { 
            type: DialogType.DialogExt,
            speaker: speaker, 
            message: message,
            col: speakerCol,
            soundName: soundName,
            durationInSecs: durationInSecs })
    }
        
    public async showMessage(message: string, type?: DialogType, durationInSecs?: number): Promise<void> {
        // Show a white message
        return this.showMessageCore( { 
            type: type,
            message: message,
            col: "#fff", 
            durationInSecs: durationInSecs })
    }

    public async showErrorMessage(errorMessage: string): Promise<void> {
        // Show a red message
        return this.showMessageCore( { 
            message: errorMessage,
            col: "#ff0000" })
    }

    public clearMessage(): void {
        if (this.dialogContainer) {            
            // SAGE.app.stage.removeChild(this.dialogBackground);
            // SAGE.app.stage.removeChild(this.dialogText);
            SAGE.app.stage.removeChild(this.dialogContainer); 
        }
        this.dialogText = null;
        this.dialogBackground = null;
        this.currentDialogType = null;
        this.dialogContainer = null;
    }

    private async showMessageCore(options: { 
        type?: DialogType, message: string, speaker?: string, col?: string, soundName?: string, durationInSecs?: number }): Promise<void> {
    //private async showMessageCore(message: string, col: string, type: DialogType = DialogType.DialogInt, durationInSecs?: number): Promise<void> {
        let waitDuration = 0;
        // Are we already displaying something? 
        if (this.dialogBackground) {
            // If so, is incoming message low priority? (e.g. hover)
            if (options.type === DialogType.Caption) {
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
        // https://www.gameuidatabase.com/index.php?&scrn=162&set=1&tag=67
        // ---
        // https://www.capitalcaptions.com/services/subtitle-services-2/capital-captions-standard-subtitling-guidelines/
        // https://uxdesign.cc/a-guide-to-the-visual-language-of-closed-captions-and-subtitles-2fda5fa2a325
        // https://www.3playmedia.com/learn/popular-topics/closed-captioning/
        // https://www.w3.org/WAI/media/av/captions/
        // https://bbc.github.io/subtitle-guidelines/

        // if both speaker AND col passed...
        if (options.col && options.speaker) {
            // ...remember for future use!
            this.speakerCols[options.speaker.toUpperCase()] = options.col;
        }

        // if speaker col wasn't passed...
        // ...see whether it's been prev defined
        if (options.col === undefined 
                && options.speaker
                && this.speakerCols[options.speaker.toUpperCase()]) {
            options.col = this.speakerCols[options.speaker.toUpperCase()]
        }

        // Subtitle/caption/speech
        const styly: TextStyle = new TextStyle({
            align: "center",
            fill: options.col || "#fff",
            fontSize: 47,
            strokeThickness: 6,
            lineJoin: "round",
            wordWrap: true,
            wordWrapWidth: SAGE.width / 2,
        });
        // Spoken by..?
        if (options.speaker) {
            options.message = `[${options.speaker.toUpperCase()}]\n${options.message}`;
        }
        const newDialogText = new Text(options.message, styly); // Text supports unicode!
        newDialogText.x = SAGE.width / 2;
        newDialogText.y = SAGE.height - 88 - this.BACKGROUND_MARGIN;
        newDialogText.anchor.set(0.5);
        // newDialogText.x = SAGE.width / 2;
        // newDialogText.y = SAGE.height - 88 - this.BACKGROUND_MARGIN;
        // .text = "This is expensive to change, please do not abuse";
        //this.dialogTextList.push(newDialogText);
        this.dialogText = newDialogText;
        
        // Background for all dialog
        this.dialogBackground = new Graphics();
        this.dialogBackground.beginFill(0x0);
        this.dialogBackground.alpha = 0.6;
        this.dialogBackground.drawRect(
            newDialogText.x, 
            newDialogText.y, 
            newDialogText.width + (4*this.BACKGROUND_MARGIN),
            newDialogText.height + (2*this.BACKGROUND_MARGIN));
        this.dialogBackground.endFill();
        // Make a center point of origin (anchor)
        this.dialogBackground.pivot.set(this.dialogBackground.width/2, this.dialogBackground.height/2);

        this.dialogContainer = new Container();
        this.dialogContainer.addChild(this.dialogBackground);
        this.dialogContainer.addChild(this.dialogText);
        SAGE.app.stage.addChild(this.dialogContainer);

        // Set here, so if another dialog comes before this expires, it'll be removed
        //this.currentDialogText = newDialogText;
        this.currentDialogType = options.type ?? DialogType.DialogInt;        
        
        // Sound file?
        //let instance: IMediaInstance
        if (options.soundName) {
            this.dialogSoundName = options.soundName;
            SAGE.Sound.play(this.dialogSoundName)
            //instance = SAGE.Sound.play(this.dialogSoundName) as IMediaInstance;
        }

        // ---------------------------------------
        // How long to display?
        //
        if (options.durationInSecs) {
            // Duration specified, so use it
            waitDuration = options.durationInSecs;
        }
        else if (options.soundName) {
            this.dialogSoundName = options.soundName;
            const sound = SAGE.Sound.soundLibrary.find(this.dialogSoundName);
            // display dialog until sound file finishes (or is stopped)
            waitDuration = sound?.duration;
        }
        else {
            // calc display duration (1 sec for every 7 chars, approx.)        
            waitDuration = clamp(options.message.length / this.CHARS_PER_SEC, this.MIN_DURATION_SEC, this.MAX_DURATION_SEC);
        }
        //console.log(`Duration = ${waitDuration}`)
        
        // Wait for duration
        // ...or leave on display (e.g. if duration = -1)
        if (waitDuration > 0) {
            // wait for calc'd duration
            await SAGE.Script.waitSkippable(waitDuration);
            //await SAGE.Script.wait(waitDuration);

            // Remove message now duration over
            // - (Unlike counter method, this could create a bug where msg changed mid-show & thread clash?)            
            // Only clear dialog if we're the last message 
            // (could have been an overlap)
            if (newDialogText === this.dialogText) {
                this.clearMessage();

                const sound = SAGE.Sound.soundLibrary.find(this.dialogSoundName);
                if (sound && sound.isPlaying) sound.stop();
                //SAGE.Sound.stop(this.dialogSoundName);
            }

            // Add a gap at end (so dialog not too close together)
            await SAGE.Script.wait(0.5);
        }
    }

    //private onSceneInteract() {
        // console.log(`TODO: skip dialog`);
    //}
    
} 

export enum DialogType {
    Unknown,
    Caption,    // Tooltips, shown on hover (currently only for mouse input)
    DialogInt,  // Descriptions, thoughts, reactions, etc.
    DialogExt   // Talking & interacting with other characters (actors)
}

// Clamp number between two values with the following line:
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);