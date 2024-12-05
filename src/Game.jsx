import React, { useState, useEffect } from 'react';
import { Button, Switch } from 'antd';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'; 

import card1 from './assets/cp.png';
import card2 from './assets/dead.png';
import card3 from './assets/hulk.png';
import card4 from './assets/iron.png';
import card5 from './assets/pan.png';
import card6 from './assets/sp.png';
import card7 from './assets/th.png';
import card8 from './assets/wol.png';
import logo from './assets/ave.png';

const Game = () => {
  const images = [card1, card2, card3, card4, card5, card6, card7, card8];
  const [squares, setSquares] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [winMessageDisplayed, setWinMessageDisplayed] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state for preloader

  
  const initializeGame = () => {
    const shuffledImages = [...images, ...images]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        flipped: false,
        matched: false
      }));
    setSquares(shuffledImages);
    setMoves(0);
    setGameOver(false);
    setFlippedCards([]);
    setWinMessageDisplayed(false);
  };

  useEffect(() => {
    // Set a delay of 5 seconds for preloader before the game initializes
    setTimeout(() => {
      initializeGame();
      setLoading(false); // Hide preloader after 5 seconds
    }, 5000); // 5000ms = 5 seconds
  }, []);

  const flipCard = (id) => {
    if (flippedCards.length === 2 || squares[id].flipped || squares[id].matched) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[id].flipped = true;
    setSquares(newSquares);

    setFlippedCards((prevFlippedCards) => {
      const newFlippedCards = [...prevFlippedCards, id];
      if (newFlippedCards.length === 2) {
        setMoves(moves + 1);
        checkMatch(newFlippedCards);
      }
      return newFlippedCards;
    });
  };

  const checkMatch = (flippedCards) => {
    const [firstCard, secondCard] = flippedCards;
    if (squares[firstCard].image === squares[secondCard].image) {
      const newSquares = squares.slice();
      newSquares[firstCard].matched = true;
      newSquares[secondCard].matched = true;
      setSquares(newSquares);

      toast.success('Match Found!', {
        position: 'top-center',
        duration: 2000,
      });
    } else {
      setTimeout(() => {
        const newSquares = squares.slice();
        newSquares[firstCard].flipped = false;
        newSquares[secondCard].flipped = false;
        setSquares(newSquares);

        toast.error('Try Again!', {
          position: 'top-center',
          duration: 2000,
        });
      }, 1000);
    }

    setFlippedCards([]);
  };

  const restartGame = () => {
    setLoading(true); // Show preloader when restarting
    setTimeout(() => {
      initializeGame();
      setLoading(false);
    }, 5000); // 5 seconds loader on restart
  };

  useEffect(() => {
    if (squares.every(card => card.matched)) {
      if (winMessageDisplayed==true) {
        setGameOver(true);
        setWinMessageDisplayed(true);

        localStorage.setItem('lastScore', moves);

        toast.success('You Win! Congratulations!', {
          position: 'top-center',
          duration: 3000,
        });
      }
    }
  }, [squares, gameOver, winMessageDisplayed]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  return (
    <div className={clsx('game', { dark: isDarkMode })}>
      {/* Preloader Animation */}
      {loading && (
        <div className="wrapper run-animation" id="animate">
          <div className="logo">
            <span className="marvel">Marvel</span>
            <span className="studios">Studios</span>
          </div>
        </div>
      )}

      {/* Main Game Content */}
      {!loading && (
        <div>
          <div className="title-container">
            <h3 className="game-title">M2M Game</h3>
            <div className="score">Moves: {moves}</div>
            <div className="button-container">
              <Button
                type="primary"
                className="restart-button"
                onClick={restartGame}
              >
                Restart Game
              </Button>
            </div>
          </div>
          <div className="theme-toggle">
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              checkedChildren="Dark Mode"
              unCheckedChildren="Light Mode"
            />
          </div>
          <div className="grid-container">
            {squares.map((square, index) => (
              <div
                key={square.id}
                className={clsx('grid-square', { flipped: square.flipped, matched: square.matched })}
                onClick={() => flipCard(square.id)}
              >
                {square.flipped || square.matched ? (
                  <img className="card-image" src={square.image} alt="card" />
                ) : (
                  <div className="card-back">
                    <img src={logo} alt="logo" className="logo" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hot Toastify Notifications */}
      <Toaster />
    </div>
  );
};

export default Game;
