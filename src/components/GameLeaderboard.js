import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from '../firebase';
import CSS from '../styles';

export default function GameLeaderboard({ onBack }) {
  const [scores, setScores] = useState({});
  const [users, setUsers] = useState({});
  const [tab, setTab] = useState('team');

  useEffect(() => {
    const unsubS = onValue(ref(database, 'scores'), snap => setScores(snap.val() || {}));
    const unsubU = onValue(ref(database, 'users'), snap => setUsers(snap.val() || {}));
    return () => { unsubS(); unsubU(); };
  }, []);

  const teamScores = Object.entries(scores)
    .filter(([, s]) => s.teamPoints)
    .sort((a, b) => (b[1].teamPoints || 0) - (a[1].teamPoints || 0));

  const individualScores = Object.entries(users)
    .filter(([, u]) => u.name)
    .map(([id, u]) => ({
      id,
      name: u.name,
      talia: u.taliaName,
      points: scores[u.taliaKey]?.soloPoints || 0
    }))
    .sort((a, b) => b.points - a.points);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page page-top">
        <div className="card card-wide">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="label" style={{ margin: 0 }}>📊 لوحة النقاط</div>
            </div>
            <button className="btn btn-ghost" onClick={onBack}>رجوع</button>
          </div>

          <div className="tabs">
            <button className={`tab ${tab === 'team' ? 'on' : ''}`} onClick={() => setTab('team')}>
              الفرق
            </button>
            <button className={`tab ${tab === 'individual' ? 'on' : ''}`} onClick={() => setTab('individual')}>
              الأفراد
            </button>
          </div>

          {tab === 'team' ? (
            teamScores.length === 0 ? (
              <div className="tc" style={{ color: 'var(--muted)', padding: '40px' }}>
                لسه مفيش نقاط 🌙
              </div>
            ) : (
              teamScores.map(([team, data], i) => (
                <div key={team} className="leader-item">
                  <div className="leader-rank">{i + 1}</div>
                  <div className="leader-name">{team}</div>
                  <div className="leader-points">{data.teamPoints || 0} نقطة</div>
                </div>
              ))
            )
          ) : (
            individualScores.length === 0 ? (
              <div className="tc" style={{ color: 'var(--muted)', padding: '40px' }}>
                لسه مفيش نقاط 🌙
              </div>
            ) : (
              individualScores.map((p, i) => (
                <div key={p.id} className="leader-item">
                  <div className="leader-rank">{i + 1}</div>
                  <div className="leader-name">{p.name}</div>
                  <div className="leader-talia">{p.talia}</div>
                  <div className="leader-points">{p.points} نقطة</div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </>
  );
}