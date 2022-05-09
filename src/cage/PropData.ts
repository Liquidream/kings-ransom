import { Serialization } from "../utils/Serialization";

export class PropData implements Serialization<PropData> {
    constructor() { 
        // Anything?
    } 
    
    id: string = "";
    image: string = "";
    name: string = "";
    desc: string = "";
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    pickupable: boolean = false;
    visible: boolean = true;
    // Poss. event actions
    on_action: string = "";
        
    // public initialize(): void {
        //     // Anything?
    // }
    
    fromJSON(input: any) {
        this.id =  input.id;
        this.image =  input.image;
        this.name =  input.name;
        this.desc =  input.desc;
        this.x = Number(input.x);
        this.y = Number(input.y);
        this.width = Number(input.width);
        this.height = Number(input.height);        
        if (input.pickupable) { // only parse if present (else will always = false)
            this.pickupable = input.pickupable === "true"; // https://bobbyhadz.com/blog/typescript-convert-string-to-boolean#convert-a-string-to-a-boolean-in-typescript
        }
        if (input.visible) { // only parse if present (else will always = false)
            this.visible = input.visible === "true"; // https://bobbyhadz.com/blog/typescript-convert-string-to-boolean#convert-a-string-to-a-boolean-in-typescript
        }
        // Event actions
        this.on_action =  input.on_action;
        
        return this;
    }

    toJSON(): any {
        return this;
    }

    // serialize(): string {
    //     return JSON.stringify(this);
    // }
}
