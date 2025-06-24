import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Minesweeper.css';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface GameState {
  board: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  mineCount: number;
  flagCount: number;
  time: number;
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

const DIFFICULTY_SETTINGS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

const Minesweeper: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    gameOver: false,
    gameWon: false,
    mineCount: DIFFICULTY_SETTINGS.beginner.mines,
    flagCount: 0,
    time: 0,
    difficulty: 'beginner',
  });

  const [isFirstClick, setIsFirstClick] = useState(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const initializeBoard = useCallback((firstClickRow?: number, firstClickCol?: number) => {
    const { rows, cols, mines } = DIFFICULTY_SETTINGS[gameState.difficulty];
    const board: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines randomly, avoiding the first click position
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Skip if this is the first click position or adjacent to it
      if (firstClickRow !== undefined && firstClickCol !== undefined) {
        if (Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1) {
          continue;
        }
      }
      
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!board[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                board[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          board[row][col].neighborMines = count;
        }
      }
    }

    setGameState(prev => ({
      ...prev,
      board,
      gameOver: false,
      gameWon: false,
      mineCount: mines,
      flagCount: 0,
      time: 0,
    }));
  }, [gameState.difficulty]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.gameWon && !isFirstClick) {
      const newTimer = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    } else if ((gameState.gameOver || gameState.gameWon) && timer) {
      clearInterval(timer);
      setTimer(null);
    }
    return undefined;
  }, [gameState.gameOver, gameState.gameWon, isFirstClick, timer]);

  const revealCell = (board: Cell[][], row: number, col: number): Cell[][] => {
    if (
      row < 0 ||
      row >= board.length ||
      col < 0 ||
      col >= board[0].length ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return board;
    }

    board[row][col].isRevealed = true;

    if (board[row][col].neighborMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          revealCell(board, row + i, col + j);
        }
      }
    }

    return board;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.gameOver || gameState.gameWon || gameState.board[row][col].isFlagged) {
      return;
    }

    if (isFirstClick) {
      setIsFirstClick(false);
      initializeBoard(row, col);
      return;
    }

    const newBoard = [...gameState.board.map(row => [...row])];
    const cell = newBoard[row][col];

    if (cell.isMine) {
      // Game over - reveal all mines
      newBoard.forEach(row => {
        row.forEach(cell => {
          if (cell.isMine) cell.isRevealed = true;
        });
      });
      setGameState(prev => ({ ...prev, board: newBoard, gameOver: true }));
      return;
    }

    revealCell(newBoard, row, col);

    // Check for win
    const isWon = newBoard.every(row =>
      row.every(cell => cell.isRevealed || cell.isMine)
    );

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      gameWon: isWon,
    }));
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState.gameOver || gameState.gameWon || gameState.board[row][col].isRevealed) {
      return;
    }

    const newBoard = [...gameState.board.map(row => [...row])];
    const cell = newBoard[row][col];
    cell.isFlagged = !cell.isFlagged;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      flagCount: prev.flagCount + (cell.isFlagged ? 1 : -1),
    }));
  };

  const handleDifficultyChange = (difficulty: 'beginner' | 'intermediate' | 'expert') => {
    setGameState(prev => ({ ...prev, difficulty }));
    setIsFirstClick(true);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    initializeBoard();
  };

  const handleNewGame = () => {
    setIsFirstClick(true);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    initializeBoard();
  };

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) {
      return '💣';
    }
    return cell.neighborMines === 0 ? '' : cell.neighborMines.toString();
  };

  const getCellClassName = (cell: Cell) => {
    if (!cell.isRevealed) {
      return 'cell hidden';
    }
    if (cell.isMine) {
      return 'cell mine';
    }
    return `cell revealed number-${cell.neighborMines}`;
  };

  return (
    <div className="minesweeper">
      <div className="game-header">
        <div className="mine-counter">
          {String(gameState.mineCount - gameState.flagCount).padStart(3, '0')}
        </div>
        <button 
          className="new-game-btn" 
          onClick={handleNewGame}
        >
          {gameState.gameOver ? '😵' : gameState.gameWon ? '😎' : '😊'}
        </button>
        <div className="timer">
          {String(gameState.time).padStart(3, '0')}
        </div>
      </div>

      <div className="difficulty-buttons">
        <button
          className={gameState.difficulty === 'beginner' ? 'active' : ''}
          onClick={() => handleDifficultyChange('beginner')}
        >
          Beginner
        </button>
        <button
          className={gameState.difficulty === 'intermediate' ? 'active' : ''}
          onClick={() => handleDifficultyChange('intermediate')}
        >
          Intermediate
        </button>
        <button
          className={gameState.difficulty === 'expert' ? 'active' : ''}
          onClick={() => handleDifficultyChange('expert')}
        >
          Expert
        </button>
      </div>

      <div className="game-board">
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {getCellContent(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(gameState.gameOver || gameState.gameWon) && (
        <div className="game-message">
          {gameState.gameOver ? 'Game Over!' : 'You Win!'}
        </div>
      )}
    </div>
  );
};

export default Minesweeper;