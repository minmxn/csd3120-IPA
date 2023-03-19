import { Engine, Scene,ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh ,SceneLoader, HtmlElementTexture} from "babylonjs";
import 'babylonjs-loaders';
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture,TextBlock } from "babylonjs-gui";
import { App } from './app'


const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

const engine = new Engine(canvas, true);
const app = new App(engine, canvas);
const scenePromise = app.createScene();

scenePromise.then(scene => {
    app.Init();
    engine.runRenderLoop(()  => {
        scene.render();
        app.updateCollider();
    });
})

 // the canvas/window resize event handler
 window.addEventListener('resize', function () {
    engine.resize();
});