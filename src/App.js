import React, { useState, useEffect, useRef } from 'react';

// ─── STYLES ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:    #0A0F1E;
    --slate:   #1B2A4A;
    --card:    #111827;
    --teal:    #00D4AA;
    --teal2:   #00A88A;
    --white:   #F0F4FF;
    --muted:   #8A9BB5;
    --border:  rgba(255,255,255,0.07);
    --glow:    0 0 24px rgba(0,212,170,0.25);
  }

  html, body, #root {
    height: 100%;
    background: var(--navy);
    color: var(--white);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── LAYOUT ── */
  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .screen { flex: 1; overflow-y: auto; padding-bottom: 80px; }

  /* ── NAV ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(10,15,30,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex; z-index: 100;
    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 4px; padding: 6px 0; cursor: pointer; border: none;
    background: none; color: var(--muted); font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 500; transition: color 0.2s;
    letter-spacing: 0.02em;
  }
  .nav-item.active { color: var(--teal); }
  .nav-item svg { width: 22px; height: 22px; }
  .nav-item .nav-dot {
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--teal); opacity: 0;
    transition: opacity 0.2s;
  }
  .nav-item.active .nav-dot { opacity: 1; }

  /* ── HERO ── */
  .hero {
    position: relative; overflow: hidden;
    background: linear-gradient(160deg, #0D1B35 0%, #0A0F1E 60%);
    padding: 60px 24px 48px;
    min-height: 340px;
    display: flex; flex-direction: column; justify-content: flex-end;
  }
  .hero-canvas {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  }
  .hero-eyebrow {
    font-family: 'Inter', sans-serif; font-size: 11px;
    font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--teal); margin-bottom: 12px; position: relative; z-index: 1;
  }
  .hero-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 14vw, 88px);
    line-height: 0.92; color: var(--white);
    letter-spacing: 0.01em; position: relative; z-index: 1;
  }
  .hero-title span { color: var(--teal); }
  .hero-subtitle {
    margin-top: 16px; font-size: 14px; color: var(--muted);
    line-height: 1.6; max-width: 300px; position: relative; z-index: 1;
  }
  .hero-stats {
    display: flex; gap: 32px; margin-top: 32px; position: relative; z-index: 1;
  }
  .hero-stat-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; color: var(--white); line-height: 1;
  }
  .hero-stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; letter-spacing: 0.05em; }

  /* ── SECTION HEADER ── */
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 20px 16px;
  }
  .section-title { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  .section-link { font-size: 13px; color: var(--teal); font-weight: 500; cursor: pointer; }

  /* ── CARDS ── */
  .cards-row { display: flex; gap: 12px; padding: 0 20px 4px; overflow-x: auto; }
  .cards-row::-webkit-scrollbar { display: none; }

  .catch-card {
    flex-shrink: 0; width: 180px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  }
  .catch-card:hover { transform: translateY(-3px); box-shadow: var(--glow); }
  .catch-card-img {
    width: 100%; height: 110px;
    display: flex; align-items: center; justify-content: center;
    font-size: 48px;
  }
  .catch-card-body { padding: 12px; }
  .catch-card-species { font-size: 15px; font-weight: 600; color: var(--white); }
  .catch-card-weight { font-size: 13px; color: var(--teal); font-weight: 500; margin-top: 2px; }
  .catch-card-meta { font-size: 11px; color: var(--muted); margin-top: 6px; }

  /* ── FEED ── */
  .feed-post {
    margin: 0 16px 12px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .feed-post:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
  .feed-post-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
  .feed-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), var(--slate));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .feed-username { font-size: 14px; font-weight: 600; color: var(--white); }
  .feed-location { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .feed-badge {
    margin-left: auto; font-size: 11px; font-weight: 600;
    padding: 4px 10px; border-radius: 20px;
    background: rgba(0,212,170,0.12); color: var(--teal);
    border: 1px solid rgba(0,212,170,0.2);
  }
  .feed-img-area {
    width: 100%; height: 200px; background: var(--slate);
    display: flex; align-items: center; justify-content: center;
    font-size: 72px; position: relative; overflow: hidden;
  }
  .feed-img-area::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(10,15,30,0.7) 100%);
  }
  .feed-post-body { padding: 14px 16px; }
  .feed-post-text { font-size: 14px; line-height: 1.6; color: var(--white); }
  .feed-post-text strong { color: var(--teal); font-weight: 600; }
  .feed-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .feed-tag {
    font-size: 12px; color: var(--muted); padding: 3px 8px;
    border-radius: 20px; border: 1px solid var(--border);
  }
  .feed-actions { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .feed-action {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 12px; cursor: pointer; border: none; background: none;
    color: var(--muted); font-size: 13px; font-weight: 500;
    font-family: 'Inter', sans-serif; transition: color 0.2s;
  }
  .feed-action:hover { color: var(--teal); }
  .feed-action.liked { color: #FF6B6B; }
  .feed-action svg { width: 17px; height: 17px; }

  /* ── MAP ── */
  .map-container {
    position: relative; margin: 0 16px 16px;
    border-radius: 20px; overflow: hidden;
    border: 1px solid var(--border);
    height: 340px;
  }
  .map-container iframe { width: 100%; height: 100%; border: none; display: block; }
  .map-overlay {
    position: absolute; top: 12px; left: 12px; right: 12px;
    display: flex; gap: 8px; pointer-events: none;
  }
  .map-pill {
    background: rgba(10,15,30,0.85); backdrop-filter: blur(12px);
    border: 1px solid var(--border); border-radius: 20px;
    padding: 8px 14px; font-size: 12px; font-weight: 500;
    color: var(--white); pointer-events: all; cursor: pointer;
    transition: border-color 0.2s;
  }
  .map-pill.active { border-color: var(--teal); color: var(--teal); }

  .spot-list { padding: 0 16px; }
  .spot-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid var(--border);
  }
  .spot-icon {
    width: 44px; height: 44px; border-radius: 14px;
    background: var(--slate); display: flex; align-items: center;
    justify-content: center; font-size: 20px; flex-shrink: 0;
  }
  .spot-name { font-size: 15px; font-weight: 500; color: var(--white); }
  .spot-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .spot-dist { font-size: 13px; color: var(--teal); font-weight: 600; margin-left: auto; }

  /* ── LOG FORM ── */
  .log-form { padding: 0 16px; }
  .form-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block;
  }
  .form-group { margin-bottom: 20px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 16px; color: var(--white);
    font-size: 15px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,212,170,0.1);
  }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
  .form-select option { background: var(--card); }
  .form-textarea { resize: none; height: 90px; line-height: 1.6; }

  .weight-row { display: flex; gap: 10px; }
  .weight-row .form-input { flex: 1; }
  .weight-unit {
    width: 60px; background: var(--slate); border: 1px solid var(--border);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: var(--muted);
  }

  .privacy-toggle {
    display: flex; background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .privacy-opt {
    flex: 1; padding: 12px; text-align: center; cursor: pointer;
    font-size: 13px; font-weight: 500; color: var(--muted);
    transition: background 0.2s, color 0.2s;
  }
  .privacy-opt.active {
    background: var(--teal); color: var(--navy); font-weight: 600;
  }

  .btn-primary {
    width: 100%; padding: 16px; border: none; border-radius: 14px;
    background: var(--teal); color: var(--navy);
    font-size: 16px; font-weight: 700; font-family: 'Inter', sans-serif;
    cursor: pointer; letter-spacing: 0.02em;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0,212,170,0.3);
  }
  .btn-primary:hover { background: var(--teal2); box-shadow: 0 6px 28px rgba(0,212,170,0.4); }
  .btn-primary:active { transform: scale(0.98); }

  /* ── TACKLE BOX ── */
  .tackle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .tackle-item {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 16px; cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tackle-item:hover { border-color: rgba(0,212,170,0.3); box-shadow: var(--glow); }
  .tackle-emoji { font-size: 28px; margin-bottom: 10px; }
  .tackle-name { font-size: 14px; font-weight: 600; color: var(--white); }
  .tackle-count { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .tackle-bar {
    height: 3px; background: var(--border); border-radius: 2px; margin-top: 12px;
  }
  .tackle-bar-fill { height: 100%; border-radius: 2px; background: var(--teal); }

  /* ── STATS ── */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 20px 16px; text-align: center;
  }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px; color: var(--teal); line-height: 1;
  }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; letter-spacing: 0.05em; }

  .pb-list { padding: 0 16px; margin-top: 8px; }
  .pb-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 0; border-bottom: 1px solid var(--border);
  }
  .pb-species { font-size: 15px; font-weight: 500; color: var(--white); }
  .pb-weight { font-size: 13px; font-weight: 600; color: var(--teal); }

  .profile-header {
    display: flex; align-items: center; gap: 16px; padding: 20px 20px 24px;
  }
  .profile-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), #0055AA);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(0,212,170,0.3);
  }
  .profile-name { font-size: 20px; font-weight: 700; color: var(--white); }
  .profile-since { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .profile-badge {
    display: inline-block; margin-top: 8px;
    font-size: 11px; font-weight: 600; padding: 3px 10px;
    border-radius: 20px; background: rgba(0,212,170,0.12);
    color: var(--teal); border: 1px solid rgba(0,212,170,0.2);
  }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: var(--teal); color: var(--navy); font-weight: 600; font-size: 14px;
    padding: 12px 24px; border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,212,170,0.4);
    opacity: 0; transition: opacity 0.3s, transform 0.3s;
    pointer-events: none; white-space: nowrap; z-index: 999;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────
