import * as BABYLON from 'babylonjs';
// import * as cannon from 'cannon';
import enableDeveloperTools from './developerTools';
import { createScene } from './scene';
import Cube from './cube';
import Platform from './platform';
import { level } from './level';
import 'normalize.css';

const canvas = document.getElementById('root') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = createScene(canvas, engine);

interface IPlatformCoordinates {
  x: number;
  z: number;
}
const platforms = new Map<IPlatformCoordinates, Platform>();
let startPlatform: Platform | null = null;
let finishPlatform: Platform | null = null;

let currentXCoordinate = 0;
let currentZCoordinate = 0;

for (let i = 0; i < 15; i++) {
  if (i > 0) currentXCoordinate += 12;

  for (let j = 0; j < 15; j++) {
    if (j > 0) currentZCoordinate += 12;

    if (level[i][j] === 1) {
      const platform = new Platform(scene);
      platform.setPosition(currentXCoordinate, 2, currentZCoordinate);

      platforms.set({ x: currentXCoordinate, z: currentZCoordinate }, platform);
    }

    if (level[i][j] === 2) {
      const platform = new Platform(scene);
      platform.setPosition(currentXCoordinate, 2, currentZCoordinate);

      startPlatform = platform;
    }

    if (level[i][j] === 3) {
      const platform = new Platform(scene);
      platform.setPosition(currentXCoordinate, 2, currentZCoordinate);

      finishPlatform = platform;
    }
  }

  currentZCoordinate = 0;
}

const cube = new Cube(scene);

if (startPlatform) cube.setPosition(startPlatform.mesh.position.x, 9, startPlatform.mesh.position.z);

console.log(scene.activeCamera);

const currentCamera = scene.getCameraByName('Моя Camera');

const updateRoad = () => {};

/*const Directional = {
  up: 75,
  left: 72,
  right: 76,
  down: 74,
};*/

const Directional = {
  up: 87,
  left: 65,
  right: 68,
  down: 83,
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
  const key = event.which;

  if (Directional.up === key) {
    cube.moveUp();
  }

  if (Directional.down === key) {
    cube.moveDown();
  }

  if (Directional.left === key) {
    cube.moveLeft();
  }

  if (Directional.right === key) {
    cube.moveRight();
  }
});

scene.debugLayer.show({
  overlay: true,
});

enableDeveloperTools(scene);

engine.runRenderLoop(function() {
  scene.render();
});

window.addEventListener('resize', function() {
  engine.resize();
});
