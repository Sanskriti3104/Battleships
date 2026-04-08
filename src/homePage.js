import Game from './Game.js';

function homePage() {

    const homeContainer = document.querySelector('.home-container');
    const form = document.getElementById('player-form');
    const playerInput = document.getElementById('player-name');
    const gameContainer = document.querySelector('.game-container');
    const controls = document.querySelector('.controls');

    gameContainer.style.display = 'none';
    controls.style.display = 'none';

    form.addEventListener('submit', (e) => {

        e.preventDefault();
        const playerName = playerInput.value.trim();
        if (!playerName) return;
        homeContainer.style.display = 'none';
        gameContainer.style.display = 'flex';
        controls.style.display = 'flex';
        Game();
    });

}

export default homePage;
