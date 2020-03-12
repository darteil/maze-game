import * as BABYLON from 'babylonjs';

export default class Cube {
  scene: BABYLON.Scene;
  mesh: BABYLON.Mesh;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateBox('box', { width: 10, height: 10, depth: 10 }, scene);
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

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
          value: new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z - 10),
        });
        break;
      }
      case 'down': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z + 10),
        });
        break;
      }
      case 'left': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x + 10, this.mesh.position.y, this.mesh.position.z),
        });
        break;
      }
      case 'right': {
        keys.push({
          frame: 100,
          value: new BABYLON.Vector3(this.mesh.position.x - 10, this.mesh.position.y, this.mesh.position.z),
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
    this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('up')], 0, 100, false, 5);
  }

  public moveDown() {
    this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('down')], 0, 100, false, 5);
  }

  public moveLeft() {
    this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('left')], 0, 100, false, 5);
  }

  public moveRight() {
    this.scene.beginDirectAnimation(this.mesh, [this.createMoveAnimation('right')], 0, 100, false, 5);
  }
}
