import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;
      
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 100);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, onScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center bg-black p-2">
      <div className="flex justify-between w-full mb-2 text-[#ff00ff] font-sans text-2xl uppercase">
        <span>{'>'} SEQ: {score}</span>
        {isPaused && !gameOver && <span className="text-[#00ffff] animate-pulse">ERR: HALTED</span>}
      </div>
      
      <div 
        className="relative bg-black border-4 border-[#00ffff] overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 ${i === 0 ? 'bg-[#ff00ff]' : 'bg-[#00ffff] opacity-80'}`}
            style={{
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          />
        ))}
        <div
          className="absolute w-5 h-5 bg-[#ff00ff] animate-ping"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff]">
            <h2 className="text-3xl font-mono text-[#ff00ff] mb-6 glitch-text" data-text="FATAL_EXCEPTION">FATAL_EXCEPTION</h2>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-[#00ffff] text-black font-mono text-xl uppercase hover:bg-[#ff00ff] hover:text-white transition-none"
            >
              {'>'} REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-[#00ffff] font-sans text-xl flex gap-6 uppercase">
        <span>INPUT: [W A S D]</span>
        <span>BRK: [SPACE]</span>
      </div>
    </div>
  );
}
