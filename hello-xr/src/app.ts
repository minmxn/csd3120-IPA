import { Engine, Scene,ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh ,SceneLoader, HtmlElementTexture, StandardMaterial, CubeTexture, PointerDragBehavior, UniversalCamera, PointLight, Color3, ActionManager, PhotoDome, WebXRFeatureName, MultiPointerScaleBehavior, AbstractMesh, WebXRDefaultExperience, WebXRFeaturesManager, WebXRMotionControllerTeleportation, TransformNode, UtilityLayerRenderer, FreeCamera, ExecuteCodeAction, GizmoManager} from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
import { TextPlane,TheSphere  } from "./components/meshes"
// get the canvas DOM element
/*
 this creates the XR scene
 @param canvas is the string ID to render the scene onto 
 @param authoringData is the dict of dict that contains info from xrauthor
*/
enum MovementMode {
    Teleportation,
    Walk
}
export class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;
    private scene:Scene
    colliders : Array<TheSphere> =[];
    private test:boolean=false
    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
    }

    async createScene() {
        this.scene = new Scene(this.engine);
        this.scene.actionManager = new ActionManager(this.scene)
        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        const cam =this.createCamera(this.scene);
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this.createLights(this.scene);
        //hello sphere
        var utilLayer = new UtilityLayerRenderer(this.scene);
        const H2Sphere = await TheSphere.CreateModel(new TheSphere("H2", {diameter: 1}, this.scene,utilLayer));
        H2Sphere.position.x=5;
        const O2Sphere = await TheSphere.CreateModel(new TheSphere("O2", {diameter: 1.5}, this.scene,utilLayer));
        const H2OSphere =  await TheSphere.CreateModel(new TheSphere('H2O', {diameter: 1.5}, this.scene,utilLayer));
        H2OSphere.position.x=-5;
        H2OSphere.position.y=1;
        this.colliders.push(H2OSphere)
        this.colliders.push(H2Sphere);
        this.colliders.push(O2Sphere);
        this.CreateSkybox(this.scene);//load skybox
        this.CreateDebugInspector(this.scene);//load Debug
        this.CreateTable(this.scene);
         //interactions
        const ground = MeshBuilder.CreateGround("ground", {width:30, height: 15}, this.scene)
        const ground2 = MeshBuilder.CreateGround("groundbottom", {width:50, height: 50}, this.scene)
        ground.position.set(0,-1.2,0)
        ground2.position.set(0,-10,0)
        const temp=new StandardMaterial("groundbottommat",this.scene);
        temp.diffuseColor = new Color3(0, 1, 1);
        ground2.material=temp;
        const table=this.scene.getMeshById('tableRoot')
        // here we add XR support
        const xr = this.scene.createDefaultXRExperienceAsync({
            uiOptions:{
                sessionMode:"immersive-vr"
            },
            optionalFeatures:true
        });
        const featureManager = (await xr).baseExperience.featuresManager
        console.log(WebXRFeaturesManager.GetAvailableFeatures())
        // locomotion teleport
        const movement = MovementMode.Teleportation;
        this.initLocomotion(movement, await xr, featureManager, [ground,ground2], this.scene);
        this.createCameraMovement(this.scene,cam);
         //window for debugging
        (window as any).xr = xr;
        // return the created scene
        return this.scene;
    }

    createCamera(scene: Scene)
    {
        const camera = new ArcRotateCamera('arcCamera', -1.50, 1.2, 15, Vector3.Zero(), scene)
        //const camera = new FreeCamera('arcCamera', new Vector3(-1.50, 1.2, 15), scene)
        //const camera = new UniversalCamera('uniCamera', new Vector3(0,0,-5), scene)
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.canvas, true)
        return camera;
    }
    createCameraMovement(scene:Scene,camera:ArcRotateCamera)
    {
        let ground_plane = scene.getMeshByName("ground");
        let ground_plane2 = scene.getMeshByName("groundbottom");
        let mouse_on_ground=false
        this.scene.actionManager.registerAction(
          new ExecuteCodeAction(
            ActionManager.OnPointerOverTrigger,
            function (ev) {
              let mesh_under_cursor = ev.meshUnderPointer.name;
              mouse_on_ground = true;
            }
          )
        );
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
              function (ev) {
                mouse_on_ground = false;
              }
            )
          );
          ground_plane.actionManager = this.scene.actionManager;
          ground_plane2.actionManager = this.scene.actionManager;
          scene.onPointerDown = function (event, pickResult) {
            if (mouse_on_ground) {
                console.log("moving");
              let camPosTo = new Vector3(pickResult.pickedPoint.x, pickResult.pickedPoint.y + 1, pickResult.pickedPoint.z);
              camera.position = camPosTo;
              camera.target = new Vector3(pickResult.pickedPoint.x,pickResult.pickedPoint.y + 1,pickResult.pickedPoint.z+1)
            }
          }
    }
    CreateSkybox(scene:Scene)   
    {
        const dome = new PhotoDome('photoDome','asset/textures/classroom.jpg', {resolution: 64, size: 1000}, scene);
        // const skybox=MeshBuilder.CreateBox('skybox',{size:1000},scene);
        // const skyboxMaterial = new StandardMaterial('skybox-mat');
        // skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.reflectionTexture= new CubeTexture("asset/textures/skybox",scene);
        // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        // skybox.material = skyboxMaterial;
        return dome;
    }
    createLights(scene: Scene)
    {
        const hemiLight = new HemisphericLight('hemLight', new Vector3(-1,1,0), scene)
        hemiLight.intensity = 0.5
        hemiLight.diffuse = new Color3(1,1,1)

        const pointLight = new PointLight('pointLight', new Vector3(0,1.5,2), scene)
        pointLight.intensity = 1
        pointLight.diffuse = new Color3(1,1,1)

    }
    async CreateTable(scene:Scene)
    {
        const table=SceneLoader.ImportMeshAsync('','asset/models/','table.glb',scene).then(result=>{
            const root=result.meshes[0];
            root.id='tableRoot';
            root.name='tableRoot';
            root.position.y=-1.5;
            root.rotation=new Vector3(0,0,0);
            root.scaling.setAll(5)
        });
        
    }
    CreateDebugInspector(scene:Scene)
    {
        window.addEventListener('keydown',e=>{
            if(e.ctrlKey&&e.key=='i')
            {
                if(scene.debugLayer.isVisible())
                {
                    scene.debugLayer.hide();
                }
                else
                {
                    scene.debugLayer.show();
                }
            }
        });
    }
    async Init()
    {
        const gizmoManager = new GizmoManager(this.scene);
        gizmoManager.boundingBoxGizmoEnabled=true;
        gizmoManager.attachableMeshes = this.colliders;
    }
    initLocomotion(movement: MovementMode, xr: WebXRDefaultExperience, 
            featureManager: WebXRFeaturesManager, ground: Mesh[], scene: Scene)
    {
        switch(movement)
        {
            case MovementMode.Teleportation:
            console.log("movement mode: " + movement.toString())
            const teleport = featureManager.enableFeature(
                WebXRFeatureName.TELEPORTATION, "stable",
                {
                    xrInput: xr.input,
                    floorMeshes: ground,
                    timeToTeleport: 1000,
                    useMainComponentOnly: true,
                    defaultTargetMesgOptions: {
                        teleportationFillColor: "#55FF99",
                        teleportationBorderColor: "blue",
                        torusArrowMaterial: ground[0].material,
                    },
                },
                true, 
                true
            ) as WebXRMotionControllerTeleportation
            teleport.parabolicRayEnabled = true
            teleport.parabolicCheckRadius = 2
            break
            case MovementMode.Walk:
            console.log("movement mode: " + movement.toString())
            featureManager.disableFeature(WebXRFeatureName.TELEPORTATION)
            const xrRoot = new TransformNode("xr root", scene)
            xr.baseExperience.camera.parent = xrRoot
            featureManager.enableFeature(
                WebXRFeatureName.WALKING_LOCOMOTION,
                "latest",
                {
                    locomotionTarget: xrRoot,
                }
            )
            break
        }
    }
    async updateCollider()
    {       
        this.colliders.forEach((collider)=>{
            this.colliders.forEach(async (other)=>{
                if (other === collider)
                    return;
                if (collider.mesh?.intersectsMesh(other, false, true)){
                    const H20=this.colliders.find(o=>o.name==='H2O');
                    if(H20!=null)
                    {
                        H20?.setEnabled(true)
                    }
                }
                else
                    {
                        const H20=this.colliders.find(o=>o.name==='H2O');
                        if(H20!=null)
                        {
                            H20?.setEnabled(false)
                        }
                    }
            })
        })
    }

}
