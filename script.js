// Game State
let currentGame = null;
let currentLevel = 1;
let score = 0;
let gameActive = false;
let gameLoop = null;
let canvas = null;
let ctx = null;

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
    'minecraft': {
    '2048': {
        name: '2048',
        levels: 5,
        pointsPerLevel: [50, 100, 200, 400, 800],
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
    minecraft: {
    '2048': { level: 1, score: 0, unlocked: true },
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

// Load Game
function loadGame(gameId) {
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
    
    // Start the specific game
    switch(gameId) {
        case 'snake': initSnakeGame(); break;
        case 'geometry-dash': initGeometryDashGame(); break;
        case 'go-around': initGoAroundGame(); break;
        case 'beaver-clicker': initBeaverClickerGame(); break;
        case 'flappy-bird': initFlappyBirdGame(); break;
        case 'block-blast': initBlockBlastGame(); break;
        case '2048': init2048Game(); break;
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
        
        case '2048': init2048Game(); break;
}        }
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
        case '2048': init2048Game(); break;
    }
}        }
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
    if (scoreElement) scoreElement.textContent = Math.floor(score);
    
    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) finalScoreElement.textContent = Math.floor(score);
    
    const levelScoreElement = document.getElementById('level-score');
    if (levelScoreElement) levelScoreElement.textContent = Math.floor(score);
}

// Select Color
function selectColor(color, element) {
    selectedColor = color;
    const options = document.querySelectorAll('.color-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

// Game Over
function gameOver() {
    gameActive = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    document.getElementById('game-over').classList.add('active');
    
    // Check if score is enough for next level
    const requiredScore = gamesConfig[currentGame].pointsPerLevel[currentLevel - 1] || 10;
    if (score >= requiredScore) {
        // Level complete
        document.getElementById('game-over').classList.remove('active');
        document.getElementById('level-complete').classList.add('active');
        
        // Check if all levels are complete
        if (currentLevel >= gamesConfig[currentGame].levels) {
            document.getElementById('level-complete').classList.remove('active');
            document.getElementById('all-levels-complete').classList.add('active');
            
            // Unlock next game if available
            const games = Object.keys(gamesConfig);
            const currentIndex = games.indexOf(currentGame);
            if (currentIndex < games.length - 1) {
                const nextGame = games[currentIndex + 1];
                userProgress[nextGame].unlocked = true;
            }
        }
    }
    
    // Save progress
    userProgress[currentGame].score = Math.max(userProgress[currentGame].score, Math.floor(score));
}

// ==================== SNAKE GAME ====================
let snake = [];
let snakeDirection = 'right';
let food = {};
let gridSize = 20;

function initSnakeGame() {
    gameActive = true;
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    snakeDirection = 'right';
    spawnFood();
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateSnake, 150 - (currentLevel * 10));
}

function updateSnake() {
    if (!gameActive) return;
    
    const head = {x: snake[0].x, y: snake[0].y};
    switch(snakeDirection) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check collisions
    if (head.x < 0 || head.x >= canvas.width/gridSize || 
        head.y < 0 || head.y >= canvas.height/gridSize ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScoreDisplay();
        spawnFood();
    } else {
        snake.pop();
    }
    
    drawSnake();
}

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? selectedColor : '#888';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // Draw food
    ctx.fillStyle = '#FF5733';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2,
        0, Math.PI * 2
    );
    ctx.fill();
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
    
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }
}

// ==================== GEOMETRY DASH LITE ====================
let gdPlayer = {x: 50, y: 200, width: 30, height: 30, velocityY: 0, jumping: false};
let gdObstacles = [];
let gdGameSpeed = 5;

function initGeometryDashGame() {
    gameActive = true;
    gdPlayer = {x: 50, y: 200, width: 30, height: 30, velocityY: 0, jumping: false};
    gdObstacles = [];
    score = 0;
    updateScoreDisplay();
    
    generateGdObstacles();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGeometryDash, 50);
}

function generateGdObstacles() {
    gdObstacles = [];
    const types = ['spike', 'block', 'triangle'];
    const spacing = 200 + (currentLevel * 30);
    
    for (let i = 0; i < 15; i++) {
        const x = 700 + (i * spacing);
        const type = types[Math.floor(Math.random() * types.length)];
        let width, height;
        
        switch(type) {
            case 'spike': width = 30; height = 30; break;
            case 'block': width = 50 + (currentLevel * 5); height = 50 + (currentLevel * 5); break;
            case 'triangle': width = 40; height = 40; break;
        }
        
        const y = canvas.height - height - 20;
        gdObstacles.push({x, y, width, height, type});
    }
}

