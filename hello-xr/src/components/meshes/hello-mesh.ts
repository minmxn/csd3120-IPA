// Import necessary modules from babylonjs
import {
    AbstractMesh,
    ActionManager,
    BoundingBoxGizmo,
    Color3,
    ExecuteCodeAction,
    InterpolateValueAction,
    Material,
    Mesh,
    MeshBuilder,
    MultiPointerScaleBehavior,
    Observable,
    PointerDragBehavior,
    PredicateCondition,
    Quaternion,
    Scene,
    SceneLoader,
    SetValueAction,
    SixDofDragBehavior,
    StandardMaterial,
    UtilityLayerRenderer,
    Vector3,
  } from "babylonjs";

  // Import TextPlane class from local file
  import { TextPlane } from "./text-plane";
  
  // Define interface for the mesh
  export interface TheMesh {
    scene: Scene; // Scene that the mesh belongs to
    mesh: AbstractMesh; // Main mesh
    boundingbox: Mesh; // Bounding box for the mesh
    mat: Material; // Material of the mesh
    label: TextPlane; // Label for the mesh
    onInterectObservable: Observable<boolean>; // Observable for the mesh's interaction
  }
  
  // Define class for the sphere, which extends the AbstractMesh class and implements the TheMesh interface
  export class TheSphere extends AbstractMesh implements TheMesh {
    scene: Scene; // Scene that the mesh belongs to
    utillayer: UtilityLayerRenderer; // Utility layer renderer
    mesh: AbstractMesh; // Main mesh
    boundingbox: Mesh; // Bounding box for the mesh
    mat: Material; // Material of the mesh
    label: TextPlane; // Label for the mesh
    gizmo: BoundingBoxGizmo; // Bounding box gizmo for the mesh
    onInterectObservable: Observable<boolean>; // Observable for the mesh's interaction
    name: string; // Name of the mesh
    options: { diameter: number }; // Options for the mesh
    constructor(name: string, options: { diameter: number }, scene: Scene,utillayer:UtilityLayerRenderer) {
      super(name, scene);
      this.scene = scene;
      this.name=name
      this.options=options
      this.utillayer=utillayer;
    }

    // Method to create the model asynchronously and return the parent
    public static async  CreateModel(parent:TheSphere):Promise<TheSphere>
    {
        SceneLoader.ImportMeshAsync('','asset/models/',parent.name+".glb",parent.scene).then(result=>{
          const root=result.meshes[0];
          root.id='h20Root';
          root.name='h20Root';
          root.rotation=new Vector3(0,0,Math.PI);
          root.scaling.setAll(2)
          parent.mesh=root;
          parent.addChild(root);
          root.position.setAll(0)
          result.meshes[0].material = new StandardMaterial(parent.name+"material", parent.scene);
          parent.mat= parent.mesh.material
          parent.label = new TextPlane(
            "hello sphere label",
            1.5,
            1,
            0,
            0,
            0,
            parent.name,
            "purple",
            "white",
            25,
            parent.scene
          );
          parent.mesh.addChild(parent.label.mesh);
          parent.label.mesh.position.setAll(0)
          parent.label.mesh.position.y=-parent.options.diameter / 2 + 0.2
          parent.initActions();
      });
      
        return parent
    }

    private initActions() {
      // Create a new action manager for the scene and enable recursive actions
      const actionManager = (this.actionManager = new ActionManager(this.scene));
      actionManager.isRecursive = true;
      
      // Register an action to reset the sphere when the "r" key is pressed
      this.scene.actionManager.registerAction(
          new ExecuteCodeAction(
          {
              trigger: ActionManager.OnKeyUpTrigger,
              parameter: "r",
          },
          () => {
              // Reset the bounding box scaling and rotation
              this.boundingbox.scaling.setAll(1.5);
              this.boundingbox.rotation = new Vector3(0, 0, Math.PI);
              // Log the reset action to the console
              console.log("r was pressed: reset " + this.name);
          }
          )
      );
  }
  }
  