import * as BABYLON from 'babylonjs';

export default class FollowCamera {
  public scene: BABYLON.Scene;
  public camera: BABYLON.FollowCamera;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.camera = new BABYLON.FollowCamera('FollowCamera', new BABYLON.Vector3(0, 0, 0), scene);
    this.scene.activeCamera = this.camera;
  }

  public setTarget(target: BABYLON.Mesh) {
    this.camera.position.x = target.position.x + 70;
    this.camera.position.y = target.position.y + 100;
    this.camera.position.z = target.position.z + 70;

    this.camera.setTarget(target.getAbsolutePosition());
  }

  private createMoveAnimation(directional: string) {
    const keys = [];

    const animation = new BABYLON.Animation(
      'animation',
      'position',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    keys.push({
      frame: 0,
      value: this.camera.position,
    });

    switch (directional) {
      case 'up': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z - 12),
        });
        break;
      }
      case 'down': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z + 12),
        });
        break;
      }
      case 'left': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.camera.position.x + 12, this.camera.position.y, this.camera.position.z),
        });
        break;
      }
      case 'right': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.camera.position.x - 12, this.camera.position.y, this.camera.position.z),
        });
        break;
      }
      default:
        break;
    }

    animation.setKeys(keys);

    return animation;
  }

  public moveUp() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.camera, [this.createMoveAnimation('up')], 0, 100, false, 6, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveDown() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.camera, [this.createMoveAnimation('down')], 0, 100, false, 6, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveLeft() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.camera, [this.createMoveAnimation('left')], 0, 100, false, 6, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveRight() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.camera, [this.createMoveAnimation('right')], 0, 100, false, 6, () => {
        resolve('done');
      });
    });
    return promise;
  }
}
