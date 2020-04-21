import MapGenerator from './mapGenerator';
/**
 * # - default platform
 * S - start platform
 * F - finish platform
 * current max map size = 30x30
 */

// prettier-ignore
const training_level = [
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','F',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','#',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ','S',' ',' ',' ',' ',' '],
];

export interface ILevel {
  width: number;
  height: number;
  map: string[][];
}

export const trainingLevel: ILevel = {
  width: 10,
  height: 10,
  map: training_level,
};

export const generateNewMap = (): ILevel => {
  const generator = new MapGenerator(30, 30);

  return { width: 30, height: 30, map: generator.generateMap() };
};
