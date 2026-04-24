const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:   #00d4ff;
    --gold:   #fbbf24;
    --green:  #00ff88;
    --pink:   #ff2d78;
    --gold:   #fbbf24;
    --dark:   #0a1628;
    --card:   #0d1f38;
    --card2:  #112a4a;
    --border: rgba(0,212,255,0.25);
    --muted:  #6b8fad;
    --text:   #e8f4ff;
  }

  html, body { height: 100%; width: 100%; overflow-x: hidden; }
  body {
    background: var(--dark);
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    min-height: 100vh;
    background-image:
      radial-gradient(ellipse at 15% 15%, rgba(0,212,255,0.1) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 85%, rgba(251,191,36,0.08) 0%, transparent 55%),
      repeating-linear-gradient(0deg,  transparent, transparent 59px, rgba(0,212,255,0.03) 60px),
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(251,191,36,0.02) 60px);
  }

  /* ── HEADER ── */
  .hdr { display: flex; align-items: center; gap: 14px; justify-content: center; }
  .hdr-logo { height: 42px; width: 42px; border-radius: 10px; object-fit: cover; border: 2px solid var(--gold); }
  .hdr {
    position: sticky; top: 0; z-index: 999;
    background: rgba(4,4,14,0.94);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 11px 24px;
    text-align: center;
    box-shadow: 0 0 50px rgba(0,212,255,0.06);
  }
  .hdr-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(14px, 3vw, 24px);
    font-weight: 900;
    background: linear-gradient(100deg, var(--blue), var(--gold), var(--blue));
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
    letter-spacing: 4px;
    filter: drop-shadow(0 0 14px rgba(0,212,255,0.45));
  }
  @keyframes shimmer { to { background-position: 200% center; } }
  .hdr-sub {
    font-family: 'Cairo', sans-serif;
    font-size: 12px; color: var(--green);
    margin-top: 2px; letter-spacing: 1px;
  }

  /* ── LAYOUT ── */
  .page {
    min-height: calc(100vh - 66px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .page-top { align-items: flex-start; padding-top: 28px; }

  .corner-logo { position: fixed; width: 70px; height: 70px; z-index: 999; cursor: pointer; overflow: hidden; }
  .corner-logo img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid var(--gold); box-shadow: 0 4px 20px rgba(251,191,36,0.3); }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 36px;
    width: 100%; max-width: 460px;
    box-shadow: 0 0 60px rgba(0,212,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04);
    animation: rise 0.45s cubic-bezier(.22,1,.36,1);
  }
  .card-wide { max-width: 960px; }
  @keyframes rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }

  /* ── TALIA BANNER ── */
  .talia-banner {
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 24px;
    text-align: center;
    border: 1px solid;
    animation: rise 0.4s ease;
  }
  .talia-icon {
    font-size: 56px; margin-bottom: 8px;
    display: block;
    filter: drop-shadow(0 0 18px currentColor);
  }
  .talia-name {
    font-family: 'Cairo', sans-serif;
    font-size: 28px; font-weight: 900; direction: rtl;
  }

  /* ── STEPS ── */
  .steps { display: flex; gap: 8px; justify-content: center; margin-bottom: 28px; }
  .step { height: 4px; flex: 1; border-radius: 2px; max-width: 60px; transition: all .3s; }
  .step-done   { background: var(--green); }
  .step-active { background: var(--blue); box-shadow: 0 0 8px var(--blue); }
  .step-idle   { background: rgba(255,255,255,0.1); }

  /* ── TYPOGRAPHY ── */
  .label {
    font-family: 'Orbitron', monospace;
    font-size: 11px; letter-spacing: 3px;
    color: var(--blue); text-transform: uppercase;
    margin-bottom: 8px; display: block;
  }
  .ar-big {
    font-family: 'Cairo', sans-serif;
    font-size: clamp(18px,4vw,26px); font-weight: 800;
    direction: rtl; margin-bottom: 6px;
  }
  .ar-sub {
    font-family: 'Cairo', sans-serif; font-size: 14px;
    color: var(--muted); direction: rtl; margin-bottom: 20px;
  }

  /* ── INPUTS ── */
  .field { margin-bottom: 18px; }
  .field label {
    display: block; font-family: 'Cairo', sans-serif;
    font-size: 13px; color: var(--muted);
    margin-bottom: 6px; direction: rtl;
  }
  .inp {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,212,255,0.2);
    border-radius: 11px; padding: 13px 16px;
    color: var(--text); font-family: 'Cairo', sans-serif; font-size: 15px;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .inp:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(0,212,255,0.12); }
  .inp::placeholder { color: var(--muted); }
  .inp-rtl { direction: rtl; }
  .inp-ltr { direction: ltr; letter-spacing: 3px; font-family: 'Orbitron', monospace; font-size: 13px; text-align: center; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; border-radius: 11px;
    font-family: 'Orbitron', monospace; font-size: 11px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase; cursor: pointer; border: none;
    transition: all .2s; position: relative; overflow: hidden;
  }
  .btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(rgba(255,255,255,.08),transparent);
    opacity: 0; transition: opacity .2s;
  }
  .btn:hover::after { opacity: 1; }
  .btn:active { transform: scale(0.97); }
  .btn:disabled { opacity: .35; cursor: not-allowed; transform: none !important; }
  .btn-full { width: 100%; }

  .btn-primary { background: linear-gradient(135deg,var(--blue),var(--gold)); color:#000; font-weight:900; box-shadow:0 4px 24px rgba(0,212,255,0.28); }
  .btn-primary:hover:not(:disabled) { box-shadow:0 6px 36px rgba(0,212,255,0.48); transform:translateY(-1px); }

  .btn-green { background: linear-gradient(135deg,var(--green),#00c8a0); color:#000; font-weight:900; box-shadow:0 4px 20px rgba(0,255,136,0.28); }
  .btn-green:hover:not(:disabled) { box-shadow:0 6px 30px rgba(0,255,136,0.5); transform:translateY(-1px); }

  .btn-red { background: linear-gradient(135deg,var(--pink),#a0002a); color:#fff; font-weight:900; box-shadow:0 4px 20px rgba(255,45,120,0.28); }
  .btn-red:hover:not(:disabled) { box-shadow:0 6px 30px rgba(255,45,120,0.5); transform:translateY(-1px); }

  .btn-ghost { background: transparent; border: 1px solid rgba(0,212,255,0.2); color: var(--muted); font-size:10px; padding:8px 16px; }
  .btn-ghost:hover:not(:disabled) { border-color:var(--blue); color:var(--blue); }

  /* ── TABS ── */
  .tabs { display:flex; gap:4px; background:rgba(255,255,255,0.03); border-radius:11px; padding:4px; margin-bottom:22px; }
  .tab { flex:1; padding:10px; text-align:center; font-family:'Orbitron',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; border-radius:8px; border:none; background:transparent; color:var(--muted); transition:all .2s; }
  .tab.on { background:linear-gradient(135deg,var(--blue),var(--gold)); color:#000; font-weight:900; }

  /* ── ERROR ── */
  .err { font-family:'Cairo',sans-serif; font-size:13px; color:var(--pink); direction:rtl; margin-top:10px; text-align:center; }

  /* ── DIVIDER ── */
  .div { height:1px; background:rgba(0,212,255,0.1); margin:20px 0; }

  /* ── TAGS ── */
  .tag { display:inline-block; font-family:'Orbitron',monospace; font-size:9px; letter-spacing:2px; padding:3px 10px; border-radius:20px; text-transform:uppercase; }
  .tag-blue   { background:rgba(0,212,255,.14);  color:var(--blue);   border:1px solid rgba(0,212,255,.3); }
  .tag-green  { background:rgba(0,255,136,.14);  color:var(--green);  border:1px solid rgba(0,255,136,.3); }
  .tag-purple { background:rgba(191,95,255,.14); color:var(--gold); border:1px solid rgba(191,95,255,.3); }
  .tag-pink   { background:rgba(255,45,120,.14); color:var(--pink);   border:1px solid rgba(255,45,120,.3); }

  /* ── LOBBY ── */
  .lobby-center { text-align:center; padding:28px 0; }
  .lobby-icon { font-size:72px; margin-bottom:14px; display:block; animation:float 3s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .lobby-msg { font-family:'Cairo',sans-serif; font-size:26px; font-weight:900; direction:rtl; }
  .lobby-sub { font-family:'Cairo',sans-serif; font-size:14px; color:var(--muted); direction:rtl; margin-top:8px; }

.lobby-card { position: relative; overflow: hidden; }
  .lobby-content { position: relative; z-index: 1; }

  .corner-logo { position:absolute; width:70px; height:70px; z-index:0; cursor:pointer; }
  .corner-logo img { width:100%; height:100%; object-fit:cover; border-radius:10px; }

  .level-popup { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:1000; animation:popup 2.5s ease-out forwards; }
  .level-popup img { width:300px; height:300px; border-radius:20px; border:6px solid var(--gold); box-shadow:0 0 60px var(--gold); }
  .confetti { font-size:70px; text-align:center; margin-top:10px; animation:confetti 0.5s ease-out infinite; }

  .win-screen { text-align:center; padding:40px 0; }
  .win-img img { width:250px; height:250px; border-radius:20px; border:6px solid var(--gold); box-shadow:0 0 40px var(--gold); margin-bottom:20px; }
  .win-text { font-family:'Cairo',sans-serif; font-size:28px; font-weight:900; color:var(--gold); direction:rtl; margin-bottom:10px; }
  .win-sub { font-family:'Orbitron',monospace; font-size:14px; color:var(--muted); letter-spacing:2px; }

  @keyframes popup { 0%{opacity:0;transform:translate(-50%,-30%)} 20%{opacity:1;transform:translate(-50%,-50%)} 80%{opacity:1;transform:translate(-50%,-50%)} 100%{opacity:0;transform:translate(-50%,-50%)} }

  /* ── KICKED PAGE ── */
  .kicked-card { text-align:center; }
  .kicked-emoji { font-size:80px; margin-bottom:20px; }
  .kicked-title { font-family:'Cairo',sans-serif; font-size:32px; font-weight:900; color:var(--pink); direction:rtl; margin-bottom:10px; }
  .kicked-sub { font-family:'Cairo',sans-serif; font-size:16px; color:var(--muted); direction:rtl; margin-bottom:30px; }

  /* ── WRITING ── */
  .warea { width:100%; min-height:240px; background:rgba(255,255,255,0.03); border:1px solid rgba(0,212,255,0.25); border-radius:13px; padding:16px; color:var(--text); font-family:'Cairo',sans-serif; font-size:16px; line-height:1.8; resize:vertical; outline:none; direction:rtl; transition:border-color .2s, box-shadow .2s; }
  .warea:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(0,212,255,0.1); }
  .warea:disabled { opacity:.45; cursor:not-allowed; }
  .pulse-bar { height:3px; background:rgba(255,255,255,0.05); border-radius:3px; margin-bottom:14px; overflow:hidden; }
  .pulse-fill { height:100%; background:linear-gradient(90deg,var(--green),var(--blue)); animation:pb 2s ease-in-out infinite; }
  @keyframes pb { 0%,100%{opacity:1} 50%{opacity:.3} }

  /* ── ADMIN USER GRID ── */
  .ugrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:11px; max-height:360px; overflow-y:auto; padding-right:4px; margin-bottom:20px; }
  .ugrid::-webkit-scrollbar { width:3px; }
  .ugrid::-webkit-scrollbar-thumb { background:var(--blue); border-radius:2px; }

  .ucard { background:var(--card2); border:1px solid rgba(0,212,255,0.13); border-radius:11px; padding:14px; cursor:pointer; transition:all .2s; direction:rtl; user-select:none; }
  .ucard:hover { border-color:rgba(0,212,255,0.38); background:rgba(0,212,255,0.05); }
  .ucard.sel { border-color:var(--green); background:rgba(0,255,136,0.07); box-shadow:0 0 18px rgba(0,255,136,0.15); }
  .ucard.writing-now { border-color:var(--pink); background:rgba(255,45,120,0.07); animation:wpulse 1.6s ease-in-out infinite; }
  @keyframes wpulse { 0%,100%{box-shadow:0 0 8px rgba(255,45,120,0.2)} 50%{box-shadow:0 0 28px rgba(255,45,120,0.5)} }

  .uname   { font-family:'Cairo',sans-serif; font-size:14px; font-weight:700; color:var(--text); margin-bottom:3px; }
  .utalia  { font-family:'Cairo',sans-serif; font-size:11px; color:var(--muted); margin-bottom:5px; }
  .uclicks { font-family:'Orbitron',monospace; font-size:10px; color:var(--gold); letter-spacing:1px; margin-top:4px; }
  .ustatus { font-family:'Orbitron',monospace; font-size:9px; letter-spacing:1px; }
  .admactions { display:flex; gap:6px; margin-top:8px; }
  .btn-action { font-size:9px; padding:4px 10px; border-radius:6px; background:rgba(0,212,255,0.15); color:var(--blue); border:1px solid var(--blue); cursor:pointer; font-family:'Orbitron',monospace; }
  .btn-action.kick { background:rgba(255,45,120,0.15); color:var(--pink); border-color:var(--pink); }
  .btn-action:hover { opacity:0.8; }
  .s-w { color:var(--pink); }
  .s-l { color:var(--muted); }

  /* ── RESPONSES ── */
  .ritem { background:var(--card2); border:1px solid rgba(191,95,255,0.18); border-radius:13px; padding:18px; margin-bottom:12px; direction:rtl; animation:rise .4s ease; }
  .rmeta { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .rauthor { font-family:'Cairo',sans-serif; font-weight:800; color:var(--gold); font-size:15px; }
  .rtime   { font-family:'Orbitron',monospace; font-size:9px; color:var(--muted); letter-spacing:1px; }
  .rgroup  { font-family:'Cairo',sans-serif; font-size:11px; color:var(--muted); margin-bottom:10px; }
  .rcontent{ font-family:'Cairo',sans-serif; font-size:14px; line-height:1.8; color:var(--text); white-space:pre-wrap; margin-bottom:12px; }
  .btn-del { background:rgba(255,45,120,0.15); border:1px solid rgba(255,45,120,0.4); color:var(--pink); font-size:11px; padding:6px 12px; border-radius:8px; cursor:pointer; font-family:'Orbitron',monospace; letter-spacing:1px; }
  .btn-del:hover { background:rgba(255,45,120,0.3); }

  /* ── ADMIN CTRL ── */
  .ctrl { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin-bottom:22px; }
  .sel-count { font-family:'Orbitron',monospace; font-size:11px; color:var(--blue); letter-spacing:2px; margin-left:auto; }

  /* ── POPUP ── */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.78); backdrop-filter:blur(12px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn .2s ease; }
  @keyframes fadeIn { from{opacity:0}to{opacity:1} }
  .popup { background:var(--card); border:1px solid var(--border); border-radius:18px; padding:34px; max-width:400px; width:100%; text-align:center; box-shadow:0 0 80px rgba(0,212,255,0.14); animation:rise .3s ease; }
  .p-emoji { font-size:52px; margin-bottom:14px; }
  .p-msg { font-family:'Cairo',sans-serif; font-size:20px; font-weight:800; direction:rtl; margin-bottom:8px; }
  .p-sub { font-family:'Cairo',sans-serif; font-size:14px; color:var(--muted); direction:rtl; margin-bottom:24px; }
  .p-btns { display:flex; gap:12px; justify-content:center; }

  /* ── GAMES LOBBY ── */
  .ucard.disabled { opacity:0.3; pointer-events:none; }

  /* ── RED LIGHT GREEN LIGHT ── */
  .light-display { font-size:48px; font-weight:900; padding:40px; text-align:center; border-radius:20px; margin-bottom:30px; }
  .light-display.green { background:linear-gradient(135deg,var(--green),#00c8a0); color:#000; }
  .light-display.red { background:linear-gradient(135deg,var(--pink),#a0002a); color:#fff; animation:pulse 0.5s infinite; }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
  .vs-display { display:flex; align-items:center; justify-content:space-between; margin-bottom:30px; }
  .vs-text { font-size:32px; font-weight:900; color:var(--gold); }
  .team-side { flex:1; text-align:center; }
  .team-name { font-family:'Cairo',sans-serif; font-size:18px; font-weight:700; margin-bottom:10px; }
  .pull-bar { height:30px; background:rgba(255,255,255,0.1); border-radius:15px; overflow:hidden; margin-bottom:8px; }
  .pull-fill { height:100%; background:linear-gradient(90deg,var(--green),var(--gold)); border-radius:15px; transition:width 0.3s; }
  .pull-count { font-family:'Orbitron',monospace; font-size:24px; color:var(--gold); }

  /* ── TUG OF WAR ── */
  .tug-card { text-align:center; }
  .tug-title { font-size:32px; font-weight:900; margin-bottom:8px; }
  .tug-sub { color:var(--muted); margin-bottom:30px; }
  .tug-display { display:flex; align-items:center; justify-content:space-between; margin-bottom:30px; }
  .tug-team { font-size:18px; font-weight:700; }
  .tug-rope { flex:1; height:40px; position:relative; margin:0 20px; }
  .tug-line { height:8px; background:var(--gold); border-radius:4px; }
  .tug-knot { position:absolute; top:50%; transform:translate(-50%,-50%); font-size:32px; transition:left 0.2s; }
  .tug-btn { font-size:24px; padding:20px 60px; }

  /* ── GLASS BRIDGE ── */
  .glass-title { font-size:28px; font-weight:900; text-align:center; margin-bottom:8px; }
  .glass-sub { text-align:center; color:var(--muted); margin-bottom:20px; }
  .glass-bridge { display:flex; justify-content:center; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
  .glass { width:60px; height:80px; border:3px solid var(--gold); border-radius:10px 10px 5px 5px; display:flex; align-items:center; justify-content:center; font-size:24px; background:rgba(255,255,255,0.1); cursor:pointer; transition:all 0.2s; }
  .glass.available:hover { background:rgba(251,191,36,0.2); transform:scale(1.05); }
  .glass.team1 { background:linear-gradient(135deg,var(--blue),#005588); }
  .glass.team2 { background:linear-gradient(135deg,var(--pink),#880044); }
  .glass-scores { display:flex; justify-content:space-around; font-family:'Orbitron',monospace; font-size:14px; color:var(--muted); margin-bottom:20px; }
  .glass-message { font-size:20px; font-weight:700; text-align:center; padding:15px; border-radius:10px; background:rgba(255,255,255,0.1); }

  /* ── DALGONA ── */
  .dalgona-title { font-size:32px; font-weight:900; text-align:center; margin-bottom:8px; }
  .dalgona-sub { text-align:center; color:var(--muted); margin-bottom:20px; }
  .lives-display { font-size:32px; text-align:center; margin-bottom:20px; }
  .dalgona-shape { display:flex; justify-content:center; margin-bottom:20px; cursor:pointer; }
  .dalgona-circle { width:200px; height:200px; background:#d4a574; border-radius:50%; position:relative; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 -10px 30px rgba(0,0,0,0.3); }
  .dalgona-star { font-size:80px; color:#8b6914; }
  .crack { position:absolute; width:20px; height:2px; background:#8b6914; border-radius:2px; }
  .click-counter { text-align:center; font-family:'Orbitron',monospace; font-size:18px; color:var(--gold); margin-bottom:15px; }
  .dalgona-message { text-align:center; font-size:18px; font-weight:700; color:var(--gold); }

  /* ── MARBLES ── */
  .marbles-title { font-size:32px; font-weight:900; text-align:center; margin-bottom:8px; }
  .marbles-sub { text-align:center; color:var(--muted); margin-bottom:20px; }
  .scores-row { display:flex; justify-content:space-around; align-items:center; margin-bottom:30px; }
  .player-score { text-align:center; }
  .ball-count { font-size:28px; font-weight:900; color:var(--gold); }
  .pick-number { display:flex; justify-content:center; gap:12px; margin-bottom:25px; }
  .num-btn { width:50px; height:50px; border-radius:50%; border:2px solid var(--gold); background:transparent; color:var(--gold); font-size:20px; font-weight:700; cursor:pointer; transition:all 0.2s; }
  .num-btn.selected, .num-btn:hover { background:var(--gold); color:#000; }
  .message { text-align:center; font-size:18px; font-weight:700; padding:15px; border-radius:10px; background:rgba(255,255,255,0.1); }

  /* ── LEADERBOARD ── */
  .leader-item { display:flex; align-items:center; padding:15px; background:var(--card2); border-radius:12px; margin-bottom:10px; }
  .leader-rank { font-size:24px; font-weight:900; font-family:'Orbitron',monospace; color:var(--gold); width:50px; }
  .leader-name { flex:1; font-family:'Cairo',sans-serif; font-size:16px; font-weight:700; }
  .leader-talia { font-size:12px; color:var(--muted); margin-left:10px; }
  .leader-points { font-family:'Orbitron',monospace; font-size:16px; color:var(--green); }

  /* ── WINNER ── */
  .winner-announce { font-size:28px; font-weight:900; text-align:center; padding:30px; background:linear-gradient(135deg,var(--gold),#b8860b); color:#000; border-radius:15px; margin-top:20px; animation:winPulse 0.5s ease-out; }
  @keyframes winPulse { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }

  /* ── UTILS ── */
  .row { display:flex; gap:12px; align-items:center; }
  .mt8  { margin-top:8px;  }
  .mt16 { margin-top:16px; }
  .mt24 { margin-top:24px; }
  .tc   { text-align:center; }
  .w100 { width:100%; }
`;

export default CSS;
