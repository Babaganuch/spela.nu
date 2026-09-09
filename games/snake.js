// Snake Game (Phaser) — integrated into the main start page.
// Self-contained: own keyboard input, own loop, own rendering.
// Renders into a #phaser-game div inside the .game-wrapper created by
// loadGame(), and drives the page's existing score / game-over / level
// overlays rather than a private HUD.

const GRID = 20;
const COLS = 35;
const ROWS = 25;
const WIDTH = GRID * COLS;   // 700
const HEIGHT = GRID * ROWS;  // 500

class SnakeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'snake' });
    }

    create() {
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.queuedDirection = { x: 1, y: 0 };
        this.snakeScore = 0;
        this.gameOver = false;

        var startX = Math.floor(COLS / 5);
        var startY = Math.floor(ROWS / 2);
        for (var i = 0; i < 3; i++) {
            this.snake.push({ x: startX - i, y: startY });
        }

        this.placeFood();

        // Colour chosen on the start page (defaults to green).
        var sc = window.selectedColor;
        this.headColor = (sc && sc !== '#FF5733') ? Phaser.Display.Color.HexStringToColor(sc).color : 0x4CAF50;
        this.bodyColor = 0x2E7D32;

        this.gfx = this.add.graphics();

        this.moveEvent = this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.step,
            callbackScope: this
        });

        this.input.keyboard.on('keydown', (e) => {
            if (this.gameOver) return;
            var d = this.direction;
            if (e.key === 'ArrowUp' && d.y === 0) this.queuedDirection = { x: 0, y: -1 };
            else if (e.key === 'ArrowDown' && d.y === 0) this.queuedDirection = { x: 0, y: 1 };
            else if (e.key === 'ArrowLeft' && d.x === 0) this.queuedDirection = { x: -1, y: 0 };
            else if (e.key === 'ArrowRight' && d.x === 0) this.queuedDirection = { x: 1, y: 0 };
        });

        this.draw();
    }

    step() {
        if (this.gameOver) return;
        this.direction = this.queuedDirection;
        var head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { this.endGame(); return; }
        for (var i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === head.x && this.snake[i].y === head.y) { this.endGame(); return; }
        }

        this.snake.unshift(head);
        if (head.x === this.foodCell.x && head.y === this.foodCell.y) {
            this.snakeScore += 10;
            window.score = this.snakeScore;
            this.placeFood();
            if (typeof window.updateScoreDisplay === 'function') window.updateScoreDisplay();

            var target = window.gamesConfig.snake.pointsPerLevel[window.currentLevel - 1];
            if (this.snakeScore >= target) { this.levelComplete(); return; }
        } else {
            this.snake.pop();
        }
        this.draw();
    }

    placeFood() {
        var x, y, occupied;
        do {
            x = Phaser.Math.Between(0, COLS - 1);
            y = Phaser.Math.Between(0, ROWS - 1);
            occupied = false;
            for (var i = 0; i < this.snake.length; i++) {
                if (this.snake[i].x === x && this.snake[i].y === y) { occupied = true; break; }
            }
        } while (occupied);
        this.foodCell = { x: x, y: y };
    }

    draw() {
        var g = this.gfx;
        g.clear();
        // background
        g.fillStyle(0x111111, 1);
        g.fillRect(0, 0, WIDTH, HEIGHT);
        // subtle grid lines for a refreshed look
        g.fillStyle(0x1c1c1c, 1);
        for (var gx = 0; gx <= COLS; gx++) g.fillRect(gx * GRID, 0, 1, HEIGHT);
        for (var gy = 0; gy <= ROWS; gy++) g.fillRect(0, gy * GRID, WIDTH, 1);
        // food
        g.fillStyle(0xFF5733, 1);
        g.fillCircle(this.foodCell.x * GRID + GRID / 2, this.foodCell.y * GRID + GRID / 2, GRID / 2);
        // snake
        for (var i = 0; i < this.snake.length; i++) {
            g.fillStyle(i === 0 ? this.headColor : this.bodyColor, 1);
            g.fillRect(this.snake[i].x * GRID, this.snake[i].y * GRID, GRID, GRID);
        }
    }

    endGame() {
        this.gameOver = true;
        this.moveEvent.remove();
        window.gameActive = false;
        var fs = document.getElementById('final-score');
        if (fs) fs.textContent = this.snakeScore;
        var go = document.getElementById('game-over');
        if (go) go.classList.add('active');
    }

    levelComplete() {
        this.gameOver = true;
        this.moveEvent.remove();
        window.gameActive = false;
        if (window.currentLevel >= window.gamesConfig.snake.levels) {
            var all = document.getElementById('all-levels-complete');
            if (all) all.classList.add('active');
        } else {
            var ls = document.getElementById('level-score');
            if (ls) ls.textContent = this.snakeScore;
            var lc = document.getElementById('level-complete');
            if (lc) lc.classList.add('active');
        }
    }
}

function initSnakeGame() {
    window.gameActive = true;

    if (window.phaserGame) {
        window.phaserGame.destroy(true);
        window.phaserGame = null;
    }

    // The generic #game-canvas is unused by Phaser; replace it with a
    // dedicated container so the Phaser canvas is injected predictably.
    var oldCanvas = document.getElementById('game-canvas');
    var parent = oldCanvas ? oldCanvas.parentNode : document.querySelector('.game-wrapper');
    if (oldCanvas) oldCanvas.remove();
    var holder = document.createElement('div');
    holder.id = 'phaser-game';
    if (parent) parent.appendChild(holder);

    window.phaserGame = new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: WIDTH,
        height: HEIGHT,
        backgroundColor: '#111111',
        scene: SnakeScene,
        input: { keyboard: true }
    });
}
