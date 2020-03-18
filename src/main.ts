import Game from './game';
import { enableDeveloperTools } from './utils';

const canvas = document.getElementById('root') as HTMLCanvasElement;
const game = new Game(canvas);

game.init();

game.scene.debugLayer.show({
  overlay: true,
});

enableDeveloperTools(game.scene);
