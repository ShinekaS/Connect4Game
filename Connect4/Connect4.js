let playerRed = "R";
let playerYellow = "Y";
let currPlayer;
let redName;
let yellowName;

let gameOver = false;
let board;

let rows = 6;
let columns = 7;
let currColumns = []; // keeps track of which row each column is at.
let gameMode; // 1 for one player against the computer, 2 for two players

window.onload = function() {
    setGame();
    playBackgroundMusic();
};

function setGame() {
    gameMode = parseInt(prompt("Choose the game mode:\n1. One player against the computer\n2. Two players"));

    redName = prompt("Enter Player Red's Name:");
    if (gameMode === 2) {
        yellowName = prompt("Enter Player Yellow's Name:");
    } else {
        yellowName = "Computer";
    }

    if (redName) {
        playerRed = redName;
    }

    board = [];
    currColumns = [5, 5, 5, 5, 5, 5, 5];
    currPlayer = playerRed;

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(" ");

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function playBackgroundMusic() {
    let backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play();
}

function setPiece() {
    if (gameOver) {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];

    if (r < 0) {
        return;
    }

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer === playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    r -= 1;
    currColumns[c] = r;

    checkWinner();

    if (!gameOver && currPlayer === playerYellow && gameMode === 1) {
        // If it's the computer's turn in one-player mode, make a random move after a short delay
        setTimeout(makeComputerMove, 500);
    }
}

function makeComputerMove() {
    // Generate a random valid move for the computer
    let validMoves = [];
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            validMoves.push(c);
        }
    }

    if (validMoves.length > 0) {
        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        let r = currColumns[randomMove];
        board[r][randomMove] = currPlayer;
        let tile = document.getElementById(r.toString() + "-" + randomMove.toString());
        tile.classList.add("yellow-piece");
        r -= 1;
        currColumns[randomMove] = r;

        checkWinner();
        currPlayer = playerRed; // Switch back to the human player

    }
}

function checkWinner() {
    // Check for a winner
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let player = board[r][c];
            if (player !== " ") {
                // Check horizontal
                if (c + 3 < columns &&
                    player === board[r][c + 1] &&
                    player === board[r][c + 2] &&
                    player === board[r][c + 3]) {
                    setWinner(player);
                    return;
                }

                // Check vertical
                if (r + 3 < rows &&
                    player === board[r + 1][c] &&
                    player === board[r + 2][c] &&
                    player === board[r + 3][c]) {
                    setWinner(player);
                    return;
                }

                // Check diagonal (top-left to bottom-right)
                if (r + 3 < rows && c + 3 < columns &&
                    player === board[r + 1][c + 1] &&
                    player === board[r + 2][c + 2] &&
                    player === board[r + 3][c + 3]) {
                    setWinner(player);
                    return;
                }

                // Check diagonal (top-right to bottom-left)
                if (r + 3 < rows && c - 3 >= 0 &&
                    player === board[r + 1][c - 1] &&
                    player === board[r + 2][c - 2] &&
                    player === board[r + 3][c - 3]) {
                    setWinner(player);
                    return;
                }
            }
        }
    }

    // Check if the board is full
    let isBoardFull = true;
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            isBoardFull = false;
            break;
        }
    }

    if (isBoardFull) {
        setWinner(null);
        return;
    }
}

function setWinner(winner) {
    let winnerText = "";
    if (winner === null) {
        winnerText = "It's a draw!";
    } else if (winner === playerRed) {
        winnerText = `${redName} wins!`;
    } else {
        winnerText = `${yellowName} wins!`;
    }

    let winnerElement = document.getElementById("winner");
    winnerElement.innerText = winnerText;
    gameOver = true;

    // Stop background music when the game is over
    let backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause();

    function resetGame(){
        board = [];
        currColumns = playerRed;
    }
}