function updateGeometryDash() {
    if (!gameActive) return;
    
    gdPlayer.x += gdGameSpeed + (currentLevel * 0.5);
    
    // Apply gravity
    gdPlayer.velocityY += 1.5;  // ÖKAD GRAVITATION
    
    // Apply velocity to position
    gdPlayer.y += gdPlayer.velocityY;
    
    // Ground collision
    if (gdPlayer.y + gdPlayer.height > canvas.height - 20) {
        gdPlayer.y = canvas.height - 20 - gdPlayer.height;
        gdPlayer.velocityY = 0;
        gdPlayer.jumping = false;
    }
    
    for (let i = 0; i < gdObstacles.length; i++) {
        const obs = gdObstacles[i];
        if (gdPlayer.x + gdPlayer.width > obs.x &&
            gdPlayer.x < obs.x + obs.width &&
            gdPlayer.y + gdPlayer.height > obs.y &&
            gdPlayer.y < obs.y + obs.height) {
            gameOver();
            return;
        }
        
        if (obs.x + obs.width < 0) {
            gdObstacles.splice(i, 1);
            i--;
            score += 5;
            updateScoreDisplay();
            
            const types = ['spike', 'block', 'triangle'];
            const type = types[Math.floor(Math.random() * types.length)];
            let width, height;
            
            switch(type) {
                case 'spike': width = 30; height = 30; break;
                case 'block': width = 50 + (currentLevel * 5); height = 50 + (currentLevel * 5); break;
                case 'triangle': width = 40; height = 40; break;
            }
            
            const y = canvas.height - height - 20;
            gdObstacles.push({x: canvas.width, y, width, height, type});
        }
    }
    
    gdObstacles.forEach(obs => {
        obs.x -= gdGameSpeed + (currentLevel * 0.5);
    });
    
    drawGeometryDash();
}

function drawGeometryDash() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    ctx.fillStyle = selectedColor;
    ctx.fillRect(gdPlayer.x, gdPlayer.y, gdPlayer.width, gdPlayer.height);
    
    gdObstacles.forEach(obs => {
        ctx.fillStyle = obs.type === 'spike' ? '#ff0000' : 
                        obs.type === 'block' ? '#0000ff' : '#00ff00';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        if (obs.type === 'spike') {
            ctx.fillStyle = '#ff9999';
            ctx.beginPath();
            ctx.moveTo(obs.x + obs.width/2, obs.y);
            ctx.lineTo(obs.x, obs.y + obs.height);
            ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// ==================== GO AROUND (LOL BEANS) ====================
let gaPlayer = {x: 350, y: 250, radius: 20, speed: 5};
let gaObstacles = [];
let gaBots = [];

function initGoAroundGame() {
    gameActive = true;
    gaPlayer = {x: 350, y: 250, radius: 20, speed: 5 + (currentLevel * 0.5)};
    gaObstacles = [];
    gaBots = [];
    score = 0;
    updateScoreDisplay();
    
    for (let i = 0; i < 5 + (currentLevel * 2); i++) {
        gaObstacles.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            radius: 15 + (currentLevel * 2)
        });
    }
    
    for (let i = 0; i < 2 + currentLevel; i++) {
        gaBots.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            radius: 20,
            direction: Math.random() * Math.PI * 2,
            speed: 2 + (currentLevel * 0.5)
        });
    }
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGoAround, 50);
}

function updateGoAround() {
    if (!gameActive) return;
    
    gaBots.forEach(bot => {
        if (Math.random() < 0.02) {
            bot.direction += (Math.random() - 0.5) * 0.5;
        }
        
        bot.x += Math.cos(bot.direction) * bot.speed;
        bot.y += Math.sin(bot.direction) * bot.speed;
        
        if (bot.x < bot.radius) bot.direction = Math.PI - bot.direction;
        if (bot.x > canvas.width - bot.radius) bot.direction = Math.PI - bot.direction;
        if (bot.y < bot.radius) bot.direction = -bot.direction;
        if (bot.y > canvas.height - bot.radius) bot.direction = -bot.direction;
        
        const dx = gaPlayer.x - bot.x;
        const dy = gaPlayer.y - bot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < gaPlayer.radius + bot.radius) {
            gameOver();
            return;
        }
    });
    
    for (const obs of gaObstacles) {
        const dx = gaPlayer.x - obs.x;
        const dy = gaPlayer.y - obs.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < gaPlayer.radius + obs.radius) {
            score += 1;
            updateScoreDisplay();
            obs.x = Math.random() * (canvas.width - 40) + 20;
            obs.y = Math.random() * (canvas.height - 40) + 20;
        }
    }
    
    drawGoAround();
}

