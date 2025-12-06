import React, { useState, useEffect } from 'react';
import { Square } from 'lucide-react';

// Define colors for the blocks
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
const BOARD_SIZE = 8;

interface Block {
  color: string;
  id: string;
}

function App() {
  const [board, setBoard] = useState<Block[][]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{row: number; col: number} | null>(null);
  const [score, setScore] = useState(0);

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard: Block[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: Block[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push({
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          id: `${i}-${j}-${Math.random()}`
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setScore(0); // Reset score when initializing new board
    setSelectedBlock(null); // Clear any selected block
  };

  const handleBlockClick = (row: number, col: number) => {
    if (!selectedBlock) {
      setSelectedBlock({ row, col });
    } else {
      // Check if blocks are adjacent
      const isAdjacent = (
        (Math.abs(selectedBlock.row - row) === 1 && selectedBlock.col === col) ||
        (Math.abs(selectedBlock.col - col) === 1 && selectedBlock.row === row)
      );

      if (isAdjacent) {
        swapBlocks(selectedBlock.row, selectedBlock.col, row, col);
      }
      setSelectedBlock(null);
    }
  };

  const swapBlocks = (row1: number, col1: number, row2: number, col2: number) => {
    const newBoard = [...board];
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;
    setBoard(newBoard);

    // Check for matches after swapping
    setTimeout(() => {
      const matches = findMatches(newBoard);
      if (matches.length > 0) {
        removeMatches(matches);
      }
    }, 300);
  };

  const findMatches = (currentBoard: Block[][]) => {
    const matches: {row: number; col: number}[] = [];

    // Check horizontal matches
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE - 2; j++) {
        if (
          currentBoard[i][j].color === currentBoard[i][j + 1].color &&
          currentBoard[i][j].color === currentBoard[i][j + 2].color
        ) {
          matches.push({row: i, col: j});
          matches.push({row: i, col: j + 1});
          matches.push({row: i, col: j + 2});
        }
      }
    }

    // Check vertical matches
    for (let i = 0; i < BOARD_SIZE - 2; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (
          currentBoard[i][j].color === currentBoard[i + 1][j].color &&
          currentBoard[i][j].color === currentBoard[i + 2][j].color
        ) {
          matches.push({row: i, col: j});
          matches.push({row: i + 1, col: j});
          matches.push({row: i + 2, col: j});
        }
      }
    }

    return matches;
  };

  const removeMatches = (matches: {row: number; col: number}[]) => {
    const newBoard = [...board];
    
    // Remove matches and add score
    matches.forEach(({row, col}) => {
      newBoard[row][col] = {
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        id: `${row}-${col}-${Math.random()}`
      };
    });

    setScore(prev => prev + matches.length);
    setBoard(newBoard);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">消消乐</h1>
          <p className="text-xl text-gray-600">得分: {score}</p>
        </div>
        
        <div className="grid gap-1 p-4 bg-gray-100 rounded-lg">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((block, colIndex) => (
                <button
                  key={block.id}
                  onClick={() => handleBlockClick(rowIndex, colIndex)}
                  className={`w-12 h-12 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center
                    ${selectedBlock?.row === rowIndex && selectedBlock?.col === colIndex ? 'ring-4 ring-blue-400' : ''}`}
                  style={{ backgroundColor: block.color }}
                >
                  <Square className="w-8 h-8 text-white/30" />
                </button>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={initializeBoard}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          重新开始
        </button>
      </div>
    </div>
  );
}

export default App;