import * as BABYLON from 'babylonjs';

export default class Cube {
  scene: BABYLON.Scene;
  mesh: BABYLON.Mesh;
  material: BABYLON.StandardMaterial;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateBox('cube', { width: 10, height: 10, depth: 10 }, scene);
    this.material = new BABYLON.StandardMaterial('cube', scene);

    this.material.specularColor = new BABYLON.Color3(0, 0, 0);
    this.mesh.material = this.material;
    // this.mesh.receiveShadows = true;
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Create moving animation
   * @param directional Options: 'up', 'down', 'left', 'right'
   */
  private createMoveAnimation(directional: string): BABYLON.Animation {
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
      value: this.mesh.getAbsolutePosition(),
    });

    switch (directional) {
      case 'up': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z - 12),
        });
        break;
      }
      case 'down': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z + 12),
        });
        break;
      }
      case 'left': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x + 12, this.mesh.position.y, this.mesh.position.z),
        });
        break;
      }
      case 'right': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x - 12, this.mesh.position.y, this.mesh.position.z),
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
      this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('up')], 0, 100, false, 5, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveDown() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('down')], 0, 100, false, 5, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveLeft() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('left')], 0, 100, false, 5, () => {
        resolve('done');
      });
    });
    return promise;
  }

  public moveRight() {
    const promise = new Promise((resolve, reject) => {
      this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('right')], 0, 100, false, 5, () => {
        resolve('done');
      });
    });
    return promise;
  }
}
