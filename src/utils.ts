import * as BABYLON from 'babylonjs';
import Game from './game';

export const enableDeveloperTools = (game: Game) => {
  const scene = game.sceneInstance.scene;
  const arcCamera = new BABYLON.ArcRotateCamera('arcCamera', 0, 0, 100, game.cube.mesh.getAbsolutePosition(), scene);
  arcCamera.lowerRadiusLimit = 10;
  arcCamera.useBouncingBehavior = true;
  arcCamera.attachControl(game.canvas, true);

  scene.activeCamera = arcCamera;

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

  const debugLayerConfig = {
    overlay: true,
    enablePopup: false,
  };

  /**
   * Press 'p' to show debugLayer
   */
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.which === 80) {
      scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show(debugLayerConfig);
    }
  });
};

/**
 * Object visibility coordinates
 * @param x position of the object
 * @param z position of the object
 * @param step distance to the center of the neighboring object
 */
export const createVisibilityCoordinates = (x: number, z: number, step: number): string[] => {
  // visibility area
  const visibility = 2;

  return [
    `x: ${x}, z: ${z}`,
    `x: ${x - step}, z: ${z}`,
    `x: ${x - step}, z: ${z + step}`,
    `x: ${x}, z: ${z + step}`,
    `x: ${x + step}, z: ${z + step}`,
    `x: ${x + step}, z: ${z}`,
    `x: ${x + step}, z: ${z - step}`,
    `x: ${x}, z: ${z - step}`,
    `x: ${x - step}, z: ${z - step}`,

    `x: ${x - step * visibility}, z: ${z}`,
    `x: ${x - step * visibility}, z: ${z + step * visibility}`,
    `x: ${x}, z: ${z + step * visibility}`,
    `x: ${x + step * visibility}, z: ${z + step * visibility}`,
    `x: ${x + step * visibility}, z: ${z}`,
    `x: ${x + step * visibility}, z: ${z - step * visibility}`,
    `x: ${x}, z: ${z - step * visibility}`,
    `x: ${x - step * visibility}, z: ${z - step * visibility}`,

    `x: ${x - step * visibility}, z: ${z - step}`,
    `x: ${x - step}, z: ${z - step * visibility}`,
    `x: ${x + step}, z: ${z + step * visibility}`,
    `x: ${x + step * visibility}, z: ${z + step}`,

    `x: ${x - step * visibility}, z: ${z + step}`,
    `x: ${x + step * visibility}, z: ${z - step}`,
    `x: ${x - step}, z: ${z + step * visibility}`,
    `x: ${x + step}, z: ${z - step * visibility}`,
  ];
};
