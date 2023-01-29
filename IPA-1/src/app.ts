import { Engine, Scene, ArcRotateCamera, HemisphericLight, StandardMaterial, Texture, MeshBuilder, Vector3, PointerEventTypes, ActionManager, ExecuteCodeAction } from 'babylonjs';
import {AdvancedDynamicTexture, TextBlock} from 'babylonjs-gui';

export class App{
    private engine: Engine;
    private canvas: HTMLCanvasElement;

    constructor(engine: Engine)
    {
        this.engine = engine;
        console.log('app is running')
    }
    createXRScene(canvasID: HTMLCanvasElement,authoringData)
    {
        this.canvas = canvasID
        
        const scene = new Scene(this.engine); 
        //scene.createDefaultLight()

        //Create a sphere for each atom and position them on the virtual table
        const hydrogen = MeshBuilder.CreateSphere('hydrogen', { diameter: 0.5 }, scene);
        hydrogen.position.y = 1;
        hydrogen.position.x = -1;
        hydrogen.position.z = 5;

        hydrogen.actionManager = new ActionManager(scene);
hydrogen.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, event => {
    hydrogen.isPickable = false;
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case PointerEventTypes.POINTERMOVE:
                hydrogen.position.x += pointerInfo.event.movementX * 0.01;
                hydrogen.position.y -= pointerInfo.event.movementY * 0.01;
                break;
            case PointerEventTypes.POINTERUP:
                hydrogen.isPickable = true;
                scene.onPointerObservable.clear();
                break;
        }
    });
}));

        const helium = MeshBuilder.CreateSphere('helium', { diameter: 0.6 }, scene);
        helium.position.y = 1;
        helium.position.x = 1;
        helium.position.z = 5;

        const carbon = MeshBuilder.CreateSphere('carbon', { diameter: 0.7 }, scene);
        carbon.position.y = 1;
        carbon.position.x = 0;
        carbon.position.z = 5;

        const helloPlane = MeshBuilder.CreatePlane('hello plane',{size:10});
        helloPlane.position.y = hydrogen.position.y - 0.5;
        helloPlane.position.z = hydrogen.position.z;
        helloPlane.position.x = hydrogen.position.x + 1;

        const helloTexture = AdvancedDynamicTexture.CreateForMesh(helloPlane);
        const helloText = new TextBlock('hello');
        helloText.text = 'hydrogen   helium   carbon';
        helloText.color = 'white';
        helloText.fontSize = 30;
        helloTexture.addControl(helloText);

        const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
        camera.setPosition(new Vector3(0, 2, -10));

        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        const floor = MeshBuilder.CreateGround("ground", {width: 20, height: 20, subdivisions: 4}, scene);
        const material = new StandardMaterial("floorMaterial", scene);
        material.diffuseTexture = new Texture("https://www.example.com/textures/floor.jpg", scene);
        floor.material = material;

        const wall1 = MeshBuilder.CreateBox("wall1", {width: 20, height: 8, depth: 0.1}, scene);
        wall1.position.z = 10;
        const wall2 = MeshBuilder.CreateBox("wall2", {width: 20, height: 8, depth: 0.1}, scene);
        wall2.position.z = -10;
        const wall3 = MeshBuilder.CreateBox("wall3", {width: 20, height: 8, depth: 0.1}, scene);
        wall3.position.x = -10;
        wall3.rotation.y = Math.PI / 2;
        const wall4 = MeshBuilder.CreateBox("wall4", {width: 20, height: 8, depth: 0.1}, scene);
        wall4.position.x = 10;
        wall4.rotation.y = Math.PI / 2;

        const furniture = MeshBuilder.CreateBox("desk", {width: 4, height: 2, depth: 2}, scene);
        furniture.position.x = -6;

        const cam : ArcRotateCamera = new ArcRotateCamera( "camera", -Math.PI/2, Math.PI/2, 8, Vector3.Zero(), scene)
        cam.attachControl(this.canvas, true)

        const xr = scene.createDefaultXRExperienceAsync({
            uiOptions: { 
                sessionMode: 'immersive-vr'
            }
        })

        return scene
    }

}