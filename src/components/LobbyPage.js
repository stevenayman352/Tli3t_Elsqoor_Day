import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue } from '../firebase';

const LEVELS = [
  { clicks: 5,  img: '/waseem.jpeg',  name: 'وسيم' },
  { clicks: 10, img: '/k%20samir.jpeg', name: 'كامل سمير' },
  { clicks: 15, img: '/hosam.jpeg',  name: 'حسام' },
  { clicks: 20, img: '/fady.jpeg',  name: 'فادي' },
  { clicks: 25, img: '/k%20emad.jpeg', name: 'عماد' },
  { clicks: 30, img: '/gwala.jpeg',  name: 'الغلوة', win: true },
];

export default function LobbyPage({ user, sessionState }) {
  const [clicks, setClicks] = useState(0);
  const [showImg, setShowImg] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [showBtnAnim, setShowBtnAnim] = useState(false);
  const isSelected = sessionState?.selectedUsers?.[user.sessionId];

  useEffect(() => {
    const unsub = onValue(ref(database, `users/${user.sessionId}`), snap => {
      if (snap.exists()) setClicks(snap.val().clicks || 0);
    });
    return unsub;
  }, [user.sessionId]);

  useEffect(() => {
    const level = LEVELS.find(l => clicks >= l.clicks);
    if (level) {
      setShowImg(level);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 2000);
    }
  }, [clicks]);

  const handleClick = async () => {
    setShowBtnAnim(true);
    setTimeout(() => setShowBtnAnim(false), 300);
    const newClicks = clicks + 1;
    setClicks(newClicks);
    await set(ref(database, `users/${user.sessionId}/clicks`), newClicks);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="rcount">{clicks} ضغطه</div>

        <div className="click-btn" onClick={handleClick}>
          <img src="/gwalalogo.jpeg" alt="اضغط" className={`click-img ${showBtnAnim ? 'pulse' : ''}`} />
        </div>

        {showImg && (
          <div className={`level-img ${animate ? 'drop' : ''} ${showImg.win ? 'win' : ''}`}>
            <img src={showImg.img} alt={showImg.name} />
            {showImg.win && <div className="confetti">🎉🏆🎊</div>}
          </div>
        )}
      </div>
    </div>
  );
}