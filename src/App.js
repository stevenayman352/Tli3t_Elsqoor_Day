import React, { useState, useEffect, useRef } from 'react';
import { database, ref, set, get, onValue, push, update, remove } from './firebase';
import { getSession, saveSession, clearSession, genId } from './helpers';
import CSS from './styles';
import Header          from './components/Header';
import Popup           from './components/Popup';
import LoginPage       from './components/LoginPage';
import LobbyPage       from './components/LobbyPage';
import WritingPage     from './components/WritingPage';
import AdminDashboard  from './components/AdminDashboard';
import SpectatorPage   from './components/SpectatorPage';
import KickedPage     from './components/KickedPage';

export default function App() {
  const [screen, setScreen]       = useState('login');
  const [user, setUser]          = useState(null);
  const [sessState, setSessState] = useState(null);
  const screenRef = useRef(screen);
  screenRef.current = screen;

  // Restore session on mount
  useEffect(() => {
    const saved = getSession();
    if (!saved) return;
    if (saved.isAdmin) { setScreen('admin'); return; }
    if (saved.isSpectator) { setScreen('spectator'); return; }
    if (saved.kicked) { setScreen('kicked'); return; }
    setUser(saved);
    setScreen('lobby');
  }, []);

  // Real-time session listener → redirect participant instantly
  useEffect(() => {
    if (!user) return;
    const unsub = onValue(ref(database, 'session'), snap => {
      const val = snap.val() || {};
      setSessState(val);
      if (val.status === 'writing' && val.selectedUsers?.[user.sessionId]) {
        setScreen('writing');
      } else if (
        (val.status === 'lobby' || val.status === 'ended') &&
        screenRef.current === 'writing'
      ) {
        setScreen('lobby');
      }
    });
    return unsub;
  }, [user]);

  // Listen for user deletion (kick)
  useEffect(() => {
    if (!user) return;
    const unsub = onValue(ref(database, `users/${user.sessionId}`), snap => {
      if (!snap.exists()) {
        clearSession();
        setUser(null);
        setScreen('kicked');
      }
    });
    return unsub;
  }, [user]);

  // ── Complete login after validation ──
  const completeLogin = async (userData) => {
    const userId = userData.sessionId;
    await set(ref(database, `users/${userId}`), {
      name:      userData.name,
      taliaName: userData.talia.taliaName,
      taliaKey:  userData.talia.taliaKey,
      sessionId: userData.sessionId,
      status:    'lobby',
      joinedAt:  Date.now(),
    });
    const fullUser = { ...userData, userId };
    setUser(fullUser);
    saveSession(fullUser);
    setScreen('lobby');
  };

  // ── Participant login ──
  const handleParticipantLogin = async (userData) => {
    const snapUsers = await get(ref(database, 'users'));
    const snapKicked = await get(ref(database, 'kicked'));
    
    const allUsers = { ...(snapUsers.val() || {}), ...(snapKicked.val() || {}) };
    const nameExists = Object.values(allUsers).some(u => u.name === userData.name);
    
    if (nameExists) {
      alert('هذا الاسم مستخدم من قبل - تواصل مع الأدمن');
      return;
    }
    
    await completeLogin(userData);
  };

  const handleAdminLogin = () => {
    saveSession({ isAdmin: true });
    setScreen('admin');
  };

  const handleSpectatorLogin = () => {
    saveSession({ isSpectator: true });
    setScreen('spectator');
  };

  const handleLogout = async () => {
    if (user) await remove(ref(database, `users/${user.userId}`));
    clearSession();
    setUser(null);
    setScreen('login');
  };

  const handleAdminLogout = () => {
    clearSession();
    setScreen('login');
  };

  const handleSpectatorLogout = () => {
    clearSession();
    setScreen('login');
  };

  // ── Submit writing response ──
  const handleSubmit = async (content) => {
    if (!user) return;
    await set(ref(database, `responses/${user.sessionId}`), {
      name:      user.name,
      taliaName: user.talia.taliaName,
      taliaKey:  user.talia.taliaKey,
      content,
      timestamp: Date.now(),
      sessionId: user.sessionId,
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Header />

      {screen === 'login'   && <LoginPage onParticipantLogin={handleParticipantLogin} onAdminLogin={handleAdminLogin} onSpectatorLogin={handleSpectatorLogin} />}
      {screen === 'lobby'   && user && <LobbyPage user={user} sessionState={sessState} />}
      {screen === 'writing' && user && <WritingPage user={user} sessionState={sessState} onSubmit={handleSubmit} />}
      {screen === 'admin'   && <AdminDashboard onLogout={handleAdminLogout} />}
      {screen === 'spectator' && <SpectatorPage onLogout={handleSpectatorLogout} />}
      {screen === 'kicked'  && <KickedPage />}
    </>
  );
}
