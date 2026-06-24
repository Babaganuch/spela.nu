// Main Game Script - Modular Version
// This file handles the core game loading and UI, while individual games are loaded from separate files

// Game State
let currentGame = null;
let currentLevel = 1;
let score = 0;
let gameActive = false;
let gameLoop = null;
let canvas = null;
let ctx = null;
let modulesLoaded = false;

// Game Configurations
const gamesConfig = {
    'snake': {
        name: 'Snake IO',
        levels: 5,
        pointsPerLevel: [10, 20, 30, 40, 50],
        colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3']
    },
    'geometry-dash': {
        name: 'Geometry Dash Lite',
        levels: 5,
        pointsPerLevel: [15, 25, 35, 45, 55],
        colors: []
    },
    'go-around': {
        name: 'Go Around',
        levels: 5,
        pointsPerLevel: [5, 10, 15, 20, 25],
        colors: []
    },
    'beaver-clicker': {
        name: 'Bäver Clicker',
        levels: 5,
        pointsPerLevel: [20, 40, 60, 80, 100],
        colors: []
    },
    'flappy-bird': {
        name: 'Flappy Bird',
        levels: 5,
        pointsPerLevel: [10, 20, 30, 40, 50],
        colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3']
    },
    'block-blast': {
        name: 'Block Blast',
        levels: 5,
        pointsPerLevel: [15, 25, 35, 45, 55],
        colors: []
    },
    '2048': {
        name: '2048',
        levels: 5,
        pointsPerLevel: [50, 100, 200, 400, 800],
        colors: []
    },
    'tic-tac-toe': {
        name: 'Tick Tack Go',
        levels: 5,
        pointsPerLevel: [10, 20, 30, 40, 50],
        colors: []
    },
    'shark-clicker': {
        name: 'Haj Clicker',
        levels: 5,
        pointsPerLevel: [20, 40, 60, 80, 100],
        colors: []
    },
    'minecraft': {
        name: 'Minecraft',
        levels: 5,
        pointsPerLevel: [20, 30, 40, 50, 60],
        colors: []
    }
};

// User Progress
let userProgress = {
    snake: { level: 1, score: 0, unlocked: true },
    'geometry-dash': { level: 1, score: 0, unlocked: true },
    'go-around': { level: 1, score: 0, unlocked: true },
    'beaver-clicker': { level: 1, score: 0, unlocked: true },
    'flappy-bird': { level: 1, score: 0, unlocked: true },
    'block-blast': { level: 1, score: 0, unlocked: false },
    '2048': { level: 1, score: 0, unlocked: true },
    'tic-tac-toe': { level: 1, score: 0, unlocked: true },
    'shark-clicker': { level: 1, score: 0, unlocked: true },
    minecraft: { level: 1, score: 0, unlocked: false }
};

