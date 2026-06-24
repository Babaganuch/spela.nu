// Tic Tac Toe Game
let ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
let ticTacToeCurrentPlayer = 'X';
let ticTacToeGameOver = false;

function initTicTacToeGame() {
    gameActive = true;
    ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
    ticTacToeCurrentPlayer = 'X';
    ticTacToeGameOver = false;
    score = 0;
    updateScoreDisplay();
    
    const container = document.querySelector('.game-wrapper');
    const canvasElement = document.getElementById('game-canvas');
    canvasElement.style.display = 'none';
    
    const ticTacToeHtml = `
        <div class="tic-tac-toe-game">
            <div class="tic-tac-toe-status">Spelare: <span id="current-player">X</span></div>
            <div class="tic-tac-toe-board">
                ${createTicTacToeCells()}
            </div>
            <div class="tic-tac-toe-controls">
                <button onclick="resetTicTacToeGame()" class="btn btn-primary">Starta om</button>
            </div>
        </div>
    `;
    
    container.innerHTML = container.innerHTML.replace(canvasElement.outerHTML, '') + ticTacToeHtml;
}

function createTicTacToeCells() {
    let cells = '';
    for (let i = 0; i < 9; i++) {
        cells += `<div class="tic-tac-toe-cell" onclick="makeTicTacToeMove(${i})">${ticTacToeBoard[i]}</div>`;
    }
    return cells;
}

function makeTicTacToeMove(cellIndex) {
    if (ticTacToeGameOver || ticTacToeBoard[cellIndex] !== '') return;
    
    ticTacToeBoard[cellIndex] = ticTacToeCurrentPlayer;
    
    // Update UI
    const cells = document.querySelectorAll('.tic-tac-toe-cell');
    cells[cellIndex].textContent = ticTacToeCurrentPlayer;
    
    // Check for win
    if (checkTicTacToeWin()) {
        ticTacToeGameOver = true;
        score += 10;
        updateScoreDisplay();
        setTimeout(() => alert(`Spelare ${ticTacToeCurrentPlayer} vann!`), 100);
        return;
    }
    
    // Check for draw
    if (ticTacToeBoard.every(cell => cell !== '')) {
        ticTacToeGameOver = true;
        score += 5;
        updateScoreDisplay();
        setTimeout(() => alert('Oavgjort!'), 100);
        return;
    }
    
    // Switch player
    ticTacToeCurrentPlayer = ticTacToeCurrentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('current-player').textContent = ticTacToeCurrentPlayer;
    
    // Check if level is complete
    if (score >= gamesConfig['tic-tac-toe'].pointsPerLevel[currentLevel - 1]) {
        levelComplete();
    }
}

function checkTicTacToeWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (ticTacToeBoard[a] && ticTacToeBoard[a] === ticTacToeBoard[b] && ticTacToeBoard[a] === ticTacToeBoard[c]) {
            return true;
        }
    }
    return false;
}

function resetTicTacToeGame() {
    initTicTacToeGame();
}

function gameOver() {
    gameActive = false;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.add('active');
}

function levelComplete() {
    gameActive = false;
    
    // Check if all levels are complete
    if (currentLevel >= gamesConfig['tic-tac-toe'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}