const RECENT_CATCHES = [
  { id:1, species:'Common Carp', weight:'12lb 4oz', emoji:'🐟', location:'River Severn', date:'Today', bg:'#0D2A1F' },
  { id:2, species:'Pike', weight:'8lb 8oz', emoji:'🦈', location:'Grafham Water', date:'Yesterday', bg:'#1A1A0D' },
  { id:3, species:'Tench', weight:'5lb 2oz', emoji:'🐠', location:'Coombe Abbey', date:'2 days ago', bg:'#0D1A2A' },
  { id:4, species:'Bream', weight:'4lb 14oz', emoji:'🐡', location:'River Avon', date:'3 days ago', bg:'#1A0D1A' },
];

const FEED_POSTS = [
  {
    id:1, user:'Matt_Angler', avatar:'🎣', location:'River Thames, Berkshire',
    emoji:'🐟', weight:'17lb 6oz', species:'Mirror Carp',
    text: 'What a session — dropped in at first light and this beauty took the boilie just 20 mins in. PB by 2lb!',
    tags:['CarpFishing','RiverThames','BoilieFishing'],
    likes:42, comments:14, liked:false
  },
  {
    id:2, user:'NorthernPiker', avatar:'🦅', location:'Windermere, Cumbria',
    emoji:'🦈', weight:'19lb 2oz', species:'Northern Pike',
    text: 'Finally got her after 3 blank sessions. Deadbait on a size 6 treble, slow-rolled just off the margin.',
    tags:['PikeFishing','Windermere','Deadbait'],
    likes:87, comments:31, liked:true
  },
];

