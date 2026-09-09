// Snake Game
window.snake = [];
window.snakeDirection = 'right';
window.snakeFood = {};
let snakeSpeed = 150;
let snakeGridSize = 20;
let snakeGridWidth = 0;
let snakeGridHeight = 0;

function initSnakeGame() {
    // Calculate grid dimensions based on canvas
    snakeGridWidth = Math.floor(canvas.width / snakeGridSize);
    snakeGridHeight = Math.floor(canvas.height / snakeGridSize);
    window.gameActive = true;
    window.snake = [{x: 5, y: 10}];
    window.snakeDirection = 'right';
    placeSnakeFood();
    
    if (window.gameLoop) clearInterval(window.gameLoop);
    window.gameLoop = setInterval(updateSnakeGame, snakeSpeed);
}

function updateSnakeGame() {
    if (!window.gameActive) return;
    
    // Move snake
    const head = {...window.snake[0]};
    switch(window.snakeDirection) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Check for collisions
    if (head.x < 0 || head.x >= snakeGridWidth || head.y < 0 || head.y >= snakeGridHeight) {
        gameOver();
        return;
    }
    
    // Check for self collision
    for (let i = 0; i < window.snake.length; i++) {
        if (head.x === window.snake[i].x && head.y === window.snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    window.snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === window.snakeFood.x && head.y === window.snakeFood.y) {
        window.score += 10;
        updateScoreDisplay();
        placeSnakeFood();
        
        // Check if level is complete
        if (window.score >= window.gamesConfig.snake.pointsPerLevel[window.currentLevel - 1]) {
            levelComplete();
            return;
        }
    } else {
        // Remove tail if no food eaten
        window.snake.pop();
    }
    
    // Draw
    drawSnakeGame();
}

function placeSnakeFood() {
    let validPosition = false;
    let newFoodPosition;
    
    while (!validPosition) {
        newFoodPosition = {
            x: Math.floor(Math.random() * snakeGridWidth),
            y: Math.floor(Math.random() * snakeGridHeight)
        };
        
        // Check if food is on snake
        validPosition = true;
        for (const segment of window.snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    window.snakeFood = newFoodPosition;
}

function drawSnakeGame() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    window.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? selectedColor : '#4CAF50';
        ctx.fillRect(segment.x * snakeGridSize, segment.y * snakeGridSize, snakeGridSize, snakeGridSize);
        
        // Draw eyes on head
        if (index === 0) {
            const eyeSize = snakeGridSize / 5;
            const eyeOffset = snakeGridSize / 3;
            
            ctx.fillStyle = 'white';
            if (window.snakeDirection === 'right' || window.snakeDirection === 'left') {
                ctx.fillRect(segment.x * snakeGridSize + (window.snakeDirection === 'right' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            segment.y * snakeGridSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * snakeGridSize + (window.snakeDirection === 'right' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            segment.y * snakeGridSize + snakeGridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else {
                ctx.fillRect(segment.x * snakeGridSize + eyeOffset,
                            segment.y * snakeGridSize + (window.snakeDirection === 'down' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            eyeSize, eyeSize);
                ctx.fillRect(segment.x * snakeGridSize + snakeGridSize - eyeOffset - eyeSize,
                            segment.y * snakeGridSize + (window.snakeDirection === 'down' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            eyeSize, eyeSize);
            }
            
            ctx.fillStyle = 'black';
            if (window.snakeDirection === 'right' || window.snakeDirection === 'left') {
                ctx.fillRect(segment.x * snakeGridSize + (window.snakeDirection === 'right' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            segment.y * snakeGridSize + eyeOffset + eyeSize/3, eyeSize/3, eyeSize/3);
                ctx.fillRect(segment.x * snakeGridSize + (window.snakeDirection === 'right' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            segment.y * snakeGridSize + snakeGridSize - eyeOffset - eyeSize + eyeSize/3, eyeSize/3, eyeSize/3);
            } else {
                ctx.fillRect(segment.x * snakeGridSize + eyeOffset + eyeSize/3,
                            segment.y * snakeGridSize + (window.snakeDirection === 'down' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            eyeSize/3, eyeSize/3);
                ctx.fillRect(segment.x * snakeGridSize + snakeGridSize - eyeOffset - eyeSize + eyeSize/3,
                            segment.y * snakeGridSize + (window.snakeDirection === 'down' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            eyeSize/3, eyeSize/3);
            }
        }
    });
    
    // Draw food
    ctx.fillStyle = '#FF5733';
    ctx.beginPath();
    ctx.arc(window.snakeFood.x * snakeGridSize + snakeGridSize/2, window.snakeFood.y * snakeGridSize + snakeGridSize/2, snakeGridSize/2, 0, Math.PI * 2);
    ctx.fill();
}

function gameOver() {
    window.gameActive = false;
    if (window.gameLoop) {
        clearInterval(window.gameLoop);
        window.gameLoop = null;
    }
    document.getElementById('final-score').textContent = window.score;
    document.getElementById('game-over').classList.add('active');
}

function levelComplete() {
    window.gameActive = false;
    if (window.gameLoop) {
        clearInterval(window.gameLoop);
        window.gameLoop = null;
    }
    
    // Check if all levels are complete
    if (window.currentLevel >= window.gamesConfig.snake.levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = window.score;
        document.getElementById('level-complete').classList.add('active');
    }
}
