import React, { useState } from 'react';
import { database, ref, update } from '../firebase';
import CSS from '../styles';

export default function Marbles({ gameData, user, onGameEnd }) {
  const [player1Balls, setPlayer1Balls] = useState(10);
  const [player2Balls, setPlayer2Balls] = useState(10);
  const [pick, setPick] = useState(1);
  const [p1Choice, setP1Choice] = useState(null);
  const [p2Choice, setP2Choice] = useState(null);
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState(null);
  const [round, setRound] = useState(1);
  
  const isPlayer1 = user?.id === gameData.player1;
  const isPlayer2 = user?.id === gameData.player2;
  const isMyTurn = (isPlayer1 && p1Choice === null) || (isPlayer2 && p2Choice === null);

  const handlePick = async (num) => {
    if (p1Choice !== null || winner) return;
    setPick(num);
  };

  const handleCommit = async () => {
    if (p1Choice !== null || !isPlayer1 || winner) return;
    setP1Choice(pick);
  };

  useState(() => {
    if (p1Choice && !p2Choice && gameData.player2) {
      setP2Choice(Math.floor(Math.random() * 5) + 1);
    }
  }, [p1Choice]);

  useState(() => {
    if (p1Choice && p2Choice) {
      const total = p1Choice + p2Choice;
      const isOdd = total % 2 !== 0;
      let winnerId;
      
      if (isOdd) {
        if (isOdd ? player1Balls > 0 : player2Balls > 0) {
          setPlayer1Balls(b => b + 2);
          setPlayer2Balls(b => b - 2);
        }
      } else {
        if (player1Balls > 0 && player2Balls > 0) {
          setPlayer2Balls(b => b + 2);
          setPlayer1Balls(b => b - 2);
        }
      }
      
      setMessage(`المرحلة ${round}: اللاعب 1 اختار ${p1Choice}, اللاعب 2 اختار ${p2Choice}`);
      setTimeout(() => {
        setP1Choice(null);
        setP2Choice(null);
        setRound(r => r + 1);
      }, 2000);
      
      if (player1Balls <= 0) {
        setWinner(gameData.player2);
        setMessage('اللاعب 2 يفوز!');
        update(ref(database, `scores/${gameData.team2}`), { teamPoints: 60, soloPoints: 20 }, { merge: true });
        setTimeout(() => onGameEnd(gameData.player2), 3000);
      } else if (player2Balls <= 0) {
        setWinner(gameData.player1);
        setMessage('اللاعب 1 يفوز!');
        update(ref(database, `scores/${gameData.team1}`), { teamPoints: 60, soloPoints: 20 }, { merge: true });
        setTimeout(() => onGameEnd(gameData.player1), 3000);
      }
    }
  }, [p1Choice, p2Choice]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card">
          <div className="marbles-title">🎱 الك marbles</div>
          <div className="marbles-sub">اختر رقم من 1-5</div>
          
          <div className="scores-row">
            <div className="player-score">
              <div>{gameData.team1}</div>
              <div className="ball-count">{player1Balls} ⚫</div>
            </div>
            <div className="vs-text">VS</div>
            <div className="player-score">
              <div>{gameData.team2}</div>
              <div className="ball-count">{player2Balls} ⚫</div>
            </div>
          </div>

          <div className="pick-number">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`num-btn ${pick === n ? 'selected' : ''}`} onClick={() => handlePick(n)}>
                {n}
              </button>
            ))}
          </div>

          {isPlayer1 && p1Choice === null && (
            <button className="btn btn-primary" onClick={handleCommit}>تأكيد</button>
          )}

          {message && <div className="message">{message}</div>}
          
          {winner && (
            <div className="winner-announce">
              🎉 يفوز: {winner === gameData.player1 ? gameData.team1 : gameData.team2} 🎉
            </div>
          )}
        </div>
      </div>
    </>
  );
}