import * as BABYLON from 'babylonjs';
import SceneInstance from './scene';
import { trainingLevel, ILevel, generateNewMap } from './levels';
import Platform from './objects/platform';
import Cube from './objects/cube';
import Ground from './objects/ground';
import FollowCamera from './camera';
import TrainingGui from './gui/trainingGui';
import ProgressGui from './gui/progressGui';
import MiniMap from './miniMap';
import { createVisibilityCoordinates } from './utils';

/**
 * distance between the center of the platform and the edge = 5
 * distance between platforms = 2
 *
 * then distance between centers of the two platforms is equal 5 + 5 + 2 = 12
 * starting position of the platform along the Y axis = -8
 * starting position of the cube along the Y axis = 9
 */

interface IGameState {
  moving: boolean;
  firstRun?: boolean;
  mazesCompleted: string;
}

const Controls = {
  up: 87,
  left: 65,
  right: 68,
  down: 83,
};

export default class Game {
  public sceneInstance: SceneInstance;
  public canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private platforms: Map<string, Platform> = new Map();
  public startPlatform: Platform | null = null;
  public finishPlatform: Platform | null = null;

  private currentMap: ILevel;

  public cube: Cube;
  private followCamera: FollowCamera;
  private gameState: IGameState;
  private ground: Ground;

  private trainingGui: TrainingGui | null = null;
  private progressGui: ProgressGui | null = null;

  private miniMap: MiniMap;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.sceneInstance = new SceneInstance(this.engine);
    this.cube = new Cube(this.sceneInstance.scene);
    this.ground = new Ground(this.sceneInstance.scene);
    this.followCamera = new FollowCamera(this.sceneInstance.scene);
    this.miniMap = new MiniMap();

    if (!localStorage.getItem('maze_game_first_run')) {
      localStorage.setItem('maze_game_first_run', 'yes');
    }

    if (!localStorage.getItem('maze_game_mazes_completed')) {
      localStorage.setItem('maze_game_mazes_completed', '0');
    }

    this.gameState = {
      moving: false,
      firstRun: localStorage.getItem('maze_game_first_run') === 'yes',
      mazesCompleted: localStorage.getItem('maze_game_mazes_completed') as string,
    };

    this.progressGui = new ProgressGui(this.sceneInstance.scene, +this.gameState.mazesCompleted);

    if (this.gameState.firstRun) {
      this.trainingGui = new TrainingGui(this);
    }

