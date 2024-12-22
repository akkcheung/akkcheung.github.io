import { startGame, hit, stand } from './game.js';

document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
document.getElementById('new-game-button').addEventListener('click', startGame);

startGame();

console.log('Game is start!')
