// Snake Game
let snake = [];
let snakeDirection = 'right';
let snakeFood = {};
let snakeSpeed = 150;
let snakeGridSize = 20;
let snakeGridWidth = canvas.width / snakeGridSize;
let snakeGridHeight = canvas.height / snakeGridSize;

export function initSnakeGame() {
    gameActive = true;
    snake = [{x: 5, y: 10}];
    snakeDirection = 'right';
    placeSnakeFood();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateSnakeGame, snakeSpeed);
}

function updateSnakeGame() {
    if (!gameActive) return;
    
    // Move snake
    const head = {...snake[0]};
    switch(snakeDirection) {
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
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        score += 10;
        updateScoreDisplay();
        placeSnakeFood();
        
        // Check if level is complete
        if (score >= gamesConfig.snake.pointsPerLevel[currentLevel - 1]) {
            levelComplete();
            return;
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
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
        for (const segment of snake) {
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    snakeFood = newFoodPosition;
}

function drawSnakeGame() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? selectedColor : '#4CAF50';
        ctx.fillRect(segment.x * snakeGridSize, segment.y * snakeGridSize, snakeGridSize, snakeGridSize);
        
        // Draw eyes on head
        if (index === 0) {
            const eyeSize = snakeGridSize / 5;
            const eyeOffset = snakeGridSize / 3;
            
            ctx.fillStyle = 'white';
            if (snakeDirection === 'right' || snakeDirection === 'left') {
                ctx.fillRect(segment.x * snakeGridSize + (snakeDirection === 'right' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            segment.y * snakeGridSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * snakeGridSize + (snakeDirection === 'right' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            segment.y * snakeGridSize + snakeGridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else {
                ctx.fillRect(segment.x * snakeGridSize + eyeOffset,
                            segment.y * snakeGridSize + (snakeDirection === 'down' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            eyeSize, eyeSize);
                ctx.fillRect(segment.x * snakeGridSize + snakeGridSize - eyeOffset - eyeSize,
                            segment.y * snakeGridSize + (snakeDirection === 'down' ? eyeOffset : snakeGridSize - eyeOffset - eyeSize),
                            eyeSize, eyeSize);
            }
            
            ctx.fillStyle = 'black';
            if (snakeDirection === 'right' || snakeDirection === 'left') {
                ctx.fillRect(segment.x * snakeGridSize + (snakeDirection === 'right' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            segment.y * snakeGridSize + eyeOffset + eyeSize/3, eyeSize/3, eyeSize/3);
                ctx.fillRect(segment.x * snakeGridSize + (snakeDirection === 'right' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            segment.y * snakeGridSize + snakeGridSize - eyeOffset - eyeSize + eyeSize/3, eyeSize/3, eyeSize/3);
            } else {
                ctx.fillRect(segment.x * snakeGridSize + eyeOffset + eyeSize/3,
                            segment.y * snakeGridSize + (snakeDirection === 'down' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            eyeSize/3, eyeSize/3);
                ctx.fillRect(segment.x * snakeGridSize + snakeGridSize - eyeOffset - eyeSize + eyeSize/3,
                            segment.y * snakeGridSize + (snakeDirection === 'down' ? eyeOffset + eyeSize/3 : snakeGridSize - eyeOffset - eyeSize + eyeSize/3),
                            eyeSize/3, eyeSize/3);
            }
        }
    });
    
    // Draw food
    ctx.fillStyle = '#FF5733';
    ctx.beginPath();
    ctx.arc(snakeFood.x * snakeGridSize + snakeGridSize/2, snakeFood.y * snakeGridSize + snakeGridSize/2, snakeGridSize/2, 0, Math.PI * 2);
    ctx.fill();
}

function gameOver() {
    gameActive = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.add('active');
}

function levelComplete() {
    gameActive = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // Check if all levels are complete
    if (currentLevel >= gamesConfig.snake.levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}
