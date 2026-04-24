import React from 'react';

export default function LobbyPage({ user, sessionState }) {
  const isSelected = sessionState?.selectedUsers?.[user.sessionId];
  const inLobby = sessionState?.status === 'lobby';

  return (
    <div className="page">
      <div className="card">
        <div className="row" style={{ justifyContent: 'center', marginBottom: 22 }}>
          <div
            className="tag"
            style={{
              background: `${user.talia.color}33`,
              color: user.talia.accent,
              border: `1px solid ${user.talia.accent}55`,
            }}
          >
            {user.talia.icon} {user.talia.taliaName}
          </div>
        </div>

        <div className="lobby-center">
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
      </div>
    </div>
  );
}