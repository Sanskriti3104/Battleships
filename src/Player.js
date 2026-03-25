import Gameboard from '../src/Gameboard.js';

function Player (name) {
    this.name = name;
    this.gameboard = new Gameboard();
}

export default Player;