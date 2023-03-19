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
  import { TextPlane } from "./text-plane";
  
  export interface TheMesh {
    scene: Scene;
    mesh: AbstractMesh;
    boundingbox: Mesh;
    mat:Material;
    label: TextPlane;
    onInterectObservable: Observable<boolean>;
  }
  
  export class TheSphere extends AbstractMesh implements TheMesh {
    scene: Scene;
    utillayer:UtilityLayerRenderer;
    mesh: AbstractMesh;
    boundingbox: Mesh;
    mat:Material;
    label: TextPlane;
    gizmo:BoundingBoxGizmo;
    onInterectObservable: Observable<boolean>;
    name: string
    options: { diameter: number }
    constructor(name: string, options: { diameter: number }, scene: Scene,utillayer:UtilityLayerRenderer) {
      super(name, scene);
      this.scene = scene;
      this.name=name
      this.options=options
      this.utillayer=utillayer;
    }
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
          // parent.CreateBoundingBox().then(result=>{
          //   parent.boundingbox=result
          //   parent.addChild(result)
          // });
          parent.initActions();
          //parent.CreateControls();
      });
      
        return parent
    }
    private CreateControls()
    {
      var sixDofDragBehavior = new SixDofDragBehavior()
      this.addBehavior(sixDofDragBehavior)
      var multiPointerScaleBehavior = new MultiPointerScaleBehavior()
      this.addBehavior(multiPointerScaleBehavior)
    }
    private async CreateBoundingBox()
    {
      var boundingBox = BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.mesh as Mesh)
      //var boundingBoxtext = BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(this.label.mesh)
      //var utilLayer = new UtilityLayerRenderer(this.scene);
      this.utillayer.utilityLayerScene.autoClearDepthAndStencil = false;
      this.gizmo = new BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), this.utillayer)
      this.gizmo.attachedMesh=boundingBox;
      var sixDofDragBehavior = new SixDofDragBehavior()
      boundingBox.addBehavior(sixDofDragBehavior)
      var multiPointerScaleBehavior = new MultiPointerScaleBehavior()
      boundingBox.addBehavior(multiPointerScaleBehavior)
      return boundingBox
    }
    private initActions() {
        const actionManager = (this.actionManager = new ActionManager(this.scene));
        actionManager.isRecursive = true;
        //Reset sphere
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(
            {
                trigger: ActionManager.OnKeyUpTrigger,
                parameter: "r",
            },
            () => {
                this.boundingbox.scaling.setAll(1.5);
                this.boundingbox.rotation=new Vector3(0,0,Math.PI);
                console.log("r was pressed: reset " + this.name);
            }
            )
        );
        // //Reset sphere
        // this.scene.actionManager.registerAction(
        //     new ExecuteCodeAction(
        //     {
        //         trigger: ActionManager.OnKeyUpTrigger,
        //         parameter: "e",
        //     },
        //     () => {
        //       //i do this because it wouldnt work in a async function
        //       this.gizmo.attachedMesh = !this.gizmo.attachedMesh ? this.boundingbox : null            
        //     }
        //     )
        // );
  
    }
  }
  