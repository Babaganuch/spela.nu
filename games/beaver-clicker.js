// Beaver Clicker Game
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
    
    // Check if level is complete
    if (score >= gamesConfig['beaver-clicker'].pointsPerLevel[currentLevel - 1]) {
        levelComplete();
    }
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
    if (currentLevel >= gamesConfig['beaver-clicker'].levels) {
        document.getElementById('all-levels-complete').classList.add('active');
    } else {
        document.getElementById('level-score').textContent = score;
        document.getElementById('level-complete').classList.add('active');
    }
}