import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh, SceneLoader, HtmlElementTexture, StandardMaterial, CubeTexture, PointerDragBehavior, UniversalCamera, PointLight, Color3, ActionManager, PhotoDome, WebXRFeatureName, MultiPointerScaleBehavior, AbstractMesh, WebXRDefaultExperience, WebXRFeaturesManager, WebXRMotionControllerTeleportation, TransformNode, UtilityLayerRenderer, FreeCamera, ExecuteCodeAction, GizmoManager } from "babylonjs";
import { AdvancedDynamicTexture, TextBlock } from "babylonjs-gui";
import { TextPlane, TheSphere } from "./components/meshes"

enum MovementMode {
    Teleportation,
    Walk
}
export class App {
    private engine: Engine;
    private canvas: HTMLCanvasElement;
    private scene: Scene
    colliders: Array<TheSphere> = [];
    private test: boolean = false
    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine = engine;
        this.canvas = canvas;
    }

    async createScene() {
        // Create a new Babylon.js scene and set it as the active scene
        this.scene = new Scene(this.engine);

        // Set up the scene's action manager to handle user input
        this.scene.actionManager = new ActionManager(this.scene);

        // Create the camera and lights for the scene
        const cam = this.createCamera(this.scene);
        this.createLights(this.scene);

        // Create the spheres for the H2, O2, and H2O molecules
        var utilLayer = new UtilityLayerRenderer(this.scene);
        const H2Sphere = await TheSphere.CreateModel(new TheSphere("H2", { diameter: 1 }, this.scene, utilLayer));
        H2Sphere.position.x = 5;
        const O2Sphere = await TheSphere.CreateModel(new TheSphere("O2", { diameter: 1.5 }, this.scene, utilLayer));
        const H2OSphere = await TheSphere.CreateModel(new TheSphere('H2O', { diameter: 1.5 }, this.scene, utilLayer));
        H2OSphere.position.x = -5;
        H2OSphere.position.y = 1;

        // Add the spheres to the colliders array for collision detection
        this.colliders.push(H2OSphere)
        this.colliders.push(H2Sphere);
        this.colliders.push(O2Sphere);

        // Create the skybox, debug inspector, and table for the scene
        this.CreateSkybox(this.scene);
        this.CreateDebugInspector(this.scene);
        this.CreateTable(this.scene);

        // Create the ground and bottom ground for the scene
        const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 15 }, this.scene)
        const ground2 = MeshBuilder.CreateGround("groundbottom", { width: 50, height: 50 }, this.scene)
        ground.position.set(0, -1.2, 0)
        ground2.position.set(0, -10, 0)
        const temp = new StandardMaterial("groundbottommat", this.scene);
        temp.diffuseColor = new Color3(0, 1, 1);
        ground2.material = temp;

        // Get the table mesh and set up the XR experience
        const table = this.scene.getMeshById('tableRoot')
        const xr = this.scene.createDefaultXRExperienceAsync({
            uiOptions: {
                sessionMode: "immersive-vr"
            },
            optionalFeatures: true
        });
        const featureManager = (await xr).baseExperience.featuresManager

        // Initialize the locomotion mode and camera movement
        const movement = MovementMode.Teleportation;
        this.initLocomotion(movement, await xr, featureManager, [ground, ground2], this.scene);
        this.createCameraMovement(this.scene, cam);

        // Set the XR experience to the window object for debugging purposes
        (window as any).xr = xr;

        // Return the newly created scene as a Promise
        return this.scene;
    }

    createCamera(scene: Scene) {
        // Create a new ArcRotateCamera with initial position (-1.50, 1.2, 15) and target at the origin
        const camera = new ArcRotateCamera('arcCamera', -1.50, 1.2, 15, Vector3.Zero(), scene)

        // Set the camera to look at the origin
        camera.setTarget(Vector3.Zero());

        // Attach the camera controls to the canvas
        camera.attachControl(this.canvas, true)

        // Return the camera
        return camera;
    }

    createCameraMovement(scene: Scene, camera: ArcRotateCamera) {
        // Get meshes to interact with
        let ground_plane = scene.getMeshByName("ground");
        let ground_plane2 = scene.getMeshByName("groundbottom");

        // Set initial state of mouse position
        let mouse_on_ground = false;

        // Register mouse pointer events for ground planes
        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOverTrigger,
                function (ev) {
                    let mesh_under_cursor = ev.meshUnderPointer.name;
                    mouse_on_ground = true;
                }
            )
        );
        scene.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPointerOutTrigger,
                function (ev) {
                    mouse_on_ground = false;
                }
            )
        );

        // Register mouse pointer down event for moving camera
        ground_plane.actionManager = this.scene.actionManager;
        ground_plane2.actionManager = this.scene.actionManager;
        scene.onPointerDown = function (event, pickResult) {
            if (mouse_on_ground) {
                console.log("moving");
                let camPosTo = new Vector3(pickResult.pickedPoint.x, pickResult.pickedPoint.y + 1, pickResult.pickedPoint.z);
                camera.position = camPosTo;
                camera.target = new Vector3(pickResult.pickedPoint.x, pickResult.pickedPoint.y + 1, pickResult.pickedPoint.z + 1)
            }
        }
    }

    CreateSkybox(scene: Scene) {
        const dome = new PhotoDome('photoDome', 'asset/textures/classroom.jpg', { resolution: 64, size: 1000 }, scene);
        return dome;
    }

    createLights(scene: Scene) {
        const hemiLight = new HemisphericLight('hemLight', new Vector3(-1, 1, 0), scene)
        hemiLight.intensity = 0.5
        hemiLight.diffuse = new Color3(1, 1, 1)

        const pointLight = new PointLight('pointLight', new Vector3(0, 1.5, 2), scene)
        pointLight.intensity = 1
        pointLight.diffuse = new Color3(1, 1, 1)

    }

    async CreateTable(scene: Scene) {
        const table = SceneLoader.ImportMeshAsync('', 'asset/models/', 'table.glb', scene).then(result => {
            const root = result.meshes[0];
            root.id = 'tableRoot';
            root.name = 'tableRoot';
            root.position.y = -1.5;
            root.rotation = new Vector3(0, 0, 0);
            root.scaling.setAll(5)
        });

    }

    CreateDebugInspector(scene: Scene) {
        window.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key == 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                }
                else {
                    scene.debugLayer.show();
                }
            }
        });
    }

    async Init() {
        const gizmoManager = new GizmoManager(this.scene);
        gizmoManager.boundingBoxGizmoEnabled = true;
        gizmoManager.rotationGizmoEnabled = true;
        gizmoManager.attachableMeshes = this.colliders;
    }

    initLocomotion(movement: MovementMode, xr: WebXRDefaultExperience,
        featureManager: WebXRFeaturesManager, ground: Mesh[], scene: Scene) {
        // Based on the movement mode, enable the corresponding XR feature
        switch (movement) {
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

                // Customize parabolic ray settings for teleportation
                teleport.parabolicRayEnabled = true
                teleport.parabolicCheckRadius = 2
                break

            case MovementMode.Walk:
                console.log("movement mode: " + movement.toString())

                // Disable teleportation feature
                featureManager.disableFeature(WebXRFeatureName.TELEPORTATION)

                // Create a new TransformNode to serve as the locomotion target for walking mode
                const xrRoot = new TransformNode("xr root", scene)
                xr.baseExperience.camera.parent = xrRoot

                // Enable walking locomotion feature with the newly created XR root node as the target
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
    async updateCollider() {
        // Iterate through all colliders
        this.colliders.forEach((collider) => {
            // Compare each collider with every other collider in the scene
            this.colliders.forEach(async (other) => {
                // Skip if comparing collider with itself
                if (other === collider)
                    return;
                // Check if colliders are intersecting
                if (collider.mesh?.intersectsMesh(other, false, true)) {
                    // Find the collider named 'H2O' and set it to enabled if it exists
                    const H20 = this.colliders.find(o => o.name === 'H2O');
                    if (H20 != null) {
                        H20?.setEnabled(true)
                    }
                }
                else {
                    // Find the collider named 'H2O' and set it to disabled if it exists
                    const H20 = this.colliders.find(o => o.name === 'H2O');
                    if (H20 != null) {
                        H20?.setEnabled(false)
                    }
                }
            })
        })
    }

}
