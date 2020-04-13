import Konva from 'konva';
import Platform2D from './platform';
import Platform from '../objects/platform';
import Cube from '../objects/cube';

const PLATFORM_WIDTH = 20;
const PLATFORM_HEIGHT = 20;
const CUBE_COLOR = '#dd6e42';
const PLATFORM_COLOR = '#4f6d7a';

export default class MiniMap {
  private container: HTMLDivElement;
  private showStatus = false;
  private stage: Konva.Stage;
  private mainLayer: Konva.Layer;
  private mapLayer: Konva.Layer;
  private playerLayer: Konva.Layer;
  private platforms: Set<string> = new Set();

  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    this.initStyles();
    this.stage = new Konva.Stage({
      width: 600,
      height: 630,
      container: this.container,
    });
    this.mainLayer = new Konva.Layer();
    this.mapLayer = new Konva.Layer();
    this.playerLayer = new Konva.Layer();
    this.stage.hide();

    this.init();
  }

  private init() {
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 600,
      height: 600,
      fill: '#e8dab2',
      stroke: '#c0d6df',
      strokeWidth: 1,
    });

    const legendCubeIcon = new Konva.Rect({
      x: 0,
      y: 610,
      width: 20,
      height: 20,
      fill: CUBE_COLOR,
      stroke: 'black',
      strokeWidth: 1,
    });

    const legendCubeText = new Konva.Text({
      x: 25,
      y: 612,
      text: 'Cube',
      fontSize: 18,
    });

    const legendPlatformIcon = new Konva.Rect({
      x: 80,
      y: 610,
      width: 20,
      height: 20,
      fill: PLATFORM_COLOR,
      stroke: 'black',
      strokeWidth: 1,
    });

    const legendPlatformText = new Konva.Text({
      x: 105,
      y: 612,
      text: 'Platform',
      fontSize: 18,
    });

    this.mainLayer.add(rect);
    this.mainLayer.add(legendCubeIcon);
    this.mainLayer.add(legendCubeText);
    this.mainLayer.add(legendPlatformIcon);
    this.mainLayer.add(legendPlatformText);

    this.stage.add(this.mainLayer);
    this.stage.add(this.mapLayer);
    this.stage.add(this.playerLayer);
  }

  public update(platforms: Map<string, Platform>, cube: Cube) {
    platforms.forEach((platform) => {
      if (!platform.isVisible) return;

      if (!this.platforms.has(`x: ${platform.row}, y: ${platform.column}`)) {
        const rect = new Platform2D(
          PLATFORM_WIDTH,
          PLATFORM_HEIGHT,
          platform.row * PLATFORM_WIDTH,
          platform.column * PLATFORM_HEIGHT,
          PLATFORM_COLOR,
        );
        this.mapLayer.add(rect.konvaObject);
        this.platforms.add(`x: ${platform.row}, y: ${platform.column}`);
      }
    });

    this.playerLayer.removeChildren();
    const player = new Platform2D(
      PLATFORM_WIDTH,
      PLATFORM_HEIGHT,
      cube.row * PLATFORM_WIDTH,
      cube.column * PLATFORM_HEIGHT,
      CUBE_COLOR,
    );
    this.playerLayer.add(player.konvaObject);

    this.stage.draw();
  }

  public clear() {
    this.playerLayer.removeChildren();
    this.mapLayer.removeChildren();
    this.platforms.clear();
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
      this.stage.hide();
      this.showStatus = false;
    } else {
      this.stage.show();
      this.stage.draw();
      this.showStatus = true;
    }
  }
}
