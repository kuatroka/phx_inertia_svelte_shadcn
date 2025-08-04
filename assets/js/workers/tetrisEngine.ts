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
  '#9bbc0f', // Empty
  '#306230', // I - cyan
  '#8bac0f', // O - yellow  
  '#0f380f', // T - purple
  '#306230', // S - green
  '#0f380f', // Z - red
  '#306230', // J - blue
  '#8bac0f'  // L - orange
];

// Game state
let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
let board = new Int8Array(BOARD_WIDTH * BOARD_HEIGHT);
let gameState = {
  score: 0,
  level: 1,
  lines: 0,
  isPlaying: false,
  isPaused: false,
  gameOver: false
};

let currentPiece: {
  type: keyof typeof TETROMINOES;
  x: number;
  y: number;
  rotation: number;
} | null = null;

let nextPiece: keyof typeof TETROMINOES;
let dropTimer = 0;
let dropInterval = 1000; // ms
let lastTime = 0;
let keys: Set<string> = new Set();

// Initialize the game
function init(canvas: OffscreenCanvas | null, sprites: string, canvasId?: string) {
  if (canvas) {
    // OffscreenCanvas path (preferred)
    ctx = canvas.getContext('2d')!;
  } else if (canvasId) {
    // Fallback: get canvas from main thread
    // This won't work in worker, so we'll need to handle differently
    postMessage({
      type: 'error',
      data: 'Canvas fallback not implemented in worker'
    });
    return;
  }

  if (!ctx) {
    postMessage({
      type: 'error', 
      data: 'Failed to get canvas context'
    });
    return;
  }

  // Set up canvas
  ctx.imageSmoothingEnabled = false;
  
  // Initialize game
  resetGame();
  startGameLoop();
}

function resetGame() {
  board.fill(0);
  gameState = {
    score: 0,
    level: 1,
    lines: 0,
    isPlaying: true,
    isPaused: false,
    gameOver: false
  };
  
  currentPiece = null;
  spawnPiece();
  updateDropInterval();
  
  postMessage({
    type: 'gameStateUpdate',
    data: gameState
  });
}

