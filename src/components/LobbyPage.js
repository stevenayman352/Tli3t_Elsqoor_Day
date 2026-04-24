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

export default function LobbyPage({ user, sessionState }) {
  const [clicks, setClicks] = useState(0);
  const [showImg, setShowImg] = useState(null);
  const [shownLevels, setShownLevels] = useState([]);
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
      setTimeout(() => setShowImg(null), 2000);
    }
  }, [clicks]);

  const handleClick = async () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    await set(ref(database, `users/${user.sessionId}/clicks`), newClicks);
  };

  return (
    <div className="page">
      <div className="card lobby-card">
        <div className="corner-logo tl"><img src="/gwalalogo.jpeg" alt="" /></div>
        <div className="corner-logo tr"><img src="/gwalalogo.jpeg" alt="" /></div>
        <div className="corner-logo bl"><img src="/gwalalogo.jpeg" alt="" /></div>
        <div className="corner-logo br"><img src="/gwalalogo.jpeg" alt="" /></div>

        <div className="lobby-content">
          {isSelected ? (
            <>
              <span className="lobby-icon">✍️</span>
              <div className="lobby-msg" style={{ color: 'var(--pink)' }}>جاري التحويل...</div>
            </>
          ) : (
            <>
              <span className="lobby-icon">⏳</span>
              <div className="lobby-msg" style={{ color: user.talia.accent }}>لسه دورك مجاش</div>
              <div className="lobby-sub">استنى الأدمن يختارك</div>
            </>
          )}
        </div>

        <div className="click-zone" onClick={handleClick} />

        {showImg && (
          <div className="level-popup">
            <img src={showImg.img} alt="" />
            {showImg.win && <div className="confetti">🎉🏆🎊</div>}
          </div>
        )}
      </div>
    </div>
  );
}