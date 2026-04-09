import setupShips from './setUpShips.js';

function homePage() {

    const homeContainer = document.querySelector('.home-container');
    const form = document.getElementById('player-form');
    const playerInput = document.getElementById('player-name');
    const setupContainer = document.querySelector('.setup-container');
    const gameContainer = document.querySelector('.game-container');
    const controls = document.querySelector('.controls');

    gameContainer.style.display = 'none';
    controls.style.display = 'none';

    form.addEventListener('submit', (e) => {

        e.preventDefault();
        const playerName = playerInput.value.trim();
        if (!playerName) return;
        homeContainer.style.display = 'none';
        setupContainer.style.display = 'flex';

        setupShips(playerName);
    });

}

export default homePage;