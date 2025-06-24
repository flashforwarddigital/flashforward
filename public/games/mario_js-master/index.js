// Main entry point for Mario JS
document.addEventListener('DOMContentLoaded', () => {
  // Load game assets
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  
  // Set up game state
  let gameStarted = false;
  
  // Load assets
  const marioSprite = new Image();
  marioSprite.src = './assets/sprites/spritesheet.png';
  
  const backgroundImage = new Image();
  backgroundImage.src = './assets/sprites/clouds.png';
  
  // Draw loading screen
  function drawLoadingScreen() {
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '20px "PixelEmulator", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);
  }
  
  // Draw start screen
  function drawStartScreen() {
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px "PixelEmulator", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MARIO JS', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '16px "PixelEmulator", monospace';
    ctx.fillText('Press ENTER to Start', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '12px "PixelEmulator", monospace';
    ctx.fillText('Arrow Keys to Move, Space to Jump', canvas.width / 2, canvas.height * 2/3);
  }
  
  // Initialize game
  function init() {
    drawLoadingScreen();
    
    // When assets are loaded, show start screen
    Promise.all([
      new Promise(resolve => marioSprite.onload = resolve),
      new Promise(resolve => backgroundImage.onload = resolve)
    ]).then(() => {
      drawStartScreen();
      
      // Add event listener for starting the game
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !gameStarted) {
          gameStarted = true;
          startGame();
        }
      });
    });
  }
  
  // Start the game
  function startGame() {
    // Redirect to the actual game
    window.location.href = './assets/javascripts/bundle.js';
  }
  
  // Initialize the game
  init();
});