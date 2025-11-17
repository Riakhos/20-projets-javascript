const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let currentPlayer = 'X';

const info = document.querySelector('.tictactoe__info');
info.textContent = `Au tour de ${currentPlayer}`;

const cellsContainer = document.querySelector('.tictactoe__cells-container');
cellsContainer.addEventListener('click', handleTry);

const cellsArray = Array.from(cellsContainer.children);
let gameIsLocked = false;

/**
 * Gère la tentative de jouer dans une cellule.
 * @param {MouseEvent} e - événement de clic.
 */
function handleTry(e) {
    if (e.target === cellsContainer) return;

    const boxIndex = e.target.getAttribute('data-cell-index');

    if (cellsArray[boxIndex].textContent !== '' || gameIsLocked) {
        return
    }

    cellsArray[boxIndex].textContent = currentPlayer;

    checkForGameEnd();
}

/** Vérifie si la partie est terminée (victoire ou match nul),
 * met à jour l'UI et verrouille le jeu si nécessaire.
 */
function checkForGameEnd() {
    for (let i = 0; i < winningCombinations.length; i++) {
        const combinationToCheck = winningCombinations[i];
        // [0, 1, 2]

        const [a, b, c] = combinationToCheck.map(cellIndex => cellsArray[cellIndex].textContent);

        if (a === "" || b === "" || c === "") {
            continue;
        } else if (a === b && b === c) {
            info.textContent = `Le Joueur ${currentPlayer} a gagné ! Appuyer sur espace pour recommencer.`;
            gameIsLocked = true;
            return;
        }
    }

    if (cellsArray.every(cell => cell.textContent !== "")) {
        info.textContent = "Match nul ! Appuyer sur espace pour recommencer.";
        gameIsLocked = true;
        return;
    }

    // Changer de joueur
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    info.textContent = `Au tour de ${currentPlayer}`;
}

document.addEventListener('keydown', handleGameReset);

/**
 * Gère la réinitialisation de la partie lorsque la touche espace est pressée.
 * @param {KeyboardEvent} e - événement de clavier.
 */
function handleGameReset(e) {
    if (e.code = "space") {
        cellsArray.forEach(cell => cell.textContent = '');

        info.textContent = `Au tour de ${currentPlayer}`;
        gameIsLocked = false;
    }
}