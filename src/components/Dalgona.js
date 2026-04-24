import React, { useState } from 'react';
import { database, ref, update } from '../firebase';
import CSS from '../styles';

export default function Dalgona({ gameData, user, onGameEnd }) {
  const [lives, setLives] = useState(2);
  const [clickCount, setClickCount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');
  const [cracks, setCracks] = useState([]);
  
  const isPlayer1 = user?.id === gameData.player1;
  const maxClicks = 15 + Math.floor(Math.random() * 10);

  const handlePress = async () => {
    if (lives <= 0 || winner) return;
    
    const newClick = clickCount + 1;
    setClickCount(newClick);
    setCracks([...cracks, { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
    
    if (newClick >= maxClicks) {
      setLives(l => l - 1);
      setClickCount(0);
      setCracks([]);
      
      if (lives <= 1) {
        setWinner(isPlayer1 ? gameData.player2 : gameData.player1);
        setMessage('❌ كسرت الدalgona!');
        await update(ref(database, `scores/${gameData.team2}`), { teamPoints: 60, soloPoints: 20 }, { merge: true });
        await update(ref(database, `scores/${gameData.team1}/soloPoints`), 0, { merge: true });
        setTimeout(() => onGameEnd(gameData.player2), 3000);
      }
    } else {
      setMessage('✅ خطر! اضغط بلطف');
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card">
          <div className="dalgona-title">🍪 دalgona</div>
          <div className="dalgona-sub">اضغط بلطف! 2 حيات</div>
          
          <div className="lives-display">
            {[...Array(lives)].map((_, i) => <span key={i} className="heart">❤️</span>)}
          </div>

          <div className="dalgona-shape" onClick={handlePress}>
            <div className="dalgona-circle">
              {cracks.map((c, i) => (
                <div key={i} className="crack" style={{ left: c.x + '%', top: c.y + '%' }} />
              ))}
              <div className="dalgona-star">★</div>
            </div>
          </div>

          <div className="click-counter">{clickCount} / {maxClicks}</div>
          <div className="dalgona-message">{message}</div>
          
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