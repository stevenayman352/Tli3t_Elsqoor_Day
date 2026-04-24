import React, { useState, useEffect, useCallback } from 'react';
import { database, ref, set, onValue } from '../firebase';

export default function WritingPage({ user, sessionState, onSubmit }) {
  const [text, setText] = useState('');
  const [locked, setLocked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(database, `responses/${user.sessionId}`), snap => {
      const savedText = snap.val()?.content;
      if (savedText && savedText !== text) {
        setText(savedText);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
    return unsub;
  }, [user.sessionId]);

  useEffect(() => {
    if (sessionState?.status === 'ended' || sessionState?.status === 'lobby') {
      setLocked(true);
      if (text.trim()) {
        onSubmit(text);
      }
    }
  }, [sessionState]);

  useEffect(() => {
    if (text.trim() && !locked) {
      const timer = setTimeout(() => {
        onSubmit(text);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [text, locked]);

  const blockPaste = useCallback(e => e.preventDefault(), []);
  const blockMenu = useCallback(e => e.preventDefault(), []);
  const onKeyDown = e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') e.preventDefault();
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 640 }}>

        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="label" style={{ margin: 0 }}>✍️ جلسة الكتابة</div>
          <div className="tag tag-pink">🔴 مباشر</div>
        </div>

        <div className="pulse-bar"><div className="pulse-fill" /></div>

        <div
          className="talia-banner"
          style={{
            background: `${user.talia.color}22`,
            borderColor: `${user.talia.accent}55`,
            padding: '12px 18px',
            marginBottom: 18,
            textAlign: 'right',
          }}
        >
          <div style={{ fontFamily: "'Cairo',sans-serif", fontWeight: 800, fontSize: 16, color: user.talia.accent, direction: 'rtl' }}>
            {user.talia.icon} {user.name}
          </div>
          <div style={{ fontFamily: "'Cairo',sans-serif", fontSize: 12, color: 'var(--muted)', direction: 'rtl' }}>
            {user.talia.taliaName}
          </div>
        </div>

        <div className="ar-sub" style={{ marginBottom: 12 }}>
          اكتب تلخيصك للمحاضرة — ممنوع اللصق! ✋
        </div>

        <textarea
          className="warea"
          placeholder="ابدأ الكتابة هنا... 📝"
          value={text}
          onChange={e => !locked && setText(e.target.value)}
          onPaste={blockPaste}
          onContextMenu={blockMenu}
          onKeyDown={onKeyDown}
          disabled={locked}
          rows={10}
        />

        <div className="mt16" style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
          {text.length} حرف {saved && '• تم الحفظ'}
        </div>

        {locked && text.trim() && (
          <div className="mt16 tc" style={{ fontFamily: "'Cairo',sans-serif", color: 'var(--green)', fontSize: 15 }}>
            ✅ تم حفظ إجابتك
          </div>
        )}

      </div>
    </div>
  );
}