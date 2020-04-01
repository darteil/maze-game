import Game from './game';
import { enableDeveloperTools } from './utils';
import 'normalize.css';

const canvas = document.getElementById('root') as HTMLCanvasElement;
const game = new Game(canvas);

game.init();

// enableDeveloperTools(game);
