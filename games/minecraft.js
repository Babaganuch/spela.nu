// Minecraft Game
let mcPlayer = {x: 0, y: 0, width: 40, height: 60, speed: 3};
const mcBlocks = [];
const mcInventory = {wood: 0, stone: 0, diamond: 0};
let mcScore = 0;

function initMinecraftGame() {
    gameActive = true;
    mcPlayer.x = canvas.width/2;
    mcPlayer.y = canvas.height/2;
    mcInventory.wood = 0;
    mcInventory.stone = 0;
    mcInventory.diamond = 0;
    mcScore = 0;
    score = 0;
    updateScoreDisplay();
    
    // Generate initial terrain
    generateMinecraftTerrain();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateMinecraftGame, 1000/60);
}

function generateMinecraftTerrain() {
    mcBlocks.length = 0;
    
    // Generate ground
    for (let x = 0; x < canvas.width; x += 50) {
        const height = 100 + Math.random() * 100;
        for (let y = canvas.height - 50; y > canvas.height - height; y -= 50) {
            const blockType = y > canvas.height - 80 ? 'dirt' : Math.random() > 0.7 ? 'stone' : 'dirt';
            mcBlocks.push({x, y, width: 50, height: 50, type: blockType});
        }
    }
    
    // Generate trees
    for (let i = 0; i < 10; i++) {
        const treeX = 100 + Math.random() * (canvas.width - 200);
        const groundY = canvas.height - 50;
        
        // Tree trunk
        for (let y = groundY; y > groundY - 150; y -= 50) {
            mcBlocks.push({x: treeX, y, width: 50, height: 50, type: 'wood'});
        }
        
        // Tree leaves
        for (let x = treeX - 100; x <= treeX + 100; x += 50) {
            for (let y = groundY - 150; y > groundY - 250; y -= 50) {
                if (Math.random() > 0.3) {
                    mcBlocks.push({x, y, width: 50, height: 50, type: 'leaves'});
                }
            }
        }
    }
    
    // Generate some stone and diamond blocks
    for (let i = 0; i < 20; i++) {
        const x = 50 + Math.random() * (canvas.width - 100);
        const y = 100 + Math.random() * (canvas.height - 200);
        const type = Math.random() > 0.8 ? 'diamond' : 'stone';
        mcBlocks.push({x, y, width: 50, height: 50, type});
    }
}

function updateMinecraftGame() {
    if (!gameActive) return;
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw blocks
    mcBlocks.forEach(block => {
        switch(block.type) {
            case 'dirt': ctx.fillStyle = '#8B4513'; break;
            case 'stone': ctx.fillStyle = '#808080'; break;
            case 'wood': ctx.fillStyle = '#8B4513'; break;
            case 'leaves': ctx.fillStyle = '#228B22'; break;
            case 'diamond': ctx.fillStyle = '#00BFFF'; break;
        }
        ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Draw block borders
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
    
    // Draw player
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(mcPlayer.x, mcPlayer.y, mcPlayer.width, mcPlayer.height);
    
    // Draw player head
    ctx.fillStyle = '#F5DEB3';
    ctx.beginPath();
    ctx.arc(mcPlayer.x + mcPlayer.width/2, mcPlayer.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inventory
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, 20, 200, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Trä: ${mcInventory.wood}`, 30, 40);
    ctx.fillText(`Sten: ${mcInventory.stone}`, 30, 60);
    ctx.fillText(`Diamant: ${mcInventory.diamond}`, 30, 80);
    ctx.fillText(`Poäng: ${mcScore}`, 30, 100);
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Total poäng: ${score}`, 20, canvas.height - 20);
    
    // Check if level is complete
    if (score >= gamesConfig.minecraft.pointsPerLevel[currentLevel - 1]) {
        levelComplete();
    }
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
    if (currentLevel >= gamesConfig.minecraft.levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}