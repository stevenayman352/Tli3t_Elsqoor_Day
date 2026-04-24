import React, { useState, useEffect } from 'react';
import { database, ref, set, get, onValue, push, update, remove } from '../firebase';
import { TALIA_FILTERS } from '../constants';
import { fmtTime } from '../helpers';

export default function AdminDashboard({ onLogout }) {
  const [users, setUsers]           = useState({});
  const [responses, setResponses]   = useState({});
  const [selected, setSelected]     = useState(new Set());
  const [sessStatus, setSessStatus] = useState('lobby');
  const [tab, setTab]               = useState('users');
  const [filter, setFilter]         = useState('all');

  useEffect(() => {
    const unU = onValue(ref(database, 'users'),     s => setUsers(s.val() || {}));
    const unS = onValue(ref(database, 'session'),   s => setSessStatus((s.val() || {}).status || 'lobby'));
    const unR = onValue(ref(database, 'responses'), s => setResponses(s.val() || {}));
    return () => { unU(); unS(); unR(); };
  }, []);

  const allUsers    = Object.entries(users).map(([id, u]) => ({ id, ...u }));
  const writingList = allUsers.filter(u => u.status === 'writing');
  const lobbyList   = allUsers.filter(u => u.status !== 'writing');

  const toggleSelect = id => {
    if (sessStatus === 'writing') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startSession = async () => {
    if (selected.size < 1) return;
    const sel = {};
    selected.forEach(id => (sel[id] = true));
    await set(ref(database, 'session'), {
      status: 'writing',
      selectedUsers: sel,
      startedAt: Date.now(),
    });
    for (const id of selected)
      await update(ref(database, `users/${id}`), { status: 'writing' });
    setSelected(new Set());
  };

  const endSession = async () => {
    await update(ref(database, 'session'), { status: 'ended', endedAt: Date.now() });
    setTimeout(async () => {
      const snap = await get(ref(database, 'users'));
      const all  = snap.val() || {};
      for (const [id, u] of Object.entries(all))
        if (u.status === 'writing')
          await update(ref(database, `users/${id}`), { status: 'lobby' });
      await set(ref(database, 'session'), { status: 'lobby' });
    }, 3000);
  };

  const filteredResponses = Object.entries(responses)
    .filter(([, r]) => filter === 'all' || r.taliaKey === filter)
    .sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));

  const deleteResponse = async (sessionId) => {
    await remove(ref(database, `responses/${sessionId}`));
  };

  return (
    <div className="page page-top">
      <div className="card card-wide">

        {/* Header */}
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="label" style={{ margin: 0 }}>🛡️ لوحة الأدمن</div>
            <div className="mt8">
              <span className={`tag ${sessStatus === 'writing' ? 'tag-pink' : 'tag-blue'}`}>
                {sessStatus === 'writing' ? '🔴 جلسة كتابة نشطة' : '⚡ في الانتظار'}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onLogout}>خروج</button>
        </div>

        {/* Main tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'users' ? 'on' : ''}`} onClick={() => setTab('users')}>
            المشتركين ({allUsers.length})
          </button>
          <button className={`tab ${tab === 'responses' ? 'on' : ''}`} onClick={() => setTab('responses')}>
            الإجابات ({responses.length})
          </button>
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <>
            <div className="ctrl">
              {sessStatus !== 'writing' ? (
                <>
                  <button className="btn btn-green" onClick={startSession} disabled={selected.size < 1}>
                    🚀 ابدأ الجلسة
                  </button>
                  <button className="btn btn-ghost" onClick={() => setSelected(new Set())} disabled={selected.size === 0}>
                    مسح
                  </button>
                  <div className="sel-count">{selected.size} مختارين</div>
                </>
              ) : (
                <button className="btn btn-red" onClick={endSession}>🛑 إنهاء الجلسة</button>
              )}
            </div>

            {/* Writing users */}
            {sessStatus === 'writing' && writingList.length > 0 && (
              <>
                <div className="label">يكتبون الآن</div>
                <div className="ugrid" style={{ marginBottom: 16 }}>
                  {writingList.map(u => (
                    <div key={u.id} className="ucard writing-now">
                      <div className="uname">{u.name}</div>
                      <div className="utalia">{u.taliaName}</div>
                      <div className="ustatus s-w">✍️ يكتب</div>
                    </div>
                  ))}
                </div>
                <div className="div" />
              </>
            )}

            {/* Lobby / all users */}
            <div className="label">
              {sessStatus === 'writing' ? 'في الانتظار' : 'اختر المشتركين'}
            </div>

            {allUsers.length === 0 ? (
              <div className="tc" style={{ fontFamily: "'Cairo',sans-serif", color: 'var(--muted)', padding: '40px 0' }}>
                لسه مفيش مشتركين 🌙
              </div>
            ) : (
              <div className="ugrid">
                {(sessStatus === 'writing' ? lobbyList : allUsers).map(u => (
                  <div
                    key={u.id}
                    className={`ucard ${selected.has(u.id) ? 'sel' : ''}`}
                    onClick={() => toggleSelect(u.id)}
                  >
                    <div className="uname">{u.name}</div>
                    <div className="utalia">{u.taliaName}</div>
                    <div className={`ustatus ${u.status === 'writing' ? 's-w' : 's-l'}`}>
                      {u.status === 'writing' ? '✍️ يكتب' : '⏳ ينتظر'}
                    </div>
                    {u.clicks > 0 && <div className="uclicks">🖱️ {u.clicks} ضغطه</div>}
                    {selected.has(u.id) && (
                      <div className="mt8">
                        <span className="tag tag-green">✓ مختار</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── RESPONSES TAB ── */}
        {tab === 'responses' && (
          <>
            {/* Filter by talia */}
            <div className="tabs" style={{ marginBottom: 16 }}>
              {TALIA_FILTERS.map(f => (
                <button key={f.key} className={`tab ${filter === f.key ? 'on' : ''}`} onClick={() => setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>

            {filteredResponses.length === 0 ? (
              <div className="tc" style={{ fontFamily: "'Cairo',sans-serif", color: 'var(--muted)', padding: '40px 0' }}>
                لسه مفيش إجابات 📭
              </div>
            ) : (
              filteredResponses.map(([sessionId, r]) => (
                <div key={sessionId} className="ritem">
                  <div className="rmeta">
                    <div className="rauthor">{r.name}</div>
                    <div className="rtime">{fmtTime(r.timestamp)}</div>
                  </div>
                  <div className="rgroup">{r.taliaName}</div>
                  <div className="rcontent">{r.content}</div>
                  <button className="btn-del" onClick={() => deleteResponse(sessionId)}>🗑️ حذف</button>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}