function getPieceSize(pieceType: keyof typeof TETROMINOES, rotation: number): { width: number; height: number } {
  const piece = TETROMINOES[pieceType];
  const rotatedPiece = rotatePiece(piece, rotation);
  
  let minX = rotatedPiece[0].length;
  let maxX = -1;
  let minY = rotatedPiece.length;
  let maxY = -1;
  
  for (let py = 0; py < rotatedPiece.length; py++) {
    for (let px = 0; px < rotatedPiece[py].length; px++) {
      if (rotatedPiece[py][px] !== 0) {
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }
  
  return {
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

function spawnPiece() {
  const pieces = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
  
  if (!nextPiece) {
    nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
  }
  
  // Calculate the actual width of the piece to center it properly
  const pieceSize = getPieceSize(nextPiece, 0);
  const spawnX = Math.floor((BOARD_WIDTH - pieceSize.width) / 2);
  
  currentPiece = {
    type: nextPiece,
    x: Math.max(0, Math.min(spawnX, BOARD_WIDTH - pieceSize.width)),
    y: 0,
    rotation: 0
  };
  
  nextPiece = pieces[Math.floor(Math.random() * pieces.length)];
  
  // Check for game over
  if (isCollision(currentPiece.x, currentPiece.y, currentPiece.type, currentPiece.rotation)) {
    gameState.gameOver = true;
    gameState.isPlaying = false;
    
    postMessage({
      type: 'gameOver',
      data: {
        score: gameState.score,
        level: gameState.level,
        lines: gameState.lines
      }
    });
  }
}

function isCollision(x: number, y: number, pieceType: keyof typeof TETROMINOES, rotation: number): boolean {
  const piece = TETROMINOES[pieceType];
  const rotatedPiece = rotatePiece(piece, rotation);
  
  for (let py = 0; py < rotatedPiece.length; py++) {
    for (let px = 0; px < rotatedPiece[py].length; px++) {
      if (rotatedPiece[py][px] !== 0) {
        const boardX = x + px;
        const boardY = y + py;
        
        // Check boundaries
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return true;
        }
        
        // Check collision with existing blocks (but allow negative Y for spawning)
        if (boardY >= 0 && board[boardY * BOARD_WIDTH + boardX] !== 0) {
          return true;
        }
      }
    }
  }
  
  return false;
}

function rotatePiece(piece: number[][], rotation: number): number[][] {
  let rotated = piece;
  
  for (let i = 0; i < rotation % 4; i++) {
    const newPiece: number[][] = [];
    const size = rotated.length;
    
    for (let x = 0; x < size; x++) {
      newPiece[x] = [];
      for (let y = 0; y < size; y++) {
        newPiece[x][y] = rotated[size - 1 - y][x];
      }
    }
    
    rotated = newPiece;
  }
  
  return rotated;
}

function placePiece() {
  if (!currentPiece) return;
  
  const piece = TETROMINOES[currentPiece.type];
  const rotatedPiece = rotatePiece(piece, currentPiece.rotation);
  const pieceValue = Object.keys(TETROMINOES).indexOf(currentPiece.type) + 1;
  
  for (let py = 0; py < rotatedPiece.length; py++) {
    for (let px = 0; px < rotatedPiece[py].length; px++) {
      if (rotatedPiece[py][px] !== 0) {
        const boardX = currentPiece.x + px;
        const boardY = currentPiece.y + py;
        
        if (boardY >= 0 && boardX >= 0 && boardX < BOARD_WIDTH && boardY < BOARD_HEIGHT) {
          board[boardY * BOARD_WIDTH + boardX] = pieceValue;
        }
      }
    }
  }
  
  // Check for completed lines
  checkLines();
  spawnPiece();
}

function checkLines() {
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let isComplete = true;
    
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y * BOARD_WIDTH + x] === 0) {
        isComplete = false;
        break;
      }
    }
    
    if (isComplete) {
      // Remove the line
      for (let moveY = y; moveY > 0; moveY--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[moveY * BOARD_WIDTH + x] = board[(moveY - 1) * BOARD_WIDTH + x];
        }
      }
      
      // Clear top line
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[x] = 0;
      }
      
      linesCleared++;
      y++; // Check the same line again
    }
  }
  
  if (linesCleared > 0) {
    gameState.lines += linesCleared;
    gameState.score += getLineScore(linesCleared) * gameState.level;
    gameState.level = Math.floor(gameState.lines / 10) + 1;
    updateDropInterval();
    
    postMessage({
      type: 'gameStateUpdate',
      data: gameState
    });
  }
}

function getLineScore(lines: number): number {
  switch (lines) {
    case 1: return 40;
    case 2: return 100;
    case 3: return 300;
    case 4: return 1200;
    default: return 0;
  }
}

function updateDropInterval() {
  dropInterval = Math.max(50, 1000 - (gameState.level - 1) * 50);
}

function handleInput(key: string, action: 'keydown' | 'keyup') {
  if (action === 'keydown') {
    keys.add(key);
  } else {
    keys.delete(key);
  }
  
  if (action === 'keydown') {
    switch (key) {
      case 'p':
        if (gameState.isPlaying) {
          gameState.isPaused = !gameState.isPaused;
        }
        break;
        
      case 'r':
        resetGame();
        break;
        
      case ' ':
        hardDrop();
        break;
        
      case 'arrowup':
        rotatePieceInput();
        break;
        
      case 'arrowleft':
        movePiece(-1, 0);
        break;
        
      case 'arrowright':
        movePiece(1, 0);
        break;
        
      case 'arrowdown':
        movePiece(0, 1);
        break;
    }
  }
}

function movePiece(dx: number, dy: number) {
  if (!currentPiece || gameState.isPaused || gameState.gameOver) return;
  
  const newX = currentPiece.x + dx;
  const newY = currentPiece.y + dy;
  
  if (!isCollision(newX, newY, currentPiece.type, currentPiece.rotation)) {
    currentPiece.x = newX;
    currentPiece.y = newY;
    
    if (dy > 0) {
      gameState.score += 1; // Soft drop bonus
    }
  } else if (dy > 0) {
    // Piece hit bottom, place it
    placePiece();
  }
}

