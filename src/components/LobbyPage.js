import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue } from '../firebase';

const LEVELS = [
  { clicks: 5,  img: '/waseem.jpeg' },
  { clicks: 10, img: '/k%20samir.jpeg' },
  { clicks: 15, img: '/hosam.jpeg' },
  { clicks: 20, img: '/fady.jpeg' },
  { clicks: 25, img: '/k%20emad.jpeg' },
  { clicks: 30, img: '/gwala.jpeg', win: true },
];

const CORNERS = [
  { top: '80px', left: '20px' },
  { top: '80px', right: '20px' },
  { top: 'auto', left: '20px', bottom: '80px' },
  { top: 'auto', right: '20px', bottom: '80px' },
];

export default function LobbyPage({ user, sessionState, onGoToGames }) {
  const [clicks, setClicks] = useState(0);
  const [showImg, setShowImg] = useState(null);
  const [shownLevels, setShownLevels] = useState([]);
  const [logoPos, setLogoPos] = useState(0);
  const [won, setWon] = useState(false);
  const isSelected = sessionState?.selectedUsers?.[user.sessionId];

  useEffect(() => {
    const unsub = onValue(ref(database, `users/${user.sessionId}`), snap => {
      if (snap.exists()) setClicks(snap.val().clicks || 0);
    });
    return unsub;
  }, [user.sessionId]);

  useEffect(() => {
    const level = LEVELS.find(l => clicks >= l.clicks && !shownLevels.includes(l.clicks));
    if (level) {
      setShowImg(level);
      setShownLevels([...shownLevels, level.clicks]);
      if (level.win) setWon(true);
      let newPos;
      do { newPos = Math.floor(Math.random() * CORNERS.length); } while (newPos === logoPos);
      setLogoPos(newPos);
      setTimeout(() => setShowImg(null), 2500);
    }
  }, [clicks]);

  const handleClick = async () => {
    if (won) return;
    const newClicks = clicks + 1;
    setClicks(newClicks);
    await set(ref(database, `users/${user.sessionId}/clicks`), newClicks);
  };

  return (
    <>
      {!won && (
        <div className="corner-logo" style={CORNERS[logoPos]}>
          <img src="/gwalalogo.jpeg" alt="" onClick={handleClick} />
        </div>
      )}

      <div className="page">
        <div className="card lobby-card">
          <button className="btn btn-primary btn-full" style={{ marginBottom: 20 }} onClick={onGoToGames}>
            🎮 شارك في الألعاب
          </button>
          
          <div className="lobby-content">
            {won ? (
              <>
                <div className="win-screen">
                  <div className="win-img"><img src="/gwala.jpeg" alt="مباروك" /></div>
                  <div className="win-text">🎉 مبروك طبلت لجوالة كويس 🎉</div>
                  <div className="win-sub">30 ضغطة مكتملة ✅</div>
                </div>
              </>
            ) : isSelected ? (
              <>
                <span className="lobby-icon">✍️</span>
                <div className="lobby-msg" style={{ color: 'var(--pink)' }}>جاري التحويل...</div>
              </>
            ) : (
              <>
                <span className="lobby-icon">⏳</span>
                <div className="lobby-msg" style={{ color: user.talia.accent }}>لسه دورك مجاش</div>
                <div className="lobby-sub">اضغط على الشعار في أي زاوية</div>
              </>
            )}
          </div>
        </div>
      </div>

      {showImg && (
        <div className="level-popup">
          <img src={showImg.img} alt="" />
          {showImg.win && <div className="confetti">🎉🏆🎊🎉🏆🎊</div>}
        </div>
      )}
    </>
  );
}