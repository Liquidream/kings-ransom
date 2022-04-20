import { Scene } from "./Scene";



export class World {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    public static title: string | undefined;
    public static scenes: Array<Scene> = [];

    public static initialize(input:any): void {
        
        World.deserialize(input);

        //World.scenes[0] = new Scene();
    }

    private static deserialize(input: any) {
        World.title = input.title;
        for(let scene of input.scenes){
            World.scenes.push(new Scene().deserialize(scene))
        }
    }
}