function rotatePieceInput() {
  if (!currentPiece || gameState.isPaused || gameState.gameOver) return;
  
  const newRotation = (currentPiece.rotation + 1) % 4;
  
  // Try rotation at current position first
  if (!isCollision(currentPiece.x, currentPiece.y, currentPiece.type, newRotation)) {
    currentPiece.rotation = newRotation;
    return;
  }
  
  // Try wall kicks (simple implementation)
  const wallKicks = [-1, 1, -2, 2]; // Try moving left/right to accommodate rotation
  
  for (const kick of wallKicks) {
    const newX = currentPiece.x + kick;
    if (!isCollision(newX, currentPiece.y, currentPiece.type, newRotation)) {
      currentPiece.x = newX;
      currentPiece.rotation = newRotation;
      return;
    }
  }
}

function hardDrop() {
  if (!currentPiece || gameState.isPaused || gameState.gameOver) return;
  
  let dropDistance = 0;
  
  while (!isCollision(currentPiece.x, currentPiece.y + dropDistance + 1, currentPiece.type, currentPiece.rotation)) {
    dropDistance++;
  }
  
  currentPiece.y += dropDistance;
  gameState.score += dropDistance * 2; // Hard drop bonus
  placePiece();
}

function update(deltaTime: number) {
  if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) return;
  
  dropTimer += deltaTime;
  
  if (dropTimer >= dropInterval) {
    movePiece(0, 1);
    dropTimer = 0;
  }
}

function render() {
  if (!ctx) return;
  
  // Clear canvas
  ctx.fillStyle = '#9bbc0f';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Draw board
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const value = board[y * BOARD_WIDTH + x];
      if (value !== 0) {
        drawBlock(x, y, TETROMINO_COLORS[value]);
      }
    }
  }
  
  // Draw current piece
  if (currentPiece) {
    const piece = TETROMINOES[currentPiece.type];
    const rotatedPiece = rotatePiece(piece, currentPiece.rotation);
    const pieceValue = Object.keys(TETROMINOES).indexOf(currentPiece.type) + 1;
    
    for (let py = 0; py < rotatedPiece.length; py++) {
      for (let px = 0; px < rotatedPiece[py].length; px++) {
        if (rotatedPiece[py][px] !== 0) {
          const x = currentPiece.x + px;
          const y = currentPiece.y + py;
          
          if (y >= 0) {
            drawBlock(x, y, TETROMINO_COLORS[pieceValue]);
          }
        }
      }
    }
  }
  
  // Draw grid lines
  ctx.strokeStyle = '#8bac0f';
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= BOARD_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * BLOCK_SIZE * 2, 0);
    ctx.lineTo(x * BLOCK_SIZE * 2, CANVAS_HEIGHT);
    ctx.stroke();
  }
  
  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * BLOCK_SIZE * 2);
    ctx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE * 2);
    ctx.stroke();
  }
}

function drawBlock(x: number, y: number, color: string) {
  if (!ctx) return;
  
  const pixelX = x * BLOCK_SIZE * 2;
  const pixelY = y * BLOCK_SIZE * 2;
  const size = BLOCK_SIZE * 2;
  
  ctx.fillStyle = color;
  ctx.fillRect(pixelX, pixelY, size, size);
  
  // Add border for better visibility
  ctx.strokeStyle = '#0f380f';
  ctx.lineWidth = 2;
  ctx.strokeRect(pixelX, pixelY, size, size);
}

function startGameLoop() {
  function gameLoop(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    update(deltaTime);
    render();
    
    requestAnimationFrame(gameLoop);
  }
  
  requestAnimationFrame(gameLoop);
}

// Worker message handler
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type } = event.data;
  
  switch (type) {
    case 'init':
      const { canvas, sprites, canvasId } = event.data;
      init(canvas, sprites, canvasId);
      break;
      
    case 'input':
      const { key, action } = event.data;
      handleInput(key, action);
      break;
      
    case 'visibility':
      const { hidden } = event.data;
      if (hidden && gameState.isPlaying) {
        gameState.isPaused = true;
      }
      break;
  }
};
