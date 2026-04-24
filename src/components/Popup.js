import React from 'react';

export default function Popup({ emoji, msg, sub, buttons }) {
  return (
    <div className="overlay">
      <div className="popup">
        <div className="p-emoji">{emoji}</div>
        <div className="p-msg">{msg}</div>
        {sub && <div className="p-sub">{sub}</div>}
        <div className="p-btns">{buttons}</div>
      </div>
    </div>
  );
}