function drawGoAround() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(gaPlayer.x, gaPlayer.y, gaPlayer.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff0000';
    gaObstacles.forEach(obs => {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.fillStyle = '#0000ff';
    gaBots.forEach(bot => {
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, bot.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        const eyeX = bot.x + Math.cos(bot.direction) * bot.radius * 0.5;
        const eyeY = bot.y + Math.sin(bot.direction) * bot.radius * 0.5;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0000ff';
    });
}

// ==================== BEAVER CLICKER ====================
let clickerScore = 0;
let autoClickers = 0;
let clickerMultiplier = 1;
let autoClickerLoop = null;

function initBeaverClickerGame() {
    gameActive = true;
    clickerScore = 0;
    score = 0;
    updateScoreDisplay();
    
    const container = document.querySelector('.game-wrapper');
    const canvasElement = document.getElementById('game-canvas');
    canvasElement.style.display = 'none';
    
    const clickerHtml = `
        <div class="clicker-display">
            <div class="clicker-count" id="clicker-count">0</div>
            <div class="clicker-beaver" onclick="clickBeaver()">🦫</div>
            <div style="font-size: 1.2rem; margin: 10px 0;">Poäng per klick: <span id="multiplier-display">${clickerMultiplier}</span></div>
            <div style="font-size: 1.2rem; margin: 10px 0;">Auto-clickers: <span id="auto-clicker-count">${autoClickers}</span></div>
            
            <div class="upgrade-item">
                <div>
                    <strong>Auto-clicker</strong><br>
                    <small>Kostar: 50 poäng</small>
                </div>
                <button onclick="buyAutoClicker()">Köpa</button>
            </div>
            
            <div class="upgrade-item">
                <div>
                    <strong>Dubbla poäng</strong><br>
                    <small>Kostar: 100 poäng</small>
                </div>
                <button onclick="buyDoublePoints()">Köpa</button>
            </div>
            
            <div class="upgrade-item">
                <div>
                    <strong>Trippla poäng</strong><br>
                    <small>Kostar: 300 poäng</small>
                </div>
                <button onclick="buyTriplePoints()">Köpa</button>
            </div>
        </div>
    `;
    
    container.innerHTML = container.innerHTML.replace(canvasElement.outerHTML, '') + clickerHtml;
    
    if (autoClickerLoop) clearInterval(autoClickerLoop);
    autoClickerLoop = setInterval(() => {
        if (gameActive && currentGame === 'beaver-clicker') {
            clickerScore = Math.min(clickerScore + autoClickers * 0.1 * clickerMultiplier, 200);
            score += autoClickers * 0.1 * clickerMultiplier;
            updateClickerDisplay();
        }
    }, 100);
}

function clickBeaver() {
    if (!gameActive || currentGame !== 'beaver-clicker') return;
    
    clickerScore = Math.min(clickerScore + clickerMultiplier, 200);
    score += clickerMultiplier;
    updateClickerDisplay();
    
    const beaver = document.querySelector('.clicker-beaver');
    beaver.style.transform = 'scale(0.95)';
    setTimeout(() => {
        beaver.style.transform = 'scale(1)';
    }, 100);
}

function buyAutoClicker() {
    if (!gameActive || currentGame !== 'beaver-clicker') return;
    if (clickerScore >= 50) {
        clickerScore -= 50;
        autoClickers++;
        updateClickerDisplay();
    }
}

function buyDoublePoints() {
    if (!gameActive || currentGame !== 'beaver-clicker') return;
    if (clickerScore >= 100) {
        clickerScore -= 100;
        clickerMultiplier *= 2;
        updateClickerDisplay();
    }
}

function buyTriplePoints() {
    if (!gameActive || currentGame !== 'beaver-clicker') return;
    if (clickerScore >= 300) {
        clickerScore -= 300;
        clickerMultiplier *= 3;
        updateClickerDisplay();
    }
}

function updateClickerDisplay() {
    const countElement = document.getElementById('clicker-count');
    if (countElement) countElement.textContent = Math.floor(clickerScore);
    
    const autoElement = document.getElementById('auto-clicker-count');
    if (autoElement) autoElement.textContent = autoClickers;
    
    const multiElement = document.getElementById('multiplier-display');
    if (multiElement) multiElement.textContent = clickerMultiplier;
    
    updateScoreDisplay();
}

// ==================== FLAPPY BIRD ====================
let fbBird = {x: 100, y: 250, width: 40, height: 30, velocityY: 0, gravity: 0.5, jumpForce: -8};
let fbPipes = [];
let fbPipeGap = 150;
let fbPipeFrequency = 1500;
let fbLastPipe = 0;
let fbGameSpeed = 3;

function initFlappyBirdGame() {
    gameActive = true;
    fbBird = {x: 100, y: 250, width: 40, height: 30, velocityY: 0, gravity: 0.5, jumpForce: -8};
    fbPipes = [];
    fbLastPipe = 0;
    score = 0;
    updateScoreDisplay();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateFlappyBird, 50);
}

function updateFlappyBird() {
    if (!gameActive) return;
    
    fbBird.velocityY += fbBird.gravity;
    fbBird.y += fbBird.velocityY;
    
    if (fbBird.y + fbBird.height > canvas.height || fbBird.y < 0) {
        gameOver();
        return;
    }
    
    const now = Date.now();
    if (now - fbLastPipe > fbPipeFrequency) {
        const height = 100 + Math.random() * 200;
        fbPipes.push({
            x: canvas.width,
            height: height,
            passed: false
        });
        fbLastPipe = now;
    }
    
    fbPipes.forEach(pipe => {
        pipe.x -= fbGameSpeed + (currentLevel * 0.3);
        
        if (fbBird.x + fbBird.width > pipe.x &&
            fbBird.x < pipe.x + 50 &&
            (fbBird.y < pipe.height || fbBird.y + fbBird.height > pipe.height + fbPipeGap)) {
            gameOver();
            return;
        }
        
        if (!pipe.passed && fbBird.x > pipe.x + 50) {
            pipe.passed = true;
            score++;
            updateScoreDisplay();
        }
        
        if (pipe.x + 50 < 0) {
            fbPipes = fbPipes.filter(p => p !== pipe);
        }
    });
    
    drawFlappyBird();
}

function drawFlappyBird() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = selectedColor;
    ctx.fillRect(fbBird.x, fbBird.y, fbBird.width, fbBird.height);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(fbBird.x + 30, fbBird.y + 15, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#00aa00';
    fbPipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + fbPipeGap, 50, canvas.height - pipe.height - fbPipeGap);
    });
}

