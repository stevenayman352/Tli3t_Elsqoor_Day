import React, { useState, useEffect } from 'react';
import { database, ref, set, onValue } from '../firebase';
import CSS from '../styles';

export default function GamesLobby({ onStartGame, onGameSelected }) {
  const [users, setUsers] = useState({});
  const [gameType, setGameType] = useState(null);
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);
  const [soloPlayer1, setSoloPlayer1] = useState(null);
  const [soloPlayer2, setSoloPlayer2] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  // Listen for active game and auto-redirect
  useEffect(() => {
    const unsub = onValue(ref(database, 'game'), snap => {
      const game = snap.val();
      if (game && game.status === 'active') {
        if (onGameSelected) onGameSelected(game);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onValue(ref(database, 'users'), snap => {
      setUsers(snap.val() || {});
    });
    return unsub;
  }, []);

  const teams = {};
  Object.values(users).forEach(u => {
    if (!teams[u.taliaKey]) teams[u.taliaKey] = [];
    teams[u.taliaKey].push(u);
  });

  const teamList = Object.entries(teams);
  const soloPlayers = Object.values(users).filter(u => u.status === 'lobby');

  const handleStartTeamGame = async () => {
    if (!selectedTeam1 || !selectedTeam2 || !selectedGame) return;
    await set(ref(database, 'game'), {
      type: 'team',
      game: selectedGame,
      team1: selectedTeam1,
      team2: selectedTeam2,
      status: 'active',
      scores: { [selectedTeam1]: 0, [selectedTeam2]: 0 },
      startTime: Date.now(),
    });
    if (onStartGame) onStartGame({ type: 'team', game: selectedGame, team1: selectedTeam1, team2: selectedTeam2 });
  };

  const handleStartSoloGame = async () => {
    if (!soloPlayer1 || !soloPlayer2 || !selectedGame) return;
    if (soloPlayer1.taliaKey === soloPlayer2.taliaKey) return;
    await set(ref(database, 'game'), {
      type: 'solo',
      game: selectedGame,
      player1: soloPlayer1.id,
      player2: soloPlayer2.id,
      team1: soloPlayer1.taliaKey,
      team2: soloPlayer2.taliaKey,
      status: 'active',
      scores: { [soloPlayer1.taliaKey]: 0, [soloPlayer2.taliaKey]: 0 },
      startTime: Date.now(),
    });
    if (onStartGame) onStartGame({ type: 'solo', game: selectedGame, player1: soloPlayer1.id, player2: soloPlayer2.id });
  };

  const handleEndGame = async () => {
    await set(ref(database, 'game'), null);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page page-top">
        <div className="card card-wide">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="label" style={{ margin: 0 }}>🎮 lobby الألعاب</div>
              <div className="mt8">
                <button className="btn btn-red" onClick={handleEndGame}>🛑 إنهاء اللعبة</button>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab ${gameType === 'team' ? 'on' : ''}`} onClick={() => setGameType('team')}>
              ضد فريق
            </button>
            <button className={`tab ${gameType === 'solo' ? 'on' : ''}`} onClick={() => setGameType('solo')}>
              ضد فردي
            </button>
          </div>

          {!gameType ? (
            <div className="tc" style={{ color: 'var(--muted)', padding: '40px' }}>
              اختر نوع اللعبة
            </div>
          ) : gameType === 'team' ? (
            <>
              <div className="label">اختر اللعبة</div>
              <div className="tabs" style={{ marginBottom: 20 }}>
                {['redlight', 'tug', 'glass'].map(g => (
                  <button key={g} className={`tab ${selectedGame === g ? 'on' : ''}`} onClick={() => setSelectedGame(g)}>
                    {g === 'redlight' ? '🔴أحمر أخضر' : g === 'tug' ? '🔗 شد الحبل' : '🥃 الجسر'}
                  </button>
                ))}
              </div>

              <div className="label">اختر الفريق الأول</div>
              <div className="ugrid" style={{ marginBottom: 20 }}>
                {teamList.map(([key, members]) => (
                  <div key={key} className={`ucard ${selectedTeam1 === key ? 'sel' : ''}`} onClick={() => setSelectedTeam1(key)}>
                    <div className="uname">{members[0]?.taliaName || key}</div>
                    <div className="utalia">{members.length} عضو</div>
                  </div>
                ))}
              </div>

              <div className="label">اختر الفريق الثاني</div>
              <div className="ugrid" style={{ marginBottom: 20 }}>
                {teamList.filter(([key]) => key !== selectedTeam1).map(([key, members]) => (
                  <div key={key} className={`ucard ${selectedTeam2 === key ? 'sel' : ''}`} onClick={() => setSelectedTeam2(key)}>
                    <div className="uname">{members[0]?.taliaName || key}</div>
                    <div className="utalia">{members.length} عضو</div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-full" onClick={handleStartTeamGame} disabled={!selectedTeam1 || !selectedTeam2 || !selectedGame}>
                🚀 ابدأ اللعبة
              </button>
            </>
          ) : (
            <>
              <div className="label">اختر اللعبة</div>
              <div className="tabs" style={{ marginBottom: 20 }}>
                {['dalgona', 'marbles'].map(g => (
                  <button key={g} className={`tab ${selectedGame === g ? 'on' : ''}`} onClick={() => setSelectedGame(g)}>
                    {g === 'dalgona' ? '🍪 دalgona' : '🎱 ك marbles'}
                  </button>
                ))}
              </div>

              <div className="label">اللاعب الأول</div>
              <div className="ugrid" style={{ marginBottom: 20 }}>
                {soloPlayers.map(p => (
                  <div key={p.id} className={`ucard ${soloPlayer1?.id === p.id ? 'sel' : ''}`} onClick={() => setSoloPlayer1(p)}>
                    <div className="uname">{p.name}</div>
                    <div className="utalia">{p.taliaName}</div>
                  </div>
                ))}
              </div>

              <div className="label">اللاعب الثاني</div>
              <div className="ugrid" style={{ marginBottom: 20 }}>
                {soloPlayers.filter(p => p.id !== soloPlayer1?.id).map(p => (
                  <div key={p.id} className={`ucard ${soloPlayer2?.id === p.id ? 'sel' : ''}`} onClick={() => setSoloPlayer2(p)}>
                    <div className="uname">{p.name}</div>
                    <div className="utalia">{p.taliaName}</div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary btn-full" onClick={handleStartSoloGame} disabled={!soloPlayer1 || !soloPlayer2 || !selectedGame}>
                🚀 ابدأ اللعبة
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}