// Background colors for levels
const levelBackgrounds = [
    'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    'linear-gradient(135deg, #22c1c3, #fdbb2d)',
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a8edea, #fed6e3)'
];

// Selected color for games with color options
let selectedColor = '#FF5733';

// Global game functions - will be populated by module imports
window.initSnakeGame = null;
window.initGeometryDashGame = null;
window.initGoAroundGame = null;
window.initBeaverClickerGame = null;
window.initFlappyBirdGame = null;
window.initBlockBlastGame = null;
window.init2048Game = null;
window.initTicTacToeGame = null;
window.initSharkClickerGame = null;
window.initMinecraftGame = null;

// Load Game Modules - using script tags instead of ES modules
function loadGameModules() {
    return new Promise((resolve, reject) => {
        const gameFiles = [
            './games/snake.js',
            './games/geometry-dash.js',
            './games/go-around.js',
            './games/beaver-clicker.js',
            './games/flappy-bird.js',
            './games/block-blast.js',
            './games/2048.js',
            './games/tic-tac-toe.js',
            './games/shark-clicker.js',
            './games/minecraft.js'
        ];
        
        let loadedCount = 0;
        const totalGames = gameFiles.length;
        
        if (totalGames === 0) {
            resolve();
            return;
        }
        
        gameFiles.forEach(file => {
            const script = document.createElement('script');
            script.src = file;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === totalGames) {
                    console.log('All game modules loaded successfully');
                    resolve();
                }
            };
            script.onerror = (error) => {
                console.error('Failed to load game module:', file, error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    });
}

// Load Game
function loadGame(gameId) {
    if (!modulesLoaded) {
        alert('Vänligen vänta, spel laddas...');
        return;
    }
    
    currentGame = gameId;
    currentLevel = userProgress[gameId].level;
    score = 0;
    
    const gameConfig = gamesConfig[gameId];
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    container.classList.add('active');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'game-wrapper';
    wrapper.style.background = levelBackgrounds[currentLevel - 1] || levelBackgrounds[0];
    
    // Game Header
    const header = document.createElement('div');
    header.className = 'game-header';
    header.innerHTML = `
        <div class="game-title">${gameConfig.name} - Nivå ${currentLevel}</div>
        <div class="game-controls">
            <button class="btn btn-back" onclick="backToMenu()">Tillbaka till spel</button>
        </div>
    `;
    wrapper.appendChild(header);
    
    // Game Info
    const info = document.createElement('div');
    info.className = 'game-info';
    info.innerHTML = `
        <div class="score-display">Poäng: <span id="current-score">0</span> / ${gameConfig.pointsPerLevel[currentLevel - 1] || 10}</div>
        <div class="level-display">Nivå: ${currentLevel} / ${gameConfig.levels}</div>
    `;
    wrapper.appendChild(info);
    
    // Game Settings (for games with color options)
    if (gameConfig.colors.length > 0) {
        const settings = document.createElement('div');
        settings.className = 'game-settings';
        settings.innerHTML = '<div>Välj färg: </div>';
        gameConfig.colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.onclick = () => selectColor(color, colorOption);
            if (color === selectedColor) {
                colorOption.classList.add('selected');
            }
            settings.appendChild(colorOption);
        });
        wrapper.appendChild(settings);
    }
    
    // Game Canvas
    const canvasElement = document.createElement('canvas');
    canvasElement.className = 'game-canvas';
    canvasElement.id = 'game-canvas';
    canvasElement.width = 700;
    canvasElement.height = 500;
    wrapper.appendChild(canvasElement);
    
    // Game Over Screen
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.id = 'game-over';
    gameOver.innerHTML = `
        <h2>Game Over!</h2>
        <div style="font-size: 1.5rem; margin-bottom: 20px;">Dina poäng: <span id="final-score">0</span></div>
        <div class="game-over-buttons">
            <button class="btn btn-primary" onclick="restartGame()">Spela igen</button>
            <button class="btn btn-back" onclick="backToMenu()">Tillbaka till spel</button>
        </div>
    `;
    wrapper.appendChild(gameOver);
    
    // Level Complete Screen
    const levelComplete = document.createElement('div');
    levelComplete.className = 'level-complete';
    levelComplete.id = 'level-complete';
    levelComplete.innerHTML = `
        <h2>Nivå ${currentLevel} Klar!</h2>
        <div style="font-size: 1.5rem; margin-bottom: 20px;">Dina poäng: <span id="level-score">0</span></div>
        <div class="game-over-buttons">
            <button class="btn btn-primary" onclick="nextLevel()">Till nästa nivå</button>
            <button class="btn btn-back" onclick="backToMenu()">Tillbaka till spel</button>
        </div>
    `;
    wrapper.appendChild(levelComplete);
    
    // All Levels Complete Screen
    const allLevelsComplete = document.createElement('div');
    allLevelsComplete.className = 'all-levels-complete';
    allLevelsComplete.id = 'all-levels-complete';
    allLevelsComplete.innerHTML = `
        <div class="mario">🍄</div>
        <h2>Good job!</h2>
        <div style="font-size: 1.5rem; margin-bottom: 20px;">Du har klarat alla nivåer!</div>
        <button class="btn btn-primary" onclick="resetAllLevels()">Spela igen</button>
    `;
    wrapper.appendChild(allLevelsComplete);

    container.appendChild(wrapper);
    
    // Initialize game
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    
    // Start the specific game (this will be handled by the imported module)
    switch(gameId) {
        case 'snake': initSnakeGame(); break;
        case 'geometry-dash': initGeometryDashGame(); break;
        case 'go-around': initGoAroundGame(); break;
        case 'beaver-clicker': initBeaverClickerGame(); break;
        case 'flappy-bird': initFlappyBirdGame(); break;
        case 'block-blast': initBlockBlastGame(); break;
        case 'tic-tac-toe': initTicTacToeGame(); break;
        case 'shark-clicker': initSharkClickerGame(); break;
        case '2048': init2048Game(); break;
        case 'minecraft': initMinecraftGame(); break;
    }
    
    updateScoreDisplay();
}

// Back to Menu
function backToMenu() {
    document.getElementById('game-container').classList.remove('active');
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    gameActive = false;
    // Save progress
    if (currentGame) {
        userProgress[currentGame].score = Math.max(userProgress[currentGame].score, score);
    }
}

// Restart Game
function restartGame() {
    document.getElementById('game-over').classList.remove('active');
    score = 0;
    updateScoreDisplay();
    switch(currentGame) {
        case 'snake': initSnakeGame(); break;
        case 'geometry-dash': initGeometryDashGame(); break;
        case 'go-around': initGoAroundGame(); break;
        case 'beaver-clicker': initBeaverClickerGame(); break;
        case 'flappy-bird': initFlappyBirdGame(); break;
        case 'block-blast': initBlockBlastGame(); break;
        case 'tic-tac-toe': initTicTacToeGame(); break;
        case 'shark-clicker': initSharkClickerGame(); break;
        case '2048': init2048Game(); break;
        case 'minecraft': initMinecraftGame(); break;
    }
}

// Next Level
function nextLevel() {
    document.getElementById('level-complete').classList.remove('active');
    currentLevel++;
    userProgress[currentGame].level = currentLevel;
    score = 0;
    updateScoreDisplay();
    
    const wrapper = document.querySelector('.game-wrapper');
    wrapper.style.background = levelBackgrounds[currentLevel - 1] || levelBackgrounds[0];
    
    document.querySelector('.game-title').textContent = 
        `${gamesConfig[currentGame].name} - Nivå ${currentLevel}`;
    
    document.querySelector('.level-display').textContent = 
        `Nivå: ${currentLevel} / ${gamesConfig[currentGame].levels}`;
    
    document.getElementById('current-score').textContent = '0';
    
    switch(currentGame) {
        case 'snake': initSnakeGame(); break;
        case 'geometry-dash': initGeometryDashGame(); break;
        case 'go-around': initGoAroundGame(); break;
        case 'beaver-clicker': initBeaverClickerGame(); break;
        case 'flappy-bird': initFlappyBirdGame(); break;
        case 'block-blast': initBlockBlastGame(); break;
        case 'tic-tac-toe': initTicTacToeGame(); break;
        case 'shark-clicker': initSharkClickerGame(); break;
        case '2048': init2048Game(); break;
        case 'minecraft': initMinecraftGame(); break;
    }
}

// Reset All Levels
function resetAllLevels() {
    document.getElementById('all-levels-complete').classList.remove('active');
    userProgress[currentGame].level = 1;
    currentLevel = 1;
    score = 0;
    backToMenu();
}

// Update Score Display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Select Color
function selectColor(color, element) {
    selectedColor = color;
    const options = document.querySelectorAll('.color-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Initialize the application
async function init() {
    try {
        // Show loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        // Set initial selected color immediately
        selectedColor = gamesConfig.snake.colors[0];
        
        // Load game modules
        await loadGameModules();
        console.log('All game modules loaded successfully');
        modulesLoaded = true;
        
        // Hide loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Enable game buttons
        document.querySelectorAll('.game-button').forEach(button => {
            button.disabled = false;
        });
        
        // Add event listeners for keyboard controls
        window.addEventListener('keydown', (e) => {
            if (!gameActive) return;
            
            switch(currentGame) {
                case 'snake':
                    switch(e.key) {
                        case 'ArrowUp': if (snakeDirection !== 'down') snakeDirection = 'up'; break;
                        case 'ArrowDown': if (snakeDirection !== 'up') snakeDirection = 'down'; break;
                        case 'ArrowLeft': if (snakeDirection !== 'right') snakeDirection = 'left'; break;
                        case 'ArrowRight': if (snakeDirection !== 'left') snakeDirection = 'right'; break;
                    }
                    break;
                    
                case 'geometry-dash':
                    if (e.key === ' ' && !gdPlayer.jumping) {
                        gdPlayer.velocityY = gdPlayer.jumpForce;
                        gdPlayer.jumping = true;
                    }
                    break;
                    
                case 'go-around':
                    if (e.key === 'ArrowLeft') goAroundPlayer.rotateLeft = true;
                    if (e.key === 'ArrowRight') goAroundPlayer.rotateRight = true;
                    break;
                    
                case 'flappy-bird':
                    if (e.key === ' ') {
                        fbBird.velocityY = fbBird.jumpForce;
                    }
                    break;
                    
                case '2048':
                    handle2048KeyPress(e);
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (!gameActive) return;
            
            if (currentGame === 'go-around') {
                if (e.key === 'ArrowLeft') goAroundPlayer.rotateLeft = false;
                if (e.key === 'ArrowRight') goAroundPlayer.rotateRight = false;
            }
        });
        
    } catch (error) {
        console.error('Failed to load game modules:', error);
    }
}

// Start the application when the page loads
window.addEventListener('load', init);