import React, { useState, useEffect } from 'react';
import { database, ref, set, update, onValue } from '../firebase';
import CSS from '../styles';

export default function RedLightGreenLight({ gameData, onGameEnd }) {
  const [gameState, setGameState] = useState('waiting');
  const [team1Pull, setTeam1Pull] = useState(0);
  const [team2Pull, setTeam2Pull] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastChange, setLastChange] = useState(Date.now());

  useEffect(() => {
    let isRed = false;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastChange > 3000) {
        isRed = !isRed;
        setGameState(isRed ? 'red' : 'green');
        setLastChange(now);
        
        if (isRed) {
          const newTeam1Pull = Math.floor(Math.random() * 10);
          const newTeam2Pull = Math.floor(Math.random() * 10);
          setTeam1Pull(t => t + newTeam1Pull);
          setTeam2Pull(t => t + newTeam2Pull);
          
          if (newTeam1Pull > newTeam2Pull) setTeam1Pull(t => t + 1);
          if (newTeam2Pull > newTeam1Pull) setTeam2Pull(t => t + 1);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lastChange]);

  useEffect(() => {
    if (Math.abs(team1Pull - team2Pull) >= 50) {
      setWinner(team1Pull > team2Pull ? gameData.team1 : gameData.team2);
      setGameState('ended');
      
      setTimeout(async () => {
        const points = 40;
        await update(ref(database, `scores/${winner}`), { teamPoints: points }, { merge: true });
        if (onGameEnd) onGameEnd(winner);
      }, 3000);
    }
  }, [team1Pull, team2Pull]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card">
          <div className={`light-display ${gameState}`}>
            {gameState === 'waiting' ? '⏳ جاري التحضير...' : gameState === 'green' ? '🟢 أخضر - اضغط!' : '🔴 أحمر - توقف!'}
          </div>

          <div className="vs-display">
            <div className="team-side">
              <div className="team-name">{gameData.team1}</div>
              <div className="pull-bar">
                <div className="pull-fill" style={{ width: `${Math.min(team1Pull * 2, 100)}%` }} />
              </div>
              <div className="pull-count">{team1Pull}</div>
            </div>
            <div className="vs-text">VS</div>
            <div className="team-side">
              <div className="team-name">{gameData.team2}</div>
              <div className="pull-bar">
                <div className="pull-fill" style={{ width: `${Math.min(team2Pull * 2, 100)}%` }} />
              </div>
              <div className="pull-count">{team2Pull}</div>
            </div>
          </div>

          {winner && (
            <div className="winner-announce">
              🎉 يفوز: {winner} 🎉
            </div>
          )}
        </div>
      </div>
    </>
  );
}