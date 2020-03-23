import * as GUI from 'babylonjs-gui';
import Game from './game';

export default class LevelsGui {
  public game: Game;
  public currentLevel: number;
  private countOfLevels: number;
  private guiTexture: GUI.AdvancedDynamicTexture;
  private buttons: GUI.Button[];

  constructor(game: Game, countOfLevels: number, currentLevel: number) {
    this.game = game;
    this.currentLevel = currentLevel;
    this.countOfLevels = countOfLevels;
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.game.scene);
    this.buttons = [];
    this.render();
  }

  public setCurrentLevel(level: number) {
    this.currentLevel = level;
    this.update();
  }

  private render() {
    let padding = 0;

    for (let i = 0; i < this.countOfLevels; i++) {
      const button = GUI.Button.CreateSimpleButton('level button', `${i + 1}`);

      button.horizontalAlignment = GUI.Container.HORIZONTAL_ALIGNMENT_LEFT;
      button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
      button.width = '40px';
      button.height = '40px';
      button.thickness = 2;
      button.background = '#2c2c2c';
      if (i === this.currentLevel) {
        button.color = '#e7a044';
      } else {
        button.color = '#65a479';
      }
      button.top = 5;
      button.left = padding;

      button.onPointerDownObservable.add(() => {
        this.game.currentLevel = i;
        this.game.restart();
      });
      this.buttons.push(button);
      this.guiTexture.addControl(button);
      padding += 45;
    }
  }

  private update() {
    this.buttons.forEach(button => {
      this.guiTexture.removeControl(button);
    });
    this.buttons = [];
    this.render();
  }
}
