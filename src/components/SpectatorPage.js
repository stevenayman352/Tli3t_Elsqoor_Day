import React, { useState, useEffect } from 'react';
import { database, ref, onValue } from '../firebase';
import { TALIA_FILTERS } from '../constants';
import { fmtTime } from '../helpers';

export default function SpectatorPage({ onLogout }) {
  const [responses, setResponses] = useState({});
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unR = onValue(ref(database, 'responses'), s => setResponses(s.val() || {}));
    return unR;
  }, []);

  const filteredResponses = Object.entries(responses)
    .filter(([, r]) => filter === 'all' || r.taliaKey === filter)
    .sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));

  return (
    <div className="page page-top">
      <div className="card card-wide">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div className="label" style={{ margin: 0 }}>👁️ المشاهدين</div>
            <div className="mt8">
              <span className="tag tag-blue">مراقبة مباشرة</span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onLogout}>خروج</button>
        </div>

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}