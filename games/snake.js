// Snake Game (Phaser)
// Self-contained: own keyboard input, own score, own game loop.
// Renders onto the #game-canvas element created by loadGame().

class SnakeScene extends Phaser.Scene {
    constructor() {
        super('snake');
    }

    create() {
        this.GRID = 20;
        this.WIDTH = this.scale.width;
        this.HEIGHT = this.scale.height;
        this.cols = Math.floor(this.WIDTH / this.GRID);
        this.rows = Math.floor(this.HEIGHT / this.GRID);

        this.headColor = (window.selectedColor && window.selectedColor !== '#FF5733')
            ? window.selectedColor
            : '#4CAF50';
        this.bodyColor = '#2E7D32';

        this.snake = [{ x: 5, y: 10 }];
        this.direction = 'right';
        this.queuedDirection = 'right';
        this.snakeScore = 0;
        this.running = true;

        this.placeFood();

        this.moveTimer = this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.step,
            callbackScope: this
        });

        // Keyboard input — managed here, not in script.js, so there is
        // no shared-state binding mismatch.
        this.input.keyboard.on('keydown', (e) => {
            if (!this.running) return;
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.queuedDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.queuedDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.queuedDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.queuedDirection = 'right';
                    break;
            }
        });

        this.draw();
    }

    step() {
        if (!this.running) return;
        this.direction = this.queuedDirection;

        const head = { x: this.snake[0].x, y: this.snake[0].y };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            this.endGame();
            return;
        }

        // Self collision
        for (const seg of this.snake) {
            if (seg.x === head.x && seg.y === head.y) {
                this.endGame();
                return;
            }
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.snakeScore += 10;
            window.score = this.snakeScore;
            if (typeof window.updateScoreDisplay === 'function') window.updateScoreDisplay();
            this.placeFood();

            const target = window.gamesConfig.snake.pointsPerLevel[window.currentLevel - 1];
            if (this.snakeScore >= target) {
                this.levelComplete();
                return;
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    placeFood() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
        this.food = pos;
    }

    draw() {
        this.add.rectangle(0, 0, this.WIDTH, this.HEIGHT, 0x111111).setOrigin(0, 0);

        // food
        this.add.circle(
            this.food.x * this.GRID + this.GRID / 2,
            this.food.y * this.GRID + this.GRID / 2,
            this.GRID / 2,
            0xFF5733
        );

        // snake
        this.snake.forEach((seg, i) => {
            this.add.rectangle(
                seg.x * this.GRID, seg.y * this.GRID,
                this.GRID, this.GRID,
                Phaser.Display.Color.HexStringToColor(i === 0 ? this.headColor : this.bodyColor).color
            ).setOrigin(0, 0);
        });
    }

    endGame() {
        this.running = false;
        this.moveTimer.remove();
        window.gameActive = false;
        const fs = document.getElementById('final-score');
        if (fs) fs.textContent = this.snakeScore;
        const go = document.getElementById('game-over');
        if (go) go.classList.add('active');
    }

    levelComplete() {
        this.running = false;
        this.moveTimer.remove();
        window.gameActive = false;
        if (window.currentLevel >= window.gamesConfig.snake.levels) {
            const all = document.getElementById('all-levels-complete');
            if (all) all.classList.add('active');
        } else {
            const ls = document.getElementById('level-score');
            if (ls) ls.textContent = this.snakeScore;
            const lc = document.getElementById('level-complete');
            if (lc) lc.classList.add('active');
        }
    }
}

function initSnakeGame() {
    const canvasEl = document.getElementById('game-canvas');
    window.gameActive = true;

    // Destroy any previous Phaser instance for this canvas.
    if (window.phaserGame) {
        window.phaserGame.destroy(true);
        window.phaserGame = null;
    }

    window.phaserGame = new Phaser.Game({
        type: Phaser.CANVAS,
        canvas: canvasEl,
        width: 700,
        height: 500,
        backgroundColor: '#111111',
        scene: SnakeScene,
        input: { keyboard: true }
    });
}
