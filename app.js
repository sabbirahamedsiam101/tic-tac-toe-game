let currentPlayer = 'X'; // Player starts first
let playerScore = 0;
let computerScore = 0;
let cells = document.querySelectorAll('.cell');

// Function to handle player's move
function playerMove(cell) {
    if (!cell.textContent) { // Check if the cell is empty
        cell.textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500); // Delay for the computer's move
        }
    }
}

// Function to handle computer's move (Hard AI)
function computerMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].textContent) {
            cells[i].textContent = 'O';
            let score = minimax(cells, 0, false);
            cells[i].textContent = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    cells[bestMove].textContent = 'O';
    checkWinner();
    currentPlayer = 'X'; // Switch player
}

// Minimax algorithm for optimal move calculation
function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result === 'O' ? 1 : result === 'X' ? -1 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].textContent) {
                board[i].textContent = 'O';
                let score = minimax(board, depth + 1, false);
                board[i].textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].textContent) {
                board[i].textContent = 'X';
                let score = minimax(board, depth + 1, true);
                board[i].textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to check for a winner or tie
function checkWinner() {
    // Winning combinations
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winCombos) {
        let [a, b, c] = combo;
        if (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            highlightWinner(cells[a], cells[b], cells[c]);
            if (cells[a].textContent === 'X') {
                playerScore++;
                document.getElementById('player-score').textContent = playerScore;
            } else {
                computerScore++;
                document.getElementById('computer-score').textContent = computerScore;
            }
            setTimeout(resetGame, 1000);
            return;
        }
    }
    // Check for a tie
    if (Array.from(cells).every(cell => cell.textContent)) {
        setTimeout(resetGame, 1000);
    }
}

// Function to highlight the winning combination
function highlightWinner(cell1, cell2, cell3) {
    cell1.style.backgroundColor = '#0f0';
    cell2.style.backgroundColor = '#0f0';
    cell3.style.backgroundColor = '#0f0';
}

// Function to reset the game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#333';
    });
    currentPlayer = 'X';
}
// Event listeners for player's moves
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        playerMove(cell);
    });
});

// Event listener for the reset button
document.getElementById('reset').addEventListener('click', () => {
    resetGame();
});
