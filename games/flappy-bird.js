// Flappy Bird Game
const fbBird = {x: 100, y: 250, width: 40, height: 30, velocityY: 0, gravity: 0.5, jumpForce: -8};
const fbPipes = [];
let fbPipeTimer = 0;
let fbScore = 0;
let fbPipeGap = 150;

function initFlappyBirdGame() {
    gameActive = true;
    fbBird.x = 100;
    fbBird.y = 250;
    fbBird.velocityY = 0;
    fbPipes.length = 0;
    fbScore = 0;
    fbPipeTimer = 0;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateFlappyBirdGame, 1000/60);
}

function updateFlappyBirdGame() {
    if (!gameActive) return;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update bird
    fbBird.velocityY += fbBird.gravity;
    fbBird.y += fbBird.velocityY;
    
    // Generate pipes
    fbPipeTimer++;
    if (fbPipeTimer > 90) {
        generateFbPipe();
        fbPipeTimer = 0;
    }
    
    // Update pipes
    for (let i = 0; i < fbPipes.length; i++) {
        fbPipes[i].x -= 3;
        
        // Check collision
        if (checkFbCollision(fbBird, fbPipes[i])) {
            gameOver();
            return;
        }
        
        // Check if bird passed pipe
        if (fbPipes[i].x + fbPipes[i].width < fbBird.x && !fbPipes[i].passed) {
            fbPipes[i].passed = true;
            fbScore += 10;
            score += 10;
            updateScoreDisplay();
            
            // Check if level is complete
            if (score >= gamesConfig['flappy-bird'].pointsPerLevel[currentLevel - 1]) {
                levelComplete();
                return;
            }
        }
        
        // Remove off-screen pipes
        if (fbPipes[i].x + fbPipes[i].width < 0) {
            fbPipes.splice(i, 1);
            i--;
        }
    }
    
    // Check ground/ceiling collision
    if (fbBird.y + fbBird.height > canvas.height || fbBird.y < 0) {
        gameOver();
        return;
    }
    
    // Draw
    drawFlappyBirdGame();
}

function generateFbPipe() {
    const gapY = 100 + Math.random() * (canvas.height - 300);
    
    fbPipes.push({
        x: canvas.width,
        width: 60,
        gapY: gapY,
        gapHeight: fbPipeGap,
        passed: false,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
}

function checkFbCollision(bird, pipe) {
    // Check top pipe collision
    if (bird.y < pipe.gapY &&
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width) {
        return true;
    }
    
    // Check bottom pipe collision
    if (bird.y + bird.height > pipe.gapY + pipe.gapHeight &&
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width) {
        return true;
    }
    
    return false;
}

function drawFlappyBirdGame() {
    // Draw sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(fbBird.x + fbBird.width/2, fbBird.y + fbBird.height/2, fbBird.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(fbBird.x + fbBird.width, fbBird.y + fbBird.height/2);
    ctx.lineTo(fbBird.x + fbBird.width + 15, fbBird.y + fbBird.height/2 - 5);
    ctx.lineTo(fbBird.x + fbBird.width + 15, fbBird.y + fbBird.height/2 + 5);
    ctx.closePath();
    ctx.fill();
    
    // Draw eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(fbBird.x + fbBird.width/2 + 5, fbBird.y + fbBird.height/2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pipes
    fbPipes.forEach(pipe => {
        ctx.fillStyle = pipe.color;
        
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, canvas.height - (pipe.gapY + pipe.gapHeight));
        
        // Pipe caps
        ctx.fillStyle = '#555';
        ctx.fillRect(pipe.x - 5, pipe.gapY - 20, pipe.width + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.gapY + pipe.gapHeight, pipe.width + 10, 20);
    });
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${fbScore}`, 20, 30);
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
    if (currentLevel >= gamesConfig['flappy-bird'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}