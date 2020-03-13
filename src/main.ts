import * as BABYLON from 'babylonjs';
// import * as cannon from 'cannon';
import enableDeveloperTools from './developerTools';
import Cube from './cube';
import Platform from './platform';
import 'normalize.css';
75;
const canvas = document.getElementById('root') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'Camera',
    Math.PI / 2,
    Math.PI / 8,
    2,
    new BABYLON.Vector3(20, 20, 20),
    scene,
  );
  camera.attachControl(canvas, true);

  const light1 = new BABYLON.HemisphericLight('hemisphericLight', new BABYLON.Vector3(10, 10, 0), scene);
  // const light2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, -10), scene);
  // const light3 = new BABYLON.DirectionalLight('directLight', new BABYLON.Vector3(-10, -10, -10), scene);

  // light3.position.set(20, 20, 20);

  const postProcess = new BABYLON.FxaaPostProcess('fxaa', 1.0, camera);

  scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  return scene;
};

const scene = createScene();

const cube = new Cube(scene);
cube.setPosition(0, 5, 0);

const platform = new Platform(scene);
platform.setPosition(15, 2, 15);

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
