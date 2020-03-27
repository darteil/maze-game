import * as BABYLON from 'babylonjs';

export default class Ground {
  public scene: BABYLON.Scene;
  public mesh: BABYLON.Mesh;
  public material: BABYLON.StandardMaterial;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateGround('ground', { width: 1000, height: 1000, subdivisions: 10 }, this.scene);
    this.material = new BABYLON.StandardMaterial('ground', scene);
    this.mesh.position.y = -8;

    this.material.diffuseColor = new BABYLON.Color3(0.611, 0.611, 0.611);
    this.mesh.material = this.material;
  }
}
