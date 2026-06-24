// 2048 Game
const game2048 = {
    grid: [],
    tiles: [],
    gameOver: false,
    won: false,
    score: 0
};

function init2048Game() {
    gameActive = true;
    game2048.grid = create2048Grid();
    game2048.tiles = [];
    game2048.gameOver = false;
    game2048.won = false;
    game2048.score = 0;
    score = 0;
    updateScoreDisplay();
    
    // Add two initial tiles
    addRandom2048Tile();
    addRandom2048Tile();
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(update2048Game, 1000/60);
}

function create2048Grid() {
    const grid = [];
    for (let i = 0; i < 4; i++) {
        grid[i] = [0, 0, 0, 0];
    }
    return grid;
}

function addRandom2048Tile() {
    const emptyCells = [];
    
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (game2048.grid[y][x] === 0) {
                emptyCells.push({x, y});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        game2048.grid[randomCell.y][randomCell.x] = Math.random() < 0.9 ? 2 : 4;
        
        // Add animation
        game2048.tiles.push({
            x: randomCell.x,
            y: randomCell.y,
            value: game2048.grid[randomCell.y][randomCell.x],
            scale: 0.5,
            new: true
        });
    }
}

function update2048Game() {
    if (!gameActive) return;
    
    // Update tile animations
    for (let i = 0; i < game2048.tiles.length; i++) {
        const tile = game2048.tiles[i];
        
        if (tile.new) {
            tile.scale += 0.05;
            if (tile.scale >= 1) {
                tile.scale = 1;
                tile.new = false;
            }
        }
        
        if (tile.merge) {
            tile.scale += 0.1;
            if (tile.scale >= 1.2) {
                game2048.tiles.splice(i, 1);
                i--;
            }
        }
    }
    
    // Draw
    draw2048Game();
}

function handle2048KeyPress(e) {
    if (!gameActive || game2048.gameOver) return;
    
    let moved = false;
    
    switch(e.key) {
        case 'ArrowUp':
            moved = move2048Up();
            break;
        case 'ArrowDown':
            moved = move2048Down();
            break;
        case 'ArrowLeft':
            moved = move2048Left();
            break;
        case 'ArrowRight':
            moved = move2048Right();
            break;
    }
    
    if (moved) {
        setTimeout(() => {
            addRandom2048Tile();
            check2048GameOver();
            check2048Win();
        }, 200);
    }
}

function move2048Left() {
    let moved = false;
    
    for (let y = 0; y < 4; y++) {
        const row = game2048.grid[y];
        const newRow = [];
        let mergeIndex = 0;
        
        for (let x = 0; x < 4; x++) {
            if (row[x] !== 0) {
                if (newRow.length > 0 && newRow[mergeIndex] === row[x] && !newRow[mergeIndex + 1]) {
                    // Merge tiles
                    newRow[mergeIndex] *= 2;
                    game2048.score += newRow[mergeIndex];
                    score += newRow[mergeIndex];
                    newRow.push(0); // Mark as merged
                    moved = true;
                    mergeIndex++;
                } else {
                    newRow.push(row[x]);
                    if (x !== mergeIndex) {
                        moved = true;
                    }
                    mergeIndex++;
                }
            }
        }
        
        // Fill remaining spaces with zeros
        while (newRow.length < 4) {
            newRow.push(0);
        }
        
        // Update grid if row changed
        if (JSON.stringify(row) !== JSON.stringify(newRow)) {
            game2048.grid[y] = newRow.filter((val, index) => index < 4);
            moved = true;
        }
    }
    
    return moved;
}

function move2048Right() {
    let moved = false;
    
    for (let y = 0; y < 4; y++) {
        const row = game2048.grid[y];
        const newRow = [];
        let mergeIndex = 0;
        
        for (let x = 3; x >= 0; x--) {
            if (row[x] !== 0) {
                if (newRow.length > 0 && newRow[mergeIndex] === row[x] && !newRow[mergeIndex + 1]) {
                    // Merge tiles
                    newRow[mergeIndex] *= 2;
                    game2048.score += newRow[mergeIndex];
                    score += newRow[mergeIndex];
                    newRow.push(0); // Mark as merged
                    moved = true;
                    mergeIndex++;
                } else {
                    newRow.push(row[x]);
                    if (3 - x !== mergeIndex) {
                        moved = true;
                    }
                    mergeIndex++;
                }
            }
        }
        
        // Fill remaining spaces with zeros
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        
        // Update grid if row changed
        if (JSON.stringify(row) !== JSON.stringify(newRow)) {
            game2048.grid[y] = newRow.filter((val, index) => index < 4);
            moved = true;
        }
    }
    
    return moved;
}

function move2048Up() {
    let moved = false;
    
    for (let x = 0; x < 4; x++) {
        const column = [game2048.grid[0][x], game2048.grid[1][x], game2048.grid[2][x], game2048.grid[3][x]];
        const newColumn = [];
        let mergeIndex = 0;
        
        for (let y = 0; y < 4; y++) {
            if (column[y] !== 0) {
                if (newColumn.length > 0 && newColumn[mergeIndex] === column[y] && !newColumn[mergeIndex + 1]) {
                    // Merge tiles
                    newColumn[mergeIndex] *= 2;
                    game2048.score += newColumn[mergeIndex];
                    score += newColumn[mergeIndex];
                    newColumn.push(0); // Mark as merged
                    moved = true;
                    mergeIndex++;
                } else {
                    newColumn.push(column[y]);
                    if (y !== mergeIndex) {
                        moved = true;
                    }
                    mergeIndex++;
                }
            }
        }
        
        // Fill remaining spaces with zeros
        while (newColumn.length < 4) {
            newColumn.push(0);
        }
        
        // Update grid if column changed
        if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
            for (let y = 0; y < 4; y++) {
                game2048.grid[y][x] = newColumn[y];
            }
            moved = true;
        }
    }
    
    return moved;
}

