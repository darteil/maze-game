import * as BABYLON from 'babylonjs';

export default class SceneInstance {
  public scene: BABYLON.Scene;
  public directionalLight: BABYLON.DirectionalLight;
  public hemisphericLight: BABYLON.HemisphericLight;
  public shadowGenerator: BABYLON.ShadowGenerator;

  constructor(engine: BABYLON.Engine) {
    this.scene = new BABYLON.Scene(engine);
    this.hemisphericLight = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hemisphericLight.intensity = 0.75;
    this.directionalLight = new BABYLON.DirectionalLight(
      'DirectionalLight_01',
      new BABYLON.Vector3(-200, -200, -200),
      this.scene,
    );
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.directionalLight);

    // this.shadowGenerator.useExponentialShadowMap = true;
    // this.shadowGenerator.blurKernel = 32;
  }
}