    this.currentMap = generateNewMap();
  }

  public init() {
    this.enablePostProcess();
    this.initControl();
    this.render();
    this.initMiniMap();
    this.start();
  }

  private initMiniMap() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.which === 77) {
        this.miniMap.toggle();
      }
    });
  }

  public enablePostProcess() {
    const fxaaPostProcess = new BABYLON.FxaaPostProcess('fxaa', 2.0, this.sceneInstance.scene.activeCamera);
    fxaaPostProcess.enablePixelPerfectMode = true;
  }

  public start() {
    if (this.gameState.firstRun) {
      this.renderMap(trainingLevel);
      this.trainingGui?.render();
    } else {
      this.renderMap(this.currentMap);
      this.progressGui?.setCurrentCount(+this.gameState.mazesCompleted);
    }
    if (this.startPlatform) {
      this.cube.setPosition(this.startPlatform.mesh.position.x, 9, this.startPlatform.mesh.position.z);
      this.cube.set2dPosition(this.startPlatform.row, this.startPlatform.column);
    }
    this.followCamera.setTarget(this.cube.mesh);
    this.updateRoad();
  }

  private closeTrainingMap() {
    localStorage.setItem('maze_game_first_run', 'no');

    this.gameState = {
      ...this.gameState,
      firstRun: false,
    };

    this.trainingGui?.disable();
    this.trainingGui?.dispose();
  }

  public clear() {
    this.platforms.forEach((platform: Platform) => {
      this.sceneInstance.scene.removeMesh(platform.mesh);
      platform.material.dispose();
    });
    this.platforms.clear();
    if (this.startPlatform) {
      this.sceneInstance.scene.removeMesh(this.startPlatform.mesh);
      this.startPlatform.material.dispose();
      this.startPlatform = null;
    }
    if (this.finishPlatform) {
      this.sceneInstance.scene.removeMesh(this.finishPlatform.mesh);
      this.finishPlatform.material.dispose();
      this.finishPlatform = null;
    }
    this.gameState = {
      ...this.gameState,
      moving: false,
    };
    this.miniMap.clear();
  }

  private createNewMap() {
    this.currentMap = generateNewMap();
  }

  private renderMap(level: ILevel) {
    const map = level.map;

    let currentXCoordinate = 0;
    let currentZCoordinate = 0;

    for (let i = 0; i < level.width; i++) {
      if (i > 0) currentXCoordinate += 12;

      for (let j = 0; j < level.height; j++) {
        if (j > 0) currentZCoordinate += 12;

        // default platform
        if (map[i][j] === '#') {
          const platform = new Platform(this.sceneInstance.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
          platform.setColor(new BABYLON.Color3(1.0, 0.766, 0.336));
          platform.set2dCoordinate(i, j);

          this.platforms.set(`x: ${currentXCoordinate}, z: ${currentZCoordinate}`, platform);
        }

        // start platform
        if (map[i][j] === 'S') {
          const platform = new Platform(this.sceneInstance.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
          platform.setColor(new BABYLON.Color3(0.7, 1, 0));
          platform.set2dCoordinate(i, j);
          platform.show();

          this.startPlatform = platform;
        }

        // finish platform
        if (map[i][j] === 'F') {
          const platform = new Platform(this.sceneInstance.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
          platform.setColor(new BABYLON.Color3(0.3, 0.8, 1));
          platform.set2dCoordinate(i, j);

          if (this.gameState.firstRun) {
            platform.show();
          } else {
            this.platforms.set(`x: ${currentXCoordinate}, z: ${currentZCoordinate}`, platform);
          }

          this.finishPlatform = platform;
        }
      }

      currentZCoordinate = 0;
    }
  }

  private updateRoad() {
    const coordinates = createVisibilityCoordinates(this.cube.mesh.position.x, this.cube.mesh.position.z, 12);

    this.platforms.forEach((value: Platform, key: string) => {
      let flag = false;

      for (let i = 0; i < coordinates.length; i++) {
        if (key === coordinates[i]) {
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

    this.miniMap.update(this.platforms, this.cube);
  }

  private cubeCorrectPositionCheck(): boolean {
    if (!this.startPlatform) return false;
    const currentPosition = `x: ${this.cube.mesh.position.x}, z: ${this.cube.mesh.position.z}`;
    const startPlatformPosition = `x: ${this.startPlatform.mesh.position.x}, z: ${this.startPlatform.mesh.position.z}`;

    return this.platforms.has(currentPosition) || currentPosition === startPlatformPosition;
  }

  private cubeFinishPositionCheck(): boolean {
    if (!this.finishPlatform) return false;

    const currentPosition = `x: ${this.cube.mesh.position.x}, z: ${this.cube.mesh.position.z}`;
    const finishPlatformPosition = `x: ${this.finishPlatform.mesh.position.x}, z: ${this.finishPlatform.mesh.position.z}`;

    return currentPosition === finishPlatformPosition;
  }

  private cubeMovingCheck() {
    if (!this.cubeCorrectPositionCheck() && !this.cubeFinishPositionCheck()) {
      this.clear();
      this.start();
      return;
    }

    if (this.cubeFinishPositionCheck()) {
      if (this.gameState.firstRun) {
        this.clear();
        this.closeTrainingMap();
        this.start();
        return;
      }

      const count = localStorage.getItem('maze_game_mazes_completed');

      if (count) {
        localStorage.setItem('maze_game_mazes_completed', `${+count + 1}`);
        this.gameState = {
          ...this.gameState,
          mazesCompleted: `${+count + 1}`,
        };
      }

      this.clear();
      this.createNewMap();
      this.start();
      return;
    }
    this.updateRoad();
  }

  /**
   * Cube movement
   * @param directional Options: 'up', 'down', 'left', 'right'
   */
  private async moveAction(directional: string) {
    if (this.gameState.moving) return;
    this.gameState.moving = true;

    if (directional === 'up' || directional === 'down' || directional === 'left' || directional === 'right') {
      if (this.gameState.firstRun) {
        this.trainingGui?.disable();
      }
    }

    switch (directional) {
      case 'up': {
        await Promise.all([this.cube.moveUp(), this.followCamera.moveUp()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'down': {
        await Promise.all([this.cube.moveDown(), this.followCamera.moveDown()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'left': {
        await Promise.all([this.cube.moveLeft(), this.followCamera.moveLeft()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'right': {
        await Promise.all([this.cube.moveRight(), this.followCamera.moveRight()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      default:
        this.gameState.moving = false;
    }
  }

  private initControl() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = event.which;

      if (Controls.up === key) {
        this.moveAction('up');
      }

      if (Controls.down === key) {
        this.moveAction('down');
      }

      if (Controls.left === key) {
        this.moveAction('left');
      }

      if (Controls.right === key) {
        this.moveAction('right');
      }
    });
  }

  private render() {
    this.engine.runRenderLoop(() => {
      this.sceneInstance.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }
}
