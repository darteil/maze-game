import * as BABYLON from 'babylonjs';

export default class Platform {
  scene: BABYLON.Scene;
  mesh: BABYLON.Mesh;
  // showAnimation: BABYLON.Animation;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.mesh = BABYLON.MeshBuilder.CreateBox('platform', { width: 10, height: 4, depth: 10 }, scene);

    var material = new BABYLON.StandardMaterial('cube_material', scene);

    // material.diffuseColor = new BABYLON.Color3(1, 0, 1);
    // material.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    // material.emissiveColor = new BABYLON.Color3(1, 1, 1);
    // material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    // material.alpha = 0.5;

    this.mesh.material = material;
  }

  public setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

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
    this.scene.beginDirectAnimation(this.mesh, [animation[0], animation[1]], 0, 100, false, 5);
  }

  show() {
    const animation = this.createAnimation('show');
    this.scene.beginDirectAnimation(this.mesh, [animation[0], animation[1]], 0, 100, false, 5);
  }
}
