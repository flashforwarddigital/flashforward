// Pizza Undelivery Game - Basic Implementation
// This is a placeholder implementation to resolve the missing bundle.js error

class PizzaUndeliveryGame {
    constructor() {
        this.canvas = document.querySelector('.game');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'title';
        this.level = 1;
        this.player = {
            x: 96,
            y: 54,
            width: 8,
            height: 8,
            speed: 2
        };
        this.pizzas = [];
        this.keys = {};
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showTitleScreen();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
        });
        
        // Handle button clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.handleButtonClick(e.target);
            }
        });
        
        // Handle level input
        document.addEventListener('input', (e) => {
            if (e.target.name === 'level') {
                this.level = parseInt(e.target.value) || 1;
            }
        });
    }
    
    handleButtonClick(button) {
        const text = button.textContent.toLowerCase();
        
        if (text.includes('go')) {
            this.startGame();
        } else if (text.includes('generate')) {
            this.generateNewMap();
        } else if (text.includes('restart')) {
            this.showTitleScreen();
        }
    }
    
    showTitleScreen() {
        this.gameState = 'title';
        const template = document.getElementById('title-template');
        const overlay = template.content.cloneNode(true);
        
        // Remove any existing overlays
        const existingOverlay = document.querySelector('.game-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        document.body.appendChild(overlay);
    }
    
    startGame() {
        this.gameState = 'playing';
        const overlay = document.querySelector('.game-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.generatePizzas();
        this.draw();
    }
    
    generateNewMap() {
        this.generatePizzas();
        this.draw();
    }
    
    generatePizzas() {
        this.pizzas = [];
        const numPizzas = Math.min(3 + this.level, 10);
        
        for (let i = 0; i < numPizzas; i++) {
            this.pizzas.push({
                x: Math.random() * (this.canvas.width - 16) + 8,
                y: Math.random() * (this.canvas.height - 16) + 8,
                collected: false
            });
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Handle player movement
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        
        // Check pizza collection
        this.pizzas.forEach(pizza => {
            if (!pizza.collected && 
                this.player.x < pizza.x + 8 && 
                this.player.x + this.player.width > pizza.x &&
                this.player.y < pizza.y + 8 && 
                this.player.y + this.player.height > pizza.y) {
                pizza.collected = true;
            }
        });
        
        // Check if all pizzas collected
        if (this.pizzas.every(pizza => pizza.collected)) {
            this.gameComplete();
        }
    }
    
    gameComplete() {
        this.gameState = 'complete';
        const template = document.getElementById('game-over-template');
        const overlay = template.content.cloneNode(true);
        overlay.querySelector('#lnum').textContent = this.level;
        
        document.body.appendChild(overlay);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2a5d31';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState === 'playing') {
            // Draw pizzas
            this.pizzas.forEach(pizza => {
                if (!pizza.collected) {
                    this.ctx.fillStyle = '#ff6b35';
                    this.ctx.fillRect(pizza.x, pizza.y, 8, 8);
                    this.ctx.fillStyle = '#ffcc02';
                    this.ctx.fillRect(pizza.x + 1, pizza.y + 1, 6, 6);
                }
            });
            
            // Draw player (delivery car)
            this.ctx.fillStyle = '#ff0000';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(this.player.x + 1, this.player.y + 1, this.player.width - 2, this.player.height - 2);
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PizzaUndeliveryGame();
});