// ==================== BLOCK BLAST ====================
let bbBlocks = [];
let bbBlockRows = 5;
let bbBlockCols = 8;
let bbBlockSize = 50;
let bbBall = {x: 350, y: 450, radius: 10, dx: 4, dy: -4};
let bbPaddle = {x: 300, y: 480, width: 100, height: 15, speed: 8};

function initBlockBlastGame() {
    gameActive = true;
    bbBlocks = [];
    score = 0;
    updateScoreDisplay();
    
    bbBlockRows = 5 + currentLevel;
    
    for (let r = 0; r < bbBlockRows; r++) {
        for (let c = 0; c < bbBlockCols; c++) {
            const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
            bbBlocks.push({
                x: c * (bbBlockSize + 5) + 50,
                y: r * (bbBlockSize + 5) + 50,
                width: bbBlockSize,
                height: bbBlockSize,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }
    
    bbBall = {x: 350, y: 450, radius: 10, dx: 4, dy: -4};
    bbPaddle = {x: 300, y: 480, width: 100, height: 15, speed: 8};
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateBlockBlast, 30);
}

function updateBlockBlast() {
    if (!gameActive) return;
    
    bbBall.x += bbBall.dx;
    bbBall.y += bbBall.dy;
    
    if (bbBall.x - bbBall.radius < 0 || bbBall.x + bbBall.radius > canvas.width) {
        bbBall.dx *= -1;
    }
    if (bbBall.y - bbBall.radius < 0) {
        bbBall.dy *= -1;
    }
    
    if (bbBall.y + bbBall.radius > bbPaddle.y &&
        bbBall.y - bbBall.radius < bbPaddle.y + bbPaddle.height &&
        bbBall.x + bbBall.radius > bbPaddle.x &&
        bbBall.x - bbBall.radius < bbPaddle.x + bbPaddle.width) {
        bbBall.dy = -Math.abs(bbBall.dy);
        const hitPosition = (bbBall.x - (bbPaddle.x + bbPaddle.width/2)) / (bbPaddle.width/2);
        bbBall.dx = hitPosition * 5;
    }
    
    if (bbBall.y + bbBall.radius > canvas.height) {
        gameOver();
        return;
    }
    
    for (let i = 0; i < bbBlocks.length; i++) {
        const block = bbBlocks[i];
        if (bbBall.x + bbBall.radius > block.x &&
            bbBall.x - bbBall.radius < block.x + block.width &&
            bbBall.y + bbBall.radius > block.y &&
            bbBall.y - bbBall.radius < block.y + block.height) {
            
            const dx = Math.min(
                Math.abs(bbBall.x - (block.x + block.width)),
                Math.abs(bbBall.x - block.x)
            );
            const dy = Math.min(
                Math.abs(bbBall.y - (block.y + block.height)),
                Math.abs(bbBall.y - block.y)
            );
            
            if (dx < dy) bbBall.dx *= -1;
            else bbBall.dy *= -1;
            
            bbBlocks.splice(i, 1);
            score++;
            updateScoreDisplay();
            
            if (bbBlocks.length === 0) {
                gameActive = false;
                document.getElementById('level-complete').classList.add('active');
            }
            
            break;
        }
    }
    
    drawBlockBlast();
}

function drawBlockBlast() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bbBlocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bbBall.x, bbBall.y, bbBall.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = selectedColor;
    ctx.fillRect(bbPaddle.x, bbPaddle.y, bbPaddle.width, bbPaddle.height);
}

// ==================== MINECRAFT ====================
let mcPlayer = {x: 350, y: 350, width: 40, height: 60, speed: 5};
let mcBlocks = [];
let mcInventory = {wood: 0, stone: 0, diamond: 0};

function initMinecraftGame() {
    gameActive = true;
    mcPlayer = {x: 350, y: 350, width: 40, height: 60, speed: 5};
    mcBlocks = [];
    mcInventory = {wood: 0, stone: 0, diamond: 0};
    score = 0;
    updateScoreDisplay();
    
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 15; y++) {
            const types = ['dirt', 'stone', 'wood', 'diamond'];
            const weights = [0.6, 0.3, 0.08, 0.02];
            let type = 'air';
            
            if (y >= 10) type = 'dirt';
            else if (y >= 7) {
                const r = Math.random();
                if (r < weights[0]) type = 'dirt';
                else if (r < weights[0] + weights[1]) type = 'stone';
                else if (r < weights[0] + weights[1] + weights[2]) type = 'wood';
                else type = 'diamond';
            }
            
            if (type !== 'air') {
                mcBlocks.push({
                    x: x * 40,
                    y: canvas.height - (y + 1) * 40,
                    width: 40,
                    height: 40,
                    type: type
                });
            }
        }
    }
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateMinecraft, 50);
}

