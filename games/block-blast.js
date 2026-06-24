// Block Blast Game
const bbGrid = [];
const bbGridSize = 50;
const bbGridWidth = Math.floor(canvas.width / bbGridSize);
const bbGridHeight = Math.floor(canvas.height / bbGridSize);
let bbSelectedBlock = null;
let bbScore = 0;

function initBlockBlastGame() {
    gameActive = true;
    bbScore = 0;
    score = 0;
    updateScoreDisplay();
    
    // Initialize grid
    bbGrid.length = 0;
    for (let y = 0; y < bbGridHeight; y++) {
        bbGrid[y] = [];
        for (let x = 0; x < bbGridWidth; x++) {
            bbGrid[y][x] = Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0;
        }
    }
    
    bbSelectedBlock = null;
    
    // Add click event listener
    canvas.onclick = handleBlockBlastClick;
    
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateBlockBlastGame, 1000/60);
}

function updateBlockBlastGame() {
    if (!gameActive) return;
    
    // Draw
    drawBlockBlastGame();
}

function handleBlockBlastClick(event) {
    if (!gameActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / bbGridSize);
    const y = Math.floor((event.clientY - rect.top) / bbGridSize);
    
    if (x >= 0 && x < bbGridWidth && y >= 0 && y < bbGridHeight) {
        if (bbGrid[y][x] > 0) {
            if (bbSelectedBlock === null) {
                // Select first block
                bbSelectedBlock = {x, y, type: bbGrid[y][x]};
            } else if (bbSelectedBlock.x === x && bbSelectedBlock.y === y) {
                // Deselect if clicking same block
                bbSelectedBlock = null;
            } else if (areBlocksAdjacent(bbSelectedBlock.x, bbSelectedBlock.y, x, y)) {
                // Swap adjacent blocks
                swapBlocks(bbSelectedBlock.x, bbSelectedBlock.y, x, y);
                bbSelectedBlock = null;
                
                // Check for matches after swap
                setTimeout(checkMatches, 300);
            } else {
                // Select new block
                bbSelectedBlock = {x, y, type: bbGrid[y][x]};
            }
        }
    }
}

