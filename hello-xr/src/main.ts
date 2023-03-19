import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    MeshBuilder,
    Mesh,
    SceneLoader,
    HtmlElementTexture
  } from "babylonjs";
  import 'babylonjs-loaders';
  import "@babylonjs/loaders/glTF";
  import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
  import { App } from './app'
  
  // Get the canvas element
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  
  // Create a new BabylonJS engine
  const engine = new Engine(canvas, true);
  
  // Create a new App instance and create the scene
  const app = new App(engine, canvas);
  const scenePromise = app.createScene();
  
  // Once the scene has loaded, initialize the app and start rendering
  scenePromise.then(scene => {
    app.Init();
    engine.runRenderLoop(()  => {
      scene.render();
      app.updateCollider();
    });
  });
  
  // Resize the engine when the window size changes
  window.addEventListener('resize', function () {
    engine.resize();
  });
  