function updateMinecraft() {
    if (!gameActive) return;
    drawMinecraft();
}

function drawMinecraft() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    mcBlocks.forEach(block => {
        switch(block.type) {
            case 'dirt': ctx.fillStyle = '#8B4513'; break;
            case 'stone': ctx.fillStyle = '#808080'; break;
            case 'wood': ctx.fillStyle = '#8B4513'; break;
            case 'diamond': ctx.fillStyle = '#00BFFF'; break;
        }
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
    
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(mcPlayer.x, mcPlayer.y - mcPlayer.height, mcPlayer.width, mcPlayer.height);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(mcPlayer.x + 10, mcPlayer.y - mcPlayer.height, 5, 10);
    ctx.fillRect(mcPlayer.x + 25, mcPlayer.y - mcPlayer.height, 5, 10);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText("🪵: " + mcInventory.wood, 20, 30);
    ctx.fillText("🪨: " + mcInventory.stone, 20, 50);
    ctx.fillText("💎: " + mcInventory.diamond, 20, 70);
}

// ==================== CONTROLS ====================
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
                gdPlayer.velocityY = -12;
                gdPlayer.jumping = true;
            }
            break;
            
        case 'go-around':
            const speed = gaPlayer.speed;
            switch(e.key) {
                case 'ArrowUp': gaPlayer.y -= speed; break;
                case 'ArrowDown': gaPlayer.y += speed; break;
                case 'ArrowLeft': gaPlayer.x -= speed; break;
                case 'ArrowRight': gaPlayer.x += speed; break;
            }
            gaPlayer.x = Math.max(gaPlayer.radius, Math.min(canvas.width - gaPlayer.radius, gaPlayer.x));
            gaPlayer.y = Math.max(gaPlayer.radius, Math.min(canvas.height - gaPlayer.radius, gaPlayer.y));
            break;
            
        case 'flappy-bird':
            if (e.key === ' ') {
                fbBird.velocityY = fbBird.jumpForce;
            }
            break;
            
        case 'block-blast':
            if (e.key === 'ArrowLeft' && bbPaddle.x > 0) bbPaddle.x -= bbPaddle.speed;
            if (e.key === 'ArrowRight' && bbPaddle.x + bbPaddle.width < canvas.width) bbPaddle.x += bbPaddle.speed;
            break;
            
        case '2048':
            handle2048KeyPress(e);
            break;
            
        case 'minecraft':
            const mcSpeed = mcPlayer.speed;
            switch(e.key) {
                case 'ArrowUp': mcPlayer.y -= mcSpeed; break;
                case 'ArrowDown': mcPlayer.y += mcSpeed; break;
                case 'ArrowLeft': mcPlayer.x -= mcSpeed; break;
                case 'ArrowRight': mcPlayer.x += mcSpeed; break;
                case ' ':
                    for (let i = 0; i < mcBlocks.length; i++) {
                        const block = mcBlocks[i];
                        if (Math.abs(mcPlayer.x + mcPlayer.width/2 - (block.x + block.width/2)) < 30 &&
                            Math.abs(mcPlayer.y - mcPlayer.height/2 - (block.y + block.height/2)) < 30) {
                            
                            mcInventory[block.type]++;
                            score++;
                            updateScoreDisplay();
                            mcBlocks.splice(i, 1);
                            break;
                        }
                    }
                    break;
            }
            mcPlayer.x = Math.max(0, Math.min(canvas.width - mcPlayer.width, mcPlayer.x));
            mcPlayer.y = Math.max(mcPlayer.height, Math.min(canvas.height, mcPlayer.y));
            break;
    }
});;



