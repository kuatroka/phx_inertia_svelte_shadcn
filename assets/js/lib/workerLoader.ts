// Worker loader utility to avoid CORS issues in development
export function createTetrisWorker(): Worker {
  // Create worker code as a string to avoid CORS issues
  const workerCode = `
// Tetris Game Engine Web Worker
// Runs at 60fps with complete game logic isolated from main thread

interface InitMessage {
  type: 'init';
  canvas: OffscreenCanvas | null;
  sprites: string;
  canvasId?: string;
}

interface InputMessage {
  type: 'input';
  key: string;
  action: 'keydown' | 'keyup';
}

interface VisibilityMessage {
  type: 'visibility';
  hidden: boolean;
}

type WorkerMessage = InitMessage | InputMessage | VisibilityMessage;

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 16;
const CANVAS_WIDTH = BOARD_WIDTH * BLOCK_SIZE * 2; // 320px
const CANVAS_HEIGHT = BOARD_HEIGHT * BLOCK_SIZE * 2; // 640px

// Tetromino definitions (using Int8Array for performance)
const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [2, 2],
    [2, 2]
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0]
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0]
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0]
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0]
  ]
};

const TETROMINO_COLORS = [
  '#000000', // 0: Empty
  '#00FFFF', // 1: I - Cyan
  '#FFFF00', // 2: O - Yellow
  '#800080', // 3: T - Purple
  '#00FF00', // 4: S - Green
  '#FF0000', // 5: Z - Red
  '#0000FF', // 6: J - Blue
  '#FFA500'  // 7: L - Orange
];

// Game state
let gameState = {
  board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
  currentPiece: null as any,
  nextPiece: null as any,
  score: 0,
  level: 1,
  lines: 0,
  gameOver: false,
  paused: false,
  dropTime: 0,
  dropInterval: 1000, // 1 second initially
  lastTime: 0
};

// Input state
let inputState = {
  left: false,
  right: false,
  down: false,
  rotate: false,
  hardDrop: false,
  pause: false,
  restart: false
};

// Rendering context
let ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;
let spritesImage: ImageBitmap | HTMLImageElement | null = null;
let canvas: OffscreenCanvas | HTMLCanvasElement | null = null;

// Game loop
let animationId: number | null = null;
let isRunning = false;

class Piece {
  x: number;
  y: number;
  shape: number[][];
  color: number;
  type: string;

  constructor(type: string) {
    this.type = type;
    this.shape = TETROMINOES[type as keyof typeof TETROMINOES];
    this.color = Object.keys(TETROMINOES).indexOf(type) + 1;
    this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.shape[0].length / 2);
    this.y = 0;
  }

  rotate() {
    const rotated = this.shape[0].map((_, i) =>
      this.shape.map(row => row[i]).reverse()
    );
    
    if (this.isValidPosition(rotated, this.x, this.y)) {
      this.shape = rotated;
      return true;
    }
    return false;
  }

  isValidPosition(shape: number[][], x: number, y: number): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && gameState.board[newY][newX] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  move(dx: number, dy: number): boolean {
    if (this.isValidPosition(this.shape, this.x + dx, this.y + dy)) {
      this.x += dx;
      this.y += dy;
      return true;
    }
    return false;
  }
}

function getRandomPiece(): Piece {
  const types = Object.keys(TETROMINOES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  return new Piece(randomType);
}

function placePiece() {
  if (!gameState.currentPiece) return;
  
  for (let row = 0; row < gameState.currentPiece.shape.length; row++) {
    for (let col = 0; col < gameState.currentPiece.shape[row].length; col++) {
      if (gameState.currentPiece.shape[row][col] !== 0) {
        const boardY = gameState.currentPiece.y + row;
        const boardX = gameState.currentPiece.x + col;
        
        if (boardY >= 0) {
          gameState.board[boardY][boardX] = gameState.currentPiece.color;
        }
      }
    }
  }
  
  // Check for completed lines
  clearLines();
  
  // Spawn next piece
  gameState.currentPiece = gameState.nextPiece;
  gameState.nextPiece = getRandomPiece();
  
  // Check game over
  if (!gameState.currentPiece.isValidPosition(
    gameState.currentPiece.shape,
    gameState.currentPiece.x,
    gameState.currentPiece.y
  )) {
    gameState.gameOver = true;
    stopGameLoop();
    self.postMessage({
      type: 'gameOver',
      data: { score: gameState.score, level: gameState.level, lines: gameState.lines }
    });
  }
}

function clearLines() {
  let linesCleared = 0;
  
  for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
    if (gameState.board[row].every(cell => cell !== 0)) {
      gameState.board.splice(row, 1);
      gameState.board.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      row++; // Check the same row again
    }
  }
  
  if (linesCleared > 0) {
    gameState.lines += linesCleared;
    gameState.level = Math.floor(gameState.lines / 10) + 1;
    gameState.dropInterval = Math.max(50, 1000 - (gameState.level - 1) * 50);
    
    // Score calculation (Tetris scoring system)
    const lineScores = [0, 40, 100, 300, 1200];
    gameState.score += lineScores[linesCleared] * gameState.level;
  }
}

function update(deltaTime: number) {
  if (gameState.gameOver || gameState.paused || !gameState.currentPiece) return;
  
  // Handle input
  if (inputState.left) {
    gameState.currentPiece.move(-1, 0);
    inputState.left = false;
  }
  if (inputState.right) {
    gameState.currentPiece.move(1, 0);
    inputState.right = false;
  }
  if (inputState.rotate) {
    gameState.currentPiece.rotate();
    inputState.rotate = false;
  }
  if (inputState.hardDrop) {
    while (gameState.currentPiece.move(0, 1)) {
      gameState.score += 2; // Hard drop bonus
    }
    placePiece();
    inputState.hardDrop = false;
    return;
  }
  
  // Gravity
  gameState.dropTime += deltaTime;
  const currentDropInterval = inputState.down ? gameState.dropInterval / 10 : gameState.dropInterval;
  
  if (gameState.dropTime >= currentDropInterval) {
    if (!gameState.currentPiece.move(0, 1)) {
      placePiece();
    } else if (inputState.down) {
      gameState.score += 1; // Soft drop bonus
    }
    gameState.dropTime = 0;
  }
}

function render() {
  if (!ctx || !canvas) return;
  
  // Clear canvas
  ctx.fillStyle = '#9BBB0F'; // Game Boy green
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Draw board
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (gameState.board[row][col] !== 0) {
        drawBlock(col * BLOCK_SIZE * 2, row * BLOCK_SIZE * 2, gameState.board[row][col]);
      }
    }
  }
  
  // Draw current piece
  if (gameState.currentPiece) {
    for (let row = 0; row < gameState.currentPiece.shape.length; row++) {
      for (let col = 0; col < gameState.currentPiece.shape[row].length; col++) {
        if (gameState.currentPiece.shape[row][col] !== 0) {
          const x = (gameState.currentPiece.x + col) * BLOCK_SIZE * 2;
          const y = (gameState.currentPiece.y + row) * BLOCK_SIZE * 2;
          drawBlock(x, y, gameState.currentPiece.color);
        }
      }
    }
  }
  
  // Draw ghost piece (preview where piece will land)
  if (gameState.currentPiece && !gameState.paused) {
    const ghostPiece = new Piece(gameState.currentPiece.type);
    ghostPiece.x = gameState.currentPiece.x;
    ghostPiece.y = gameState.currentPiece.y;
    ghostPiece.shape = gameState.currentPiece.shape;
    
    while (ghostPiece.move(0, 1)) {
      // Move down until it can't
    }
    
    ctx.globalAlpha = 0.3;
    for (let row = 0; row < ghostPiece.shape.length; row++) {
      for (let col = 0; col < ghostPiece.shape[row].length; col++) {
        if (ghostPiece.shape[row][col] !== 0) {
          const x = (ghostPiece.x + col) * BLOCK_SIZE * 2;
          const y = (ghostPiece.y + row) * BLOCK_SIZE * 2;
          drawBlock(x, y, gameState.currentPiece.color);
        }
      }
    }
    ctx.globalAlpha = 1.0;
  }
}

function drawBlock(x: number, y: number, colorIndex: number) {
  if (!ctx) return;
  
  const color = TETROMINO_COLORS[colorIndex] || '#000000';
  
  // Draw block with Game Boy style
  ctx.fillStyle = color;
  ctx.fillRect(x, y, BLOCK_SIZE * 2, BLOCK_SIZE * 2);
  
  // Add border for retro look
  ctx.strokeStyle = '#0F380F';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, BLOCK_SIZE * 2, BLOCK_SIZE * 2);
}

function gameLoop(currentTime: number) {
  if (!isRunning) return;
  
  const deltaTime = currentTime - gameState.lastTime;
  gameState.lastTime = currentTime;
  
  update(deltaTime);
  render();
  
  // Send game state update
  self.postMessage({
    type: 'gameStateUpdate',
    data: {
      score: gameState.score,
      level: gameState.level,
      lines: gameState.lines,
      gameOver: gameState.gameOver,
      paused: gameState.paused
    }
  });
  
  animationId = requestAnimationFrame(gameLoop);
}

function startGameLoop() {
  if (isRunning) return;
  isRunning = true;
  gameState.lastTime = performance.now();
  animationId = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  isRunning = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resetGame() {
  gameState = {
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: getRandomPiece(),
    nextPiece: getRandomPiece(),
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
    dropTime: 0,
    dropInterval: 1000,
    lastTime: 0
  };
  
  inputState = {
    left: false,
    right: false,
    down: false,
    rotate: false,
    hardDrop: false,
    pause: false,
    restart: false
  };
}

async function initializeGame(message: InitMessage) {
  try {
    if (message.canvas) {
      // OffscreenCanvas mode
      canvas = message.canvas;
      ctx = canvas.getContext('2d');
    } else if (message.canvasId) {
      // Fallback to main thread canvas
      // This won't work in a worker, but we'll handle it gracefully
      self.postMessage({
        type: 'error',
        data: 'OffscreenCanvas not supported, falling back to main thread rendering'
      });
      return;
    }
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Load sprites
    if (message.sprites) {
      try {
        const response = await fetch(message.sprites);
        const blob = await response.blob();
        spritesImage = await createImageBitmap(blob);
      } catch (error) {
        console.warn('Could not load sprites, using fallback rendering:', error);
      }
    }
    
    // Initialize game state
    resetGame();
    
    // Start game loop
    startGameLoop();
    
  } catch (error) {
    self.postMessage({
      type: 'error',
      data: \`Failed to initialize game: \${error.message}\`
    });
  }
}

// Message handler
self.onmessage = function(event: MessageEvent<WorkerMessage>) {
  const message = event.data;
  
  switch (message.type) {
    case 'init':
      initializeGame(message);
      break;
      
    case 'input':
      if (gameState.gameOver && message.key === 'r') {
        resetGame();
        startGameLoop();
        break;
      }
      
      if (message.action === 'keydown') {
        switch (message.key) {
          case 'arrowleft':
            inputState.left = true;
            break;
          case 'arrowright':
            inputState.right = true;
            break;
          case 'arrowdown':
            inputState.down = true;
            break;
          case 'arrowup':
          case ' ':
            inputState.rotate = true;
            break;
          case 'enter':
            inputState.hardDrop = true;
            break;
          case 'p':
            gameState.paused = !gameState.paused;
            if (gameState.paused) {
              stopGameLoop();
            } else {
              startGameLoop();
            }
            break;
          case 'r':
            if (gameState.gameOver) {
              resetGame();
              startGameLoop();
            }
            break;
        }
      } else if (message.action === 'keyup') {
        switch (message.key) {
          case 'arrowdown':
            inputState.down = false;
            break;
        }
      }
      break;
      
    case 'visibility':
      if (message.hidden) {
        gameState.paused = true;
        stopGameLoop();
      } else if (!gameState.gameOver) {
        gameState.paused = false;
        startGameLoop();
      }
      break;
  }
};
`;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}