const SPOTS = [
  { name:'River Thames — Reading Stretch', type:'River', fish:'Barbel, Chub, Roach', dist:'4.2mi', emoji:'🏞️' },
  { name:'Grafham Water', type:'Reservoir', fish:'Trout, Pike, Bream', dist:'12mi', emoji:'💧' },
  { name:'Coombe Abbey Lake', type:'Still Water', fish:'Carp, Tench, Bream', dist:'8.7mi', emoji:'🌿' },
  { name:'River Avon — Evesham', type:'River', fish:'Barbel, Roach, Dace', dist:'18mi', emoji:'🌊' },
];

const TACKLE = [
  { name:'Rods', emoji:'🎣', count:4, max:8, tags:['Carp rod ×2','Pike rod','Float rod'] },
  { name:'Reels', emoji:'⚙️', count:3, max:6, tags:['Shimano Baitrunner ×2','Mitchell 300'] },
  { name:'Terminal', emoji:'🪝', count:28, max:50, tags:['Size 6 hooks','Size 10 hooks','Swivels'] },
  { name:'Bait', emoji:'🧪', count:6, max:10, tags:['Boilies','Maggots','Pellets','Corn'] },
  { name:'Floats', emoji:'🔴', count:12, max:20, tags:['Waggler','Stick float','Bolo'] },
  { name:'Other', emoji:'🎒', count:9, max:15, tags:['Forceps','Landing net','Unhooking mat'] },
];

const PBs = [
  { species:'Common Carp', weight:'23lb 8oz' },
  { species:'Pike', weight:'19lb 2oz' },
  { species:'Barbel', weight:'9lb 14oz' },
  { species:'Tench', weight:'6lb 1oz' },
  { species:'Roach', weight:'1lb 12oz' },
];

