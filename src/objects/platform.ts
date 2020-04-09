import * as BABYLON from 'babylonjs';
import { Color3 } from 'babylonjs';

export default class Platform {
  public scene: BABYLON.Scene;
  public mesh: BABYLON.Mesh;
  public material: BABYLON.StandardMaterial;
  public isVisible = false;
  public row = 0;
  public column = 0;
  // showAnimation: BABYLON.Animation;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateBox('platform', { width: 10, height: 4, depth: 10 }, scene);

    this.material = new BABYLON.StandardMaterial('default_platform', scene);

    this.material.alpha = 0.0;
    this.material.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    // this.material.glossiness = 0.0;
    // this.material.microSurface = 1;
    this.mesh.material = this.material;
  }

  public set2dCoordinate(x: number, y: number) {
    this.row = x;
    this.column = y;
  }

  public setColor(color: Color3) {
    this.material.diffuseColor = color;
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Create moving animation
   * @param type Options: 'hide', 'show'
   */
  private createAnimation(type: string) {
    let keys = [];

    const animationMove = new BABYLON.Animation(
      'animation',
      'position.y',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    keys.push({
      frame: 0,
      value: this.mesh.position.y,
    });

    if (type === 'hide') {
      keys.push({
        frame: 100,
        value: this.mesh.position.y - 10,
      });
    }

    if (type === 'show') {
      keys.push({
        frame: 100,
        value: this.mesh.position.y + 10,
      });
    }

    animationMove.setKeys(keys);

    keys = [];

    const animationTransparent = new BABYLON.Animation(
      'animation',
      'material.alpha',
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    );

    if (type === 'hide') {
      keys.push({
        frame: 0,
        value: 1.0,
      });

      keys.push({
        frame: 100,
        value: 0.0,
      });
    }

    if (type === 'show') {
      keys.push({
        frame: 0,
        value: 0.0,
      });

      keys.push({
        frame: 100,
        value: 1.0,
      });
    }

    animationTransparent.setKeys(keys);

    return [animationMove, animationTransparent];
  }

  hide() {
    const animation = this.createAnimation('hide');
    this.scene.beginDirectAnimation(this.mesh, [...animation], 0, 100, false, 5);
    this.isVisible = false;
  }

  show() {
    const animation = this.createAnimation('show');
    this.scene.beginDirectAnimation(this.mesh, [...animation], 0, 100, false, 5);
    this.isVisible = true;
  }
}