function move2048Down() {
    let moved = false;
    
    for (let x = 0; x < 4; x++) {
        const column = [game2048.grid[0][x], game2048.grid[1][x], game2048.grid[2][x], game2048.grid[3][x]];
        const newColumn = [];
        let mergeIndex = 0;
        
        for (let y = 3; y >= 0; y--) {
            if (column[y] !== 0) {
                if (newColumn.length > 0 && newColumn[mergeIndex] === column[y] && !newColumn[mergeIndex + 1]) {
                    // Merge tiles
                    newColumn[mergeIndex] *= 2;
                    game2048.score += newColumn[mergeIndex];
                    score += newColumn[mergeIndex];
                    newColumn.push(0); // Mark as merged
                    moved = true;
                    mergeIndex++;
                } else {
                    newColumn.push(column[y]);
                    if (3 - y !== mergeIndex) {
                        moved = true;
                    }
                    mergeIndex++;
                }
            }
        }
        
        // Fill remaining spaces with zeros
        while (newColumn.length < 4) {
            newColumn.unshift(0);
        }
        
        // Update grid if column changed
        if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
            for (let y = 0; y < 4; y++) {
                game2048.grid[y][x] = newColumn[y];
            }
            moved = true;
        }
    }
    
    return moved;
}

function check2048GameOver() {
    if (game2048.gameOver || game2048.won) return;
    
    // Check if there are any empty cells
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (game2048.grid[y][x] === 0) {
                return; // Game can continue
            }
        }
    }
    
    // Check if there are any possible moves
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            // Check right
            if (x < 3 && game2048.grid[y][x] === game2048.grid[y][x + 1]) {
                return; // Game can continue
            }
            // Check down
            if (y < 3 && game2048.grid[y][x] === game2048.grid[y + 1][x]) {
                return; // Game can continue
            }
        }
    }
    
    // No moves left
    game2048.gameOver = true;
    setTimeout(() => {
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over').classList.add('active');
    }, 500);
}

function check2048Win() {
    if (game2048.won) return;
    
    // Check if 2048 tile exists
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (game2048.grid[y][x] === 2048) {
                game2048.won = true;
                
                // Check if level is complete
                if (score >= gamesConfig['2048'].pointsPerLevel[currentLevel - 1]) {
                    setTimeout(() => levelComplete(), 500);
                }
                return;
            }
        }
    }
}

function draw2048Game() {
    // Clear canvas
    ctx.fillStyle = '#BBADA0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    const cellSize = canvas.width / 4;
    ctx.fillStyle = '#CDC1B4';
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            ctx.fillRect(x * cellSize + 10, y * cellSize + 10, cellSize - 20, cellSize - 20);
        }
    }
    
    // Draw tiles
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const value = game2048.grid[y][x];
            if (value > 0) {
                // Find tile in animation array or use grid value
                const tile = game2048.tiles.find(t => t.x === x && t.y === y);
                const displayValue = tile ? tile.value : value;
                const scale = tile ? tile.scale : 1;
                
                // Draw tile
                const tileColors = {
                    2: '#EEE4DA', 4: '#EDE0C8', 8: '#F2B179', 16: '#F59563',
                    32: '#F67C5F', 64: '#F65E3B', 128: '#EDCF72', 256: '#EDCC61',
                    512: '#EDC850', 1024: '#EDC53F', 2048: '#EDC22E'
                };
                
                const tileColor = tileColors[displayValue] || '#3C3A32';
                const textColor = displayValue <= 4 ? '#776E65' : 'white';
                const fontSize = displayValue >= 1000 ? '45px' : displayValue >= 100 ? '55px' : '65px';
                
                const tileX = x * cellSize + 10;
                const tileY = y * cellSize + 10;
                const tileWidth = (cellSize - 20) * scale;
                const tileHeight = (cellSize - 20) * scale;
                const tileOffsetX = (cellSize - 20 - tileWidth) / 2;
                const tileOffsetY = (cellSize - 20 - tileHeight) / 2;
                
                ctx.fillStyle = tileColor;
                const width = cellSize - 20;
                const height = cellSize - 20;
                const xPos = x * cellSize + 10;
                const yPos = y * cellSize + 10;
                const radius = 5;
                
                ctx.beginPath();
                ctx.moveTo(xPos + radius, yPos);
                ctx.lineTo(xPos + width - radius, yPos);
                ctx.quadraticCurveTo(xPos + width, yPos, xPos + width, yPos + radius);
                ctx.lineTo(xPos + width, yPos + height - radius);
                ctx.quadraticCurveTo(xPos + width, yPos + height, xPos + width - radius, yPos + height);
                ctx.lineTo(xPos + radius, yPos + height);
                ctx.quadraticCurveTo(xPos, yPos + height, xPos, yPos + height - radius);
                ctx.lineTo(xPos, yPos + radius);
                ctx.quadraticCurveTo(xPos, yPos, xPos + radius, yPos);
                ctx.closePath();
                ctx.fill();
                
                // Draw text
                ctx.fillStyle = textColor;
                ctx.font = `${fontSize} Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(displayValue, xPos + width/2, yPos + height/2);
            }
        }
    }
    
    // Draw score
    ctx.fillStyle = '#776E65';
    ctx.font = '25px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${game2048.score}`, 20, 40);
    
    // Draw game over message
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
    if (currentLevel >= gamesConfig['2048'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}