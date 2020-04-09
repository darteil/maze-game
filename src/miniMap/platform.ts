import Konva from 'konva';

export default class Platform2D {
  private color: string;
  private x: number;
  private y: number;
  public konvaObject: Konva.Rect;

  constructor(x: number, y: number, color: string) {
    this.color = color;
    this.x = x;
    this.y = y;

    this.konvaObject = new Konva.Rect({
      x: this.x,
      y: this.y,
      width: 10,
      height: 10,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 1,
    });
  }
}
