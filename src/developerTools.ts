import * as BABYLON from 'babylonjs';

const enableDeveloperTools = (scene: BABYLON.Scene) => {
  const size = 200;
  const axisX = BABYLON.Mesh.CreateLines(
    'axisX',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
    ],
    scene,
  );
  axisX.color = new BABYLON.Color3(1, 0, 0);

  const axisY = BABYLON.Mesh.CreateLines(
    'axisY',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
    ],
    scene,
  );
  axisY.color = new BABYLON.Color3(0, 1, 0);

  const axisZ = BABYLON.Mesh.CreateLines(
    'axisZ',
    [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
    ],
    scene,
  );
  axisZ.color = new BABYLON.Color3(0, 0, 1);

  scene.debugLayer.show({
    overlay: true,
  });
};

export default enableDeveloperTools;
