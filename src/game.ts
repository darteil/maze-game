import * as BABYLON from 'babylonjs';
import { createScene } from './scene';
import { Levels, ILevel } from './levels';
import Platform from './platform';
import Cube from './cube';
import FollowCamera from './camera';
import LevelsGui from './levelsGui';
import { createVisibilityCoordinates } from './utils';

/**
 * distance between the center of the platform and the edge = 5
 * distance between platforms = 2
 *
 * then distance between centers of the two platforms is equal 5 + 5 + 2 = 12
 * starting position of the platform along the Y axis = -8
 */

interface IGameState {
  moving: boolean;
}

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

export default class Game {
  public scene: BABYLON.Scene;
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private platforms: Map<string, Platform> = new Map();
  private startPlatform: Platform | null = null;
  private finishPlatform: Platform | null = null;

  public currentLevel: number = 0;

  private cube: Cube;
  private camera: FollowCamera;
  private gameState: IGameState;

  private levelGui: LevelsGui;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = createScene(this.canvas, this.engine);
    this.cube = new Cube(this.scene);
    this.camera = new FollowCamera(this.scene);
    this.gameState = {
      moving: false,
    };

    this.levelGui = new LevelsGui(this, Levels.length, this.currentLevel);
  }

  public init() {
    this.initControl();
    this.render();
    this.start();
  }

  private start() {
    this.startNewLevel(this.currentLevel);
    if (this.startPlatform)
      this.cube.setPosition(this.startPlatform.mesh.position.x, 9, this.startPlatform.mesh.position.z);
    this.camera.setTarget(this.cube.mesh);
    this.updateRoad();
  }

  public restart() {
    this.platforms.forEach((platform: Platform) => {
      this.scene.removeMesh(platform.mesh);
      platform.material.dispose();
    });
    this.platforms.clear();
    if (this.startPlatform) {
      this.scene.removeMesh(this.startPlatform.mesh);
      this.startPlatform.material.dispose();
      this.startPlatform = null;
    }
    if (this.finishPlatform) {
      this.scene.removeMesh(this.finishPlatform.mesh);
      this.finishPlatform.material.dispose();
      this.finishPlatform = null;
    }
    this.gameState = {
      moving: false,
    };
    this.levelGui.setCurrentLevel(this.currentLevel);
    this.start();
  }

  private startNewLevel(numberOfLevel: number) {
    this.createMap(Levels[numberOfLevel]);
  }

  private createMap(level: ILevel) {
    const map = level.map;

    let currentXCoordinate = 0;
    let currentZCoordinate = 0;

    for (let i = 0; i < level.width; i++) {
      if (i > 0) currentXCoordinate += 12;

      for (let j = 0; j < level.height; j++) {
        if (j > 0) currentZCoordinate += 12;

        if (map[i][j] === 'z') {
          const platform = new Platform(this.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);

          this.platforms.set(`x: ${currentXCoordinate}, z: ${currentZCoordinate}`, platform);
        }

        if (map[i][j] === 's') {
          const platform = new Platform(this.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
          platform.show();

          this.startPlatform = platform;
        }

        if (map[i][j] === 'f') {
          const platform = new Platform(this.scene);
          platform.setPosition(currentXCoordinate, -8, currentZCoordinate);
          platform.show();

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
  }

  private cubeCorrectPositionCheck(): boolean {
    const currentPosition = `x: ${this.cube.mesh.position.x}, z: ${this.cube.mesh.position.z}`;
    return this.platforms.has(currentPosition);
  }

  private cubeFinishPositionCheck(): boolean {
    if (!this.finishPlatform) return false;

    const currentPosition = `x: ${this.cube.mesh.position.x}, z: ${this.cube.mesh.position.z}`;
    const finishPlatformPosition = `x: ${this.finishPlatform.mesh.position.x}, z: ${this.finishPlatform.mesh.position.z}`;

    return currentPosition === finishPlatformPosition;
  }

  private cubeMovingCheck() {
    if (!this.cubeCorrectPositionCheck() && !this.cubeFinishPositionCheck()) {
      this.restart();
    }
    if (this.cubeFinishPositionCheck()) {
      if (this.currentLevel === Levels.length - 1) {
        this.restart();
      } else {
        this.currentLevel += 1;
        this.restart();
      }
    }
    this.updateRoad();
  }

  private async moveAction(directional: string) {
    if (this.gameState.moving) return;
    this.gameState.moving = true;

    switch (directional) {
      case 'up': {
        await Promise.all([this.cube.moveUp(), this.camera.moveUp()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'down': {
        await Promise.all([this.cube.moveDown(), this.camera.moveDown()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'left': {
        await Promise.all([this.cube.moveLeft(), this.camera.moveLeft()]);
        this.cubeMovingCheck();
        this.gameState.moving = false;
        break;
      }
      case 'right': {
        await Promise.all([this.cube.moveRight(), this.camera.moveRight()]);
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

      if (Directional.up === key) {
        this.moveAction('up');
      }

      if (Directional.down === key) {
        this.moveAction('down');
      }

      if (Directional.left === key) {
        this.moveAction('left');
      }

      if (Directional.right === key) {
        this.moveAction('right');
      }
    });
  }

  private render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }
}
