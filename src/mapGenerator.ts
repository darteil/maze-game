type abyssSection = {
  x: number;
  y: number;
};

interface ICurrentPosition extends abyssSection {}
interface IStartPosition extends abyssSection {}

interface IAbyssSection extends ICurrentPosition {
  host: {
    x: number;
    y: number;
  };
}

export default class MapGenerator {
  private maze: string[][] = [];
  private abyss: IAbyssSection[] = [];
  private currentPosition: ICurrentPosition = { x: 0, y: 0 };
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width % 2 == 0 ? width + 1 : width;
    this.height = height % 2 == 0 ? height + 1 : height;

    for (let y = 0; y < this.height; y++) {
      this.maze[y] = [];
      for (let x = 0; x < this.height; x++) {
        this.maze[y][x] = ' ';
      }
    }

    this.amaze(this.currentPosition.y, this.currentPosition.x, true);
  }

  private valid(y: number, x: number) {
    return y < this.height && y >= 0 && x < this.width && x >= 0 ? true : false;
  }

  private amaze(y: number, x: number, addAbyss: boolean) {
    this.maze[y][x] = '#';

    if (addAbyss && this.valid(y + 1, x) && this.maze[y + 1][x] == ' ') {
      // this.abyss.push([y + 1, x, [y, x]])
      this.abyss.push({
        x,
        y: y + 1,
        host: {
          x,
          y,
        },
      });
    }
    if (addAbyss && this.valid(y - 1, x) && this.maze[y - 1][x] == ' ') {
      // this.emptiness.push([y - 1, x, [y, x]])
      this.abyss.push({
        x,
        y: y - 1,
        host: {
          x,
          y,
        },
      });
    }
    if (addAbyss && this.valid(y, x + 1) && this.maze[y][x + 1] == ' ') {
      // this.emptiness.push([y, x + 1, [y, x]])
      this.abyss.push({
        x: x + 1,
        y,
        host: {
          x,
          y,
        },
      });
    }
    if (addAbyss && this.valid(y, x - 1) && this.maze[y][x - 1] == ' ') {
      // this.emptiness.push([y, x - 1, [y, x]])
      this.abyss.push({
        x: x - 1,
        y,
        host: {
          x,
          y,
        },
      });
    }
  }

  /*---------------------------------------------------------------*/
  /*                       ↓ ↓ ↓ magic ↓ ↓ ↓                       */
  /*---------------------------------------------------------------*/

  public generateMap() {
    const MAZE = [...this.maze];

    while (this.abyss.length !== 0) {
      const randomAbyssSection = this.abyss[Math.floor(Math.random() * this.abyss.length)];
      const host = randomAbyssSection.host;
      const opposite = [host.y + (randomAbyssSection.y - host.y) * 2, host.x + (randomAbyssSection.x - host.x) * 2];

      if (this.valid(opposite[0], opposite[1])) {
        if (MAZE[opposite[0]][opposite[1]] === '#') {
          this.abyss.splice(this.abyss.indexOf(randomAbyssSection), 1);
        } else {
          this.amaze(randomAbyssSection.y, randomAbyssSection.x, false);
          this.amaze(opposite[0], opposite[1], true);
        }
      } else this.abyss.splice(this.abyss.indexOf(randomAbyssSection), 1);
    }

    const abyssSections: abyssSection[] = [];

    for (let i = 1; i < this.width - 2; i++) {
      for (let j = 1; j < this.height - 2; j++) {
        if (MAZE[i][j] === ' ') {
          abyssSections.push({ x: i, y: j });
        }
      }
    }

    const start: IStartPosition = {
      x: 0,
      y: 0,
    };

    // set start platform
    let applyStart = false;
    let randomAbyss = { x: 0, y: 0 };

    while (!applyStart) {
      randomAbyss = abyssSections[Math.floor(Math.random() * abyssSections.length)];

      if (
        MAZE[randomAbyss.x + 1][randomAbyss.y] === '#' ||
        MAZE[randomAbyss.x][randomAbyss.y + 1] === '#' ||
        MAZE[randomAbyss.x - 1][randomAbyss.y] === '#' ||
        MAZE[randomAbyss.x][randomAbyss.y - 1] === '#'
      ) {
        applyStart = true;
      }
    }

    MAZE[randomAbyss.x][randomAbyss.y] = 'S';
    start.x = randomAbyss.x;
    start.y = randomAbyss.y;

    // set finish platform
    let applyFinish = false;
    for (let i = 0; i < abyssSections.length; i++) {
      if (!applyFinish) {
        const value = abyssSections[i];

        if (
          Math.abs(start.x - value.x) >= Math.floor((this.width - 4) / 2) &&
          Math.abs(start.y - value.y) >= Math.floor((this.height - 4) / 2)
        ) {
          MAZE[value.x][value.y] = 'F';
          applyFinish = true;
        }
      }
    }

    return MAZE;
  }
}