// ==================== 2048 GAME ====================

// 2048 Game Variables
let game2048 = {
    grid: null,
    size: 4,
    tiles: [],
    gameOver: false,
    won: false,
    score: 0
};

// Colors for different tile values
const tileColors = {
    0: '#CDC1B4',
    2: '#EEE4DA',
    4: '#EDE0C8',
    8: '#F2B179',
    16: '#F59563',
    32: '#F67C5F',
    64: '#F65E3B',
    128: '#EDCF72',
    256: '#EDCC61',
    512: '#EDC850',
    1024: '#EDC53F',
    2048: '#EDC22E',
    4096: '#3E3933',
    8192: '#3E3933'
};

// Text colors for tiles
const tileTextColors = {
    0: '#F9F6F2',
    2: '#776E65',
    4: '#776E65',
    8: '#F9F6F2',
    16: '#F9F6F2',
    32: '#F9F6F2',
    64: '#F9F6F2',
    128: '#F9F6F2',
    256: '#F9F6F2',
    512: '#F9F6F2',
    1024: '#F9F6F2',
    2048: '#F9F6F2',
    4096: '#F9F6F2',
    8192: '#F9F6F2'
};

// Initialize 2048 Game
function init2048Game() {
    gameActive = true;
    game2048.grid = create2048Grid();
    game2048.tiles = [];
    game2048.gameOver = false;
    game2048.won = false;
    game2048.score = 0;
    
    // Add initial tiles
    addRandomTile();
    addRandomTile();
    
    // Clear any existing game loop
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // Start game loop for rendering
    gameLoop = setInterval(() => {
        if (currentGame === '2048' && gameActive) {
            draw2048Game();
        }
    }, 1000 / 60);
    
    // Draw initial state
    draw2048Game();
}

