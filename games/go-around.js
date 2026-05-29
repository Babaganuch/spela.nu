// Go Around (Lol Beans) Game
const goAroundPlayer = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    speed: 3,
    direction: 0,
    rotateLeft: false,
    rotateRight: false
};
const goAroundBots = [];
let goAroundBotTimer = 0;
let goAroundScore = 0;

export function initGoAroundGame() {
    gameActive = true;
    goAroundPlayer.x = canvas.width / 2;
    goAroundPlayer.y = canvas.height / 2;
    goAroundPlayer.direction = 0;
    goAroundBots.length = 0;
    goAroundScore = 0;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGoAroundGame, 1000/60);
}

function updateGoAroundGame() {
    if (!gameActive) return;
    
    // Update player direction based on rotation keys
    if (goAroundPlayer.rotateLeft) {
        goAroundPlayer.direction -= 0.1;
    }
    if (goAroundPlayer.rotateRight) {
        goAroundPlayer.direction += 0.1;
    }
    
    // Move player
    goAroundPlayer.x += Math.cos(goAroundPlayer.direction) * goAroundPlayer.speed;
    goAroundPlayer.y += Math.sin(goAroundPlayer.direction) * goAroundPlayer.speed;
    
    // Wrap around screen edges
    if (goAroundPlayer.x < 0) goAroundPlayer.x = canvas.width;
    if (goAroundPlayer.x > canvas.width) goAroundPlayer.x = 0;
    if (goAroundPlayer.y < 0) goAroundPlayer.y = canvas.height;
    if (goAroundPlayer.y > canvas.height) goAroundPlayer.y = 0;
    
    // Generate bots
    goAroundBotTimer++;
    if (goAroundBotTimer > 120) {
        generateGoAroundBot();
        goAroundBotTimer = 0;
    }
    
    // Update bots
    for (let i = 0; i < goAroundBots.length; i++) {
        const bot = goAroundBots[i];
        
        // Move bot towards player
        const angle = Math.atan2(goAroundPlayer.y - bot.y, goAroundPlayer.x - bot.x);
        bot.x += Math.cos(angle) * bot.speed;
        bot.y += Math.sin(angle) * bot.speed;
        
        // Check collision with player
        const distance = Math.sqrt(Math.pow(goAroundPlayer.x - bot.x, 2) + Math.pow(goAroundPlayer.y - bot.y, 2));
        if (distance < goAroundPlayer.radius + bot.radius) {
            gameOver();
            return;
        }
        
        // Check if bot is off screen (collected)
        if (bot.x < -bot.radius || bot.x > canvas.width + bot.radius ||
            bot.y < -bot.radius || bot.y > canvas.height + bot.radius) {
            goAroundBots.splice(i, 1);
            i--;
            goAroundScore += 5;
            score += 5;
            updateScoreDisplay();
            
            // Check if level is complete
            if (score >= gamesConfig['go-around'].pointsPerLevel[currentLevel - 1]) {
                levelComplete();
                return;
            }
        }
    }
    
    // Draw
    drawGoAroundGame();
}

function generateGoAroundBot() {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * canvas.width; y = -30; break;
        case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
        case 3: x = -30; y = Math.random() * canvas.height; break;
    }
    
    goAroundBots.push({
        x: x,
        y: y,
        radius: 15 + Math.random() * 10,
        speed: 1 + Math.random() * 2,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
}

function drawGoAroundGame() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(goAroundPlayer.x, goAroundPlayer.y, goAroundPlayer.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw direction indicator
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(
        goAroundPlayer.x + Math.cos(goAroundPlayer.direction) * goAroundPlayer.radius,
        goAroundPlayer.y + Math.sin(goAroundPlayer.direction) * goAroundPlayer.radius
    );
    ctx.lineTo(
        goAroundPlayer.x + Math.cos(goAroundPlayer.direction) * (goAroundPlayer.radius + 20),
        goAroundPlayer.y + Math.sin(goAroundPlayer.direction) * (goAroundPlayer.radius + 20)
    );
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    const eyeX = goAroundPlayer.x + Math.cos(goAroundPlayer.direction) * goAroundPlayer.radius * 0.5;
    const eyeY = goAroundPlayer.y + Math.sin(goAroundPlayer.direction) * goAroundPlayer.radius * 0.5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bots
    goAroundBots.forEach(bot => {
        ctx.fillStyle = bot.color;
        ctx.beginPath();
        ctx.arc(bot.x, bot.y, bot.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bot eyes
        ctx.fillStyle = 'white';
        const botEyeX = bot.x + Math.cos(Math.atan2(goAroundPlayer.y - bot.y, goAroundPlayer.x - bot.x)) * bot.radius * 0.5;
        const botEyeY = bot.y + Math.sin(Math.atan2(goAroundPlayer.y - bot.y, goAroundPlayer.x - bot.x)) * bot.radius * 0.5;
        ctx.beginPath();
        ctx.arc(botEyeX, botEyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(botEyeX, botEyeY, 1, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${goAroundScore}`, 20, 30);
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
    if (currentLevel >= gamesConfig['go-around'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}