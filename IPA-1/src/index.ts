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
//     helloText.text = 'Min Yi\'s XR IPA-1';
//     helloText.color = 'purple';
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

// // for testing
// createXRScene('renderCanvas',null);

import {Engine, MeshBuilder,Scene} from 'babylonjs';

export function createVirtualTableScene(canvasID: string) {
    const engine = new Engine(<HTMLCanvasElement>document.getElementById(canvasID), true);
    const scene = new Scene(engine);
    scene.createDefaultCameraOrLight();

    // Create a sphere for each atom and position them on the virtual table
    const hydrogen = MeshBuilder.CreateSphere('hydrogen', { diameter: 0.5 }, scene);
    hydrogen.position.y = 1;
    hydrogen.position.x = -1;
    hydrogen.position.z = 5;

    const helium = MeshBuilder.CreateSphere('helium', { diameter: 0.6 }, scene);
    helium.position.y = 1;
    helium.position.x = 1;
    helium.position.z = 5;

    const carbon = MeshBuilder.CreateSphere('carbon', { diameter: 0.7 }, scene);
    carbon.position.y = 1;
    carbon.position.x = 0;
    carbon.position.z = 5;

    // Choose either a virtual environment or a live video feed for AR
    const xr = scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar'
        }
    });

    engine.runRenderLoop(() => {
        scene.render();
    });
}

// For testing
createVirtualTableScene('renderCanvas');