// Create empty grid
function create2048Grid() {
    const grid = [];
    for (let i = 0; i < game2048.size; i++) {
        grid[i] = [];
        for (let j = 0; j < game2048.size; j++) {
            grid[i][j] = 0;
        }
    }
    return grid;
}

// Add a random tile (2 or 4) to an empty cell
function addRandomTile() {
    const emptyCells = [];
    
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) {
                emptyCells.push({i, j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Handle keyboard input for 2048
function handle2048KeyPress(e) {
    if (!gameActive || game2048.gameOver) return;
    
    let moved = false;
    
    switch(e.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        addRandomTile();
        draw2048Game();
        
        // Check if game is over
        if (isGameOver()) {
            game2048.gameOver = true;
            gameActive = false;
            score = game2048.score;
            updateScoreDisplay();
            document.getElementById('final-score').textContent = score;
            document.getElementById('game-over').classList.add('active');
        }
        
        // Check if player won (reached 2048)
        if (!game2048.won && hasWon()) {
            game2048.won = true;
        }
    }
}

// Move tiles left
function moveLeft() {
    let moved = false;
    const newGrid = [];
    
    for (let i = 0; i < game2048.size; i++) {
        const row = game2048.grid[i].filter(val => val !== 0);
        const newRow = [];
        let j = 0;
        
        while (j < row.length) {
            if (j + 1 < row.length && row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                game2048.score += row[j] * 2;
                score = game2048.score;
                updateScoreDisplay();
                j += 2;
                moved = true;
            } else {
                newRow.push(row[j]);
                j++;
            }
        }
        
        while (newRow.length < game2048.size) {
            newRow.push(0);
        }
        
        if (JSON.stringify(newRow) !== JSON.stringify(game2048.grid[i])) {
            moved = true;
        }
        
        newGrid[i] = newRow;
    }
    
    if (moved) {
        game2048.grid = newGrid;
    }
    
    return moved;
}

// Move tiles right
function moveRight() {
    let moved = false;
    const newGrid = [];
    
    for (let i = 0; i < game2048.size; i++) {
        const row = game2048.grid[i].filter(val => val !== 0).reverse();
        const newRow = [];
        let j = 0;
        
        while (j < row.length) {
            if (j + 1 < row.length && row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                game2048.score += row[j] * 2;
                score = game2048.score;
                updateScoreDisplay();
                j += 2;
                moved = true;
            } else {
                newRow.push(row[j]);
                j++;
            }
        }
        
        while (newRow.length < game2048.size) {
            newRow.unshift(0);
        }
        
        if (JSON.stringify(newRow) !== JSON.stringify(game2048.grid[i])) {
            moved = true;
        }
        
        newGrid[i] = newRow;
    }
    
    if (moved) {
        game2048.grid = newGrid;
    }
    
    return moved;
}

// Move tiles up
function moveUp() {
    let moved = false;
    const newGrid = [];
    
    for (let j = 0; j < game2048.size; j++) {
        const col = [];
        for (let i = 0; i < game2048.size; i++) {
            if (game2048.grid[i][j] !== 0) {
                col.push(game2048.grid[i][j]);
            }
        }
        
        const newCol = [];
        let k = 0;
        
        while (k < col.length) {
            if (k + 1 < col.length && col[k] === col[k + 1]) {
                newCol.push(col[k] * 2);
                game2048.score += col[k] * 2;
                score = game2048.score;
                updateScoreDisplay();
                k += 2;
                moved = true;
            } else {
                newCol.push(col[k]);
                k++;
            }
        }
        
        while (newCol.length < game2048.size) {
            newCol.push(0);
        }
        
        for (let i = 0; i < game2048.size; i++) {
            if (!newGrid[i]) {
                newGrid[i] = [];
            }
            newGrid[i][j] = newCol[i];
        }
    }
    
    for (let i = 0; i < game2048.size; i++) {
        if (JSON.stringify(newGrid[i]) !== JSON.stringify(game2048.grid[i])) {
            moved = true;
            break;
        }
    }
    
    if (moved) {
        game2048.grid = newGrid;
    }
    
    return moved;
}

// Move tiles down
function moveDown() {
    let moved = false;
    const newGrid = [];
    
    for (let j = 0; j < game2048.size; j++) {
        const col = [];
        for (let i = game2048.size - 1; i >= 0; i--) {
            if (game2048.grid[i][j] !== 0) {
                col.push(game2048.grid[i][j]);
            }
        }
        
        const newCol = [];
        let k = 0;
        
        while (k < col.length) {
            if (k + 1 < col.length && col[k] === col[k + 1]) {
                newCol.push(col[k] * 2);
                game2048.score += col[k] * 2;
                score = game2048.score;
                updateScoreDisplay();
                k += 2;
                moved = true;
            } else {
                newCol.push(col[k]);
                k++;
            }
        }
        
        while (newCol.length < game2048.size) {
            newCol.unshift(0);
        }
        
        for (let i = 0; i < game2048.size; i++) {
            if (!newGrid[i]) {
                newGrid[i] = [];
            }
            newGrid[i][j] = newCol[i];
        }
    }
    
    for (let i = 0; i < game2048.size; i++) {
        if (JSON.stringify(newGrid[i]) !== JSON.stringify(game2048.grid[i])) {
            moved = true;
            break;
        }
    }
    
    if (moved) {
        game2048.grid = newGrid;
    }
    
    return moved;
}

// Check if game is over (no more moves possible)
function isGameOver() {
    // Check if there are any empty cells
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] === 0) {
                return false;
            }
        }
    }
    
    // Check if any merges are possible
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size - 1; j++) {
            if (game2048.grid[i][j] === game2048.grid[i][j + 1]) {
                return false;
            }
        }
    }
    
    for (let j = 0; j < game2048.size; j++) {
        for (let i = 0; i < game2048.size - 1; i++) {
            if (game2048.grid[i][j] === game2048.grid[i + 1][j]) {
                return false;
            }
        }
    }
    
    return true;
}

// Check if player has won (reached 2048 tile)
function hasWon() {
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            if (game2048.grid[i][j] >= 2048) {
                return true;
            }
        }
    }
    return false;
}

// Draw 2048 game
function draw2048Game() {
    if (!canvas || !ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#FAF8EF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    const cellSize = Math.min(
        (canvas.width - 20) / game2048.size,
        (canvas.height - 80) / game2048.size
    );
    const startX = (canvas.width - cellSize * game2048.size) / 2;
    const startY = (canvas.height - cellSize * game2048.size) / 2 + 20;
    
    // Draw grid background
    ctx.fillStyle = '#BBADA0';
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            ctx.fillRect(
                startX + j * cellSize + 5,
                startY + i * cellSize + 5,
                cellSize - 10,
                cellSize - 10
            );
        }
    }
    
    // Draw tiles
    for (let i = 0; i < game2048.size; i++) {
        for (let j = 0; j < game2048.size; j++) {
            const value = game2048.grid[i][j];
            if (value > 0) {
                const tileColor = tileColors[value] || '#3E3933';
                const textColor = tileTextColors[value] || '#F9F6F2';
                const fontSize = value < 100 ? cellSize / 2 : 
                                value < 1000 ? cellSize / 3 : 
                                cellSize / 4;
                
                // Draw tile with rounded corners
                const x = startX + j * cellSize + 5;
                const y = startY + i * cellSize + 5;
                const width = cellSize - 10;
                const height = cellSize - 10;
                const radius = 5;
                
                ctx.fillStyle = tileColor;
                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();
                ctx.fill();
                
                // Draw tile value
                ctx.fillStyle = textColor;
                ctx.font = 'bold ' + fontSize + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    value.toString(),
                    startX + j * cellSize + cellSize / 2,
                    startY + i * cellSize + cellSize / 2
                );
            }
        }
    }
    
    // Draw score at the top
    ctx.fillStyle = '#776E65';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Poäng: ' + game2048.score, 20, 30);
    
    // Draw instructions
    ctx.fillStyle = '#776E65';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Använd piltangenter för att flytta', canvas.width / 2, canvas.height - 20);
    
    // If game is over
    if (game2048.gameOver) {
        ctx.fillStyle = 'rgba(238, 228, 218, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#776E65';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    }
    
    // If player won
    if (game2048.won && !game2048.gameOver) {
        ctx.fillStyle = 'rgba(238, 228, 218, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#F9F6F2';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Du vann!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText('Fortsätt spela!', canvas.width / 2, canvas.height / 2 + 10);
    }
};
// Initialize on page load
window.addEventListener('load', () => {
    selectedColor = gamesConfig.snake.colors[0];
});
