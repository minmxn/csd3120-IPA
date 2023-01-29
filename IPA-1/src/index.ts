import { Engine } from "babylonjs"
import { App } from './app'


// console.log('hello xr');

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d');
// ctx.font = '50px Arial';
// ctx.fillText('Hello XR', 50, 50)

const engine = new Engine(canvas, true)
const app =  new App(engine)


const scene = app.createXRScene(canvas,null)
engine.runRenderLoop(() => {
    scene.render();
})

// import {Engine, MeshBuilder,Scene} from 'babylonjs';
// import {AdvancedDynamicTexture, TextBlock} from 'babylonjs-gui';

// export function createXRScene(canvasID : string, authoringData:{[dataType:string]:{[key:string]:any}})
// {
//     const engine = new Engine(<HTMLCanvasElement>document.getElementById(canvasID),true);
//     const scene = new Scene(engine);
//     scene.createDefaultCameraOrLight();

//     const sphere = MeshBuilder.CreateSphere('sphere',{diameter:1.2},scene);
//     sphere.position.y = 1;
//     sphere.position.z = 5;

//     const helloPlane = MeshBuilder.CreatePlane('hello plane',{size:10});
//     helloPlane.position.y = 0;
//     helloPlane.position.z = 5;

//     const helloTexture = AdvancedDynamicTexture.CreateForMesh(helloPlane);
//     const helloText = new TextBlock('hello');
//     helloText.text = 'Seet Min Yi\'s XR IPA-1';
//     helloText.color = 'pink';
//     helloText.fontSize = 30;
//     helloTexture.addControl(helloText);
        
//     const xr = scene.createDefaultXRExperienceAsync({
//         uiOptions:{
//             sessionMode:'immersive-ar'
//         }
//     });
    
//     engine.runRenderLoop(()=>{
//         scene.render();
//     })

//     // only for debugging
//     //(window as any).xr = xr;
// }

//// for testing
// createXRScene('renderCanvas',null);

// // import {Engine, MeshBuilder,Scene} from 'babylonjs';
// import { Engine, Scene, ArcRotateCamera, HemisphericLight, StandardMaterial, Texture, MeshBuilder, Vector3 } from 'babylonjs';
// import {AdvancedDynamicTexture, TextBlock} from 'babylonjs-gui';

// export function createXRScene(canvasID: string) {
//     const engine = new Engine(<HTMLCanvasElement>document.getElementById(canvasID), true);
//     const scene = new Scene(engine);
//     //scene.createDefaultCameraOrLight();

//     // Create a sphere for each atom and position them on the virtual table
//     const hydrogen = MeshBuilder.CreateSphere('hydrogen', { diameter: 0.5 }, scene);
//     hydrogen.position.y = 1;
//     hydrogen.position.x = -1;
//     hydrogen.position.z = 5;

//     const helium = MeshBuilder.CreateSphere('helium', { diameter: 0.6 }, scene);
//     helium.position.y = 1;
//     helium.position.x = 1;
//     helium.position.z = 5;

//     const carbon = MeshBuilder.CreateSphere('carbon', { diameter: 0.7 }, scene);
//     carbon.position.y = 1;
//     carbon.position.x = 0;
//     carbon.position.z = 5;

//     const helloPlane = MeshBuilder.CreatePlane('hello plane',{size:10});
//     helloPlane.position.y = hydrogen.position.y - 0.5;
//     helloPlane.position.z = hydrogen.position.z;
//     helloPlane.position.x = hydrogen.position.x + 1;

//     const helloTexture = AdvancedDynamicTexture.CreateForMesh(helloPlane);
//     const helloText = new TextBlock('hello');
//     helloText.text = 'hydrogen   helium   carbon';
//     helloText.color = 'white';
//     helloText.fontSize = 30;
//     helloTexture.addControl(helloText);

//     const camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), scene);
//     camera.setPosition(new Vector3(0, 2, -10));

//     const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
//     light.intensity = 0.7;

//     const floor = MeshBuilder.CreateGround("ground", {width: 20, height: 20, subdivisions: 4}, scene);
//     const material = new StandardMaterial("floorMaterial", scene);
//     material.diffuseTexture = new Texture("https://www.example.com/textures/floor.jpg", scene);
//     floor.material = material;

//     const wall1 = MeshBuilder.CreateBox("wall1", {width: 20, height: 8, depth: 0.1}, scene);
//     wall1.position.z = 10;
//     const wall2 = MeshBuilder.CreateBox("wall2", {width: 20, height: 8, depth: 0.1}, scene);
//     wall2.position.z = -10;
//     const wall3 = MeshBuilder.CreateBox("wall3", {width: 20, height: 8, depth: 0.1}, scene);
//     wall3.position.x = -10;
//     wall3.rotation.y = Math.PI / 2;
//     const wall4 = MeshBuilder.CreateBox("wall4", {width: 20, height: 8, depth: 0.1}, scene);
//     wall4.position.x = 10;
//     wall4.rotation.y = Math.PI / 2;

//     const furniture = MeshBuilder.CreateBox("desk", {width: 4, height: 2, depth: 2}, scene);
//     furniture.position.x = -6;

//     // Choose either a virtual environment or a live video feed for AR
//     const xr = scene.createDefaultXRExperienceAsync({
//         uiOptions: {
//             sessionMode: 'immersive-ar'
//         }
//     });

//     engine.runRenderLoop(() => {
//         scene.render();
//     });
// }

// // For testing
// createXRScene('renderCanvas');