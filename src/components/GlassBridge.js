import React, { useState, useEffect } from 'react';
import { database, ref, set, update, onValue } from '../firebase';
import CSS from '../styles';

export default function GlassBridge({ gameData, user, onGameEnd }) {
  const [glasses, setGlasses] = useState([0, 0, 0, 0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [team1Attempts, setTeam1Attempts] = useState(0);
  const [team2Attempts, setTeam2Attempts] = useState(0);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  
  const winningGlass = Math.floor(Math.random() * 5);
  const isTeam1Turn = currentPlayer === 1;
  const isTeamMember = user?.taliaKey === gameData.team1 || user?.taliaKey === gameData.team2;

  const handlePick = async (index) => {
    if (glasses[index] !== 0 || winner) return;
    
    const newGlasses = [...glasses];
    newGlasses[index] = currentPlayer;
    setGlasses(newGlasses);
    
    if (index === winningGlass) {
      if (currentPlayer === 1) {
        setTeam1Attempts(t => t + 1);
        setCurrentPlayer(2);
        setMessage('✅ صحيح! دور الفريق الثاني');
      } else {
        setTeam2Attempts(t => t + 1);
        const t1Wins = team1Attempts < team2Attempts || (team1Attempts === team2Attempts && isTeam1Turn);
        const winTeam = t1Wins ? gameData.team1 : gameData.team2;
        setWinner(winTeam);
        setMessage('✅ صحيح! ' + winTeam + ' يفوز!');
        await update(ref(database, `scores/${winTeam}`), { teamPoints: 40 }, { merge: true });
        setTimeout(() => onGameEnd(winTeam), 3000);
      }
    } else {
      if (currentPlayer === 1) {
        setTeam1Attempts(t => t + 1);
        setCurrentPlayer(2);
        setMessage('❌ كسر! دور الفريق الثاني');
      } else {
        setTeam2Attempts(t => t + 1);
        const t1Wins = team1Attempts < team2Attempts;
        const winTeam = t1Wins ? gameData.team1 : gameData.team2;
        setWinner(winTeam);
        setMessage('❌ كسر! ' + winTeam + ' يفوز!');
        await update(ref(database, `scores/${winTeam}`), { teamPoints: 40 }, { merge: true });
        setTimeout(() => onGameEnd(winTeam), 3000);
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card">
          <div className="glass-title">🥃 جسر الزجاج</div>
          <div className="glass-sub">
            {isTeam1Turn ? `دور ${gameData.team1}` : `دور ${gameData.team2}`}
          </div>
          
          <div className="glass-bridge">
            {glasses.map((g, i) => (
              <div key={i} className={`glass ${g === 0 ? 'available' : g === 1 ? 'team1' : 'team2'}`} onClick={() => handlePick(i)}>
                {g === 0 ? i + 1 : g === 1 ? '✓' : '✓'}
              </div>
            ))}
          </div>

          <div className="glass-scores">
            <div>{gameData.team1}: {team1Attempts}</div>
            <div>{gameData.team2}: {team2Attempts}</div>
          </div>

          {message && <div className="glass-message">{message}</div>}
          
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