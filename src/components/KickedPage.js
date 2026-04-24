import React from 'react';
import CSS from '../styles';

export default function KickedPage() {
  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page">
        <div className="card kicked-card">
          <div className="kicked-emoji">🚫</div>
          <div className="kicked-title">أنت مطرود</div>
          <div className="kicked-sub">الأدمن أخرجك من الجلسة</div>
          <button className="btn btn-primary" onClick={handleGoBack}>
            خروج
          </button>
        </div>
      </div>
    </>
  );
}