function areBlocksAdjacent(x1, y1, x2, y2) {
    return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function swapBlocks(x1, y1, x2, y2) {
    const temp = bbGrid[y1][x1];
    bbGrid[y1][x1] = bbGrid[y2][x2];
    bbGrid[y2][x2] = temp;
}

function checkMatches() {
    if (!gameActive) return;
    
    const matches = [];
    
    // Check horizontal matches
    for (let y = 0; y < bbGridHeight; y++) {
        for (let x = 0; x < bbGridWidth - 2; x++) {
            if (bbGrid[y][x] > 0 && bbGrid[y][x] === bbGrid[y][x+1] && bbGrid[y][x] === bbGrid[y][x+2]) {
                let match = {blocks: [{x, y}, {x: x+1, y}, {x: x+2, y}], type: 'horizontal'};
                
                // Check for longer matches
                if (x > 0 && bbGrid[y][x-1] === bbGrid[y][x]) {
                    match.blocks.unshift({x: x-1, y});
                    if (x > 1 && bbGrid[y][x-2] === bbGrid[y][x]) {
                        match.blocks.unshift({x: x-2, y});
                    }
                }
                if (x < bbGridWidth - 3 && bbGrid[y][x+3] === bbGrid[y][x]) {
                    match.blocks.push({x: x+3, y});
                    if (x < bbGridWidth - 4 && bbGrid[y][x+4] === bbGrid[y][x]) {
                        match.blocks.push({x: x+4, y});
                    }
                }
                
                matches.push(match);
                x += match.blocks.length - 1; // Skip already matched blocks
            }
        }
    }
    
    // Check vertical matches
    for (let x = 0; x < bbGridWidth; x++) {
        for (let y = 0; y < bbGridHeight - 2; y++) {
            if (bbGrid[y][x] > 0 && bbGrid[y][x] === bbGrid[y+1][x] && bbGrid[y][x] === bbGrid[y+2][x]) {
                let match = {blocks: [{x, y}, {x, y: y+1}, {x, y: y+2}], type: 'vertical'};
                
                // Check for longer matches
                if (y > 0 && bbGrid[y-1][x] === bbGrid[y][x]) {
                    match.blocks.unshift({x, y: y-1});
                    if (y > 1 && bbGrid[y-2][x] === bbGrid[y][x]) {
                        match.blocks.unshift({x, y: y-2});
                    }
                }
                if (y < bbGridHeight - 3 && bbGrid[y+3][x] === bbGrid[y][x]) {
                    match.blocks.push({x, y: y+3});
                    if (y < bbGridHeight - 4 && bbGrid[y+4][x] === bbGrid[y][x]) {
                        match.blocks.push({x, y: y+4});
                    }
                }
                
                matches.push(match);
                y += match.blocks.length - 1; // Skip already matched blocks
            }
        }
    }
    
    if (matches.length > 0) {
        removeMatchedBlocks(matches);
    }
}

function removeMatchedBlocks(matches) {
    // Remove matched blocks
    matches.forEach(match => {
        match.blocks.forEach(block => {
            bbGrid[block.y][block.x] = 0;
        });
    });
    
    // Calculate score
    const matchCount = matches.reduce((total, match) => total + match.blocks.length, 0);
    bbScore += matchCount * 10;
    score += matchCount * 10;
    updateScoreDisplay();
    
    // Check if level is complete
    if (score >= gamesConfig['block-blast'].pointsPerLevel[currentLevel - 1]) {
        setTimeout(() => levelComplete(), 500);
        return;
    }
    
    // Drop blocks and fill empty spaces
    setTimeout(fillEmptySpaces, 300);
}

function fillEmptySpaces() {
    // Drop blocks
    for (let x = 0; x < bbGridWidth; x++) {
        let emptySpaces = 0;
        
        // Count empty spaces from bottom
        for (let y = bbGridHeight - 1; y >= 0; y--) {
            if (bbGrid[y][x] === 0) {
                emptySpaces++;
            } else if (emptySpaces > 0) {
                // Move block down
                bbGrid[y + emptySpaces][x] = bbGrid[y][x];
                bbGrid[y][x] = 0;
            }
        }
    }
    
    // Fill top with new blocks
    for (let x = 0; x < bbGridWidth; x++) {
        for (let y = 0; y < bbGridHeight; y++) {
            if (bbGrid[y][x] === 0) {
                bbGrid[y][x] = Math.floor(Math.random() * 5) + 1;
            }
        }
    }
    
    // Check for new matches after fill
    setTimeout(checkMatches, 300);
}

function drawBlockBlastGame() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    for (let y = 0; y < bbGridHeight; y++) {
        for (let x = 0; x < bbGridWidth; x++) {
            if (bbGrid[y][x] > 0) {
                // Draw block
                const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3'];
                ctx.fillStyle = colors[bbGrid[y][x] - 1];
                
                const blockX = x * bbGridSize;
                const blockY = y * bbGridSize;
                
                ctx.fillRect(blockX + 2, blockY + 2, bbGridSize - 4, bbGridSize - 4);
                
                // Draw border
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.strokeRect(blockX + 2, blockY + 2, bbGridSize - 4, bbGridSize - 4);
                
                // Highlight selected block
                if (bbSelectedBlock && bbSelectedBlock.x === x && bbSelectedBlock.y === y) {
                    ctx.strokeStyle = 'yellow';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(blockX + 1, blockY + 1, bbGridSize - 2, bbGridSize - 2);
                }
            }
        }
    }
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${bbScore}`, 20, 30);
}

function gameOver() {
    gameActive = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    canvas.onclick = null;
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.add('active');
}

function levelComplete() {
    gameActive = false;
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    canvas.onclick = null;
    
    // Check if all levels are complete
    if (currentLevel >= gamesConfig['block-blast'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}