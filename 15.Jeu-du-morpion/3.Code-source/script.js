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

let currentPlayer = "X"

const info = document.querySelector(".tictactoe__info")
info.textContent = `Au tour de ${currentPlayer}`

const cellsContainer = document.querySelector(".tictactoe__cells-container")
cellsContainer.addEventListener("click", handleTry)

const cellsArray = Array.from(cellsContainer.children)
let gameIsLocked = false 

function handleTry(e){
    if(e.target === cellsContainer) return

    const boxIndex = e.target.getAttribute("data-index")

    if(cellsArray[boxIndex].textContent !== "" || gameIsLocked) {
        return
    }

    cellsArray[boxIndex].textContent = currentPlayer

    checkForGameEnd()
}

function checkForGameEnd(){
    for(let i = 0; i < winningCombinations.length; i++) {

        const combinationToCheck = winningCombinations[i]
        // [0, 1, 2]
        
        const [a,b,c] = combinationToCheck.map(cellIndex => cellsArray[cellIndex].textContent)


        console.log(a,b,c)
        if(a === "" || b === "" || c === "") continue

        else if(a === b && b === c) {
            info.textContent = `Le joueur ${currentPlayer} a gagné ! Appuyer sur espace pour recommencer.`
            gameIsLocked = true 
            return
        }
    }

    if(cellsArray.every(cell => cell.textContent !== "")){
        info.textContent = "Match nul ! Appuyer sur espace pour recommencer."
        gameIsLocked = true
        return 
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X"
    info.textContent = `Au tour de ${currentPlayer}`
}

window.addEventListener("keydown", handleGameReset)

function handleGameReset(e){
    if(e.code = "Space") {
        cellsArray.forEach(cell => cell.textContent = "")

        info.textContent = `Au tour de ${currentPlayer}`
        gameIsLocked = false
    }
}