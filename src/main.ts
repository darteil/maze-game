import * as BABYLON from 'babylonjs';
import enableDeveloperTools from './developerTools';
import { createScene } from './scene';
import Cube from './cube';
import Platform from './platform';
import FollowCamera from './camera';
import { level } from './level';
import 'normalize.css';

const GameState = {
  moving: false,
};

const canvas = document.getElementById('root') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = createScene(canvas, engine);

const platforms = new Map<string, Platform>();
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
      platform.setPosition(currentXCoordinate, -8, currentZCoordinate);

      platforms.set(`x: ${currentXCoordinate}, z: ${currentZCoordinate}`, platform);
    }

    if (level[i][j] === 2) {
      const platform = new Platform(scene);
      platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
      platform.show();

      startPlatform = platform;
    }

    if (level[i][j] === 3) {
      const platform = new Platform(scene);
      platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
      platform.show();

      finishPlatform = platform;
    }
  }

  currentZCoordinate = 0;
}

const cube = new Cube(scene);

if (startPlatform) cube.setPosition(startPlatform.mesh.position.x, 9, startPlatform.mesh.position.z);

const camera = new FollowCamera(scene, cube.mesh);

const updateRoad = () => {
  const keys = [
    `x: ${cube.mesh.position.x}, z: ${cube.mesh.position.z}`,
    `x: ${cube.mesh.position.x - 12}, z: ${cube.mesh.position.z}`,
    `x: ${cube.mesh.position.x - 12}, z: ${cube.mesh.position.z + 12}`,
    `x: ${cube.mesh.position.x}, z: ${cube.mesh.position.z + 12}`,
    `x: ${cube.mesh.position.x + 12}, z: ${cube.mesh.position.z + 12}`,
    `x: ${cube.mesh.position.x + 12}, z: ${cube.mesh.position.z}`,
    `x: ${cube.mesh.position.x + 12}, z: ${cube.mesh.position.z - 12}`,
    `x: ${cube.mesh.position.x}, z: ${cube.mesh.position.z - 12}`,
    `x: ${cube.mesh.position.x - 12}, z: ${cube.mesh.position.z - 12}`,

    `x: ${cube.mesh.position.x - 24}, z: ${cube.mesh.position.z}`,
    `x: ${cube.mesh.position.x - 24}, z: ${cube.mesh.position.z + 24}`,
    `x: ${cube.mesh.position.x}, z: ${cube.mesh.position.z + 24}`,
    `x: ${cube.mesh.position.x + 24}, z: ${cube.mesh.position.z + 24}`,
    `x: ${cube.mesh.position.x + 24}, z: ${cube.mesh.position.z}`,
    `x: ${cube.mesh.position.x + 24}, z: ${cube.mesh.position.z - 24}`,
    `x: ${cube.mesh.position.x}, z: ${cube.mesh.position.z - 24}`,
    `x: ${cube.mesh.position.x - 24}, z: ${cube.mesh.position.z - 24}`,

    `x: ${cube.mesh.position.x - 24}, z: ${cube.mesh.position.z - 12}`,
    `x: ${cube.mesh.position.x - 12}, z: ${cube.mesh.position.z - 24}`,
    `x: ${cube.mesh.position.x + 12}, z: ${cube.mesh.position.z + 24}`,
    `x: ${cube.mesh.position.x + 24}, z: ${cube.mesh.position.z + 12}`,

    `x: ${cube.mesh.position.x - 24}, z: ${cube.mesh.position.z + 12}`,
    `x: ${cube.mesh.position.x + 24}, z: ${cube.mesh.position.z - 12}`,
    `x: ${cube.mesh.position.x - 12}, z: ${cube.mesh.position.z + 24}`,
    `x: ${cube.mesh.position.x + 12}, z: ${cube.mesh.position.z - 24}`,
  ];

  platforms.forEach((value: Platform, key: string) => {
    let flag = false;

    for (let i = 0; i < keys.length; i++) {
      if (key === keys[i]) {
        flag = true;
        if (!value.isVisible) {
          value.show();
        }
      }
    }
    if (!flag && value.isVisible) {
      value.hide();
    }
  });
};

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

const moveAction = async (directional: string) => {
  if (GameState.moving) return;
  GameState.moving = true;

  switch (directional) {
    case 'up': {
      await Promise.all([cube.moveUp(), camera.moveUp()]);
      updateRoad();
      GameState.moving = false;
      break;
    }
    case 'down': {
      await Promise.all([cube.moveDown(), camera.moveDown()]);
      updateRoad();
      GameState.moving = false;
      break;
    }
    case 'left': {
      await Promise.all([cube.moveLeft(), camera.moveLeft()]);
      updateRoad();
      GameState.moving = false;
      break;
    }
    case 'right': {
      await Promise.all([cube.moveRight(), camera.moveRight()]);
      updateRoad();
      GameState.moving = false;
      break;
    }
    default:
      GameState.moving = false;
  }
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
  const key = event.which;

  if (Directional.up === key) {
    moveAction('up');
  }

  if (Directional.down === key) {
    moveAction('down');
  }

  if (Directional.left === key) {
    moveAction('left');
  }

  if (Directional.right === key) {
    moveAction('right');
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
