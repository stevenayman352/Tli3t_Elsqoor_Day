import React, { useState, useEffect } from 'react';
import { database, ref, update, onValue } from '../firebase';
import CSS from '../styles';

export default function TugOfWar({ gameData, user, onGameEnd }) {
  const [position, setPosition] = useState(50);
  const [winner, setWinner] = useState(null);
  const isTeam1Member = user?.taliaKey === gameData.team1;
  
  const handlePull = async () => {
    if (winner || position <= 10 || position >= 90) return;
    
    const newPos = isTeam1Member ? position - 2 : position + 2;
    setPosition(newPos);
    await set(ref(database, 'game/tugPosition'), newPos);
  };

  useEffect(() => {
    const unsub = onValue(ref(database, 'game/tugPosition'), snap => {
      if (snap.exists()) setPosition(snap.val());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (position <= 10) {
      setWinner(gameData.team1);
      setTimeout(async () => {
        await update(ref(database, `scores/${gameData.team1}`), { teamPoints: 40 }, { merge: true });
        if (onGameEnd) onGameEnd(gameData.team1);
      }, 3000);
    } else if (position >= 90) {
      setWinner(gameData.team2);
      setTimeout(async () => {
        await update(ref(database, `scores/${gameData.team2}`), { teamPoints: 40 }, { merge: true });
        if (onGameEnd) onGameEnd(gameData.team2);
      }, 3000);
    }
  }, [position]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card tug-card">
          <div className="tug-title">🔗 شد الحبل</div>
          <div className="tug-sub">اضغط بأسرع ما يمكن!</div>
          
          <div className="tug-display">
            <div className="tug-team">{gameData.team1}</div>
            <div className="tug-rope">
              <div className="tug-knot" style={{ left: `${position}%` }}>🔗</div>
              <div className="tug-line" />
            </div>
            <div className="tug-team">{gameData.team2}</div>
          </div>

          {!winner ? (
            <button className="btn btn-primary btn-full tug-btn" onClick={handlePull}>
              {isTeam1Member ? '← شد' : 'شد →'}
            </button>
          ) : (
            <div className="winner-announce">
              🎉 يفوز: {winner} 🎉
            </div>
          )}
        </div>
      </div>
    </>
  );
}