import Konva from 'konva';

export default class Platform2D {
  private color: string;
  private row: number;
  private column: number;
  public konvaObject: Konva.Rect;

  constructor(row: number, column: number, color: string) {
    this.color = color;
    this.row = row;
    this.column = column;

    this.konvaObject = new Konva.Rect({
      x: this.column,
      y: this.row,
      width: 10,
      height: 10,
      fill: this.color,
      stroke: 'black',
      strokeWidth: 1,
    });
  }
}
