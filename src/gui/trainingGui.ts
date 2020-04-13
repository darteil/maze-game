import * as GUI from 'babylonjs-gui';
import Game from '../game';

export default class TrainingGui {
  public game: Game;
  private guiTexture: GUI.AdvancedDynamicTexture;
  private controls: Map<string, GUI.Control>;

  constructor(game: Game) {
    this.game = game;
    this.controls = new Map();
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('Training_UI', true, this.game.sceneInstance.scene);
  }

  private renderStartLabel() {
    const label = new GUI.Rectangle('start label');
    label.background = 'black';
    label.height = '30px';
    label.alpha = 0.7;
    label.width = '100px';
    label.cornerRadius = 0;
    label.thickness = 1;
    this.guiTexture.addControl(label);
    if (this.game.startPlatform) {
      label.linkWithMesh(this.game.startPlatform.mesh);
    }
    label.linkOffsetX = 140;
    label.linkOffsetY = 70;

    const labelText = new GUI.TextBlock('start text block');
    labelText.text = 'Start';
    labelText.color = '#72a200';
    label.addControl(labelText);

    const line = new GUI.Line('start label line');
    line.lineWidth = 2;
    line.color = 'black';
    line.y2 = -13;
    line.x2 = -50;
    line.linkOffsetX = 30;
    line.linkOffsetY = 20;
    line.alpha = 0.5;
    this.guiTexture.addControl(line);
    if (this.game.startPlatform) {
      line.linkWithMesh(this.game.startPlatform.mesh);
    }
    line.connectedControl = label;

    this.controls.set(label.name ? label.name : 'control', label);
    this.controls.set(labelText.name ? labelText.name : 'control', labelText);
    this.controls.set(line.name ? line.name : 'control', line);
  }

  private renderFinishLabel() {
    const label = new GUI.Rectangle('finish label');
    label.background = 'black';
    label.height = '30px';
    label.alpha = 0.7;
    label.width = '100px';
    label.cornerRadius = 0;
    label.thickness = 1;
    this.guiTexture.addControl(label);
    if (this.game.finishPlatform) {
      label.linkWithMesh(this.game.finishPlatform.mesh);
    }
    label.linkOffsetX = 140;
    label.linkOffsetY = 70;

    const labelText = new GUI.TextBlock('start text block');
    labelText.text = 'Finish';
    labelText.color = '#45b9e6';
    label.addControl(labelText);

    const line = new GUI.Line('finish label line');
    line.lineWidth = 2;
    line.color = 'black';
    line.y2 = -13;
    line.x2 = -50;
    line.linkOffsetX = 25;
    line.linkOffsetY = 12;
    line.alpha = 0.5;
    this.guiTexture.addControl(line);
    if (this.game.finishPlatform) {
      line.linkWithMesh(this.game.finishPlatform.mesh);
    }
    line.connectedControl = label;

    this.controls.set(label.name ? label.name : 'control', label);
    this.controls.set(labelText.name ? labelText.name : 'control', labelText);
    this.controls.set(line.name ? line.name : 'control', line);
  }

  private renderControlHelp() {
    const label = new GUI.Rectangle('controls help');
    label.background = 'black';
    label.height = '120px';
    label.alpha = 0.7;
    label.width = '300px';
    label.cornerRadius = 0;
    label.thickness = 1;
    label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    label.top = '-20px';
    label.left = '20px';
    this.guiTexture.addControl(label);

    const labelText = new GUI.TextBlock('control help move up');
    labelText.text = `Move up: 'w'\nMove down: 's'\nMove left: 'a'\nMove right: 'd'\nPress 'm' to open the minimap`;
    labelText.textHorizontalAlignment = 0;
    labelText.paddingLeft = 20;
    labelText.paddingRight = 20;
    labelText.color = '#e6e6e6';
    label.addControl(labelText);

    this.controls.set(label.name ? label.name : 'control', label);
    this.controls.set(labelText.name ? labelText.name : 'control', labelText);
  }

  public render() {
    this.renderStartLabel();
    this.renderFinishLabel();
    this.renderControlHelp();
  }

  public disable() {
    this.controls.forEach((control) => {
      control.dispose();
    });
    this.controls.clear();
  }

  public dispose() {
    this.guiTexture.dispose();
  }
}