const UK_SPECIES = ['Common Carp','Mirror Carp','Grass Carp','Pike','Perch','Tench','Bream','Barbel','Chub','Roach','Dace','Grayling','Brown Trout','Rainbow Trout'];
const UK_BAITS = ['Boilies','Pellets','Maggots','Corn','Bread','Worm','Luncheon Meat','Deadbait','Lures','Feeder Mix','Paste'];

// ─── RIPPLE CANVAS ────────────────────────────────────────────────────────
function RippleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    const ripples = [];
    let t = 0;
    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    function addRipple() {
      ripples.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 0, max: 80 + Math.random() * 60, speed: 0.4 + Math.random() * 0.4, alpha: 0.5 });
    }
    addRipple(); addRipple(); addRipple();
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      if (Math.random() < 0.015) addRipple();
      ripples.forEach((rp, i) => {
        rp.r += rp.speed;
        rp.alpha = 0.5 * (1 - rp.r / rp.max);
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,212,170,${rp.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (rp.r >= rp.max) ripples.splice(i, 1);
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="hero-canvas" />;
}

// ─── SCREENS ─────────────────────────────────────────────────────────────
function HomeScreen({ onLog }) {
  return (
    <div className="screen">
      <div className="hero">
        <RippleCanvas />
        <div className="hero-eyebrow">The UK Angler's Companion</div>
        <div className="hero-title">CATCH<span>BASE</span></div>
        <div className="hero-subtitle">Log catches, discover spots, and connect with anglers across England.</div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">2,847</div><div className="hero-stat-label">Catches logged</div></div>
          <div><div className="hero-stat-val">614</div><div className="hero-stat-label">Spots mapped</div></div>
          <div><div className="hero-stat-val">1,203</div><div className="hero-stat-label">Anglers</div></div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Recent Catches</span>
        <span className="section-link">See all →</span>
      </div>
      <div className="cards-row">
        {RECENT_CATCHES.map(c => (
          <div className="catch-card" key={c.id}>
            <div className="catch-card-img" style={{ background: c.bg }}>{c.emoji}</div>
            <div className="catch-card-body">
              <div className="catch-card-species">{c.species}</div>
              <div className="catch-card-weight">{c.weight}</div>
              <div className="catch-card-meta">📍 {c.location}<br/>🕐 {c.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Quick Actions</span>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>
        <button className="btn-primary" style={{ flex:1, padding:'14px' }} onClick={onLog}>+ Log Catch</button>
        <button className="btn-primary" style={{ flex:1, padding:'14px', background:'var(--slate)', color:'var(--white)', boxShadow:'none' }}>
          📍 Add Spot
        </button>
      </div>
    </div>
  );
}

function FeedScreen() {
  const [posts, setPosts] = useState(FEED_POSTS);
  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Community Feed</span>
        <span className="section-link">Following</span>
      </div>
      {posts.map(p => (
        <div className="feed-post" key={p.id}>
          <div className="feed-post-header">
            <div className="feed-avatar">{p.avatar}</div>
            <div>
              <div className="feed-username">{p.user}</div>
              <div className="feed-location">📍 {p.location}</div>
            </div>
            <div className="feed-badge">{p.weight} {p.species}</div>
          </div>
          <div className="feed-img-area">{p.emoji}</div>
          <div className="feed-post-body">
            <div className="feed-post-text">{p.text}</div>
            <div className="feed-tags">{p.tags.map(t => <span key={t} className="feed-tag">#{t}</span>)}</div>
          </div>
          <div className="feed-actions">
            <button className={`feed-action${p.liked ? ' liked' : ''}`} onClick={() => setPosts(ps => ps.map(pp => pp.id === p.id ? {...pp, liked:!pp.liked, likes:pp.liked?pp.likes-1:pp.likes+1} : pp))}>
              <svg fill={p.liked ? '#FF6B6B' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {p.likes}
            </button>
            <button className="feed-action">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {p.comments}
            </button>
            <button className="feed-action">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapScreen() {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Rivers','Still Water','Reservoirs'];
  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Fishing Spots</span>
        <span className="section-link">+ Add</span>
      </div>
      <div className="map-container">
        <iframe
          title="Fishing spots map"
          sandbox="allow-scripts allow-same-origin"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-2.5,51.3,0.3,52.8&layer=mapnik&marker=51.5,-1.5"
          loading="lazy"
        />
        <div className="map-overlay">
          {filters.map(f => (
            <button key={f} className={`map-pill${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="spot-list">
        {SPOTS.map((s,i) => (
          <div className="spot-item" key={i}>
            <div className="spot-icon">{s.emoji}</div>
            <div>
              <div className="spot-name">{s.name}</div>
              <div className="spot-meta">{s.type} · {s.fish}</div>
            </div>
            <div className="spot-dist">{s.dist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogScreen({ onSaved }) {
  const [form, setForm] = useState({ species:'', weight:'', bait:'', location:'', notes:'', privacy:'Approximate' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.species || !form.weight) return;
    onSaved();
  };

  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Log a Catch</span>
      </div>
      <div className="log-form">
        <div className="form-group">
          <label className="form-label">Species</label>
          <select className="form-select" value={form.species} onChange={e => set('species', e.target.value)}>
            <option value="">Select species…</option>
            {UK_SPECIES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Weight</label>
          <div className="weight-row">
            <input className="form-input" placeholder="e.g. 12" value={form.weight} onChange={e => set('weight', e.target.value)} />
            <div className="weight-unit">lb</div>
            <input className="form-input" placeholder="oz" style={{maxWidth:70}} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Bait used</label>
          <select className="form-select" value={form.bait} onChange={e => set('bait', e.target.value)}>
            <option value="">Select bait…</option>
            {UK_BAITS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="e.g. River Severn, Shrewsbury" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Conditions, techniques, anything worth remembering…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location privacy</label>
          <div className="privacy-toggle">
            {['Approximate','Precise'].map(opt => (
              <div key={opt} className={`privacy-opt${form.privacy===opt?' active':''}`} onClick={() => set('privacy', opt)}>
                {opt === 'Approximate' ? '🔒 Approximate (~2mi)' : '📍 Precise pin'}
              </div>
            ))}
          </div>
        </div>
        <button className="btn-primary" onClick={handleSave}>Save Catch</button>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

function TackleScreen() {
  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Tackle Box</span>
        <span className="section-link">+ Add</span>
      </div>
      <div className="tackle-grid">
        {TACKLE.map((t,i) => (
          <div className="tackle-item" key={i}>
            <div className="tackle-emoji">{t.emoji}</div>
            <div className="tackle-name">{t.name}</div>
            <div className="tackle-count">{t.count} items</div>
            <div className="tackle-bar">
              <div className="tackle-bar-fill" style={{ width:`${(t.count/t.max)*100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsScreen() {
  return (
    <div className="screen">
      <div className="profile-header">
        <div className="profile-avatar">🎣</div>
        <div>
          <div className="profile-name">Matt Clarke</div>
          <div className="profile-since">Angling since 2019</div>
          <div className="profile-badge">⭐ Verified Angler</div>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">This Season</span>
      </div>
      <div className="stats-grid">
        {[
          { val:'47', label:'Total Catches' },
          { val:'12', label:'Species Caught' },
          { val:'23.8', label:'Avg Weight (lb)' },
          { val:'18', label:'Sessions' },
        ].map((s,i) => (
          <div className="stat-card" key={i}>
            <div className="stat-num">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Personal Bests</span>
      </div>
      <div className="pb-list">
        {PBs.map((pb,i) => (
          <div className="pb-row" key={i}>
            <div className="pb-species">{pb.species}</div>
            <div className="pb-weight">{pb.weight}</div>
          </div>
        ))}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

// ─── NAV ICONS ───────────────────────────────────────────────────────────
const NAV = [
  { id:'home', label:'Home', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:'feed', label:'Feed', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id:'map', label:'Map', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
  { id:'log', label:'Log', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id:'tackle', label:'Tackle', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { id:'stats', label:'Stats', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

// ─── APP ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToast(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {screen === 'home'   && <HomeScreen onLog={() => setScreen('log')} />}
        {screen === 'feed'   && <FeedScreen />}
        {screen === 'map'    && <MapScreen />}
        {screen === 'log'    && <LogScreen onSaved={() => { triggerToast('🐟 Catch saved!'); setScreen('home'); }} />}
        {screen === 'tackle' && <TackleScreen />}
        {screen === 'stats'  && <StatsScreen />}

        <nav className="bottom-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-item${screen===n.id?' active':''}`} onClick={() => setScreen(n.id)}>
              {n.icon}
              {n.label}
              <div className="nav-dot" />
            </button>
          ))}
        </nav>

        <div className={`toast${showToast?' show':''}`}>{toast}</div>
      </div>
    </>
  );
}
