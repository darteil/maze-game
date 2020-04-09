import Konva from 'konva';
import Platform2D from './platform';
import Platform from '../objects/platform';

export default class MiniMap {
  private container: HTMLDivElement;
  private showStatus = false;
  private stage: Konva.Stage;
  private mainLayer: Konva.Layer;
  private mapLayer: Konva.Layer;
  // private startPosition:
  private platforms: string[];

  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    this.initStyles();
    this.stage = new Konva.Stage({
      width: 600,
      height: 600,
      container: this.container,
    });
    this.mainLayer = new Konva.Layer();
    this.mapLayer = new Konva.Layer();
    this.stage.hide();

    this.platforms = [];
    this.init();
  }

  private init() {
    var rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 600,
      height: 600,
      fill: '#e8dab2',
      stroke: '#c0d6df',
      strokeWidth: 1,
    });
    this.mainLayer.add(rect);

    this.stage.add(this.mainLayer);
    this.stage.add(this.mapLayer);
  }

  public update(platforms3d: Map<string, Platform>) {
    platforms3d.forEach((platform) => {
      if (!platform.isVisible) return;

      let flag = true;

      for (let i = 0; i < this.platforms.length; i++) {
        if (`x: ${platform.row}, y: ${platform.column}` === this.platforms[i]) flag = false;
      }

      if (flag) {
        const rect = new Platform2D(platform.row * 10, platform.column * 10, '#4f6d7a');
        this.mapLayer.add(rect.konvaObject);
      }
    });

    this.stage.draw();
  }

  private initStyles() {
    this.container.style.cssText = `
      width: 600px;
      height: 600px;
      margin: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    `;
  }

  public toggle() {
    if (this.showStatus) {
      // this.container.style.display = 'none';
      this.stage.hide();
      this.showStatus = false;
    } else {
      // this.container.style.display = 'block';
      this.stage.show();
      this.stage.draw();
      // this.mainLayer.show();
      // this.mainLayer.draw();
      this.showStatus = true;
    }
  }
}
