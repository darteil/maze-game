import * as BABYLON from 'babylonjs';

export const createScene = function(canvas: HTMLCanvasElement, engine: BABYLON.Engine) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FollowCamera('Моя Camera', new BABYLON.Vector3(20, 20, 20), scene);

  camera.attachControl(canvas, true);

  const light1 = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(10, 10, 0), scene);
  // const light2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, -10), scene);
  // const light3 = new BABYLON.DirectionalLight('directLight', new BABYLON.Vector3(-10, -10, -10), scene);

  // light3.position.set(20, 20, 20);

  const postProcess = new BABYLON.FxaaPostProcess('fxaa', 1.0, camera);

  scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  return scene;
};
