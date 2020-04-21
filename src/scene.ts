import * as BABYLON from 'babylonjs';

export default class SceneInstance {
  public scene: BABYLON.Scene;
  public directionalLight_01: BABYLON.DirectionalLight;
  public directionalLight_02: BABYLON.DirectionalLight;
  public hemisphericLight: BABYLON.HemisphericLight;

  constructor(engine: BABYLON.Engine) {
    this.scene = new BABYLON.Scene(engine);
    this.scene.imageProcessingConfiguration.exposure = 0.8;
    this.hemisphericLight = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hemisphericLight.intensity = 0.6;
    this.hemisphericLight.specular = BABYLON.Color3.Black();

    this.directionalLight_01 = new BABYLON.DirectionalLight(
      'DirectionalLight_01',
      new BABYLON.Vector3(-200, -200, -200),
      this.scene,
    );
    this.directionalLight_01.intensity = 0.7;

    this.directionalLight_02 = new BABYLON.DirectionalLight(
      'DirectionalLight_02',
      new BABYLON.Vector3(200, 200, 200),
      this.scene,
    );
    this.directionalLight_02.intensity = 0.7;
  }
}
