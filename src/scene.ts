import * as BABYLON from 'babylonjs';

export default class SceneInstance {
  public scene: BABYLON.Scene;
  public directionalLight: BABYLON.DirectionalLight;
  public hemisphericLight: BABYLON.HemisphericLight;
  public shadowGenerator: BABYLON.ShadowGenerator;

  constructor(engine: BABYLON.Engine) {
    this.scene = new BABYLON.Scene(engine);
    this.scene.imageProcessingConfiguration.exposure = 0.8;
    this.hemisphericLight = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hemisphericLight.intensity = 0.6;
    this.hemisphericLight.specular = BABYLON.Color3.Black();
    this.directionalLight = new BABYLON.DirectionalLight(
      'DirectionalLight_01',
      new BABYLON.Vector3(-200, -200, -200),
      this.scene,
    );
    this.directionalLight.intensity = 0.7;
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.directionalLight);

    // const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData('env.dds', this.scene);
    // this.scene.environmentTexture = hdrTexture;
    // this.scene.createDefaultSkybox(hdrTexture, true, 1000, 0.7);

    // this.shadowGenerator.useExponentialShadowMap = true;
    // this.shadowGenerator.blurKernel = 32;
  }
}
