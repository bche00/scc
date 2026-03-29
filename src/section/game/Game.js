import React, { useState, useEffect, useCallback } from 'react';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30초 제한시간
  const [activeIdx, setActiveIdx] = useState(null); // 현재 두더지 위치 (0~8)
  const [isSpecial, setIsSpecial] = useState(false); // 꽝(감점) 이미지 여부
  const [gameState, setGameState] = useState('ready'); // ready, playing, ended

  // 게임 시작 함수
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
  };

  // 타이머 로직
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameState('ended');
      setActiveIdx(null);
    }
  }, [gameState, timeLeft]);

  // 두더지 출현 로직
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveMole = () => {
      const randomIdx = Math.floor(Math.random() * 9);
      const specialChance = Math.random() > 0.7; // 30% 확률로 함정 이미지
      setActiveIdx(randomIdx);
      setIsSpecial(specialChance);
    };

    const moleTimer = setInterval(moveMole, 800); // 0.8초마다 위치 변경
    return () => clearInterval(moleTimer);
  }, [gameState]);

  // 클릭 이벤트 핸들러
  const handleWhack = (index) => {
    if (gameState !== 'playing' || index !== activeIdx) return;

    if (isSpecial) {
      setScore(prev => prev - 5); // 함정 클릭 시 감점
    } else {
      setScore(prev => prev + 10); // 일반 클릭 시 득점
    }
    setActiveIdx(null); // 클릭 후 즉시 사라짐
  };

  return (
    <div  style={{ textAlign: 'center', padding: '20px' }}>
      <h2>두더지 잡기 게임</h2>
      <h3>Score: {score} | Time: {timeLeft}s</h3>

      {gameState === 'ready' && <button onClick={startGame}>게임 시작</button>}
      {gameState === 'ended' && (
        <div>
          <p>게임 종료! 최종 점수: {score}</p>
          <button onClick={startGame}>다시 시작</button>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gap: '10px',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            onClick={() => handleWhack(i)}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '40px',
              borderRadius: '10px'
            }}
          >
            {activeIdx === i && (
              <span>{isSpecial ? '💣' : '🐹'}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhackAMole;