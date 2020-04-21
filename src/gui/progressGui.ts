import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export default class ProgressGui {
  private count: number;
  private guiTexture: GUI.AdvancedDynamicTexture;
  private controls: Map<string, GUI.Control>;

  constructor(scene: BABYLON.Scene, countOfMazesCompleted: number) {
    this.count = countOfMazesCompleted;
    this.controls = new Map();
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Progress_UI', true, scene);
  }

  /**
   * @param count Count of mazes completed
   */
  public setCurrentCount(count: number) {
    this.remove();
    this.count = count;
    this.render();
  }

  public render() {
    const label = new GUI.Rectangle('progress');
    label.background = '#e8dab2';
    label.height = '40px';
    label.alpha = 1;
    label.width = '235px';
    label.cornerRadius = 0;
    label.thickness = 1;
    label.color = '#c0d6df';
    label.horizontalAlignment = GUI.Container.HORIZONTAL_ALIGNMENT_LEFT;
    label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    label.top = '20px';
    label.left = '20px';
    this.guiTexture.addControl(label);

    const labelText = new GUI.TextBlock('control help move up');
    labelText.text = `Mazes completed: ${this.count}`;
    labelText.textHorizontalAlignment = 0;
    labelText.paddingLeft = 20;
    labelText.paddingRight = 20;
    labelText.color = '#4f6d7a';
    label.addControl(labelText);

    this.controls.set(label.name ? label.name : 'control', label);
    this.controls.set(labelText.name ? labelText.name : 'control', labelText);
  }

  private remove() {
    this.controls.forEach((control) => {
      control.dispose();
    });
    this.controls.clear();
  }
}
