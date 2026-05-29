// Shark Clicker Game
function initSharkClickerGame() {
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
            <div class="clicker-beaver" onclick="clickShark()">🦈</div>
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
        if (gameActive && currentGame === 'shark-clicker') {
            clickerScore = Math.min(clickerScore + autoClickers * 0.1 * clickerMultiplier, 200);
            score += autoClickers * 0.1 * clickerMultiplier;
            updateClickerDisplay();
        }
    }, 100);
}

function clickShark() {
    if (!gameActive || currentGame !== 'shark-clicker') return;
    
    clickerScore = Math.min(clickerScore + clickerMultiplier, 200);
    score += clickerMultiplier;
    updateClickerDisplay();
    
    const shark = document.querySelector('.clicker-beaver');
    shark.style.transform = 'scale(0.95)';
    setTimeout(() => {
        shark.style.transform = 'scale(1)';
    }, 100);
}

function gameOver() {
    gameActive = false;
    if (autoClickerLoop) {
        clearInterval(autoClickerLoop);
        autoClickerLoop = null;
    }
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').classList.add('active');
}

function levelComplete() {
    gameActive = false;
    if (autoClickerLoop) {
        clearInterval(autoClickerLoop);
        autoClickerLoop = null;
    }
    
    // Check if all levels are complete
    if (currentLevel >= gamesConfig['shark-clicker'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}