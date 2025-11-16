'use client';

import { useState, useEffect, useCallback } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  difficulty: Difficulty | null;
  num1: number;
  num2: number;
  answer: string;
  correctAnswer: number;
  timeLeft: number;
  score: number;
  totalQuestions: number;
  correctCount: number;
  isGameActive: boolean;
  feedback: 'correct' | 'wrong' | null;
  gameOver: boolean;
}

const TIME_LIMITS: Record<Difficulty, number> = {
  easy: 60,
  medium: 20,
  hard: 10,
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    difficulty: null,
    num1: 0,
    num2: 0,
    answer: '',
    correctAnswer: 0,
    timeLeft: 0,
    score: 0,
    totalQuestions: 0,
    correctCount: 0,
    isGameActive: false,
    feedback: null,
    gameOver: false,
  });

  const generateProblem = useCallback((difficulty: Difficulty) => {
    let num1: number, num2: number;

    if (difficulty === 'easy') {
      // Easy: 2-digit numbers (10-99)
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else if (difficulty === 'medium') {
      // Medium: 2-digit numbers (10-99)
      num1 = Math.floor(Math.random() * 90) + 10;
      num2 = Math.floor(Math.random() * 90) + 10;
    } else {
      // Hard: 3-digit numbers (100-999)
      num1 = Math.floor(Math.random() * 900) + 100;
      num2 = Math.floor(Math.random() * 900) + 100;
    }

    return { num1, num2, correctAnswer: num1 * num2 };
  }, []);

  const startGame = (difficulty: Difficulty) => {
    const problem = generateProblem(difficulty);
    setGameState({
      difficulty,
      num1: problem.num1,
      num2: problem.num2,
      answer: '',
      correctAnswer: problem.correctAnswer,
      timeLeft: TIME_LIMITS[difficulty],
      score: 0,
      totalQuestions: 0,
      correctCount: 0,
      isGameActive: true,
      feedback: null,
      gameOver: false,
    });
  };

  const generateNewProblem = useCallback(() => {
    if (gameState.difficulty) {
      const problem = generateProblem(gameState.difficulty);
      setGameState((prev) => ({
        ...prev,
        num1: problem.num1,
        num2: problem.num2,
        answer: '',
        correctAnswer: problem.correctAnswer,
        timeLeft: TIME_LIMITS[gameState.difficulty!],
        feedback: null,
      }));
    }
  }, [gameState.difficulty, generateProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameState.isGameActive || gameState.gameOver) return;

    const userAnswer = parseInt(gameState.answer);
    const isCorrect = userAnswer === gameState.correctAnswer;

    setGameState((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      score: isCorrect ? prev.score + 10 : prev.score,
      feedback: isCorrect ? 'correct' : 'wrong',
    }));

    // Generate new problem after a short delay
    setTimeout(() => {
      generateNewProblem();
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameState((prev) => ({
      ...prev,
      answer: e.target.value,
    }));
  };

  useEffect(() => {
    if (!gameState.isGameActive || gameState.gameOver) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeLeft <= 1) {
          return {
            ...prev,
            timeLeft: 0,
            isGameActive: false,
            gameOver: true,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameActive, gameState.gameOver]);

  const resetGame = () => {
    setGameState({
      difficulty: null,
      num1: 0,
      num2: 0,
      answer: '',
      correctAnswer: 0,
      timeLeft: 0,
      score: 0,
      totalQuestions: 0,
      correctCount: 0,
      isGameActive: false,
      feedback: null,
      gameOver: false,
    });
  };

  const getTimerColor = () => {
    if (!gameState.difficulty) return 'text-gray-600';
    const percentage = (gameState.timeLeft / TIME_LIMITS[gameState.difficulty]) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {!gameState.difficulty ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Math Challenge
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Test your multiplication skills! Choose your difficulty level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => startGame('easy')}
                className="group relative overflow-hidden bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-2">Easy</div>
                  <div className="text-sm opacity-90">60 seconds</div>
                  <div className="text-xs mt-2 opacity-75">2-digit × 2-digit</div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button
                onClick={() => startGame('medium')}
                className="group relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-600 hover:from-yellow-500 hover:to-orange-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-2">Medium</div>
                  <div className="text-sm opacity-90">20 seconds</div>
                  <div className="text-xs mt-2 opacity-75">2-digit × 2-digit</div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <button
                onClick={() => startGame('hard')}
                className="group relative overflow-hidden bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-2">Hard</div>
                  <div className="text-sm opacity-90">10 seconds</div>
                  <div className="text-xs mt-2 opacity-75">3-digit × 3-digit</div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-10">
            {/* Header with timer and score */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`text-3xl md:text-4xl font-bold ${getTimerColor()} transition-colors duration-300`}>
                  ⏱️ {gameState.timeLeft}s
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  Score: <span className="font-bold text-blue-600 dark:text-blue-400">{gameState.score}</span>
                </div>
              </div>
              {!gameState.gameOver && (
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Game Over Screen */}
            {gameState.gameOver ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Time's Up!
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{gameState.score}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {gameState.totalQuestions > 0
                          ? Math.round((gameState.correctCount / gameState.totalQuestions) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="text-lg">
                      <span className="text-gray-600 dark:text-gray-300">Questions: </span>
                      <span className="font-bold">{gameState.totalQuestions}</span>
                      <span className="text-gray-600 dark:text-gray-300 ml-4">Correct: </span>
                      <span className="font-bold text-green-600 dark:text-green-400">{gameState.correctCount}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <>
                {/* Problem Display */}
                <div className="text-center mb-8">
                  <div className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-gray-200 mb-6 py-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                    {gameState.num1} × {gameState.num2}
                  </div>
                </div>

                {/* Answer Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <input
                      type="number"
                      value={gameState.answer}
                      onChange={handleInputChange}
                      placeholder="Enter your answer"
                      autoFocus
                      className="w-full max-w-md text-center text-3xl md:text-4xl font-bold py-4 px-6 border-4 border-blue-300 dark:border-blue-600 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200"
                    />
                    <button
                      type="submit"
                      disabled={!gameState.answer.trim()}
                      className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 text-xl"
                    >
                      Submit Answer
                    </button>
                  </div>
                </form>

                {/* Feedback */}
                {gameState.feedback && (
                  <div
                    className={`mt-6 text-center text-2xl font-bold py-4 rounded-xl transition-all duration-300 ${
                      gameState.feedback === 'correct'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}
                  >
                    {gameState.feedback === 'correct' ? '✅ Correct!' : '❌ Wrong! Try again.'}
                  </div>
                )}

                {/* Stats */}
                <div className="mt-8 flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    Questions: <span className="font-bold">{gameState.totalQuestions}</span>
                  </div>
                  <div>
                    Correct: <span className="font-bold text-green-600 dark:text-green-400">{gameState.correctCount}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
