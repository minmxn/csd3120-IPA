import { Engine, Scene } from "babylonjs";
export declare class App {
    private engine;
    private canvas;
    constructor(engine: Engine, canvas: HTMLCanvasElement);
    createScene(): Promise<Scene>;
    CreateSkybox(scene: Scene): void;
    CreateDebugInspector(scene: Scene): void;
    LoadModel(scene: Scene, str: string): void;
}
