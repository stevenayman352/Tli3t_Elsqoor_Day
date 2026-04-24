import React, { useState } from 'react';
import { CODES } from '../constants';
import { genId } from '../helpers';

export default function LoginPage({ onParticipantLogin, onAdminLogin }) {
  const [step, setStep]   = useState(1);       // 1=code, 2=name
  const [code, setCode]   = useState('');
  const [name, setName]   = useState('');
  const [talia, setTalia] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── STEP 1: validate code ──
  const handleCode = () => {
    setError('');
    const trimmed = code.trim();
    const match = CODES[trimmed];
    if (!match) {
      setError('❌ الكود غلط — تأكد من الكود وحاول تاني');
      return;
    }
    if (match.isAdmin) {
      onAdminLogin();
      return;
    }
    setTalia({ ...match, code: trimmed });
    setStep(2);
  };

  // ── STEP 2: validate name ──
  const handleName = async () => {
    setError('');
    const trimmed = name.trim();
    if (trimmed.split(/\s+/).length < 3) {
      setError('لازم تكتب اسمك الثلاثي كامل — ٣ كلمات على الأقل');
      return;
    }
    setLoading(true);
    onParticipantLogin({ name: trimmed, talia, sessionId: genId() });
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="card">

        {/* Step dots */}
        <div className="steps">
          <div className={`step ${step > 1 ? 'step-done' : 'step-active'}`} />
          <div className={`step ${step === 2 ? 'step-active' : 'step-idle'}`} />
        </div>

        {/* ── Step 1: Code ── */}
        {step === 1 && (
          <>
            <div className="label">⚡ الخطوة الأولى</div>
            <div className="ar-big">كود الطليعة</div>
            <div className="ar-sub">ادخل الكود اللي اتبعتلك عشان تعرف طليعتك</div>

            <div className="field">
              <input
                className="inp inp-ltr"
                placeholder="X X - 0 0 0 0"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCode()}
                autoFocus
              />
            </div>

            {error && <div className="err">{error}</div>}

            <div className="mt16">
              <button className="btn btn-primary btn-full" onClick={handleCode}>
                تأكيد الكود ←
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Name ── */}
        {step === 2 && talia && (
          <>
            {/* Talia reveal */}
            <div
              className="talia-banner"
              style={{
                background: `linear-gradient(135deg, ${talia.color}22, ${talia.color}44)`,
                borderColor: talia.accent,
                boxShadow: `0 0 36px ${talia.glow}`,
              }}
            >
              <span className="talia-icon">{talia.icon}</span>
              <div className="talia-name" style={{ color: talia.accent }}>
                {talia.taliaName}
              </div>
            </div>

            <div className="label">✍️ الخطوة التانية</div>
            <div className="ar-big">اسمك الثلاثي</div>
            <div className="ar-sub">اكتب اسمك الأول والتاني والتالت كامل</div>

            <div className="field">
              <input
                className="inp inp-rtl"
                placeholder="الاسم الأول الثاني الثالث"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleName()}
                autoFocus
              />
            </div>

            {error && <div className="err">{error}</div>}

            <div className="mt16 row">
              <button
                className="btn btn-ghost"
                onClick={() => { setStep(1); setName(''); setTalia(null); setError(''); }}
              >
                ← رجوع
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleName}
                disabled={loading}
              >
                {loading ? 'جاري الدخول...' : 'دخول اللوبي ⚡'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
