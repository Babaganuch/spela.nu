// Geometry Dash Game
const gdPlayer = {x: 50, y: canvas.height - 100, width: 40, height: 40, velocityY: 0, jumping: false, jumpForce: -12, gravity: 0.8};
const gdObstacles = [];
let gdObstacleSpeed = 5;
let gdObstacleTimer = 0;
let gdScore = 0;

function initGeometryDashGame() {
    gameActive = true;
    gdPlayer.x = 50;
    gdPlayer.y = canvas.height - 100;
    gdPlayer.velocityY = 0;
    gdPlayer.jumping = false;
    gdObstacles.length = 0;
    gdScore = 0;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGeometryDashGame, 1000/60);
}

function updateGeometryDashGame() {
    if (!gameActive) return;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update player
    gdPlayer.velocityY += gdPlayer.gravity;
    gdPlayer.y += gdPlayer.velocityY;
    
    // Ground collision
    if (gdPlayer.y + gdPlayer.height > canvas.height) {
        gdPlayer.y = canvas.height - gdPlayer.height;
        gdPlayer.velocityY = 0;
        gdPlayer.jumping = false;
    }
    
    // Generate obstacles
    gdObstacleTimer++;
    if (gdObstacleTimer > 60) {
        generateGdObstacle();
        gdObstacleTimer = 0;
    }
    
    // Update obstacles
    for (let i = 0; i < gdObstacles.length; i++) {
        gdObstacles[i].x -= gdObstacleSpeed;
        
        // Check collision
        if (checkGdCollision(gdPlayer, gdObstacles[i])) {
            gameOver();
            return;
        }
        
        // Remove off-screen obstacles
        if (gdObstacles[i].x + gdObstacles[i].width < 0) {
            gdObstacles.splice(i, 1);
            i--;
            gdScore += 10;
            score += 10;
            updateScoreDisplay();
            
            // Check if level is complete
            if (score >= gamesConfig['geometry-dash'].pointsPerLevel[currentLevel - 1]) {
                levelComplete();
                return;
            }
        }
    }
    
    // Draw
    drawGeometryDashGame();
}

function generateGdObstacle() {
    const types = ['square', 'triangle', 'spike'];
    const type = types[Math.floor(Math.random() * types.length)];
    const height = 30 + Math.random() * 50;
    
    gdObstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 30,
        height: height,
        type: type,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
}

function checkGdCollision(player, obstacle) {
    return player.x < obstacle.x + obstacle.width &&
           player.x + player.width > obstacle.x &&
           player.y < obstacle.y + obstacle.height &&
           player.y + player.height > obstacle.y;
}

function drawGeometryDashGame() {
    // Draw ground
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw player
    ctx.fillStyle = selectedColor;
    ctx.fillRect(gdPlayer.x, gdPlayer.y, gdPlayer.width, gdPlayer.height);
    
    // Draw obstacles
    gdObstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        
        switch(obstacle.type) {
            case 'square':
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(obstacle.x + obstacle.width/2, obstacle.y);
                ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
                break;
            case 'spike':
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
                ctx.closePath();
                ctx.fill();
                break;
        }
    });
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${gdScore}`, 20, 30);
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
    if (currentLevel >= gamesConfig['geometry-dash'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}