export default function description() {

    const navBar = document.querySelector(".nav-bar");
    const popupWindow = document.getElementById("descriptionPopupWindow");

    // Add description icon in navbar
    navBar.insertAdjacentHTML(
        "beforeend",
        `<i class="fa-solid fa-circle-info description-toggle" title="Game Rules"></i>`
    );

    // Add popup content
    popupWindow.innerHTML = `
        <div class="description-popup">
            <i class="fa-solid fa-xmark close-description"></i>
            <div class="description">
                <strong>Welcome to Battleship!</strong>
                <p>
                    Strategically locate and sink your opponent's fleet before they destroy yours.
                    Both players command a fleet placed on a 10×10 grid. Your objective is to
                    find the location of the enemy ships and sink them before your fleet is destroyed.
                </p>

                <strong>Fleet Composition</strong>
                <ul>
                    <li>Carrier — 5 cells</li>
                    <li>Battleship — 4 cells</li>
                    <li>Cruiser — 3 cells</li>
                    <li>Submarine — 3 cells</li>
                    <li>Destroyer — 2 cells</li>
                </ul>

                <strong>Rules of the Game</strong>
                <ul>
                    <li>The game is played on a 10×10 grid.</li>
                    <li>Ships are placed randomly at the start.</li>
                    <li>Ships cannot overlap or extend outside the board.</li>
                    <li>Ships can be horizontal or vertical.</li>
                    <li>Click a cell in the enemy board to attack.</li>
                    <li><b>Red</b> = Hit, <b>Grey</b> = Miss.</li>
                    <li>Players attack one cell per turn.</li>
                    <li>Sink all enemy ships to win.</li>
                </ul>

                <p><em>Good luck, Captain!</em></p>
            </div>
        </div>
    `;

    const descriptionToggle = document.querySelector(".description-toggle");
    const closeDescription = document.querySelector(".close-description");

    descriptionToggle.addEventListener("click", () => {
        popupWindow.classList.add("active");
    });

    closeDescription.addEventListener("click", () => {
        popupWindow.classList.remove("active");
    });

}