import React, { useState, useEffect, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
  @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F8F7F4; --white: #FFFFFF; --blue: #3B9EE8; --blue2: #2B8ED8;
    --dark: #1A1A1F; --mid: #6B7280; --light: #E5E7EB;
    --shadow: 0 2px 12px rgba(0,0,0,0.08); --shadow2: 0 4px 24px rgba(0,0,0,0.12);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--dark); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  @media (min-width: 768px) {
    body { background: #ECEAE6; }
    .app { flex-direction: row; }
    .bottom-nav { display: none !important; }
    .sidebar { display: flex !important; }
    .main-content { flex: 1; overflow-y: auto; }
    .hero { padding: 48px 48px 44px; }
    .cards-row { padding: 0 32px 4px; }
    .section-header { padding: 24px 32px 12px; }
    .quick-actions { padding: 0 32px; }
    .feed-post { margin: 0 32px 14px; }
    .map-wrap { padding: 0 32px; }
    .map-controls { padding: 0 32px 8px; }
    .spot-list { padding: 0 32px; }
    .log-form { padding: 0 32px; }
    .tackle-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr; }
    .item-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr; }
    .stats-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr 1fr; }
    .pb-list { padding: 0 32px; }
    .profile-header { padding: 24px 32px; }
    .back-btn { padding: 20px 32px 8px; }
    .item-detail { padding: 0 32px; }
    .tide-card { margin: 32px 32px 0; }
    .catches-grid { padding: 0 32px; }
    .sessions-list { padding: 0 32px; }
  }

  .sidebar { display: none; flex-direction: column; width: 240px; min-width: 240px; background: var(--white); border-right: 1px solid var(--light); padding: 32px 16px; gap: 4px; box-shadow: 2px 0 12px rgba(0,0,0,0.04); }
  .sidebar-logo { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--dark); padding: 0 12px 24px; letter-spacing: 0.02em; }
  .sidebar-logo span { color: var(--blue); }
  .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: none; background: none; color: var(--mid); font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; transition: all 0.2s; width: 100%; text-align: left; }
  .sidebar-item svg { width: 20px; height: 20px; flex-shrink: 0; }
  .sidebar-item:hover { background: var(--bg); color: var(--dark); }
  .sidebar-item.active { background: rgba(59,158,232,0.1); color: var(--blue); }
  .sidebar-version { margin-top: auto; font-size: 11px; color: var(--mid); padding: 0 12px; }

  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: var(--white); border-top: 1px solid var(--light); display: flex; z-index: 100; padding: 8px 0 max(8px, env(safe-area-inset-bottom)); box-shadow: 0 -4px 20px rgba(0,0,0,0.06); }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0; cursor: pointer; border: none; background: none; color: var(--mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; transition: color 0.2s; }
  .nav-item.active { color: var(--blue); }
  .nav-item svg { width: 22px; height: 22px; }

  .screen { flex: 1; overflow-y: auto; padding-bottom: 90px; background: var(--bg); }
  .main-content { flex: 1; overflow-y: auto; background: var(--bg); }

  .hero { background: linear-gradient(150deg, #3B9EE8 0%, #2B8ED8 100%); padding: 48px 24px 36px; position: relative; overflow: hidden; }
  .hero::after { content:''; position:absolute; bottom:-30px; left:-10%; right:-10%; height:60px; background:var(--bg); border-radius:50% 50% 0 0/100% 100% 0 0; }
  .hero-eyebrow { font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.8); margin-bottom:10px; }
  .hero-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(52px,13vw,80px); line-height:0.92; color:white; }
  .hero-title span { color:rgba(255,255,255,0.6); }
  .hero-subtitle { margin-top:12px; font-size:14px; color:rgba(255,255,255,0.85); line-height:1.6; max-width:400px; }
  .hero-stats { display:flex; gap:28px; margin-top:28px; flex-wrap:wrap; }
  .hero-stat-val { font-family:'Bebas Neue',sans-serif; font-size:28px; color:white; line-height:1; }
  .hero-stat-label { font-size:11px; color:rgba(255,255,255,0.7); margin-top:2px; }

  .tide-card { margin:32px 16px 0; background:var(--white); border-radius:20px; box-shadow:var(--shadow); overflow:hidden; }
  .tide-header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 12px; border-bottom:1px solid var(--light); }
  .tide-title { font-size:14px; font-weight:700; color:var(--dark); }
  .tide-location { font-size:12px; color:var(--blue); font-weight:600; }
  .tide-times { display:flex; flex-wrap:wrap; }
  .tide-time { flex:1; min-width:80px; padding:12px 14px; display:flex; align-items:center; gap:10px; border-right:1px solid var(--light); }
  .tide-time:last-child { border-right:none; }
  .tide-icon { font-size:20px; }
  .tide-type { font-size:10px; color:var(--mid); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
  .tide-val { font-size:15px; font-weight:700; color:var(--dark); margin-top:1px; }
  .tide-height { font-size:12px; color:var(--blue); font-weight:600; }
  .tide-loading { padding:20px; font-size:14px; color:var(--mid); text-align:center; }

  .section-header { display:flex; align-items:center; justify-content:space-between; padding:24px 18px 12px; }
  .section-title { font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--mid); }
  .section-link { font-size:13px; color:var(--blue); font-weight:600; cursor:pointer; }

  .cards-row { display:flex; gap:12px; padding:0 16px 4px; overflow-x:auto; }
  .cards-row::-webkit-scrollbar { display:none; }
  .catch-card { flex-shrink:0; width:165px; background:var(--white); border-radius:16px; overflow:hidden; box-shadow:var(--shadow); cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; border:1px solid var(--light); }
  .catch-card:hover { transform:translateY(-2px); box-shadow:var(--shadow2); }
  .catch-card-img-wrap { width:100%; height:100px; overflow:hidden; background:#E8F4FD; display:flex; align-items:center; justify-content:center; }
  .catch-card-img { width:100%; height:100%; object-fit:cover; }
  .catch-card-body { padding:12px; }
  .catch-card-species { font-size:14px; font-weight:700; color:var(--dark); }
  .catch-card-weight { font-size:13px; color:var(--blue); font-weight:600; margin-top:2px; }
  .catch-card-meta { font-size:11px; color:var(--mid); margin-top:6px; line-height:1.5; }

  .quick-actions { display:flex; gap:10px; padding:0 16px; flex-wrap:wrap; }
  .btn-primary { flex:1; padding:16px; border:none; border-radius:14px; background:var(--blue); color:white; font-size:15px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; transition:background 0.2s,transform 0.1s; box-shadow:0 4px 16px rgba(59,158,232,0.3); }
  .btn-primary:hover { background:var(--blue2); }
  .btn-primary:active { transform:scale(0.98); }
  .btn-secondary { flex:1; padding:16px; border:2px solid var(--blue); border-radius:14px; background:white; color:var(--blue); font-size:15px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.2s; }
  .btn-secondary:hover { background:rgba(59,158,232,0.05); }

  .feed-post { margin:0 16px 14px; background:var(--white); border-radius:20px; overflow:hidden; box-shadow:var(--shadow); border:1px solid var(--light); }
  .feed-post-header { display:flex; align-items:center; gap:12px; padding:16px; }
  .feed-avatar { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--blue),#0055AA); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .feed-username { font-size:15px; font-weight:700; color:var(--dark); }
  .feed-location { font-size:12px; color:var(--mid); margin-top:1px; }
  .feed-badge { margin-left:auto; font-size:11px; font-weight:700; padding:5px 10px; border-radius:20px; background:rgba(59,158,232,0.1); color:var(--blue); border:1px solid rgba(59,158,232,0.2); white-space:nowrap; }
  .feed-img-area { width:100%; height:200px; overflow:hidden; background:#E8F4FD; display:flex; align-items:center; justify-content:center; }
  .feed-img-area img { width:100%; height:100%; object-fit:cover; }
  .feed-post-body { padding:14px 16px; }
  .feed-post-text { font-size:14px; line-height:1.6; color:var(--dark); }
  .feed-tags { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
  .feed-tag { font-size:12px; color:var(--blue); padding:3px 10px; border-radius:20px; border:1px solid rgba(59,158,232,0.3); background:rgba(59,158,232,0.05); }
  .feed-actions { display:flex; border-top:1px solid var(--light); }
  .feed-action { flex:1; display:flex; align-items:center; justify-content:center; gap:6px; padding:13px; cursor:pointer; border:none; background:none; color:var(--mid); font-size:13px; font-weight:600; font-family:'Inter',sans-serif; transition:color 0.2s; }
  .feed-action:hover { color:var(--blue); }
  .feed-action.liked { color:#EF4444; }
  .feed-action svg { width:17px; height:17px; }

  /* MAP */
  .map-wrap { padding:0 16px; }
  .map-leaflet { border-radius:20px; overflow:hidden; border:1px solid var(--light); height:420px; box-shadow:var(--shadow); position:relative; z-index:1; }
  .map-controls { padding:0 16px 8px; }
  .map-top-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
  .map-toggle-group { display:flex; background:var(--white); border:1px solid var(--light); border-radius:20px; overflow:hidden; box-shadow:var(--shadow); }
  .map-toggle-btn { padding:8px 16px; font-size:13px; font-weight:600; border:none; background:none; color:var(--mid); cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; }
  .map-toggle-btn.active { background:var(--blue); color:white; }
  .map-home-btn { padding:8px 14px; font-size:13px; font-weight:600; border:2px solid var(--light); border-radius:20px; background:var(--white); color:var(--mid); cursor:pointer; font-family:'Inter',sans-serif; box-shadow:var(--shadow); transition:all 0.2s; display:flex; align-items:center; gap:6px; }
  .map-home-btn:hover { border-color:var(--blue); color:var(--blue); }
  .pin-filter-row { display:flex; gap:8px; flex-wrap:wrap; }
  .pin-filter-btn { padding:7px 14px; font-size:12px; font-weight:600; border:2px solid var(--light); border-radius:20px; background:var(--white); color:var(--mid); cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.2s; }
  .pin-filter-btn.active { border-color:var(--blue); color:var(--blue); background:rgba(59,158,232,0.05); }
  .spot-list { padding:0 16px; }
  .spot-item { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--light); }
  .spot-icon { width:46px; height:46px; border-radius:14px; background:rgba(59,158,232,0.1); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .spot-name { font-size:15px; font-weight:600; color:var(--dark); }
  .spot-meta { font-size:12px; color:var(--mid); margin-top:2px; }
  .spot-dist { font-size:13px; color:var(--blue); font-weight:700; margin-left:auto; white-space:nowrap; }

  .log-form { padding:0 16px; }
  .form-label { font-size:13px; font-weight:700; color:var(--dark); margin-bottom:8px; display:block; }
  .form-group { margin-bottom:20px; }
  .form-input, .form-select, .form-textarea { width:100%; background:var(--white); border:2px solid var(--light); border-radius:12px; padding:14px 16px; color:var(--dark); font-size:15px; font-family:'Inter',sans-serif; outline:none; transition:border-color 0.2s; -webkit-appearance:none; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color:var(--blue); }
  .form-input::placeholder, .form-textarea::placeholder { color:var(--mid); }
  .form-textarea { resize:none; height:90px; line-height:1.6; }
  .add-custom-row { display:flex; gap:8px; margin-top:8px; }
  .add-custom-row .form-input { flex:1; padding:12px 14px; font-size:14px; }
  .btn-add { padding:12px 16px; border:2px solid var(--blue); border-radius:12px; background:rgba(59,158,232,0.08); color:var(--blue); font-size:14px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; white-space:nowrap; transition:all 0.2s; }
  .custom-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
  .custom-tag { display:flex; align-items:center; gap:6px; font-size:13px; padding:5px 12px; border-radius:20px; background:rgba(59,158,232,0.1); color:var(--blue); border:1px solid rgba(59,158,232,0.3); font-weight:600; }
  .custom-tag-x { cursor:pointer; font-size:16px; line-height:1; color:var(--mid); }
  .weight-row { display:flex; gap:10px; }
  .weight-row .form-input { flex:1; }
  .weight-unit { width:56px; background:var(--light); border:2px solid var(--light); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:var(--mid); }
  .privacy-toggle { display:flex; background:var(--light); border-radius:12px; padding:4px; gap:4px; }
  .privacy-opt { flex:1; padding:11px 8px; text-align:center; cursor:pointer; font-size:13px; font-weight:600; color:var(--mid); transition:all 0.2s; border-radius:9px; }
  .privacy-opt.active { background:var(--white); color:var(--blue); box-shadow:var(--shadow); }
  .log-map { border-radius:14px; overflow:hidden; border:2px solid var(--blue); height:240px; margin-top:12px; position:relative; z-index:1; }
  .map-picker-hint { font-size:12px; color:var(--mid); margin-top:6px; text-align:center; }

  .tackle-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; }
  .tackle-cat { background:var(--white); border:2px solid var(--light); border-radius:18px; padding:18px; cursor:pointer; transition:all 0.2s; box-shadow:var(--shadow); }
  .tackle-cat:hover { border-color:var(--blue); transform:translateY(-2px); box-shadow:var(--shadow2); }
  .tackle-emoji { font-size:30px; margin-bottom:10px; }
  .tackle-name { font-size:15px; font-weight:700; color:var(--dark); }
  .tackle-count { font-size:12px; color:var(--mid); margin-top:3px; }
  .tackle-bar { height:4px; background:var(--light); border-radius:2px; margin-top:14px; }
  .tackle-bar-fill { height:100%; border-radius:2px; background:var(--blue); }

  .back-btn { display:flex; align-items:center; gap:8px; padding:20px 16px 8px; cursor:pointer; border:none; background:none; font-size:15px; font-weight:600; color:var(--blue); font-family:'Inter',sans-serif; }
  .item-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; }
  .item-card { background:var(--white); border:2px solid var(--light); border-radius:16px; overflow:hidden; cursor:pointer; transition:all 0.2s; box-shadow:var(--shadow); }
  .item-card:hover { border-color:var(--blue); transform:translateY(-2px); }
  .item-card-img-wrap { width:100%; height:100px; overflow:hidden; background:#E8F4FD; display:flex; align-items:center; justify-content:center; }
  .item-card-img-emoji { font-size:40px; }
  .item-card-body { padding:10px 12px; }
  .item-card-name { font-size:14px; font-weight:700; color:var(--dark); }
  .item-card-brand { font-size:12px; color:var(--mid); margin-top:2px; }
  .item-card-price { font-size:13px; color:var(--blue); font-weight:700; margin-top:4px; }
  .add-item-card { background:rgba(59,158,232,0.05); border:2px dashed rgba(59,158,232,0.4); border-radius:16px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:160px; cursor:pointer; transition:all 0.2s; gap:8px; }
  .add-item-card:hover { background:rgba(59,158,232,0.1); }
  .add-item-card span { font-size:28px; }
  .add-item-card p { font-size:13px; font-weight:700; color:var(--blue); }

  .item-detail { padding:0 16px; }
  .item-detail-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
  .item-detail-img-wrap { width:100%; height:200px; border-radius:18px; background:#E8F4FD; display:flex; align-items:center; justify-content:center; margin-bottom:16px; border:2px solid var(--light); overflow:hidden; }
  .item-detail-img-emoji { font-size:80px; }
  .item-detail-name { font-size:22px; font-weight:800; color:var(--dark); }
  .item-detail-brand { font-size:14px; color:var(--mid); margin-top:4px; }
  .item-detail-price { font-size:20px; font-weight:700; color:var(--blue); margin-top:6px; }
  .item-detail-meta { font-size:13px; color:var(--mid); margin-top:4px; }
  .item-detail-comments { background:var(--bg); border-radius:12px; padding:14px; margin-top:8px; font-size:14px; color:var(--dark); line-height:1.6; border:1px solid var(--light); }
  .edit-btn { padding:8px 16px; border:2px solid var(--blue); border-radius:20px; background:white; color:var(--blue); font-size:13px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; white-space:nowrap; }
  .delete-btn { padding:8px 16px; border:2px solid #EF4444; border-radius:20px; background:white; color:#EF4444; font-size:13px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; margin-top:8px; width:100%; }
  .detail-section { margin-top:24px; }
  .detail-section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--mid); margin-bottom:12px; }
  .catch-history-item { display:flex; align-items:center; gap:12px; padding:12px; background:var(--white); border-radius:12px; margin-bottom:8px; border:1px solid var(--light); box-shadow:var(--shadow); }
  .catch-history-img-wrap { width:44px; height:44px; border-radius:10px; overflow:hidden; background:#E8F4FD; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .catch-history-img { width:100%; height:100%; object-fit:cover; }
  .catch-history-species { font-size:15px; font-weight:700; color:var(--dark); }
  .catch-history-meta { font-size:12px; color:var(--mid); margin-top:2px; }
  .catch-history-weight { font-size:14px; font-weight:700; color:var(--blue); margin-left:auto; white-space:nowrap; }

  .profile-header { display:flex; align-items:center; gap:16px; padding:20px 16px 24px; }
  .profile-avatar { width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg,var(--blue),#0055AA); display:flex; align-items:center; justify-content:center; font-size:30px; flex-shrink:0; box-shadow:0 0 0 4px rgba(59,158,232,0.2); }
  .profile-name { font-size:22px; font-weight:800; color:var(--dark); }
  .profile-since { font-size:13px; color:var(--mid); margin-top:2px; }
  .profile-badge { display:inline-block; margin-top:6px; font-size:12px; font-weight:700; padding:4px 12px; border-radius:20px; background:rgba(59,158,232,0.1); color:var(--blue); border:1px solid rgba(59,158,232,0.3); }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; }
  .stat-card { background:var(--white); border:1px solid var(--light); border-radius:16px; padding:20px 16px; text-align:center; box-shadow:var(--shadow); cursor:pointer; transition:all 0.2s; }
  .stat-card:hover { border-color:var(--blue); transform:translateY(-2px); }
  .stat-num { font-family:'Bebas Neue',sans-serif; font-size:44px; color:var(--blue); line-height:1; }
  .stat-label { font-size:12px; color:var(--mid); margin-top:4px; font-weight:600; }
  .pb-list { padding:0 16px; margin-top:4px; }
  .pb-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--light); }
  .pb-left { display:flex; align-items:center; gap:10px; }
  .pb-fish-img { width:36px; height:36px; border-radius:8px; object-fit:cover; background:#E8F4FD; }
  .pb-species { font-size:15px; font-weight:600; color:var(--dark); }
  .pb-weight { font-size:14px; font-weight:700; color:var(--blue); }
  .catches-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px; }
  .catch-drill-card { background:var(--white); border:2px solid var(--light); border-radius:16px; overflow:hidden; box-shadow:var(--shadow); }
  .catch-drill-img { width:100%; height:90px; object-fit:cover; background:#E8F4FD; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .catch-drill-body { padding:10px 12px; }
  .catch-drill-species { font-size:14px; font-weight:700; color:var(--dark); }
  .catch-drill-weight { font-size:13px; color:var(--blue); font-weight:600; margin-top:2px; }
  .catch-drill-meta { font-size:11px; color:var(--mid); margin-top:4px; line-height:1.5; }
  .sessions-list { padding:0 16px; }
  .session-row { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--light); }
  .session-icon { width:46px; height:46px; border-radius:14px; background:rgba(59,158,232,0.1); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .session-name { font-size:15px; font-weight:600; color:var(--dark); }
  .session-meta { font-size:12px; color:var(--mid); margin-top:2px; }
  .session-count { font-size:13px; color:var(--blue); font-weight:700; margin-left:auto; white-space:nowrap; }

  .toast { position:fixed; bottom:100px; left:50%; transform:translateX(-50%) translateY(20px); background:var(--blue); color:white; font-weight:700; font-size:15px; padding:14px 28px; border-radius:20px; box-shadow:0 8px 32px rgba(59,158,232,0.4); opacity:0; transition:opacity 0.3s,transform 0.3s; pointer-events:none; white-space:nowrap; z-index:999; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }

  .add-cat-card { background:rgba(59,158,232,0.04); border:2px dashed rgba(59,158,232,0.3); border-radius:18px; padding:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:130px; cursor:pointer; transition:all 0.2s; gap:6px; }
  .add-cat-card:hover { background:rgba(59,158,232,0.08); }
  .add-cat-card span { font-size:24px; color:var(--blue); }
  .add-cat-card p { font-size:13px; font-weight:600; color:var(--blue); }

  .leaflet-container { background:#E8F4FD; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--light); border-radius:2px; }
`;

// ── FISH PHOTOS ──────────────────────────────────────────────────────────
const FISH_PHOTOS = {
  'Sea Bass':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dicentrarchus_labrax.jpg/320px-Dicentrarchus_labrax.jpg',
  'Cod':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Atlantic_cod.jpg/320px-Atlantic_cod.jpg',
  'Mackerel':'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scomber_scombrus.jpg/320px-Scomber_scombrus.jpg',
  'Pollock':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Pollachius_pollachius.jpg/320px-Pollachius_pollachius.jpg',
  'Flounder':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Platichthys_flesus.jpg/320px-Platichthys_flesus.jpg',
  'Brown Trout':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Brown_trout_Salmo_trutta.jpg/320px-Brown_trout_Salmo_trutta.jpg',
  'Pike':'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Esox_lucius.jpg/320px-Esox_lucius.jpg',
  'Barbel':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Barbus_barbus.jpg/320px-Barbus_barbus.jpg',
  'Smoothhound':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Mustelus_mustelus.jpg/320px-Mustelus_mustelus.jpg',
};
function FishImg({ species, className, style }) {
  const [err, setErr] = useState(false);
  const src = FISH_PHOTOS[species] || FISH_PHOTOS['Sea Bass'];
  if (err) return <span style={{fontSize:36}}>🐟</span>;
  return <img src={src} alt={species} className={className} style={style} onError={() => setErr(true)} />;
}

// ── DATA ─────────────────────────────────────────────────────────────────
const SEA_SPECIES = ['Sea Bass','Cod','Mackerel','Pollock','Flounder','Plaice','Whiting','Dogfish','Conger Eel','Smoothhound','Bull Huss','Wrasse','Grey Mullet','Dab','Turbot','Thornback Ray','Black Bream','Garfish','Coalfish','Pouting'];
const RIVER_SPECIES = ['Brown Trout','Sea Trout','Atlantic Salmon','Barbel','Chub','Roach','Dace','Grayling','Pike','Perch','Tench','Bream','Rudd','Carp'];
const SEA_BAITS = ['Ragworm','Lugworm','Mackerel Strip','Squid','Sandeel','Peeler Crab','Hermit Crab','Mussel','Limpet','Feathers','Lures / Spinners','Plugs','Soft Plastics'];
const RIVER_BAITS = ['Maggots','Casters','Worm','Bread','Pellets','Boilies','Corn','Hemp','Paste','Spoons','Flies'];
const RECENT_CATCHES = [
  { id:1, species:'Sea Bass', weight:'4lb 8oz', location:'Chesil Beach', date:'Today' },
  { id:2, species:'Cod', weight:'6lb 14oz', location:'Whitby Pier', date:'Yesterday' },
  { id:3, species:'Mackerel', weight:'1lb 2oz', location:'Brighton Pier', date:'2 days ago' },
  { id:4, species:'Pollock', weight:'3lb 6oz', location:'Lyme Regis', date:'3 days ago' },
];
const FEED_POSTS = [
  { id:1, user:'SouthCoastSam', avatar:'🎣', location:'Chesil Beach, Dorset', species:'Sea Bass', weight:'7lb 2oz', text:"Incredible dawn session at Chesil this morning. Used ragworm on a running leger rig — took about 40 minutes but absolutely worth the wait. Biggest bass of the year!", tags:['SeaBass','ChesilBeach','Ragworm'], likes:54, comments:18, liked:false },
  { id:2, user:'NorthSeaNick', avatar:'🦅', location:'Whitby Pier, Yorkshire', species:'Cod', weight:'9lb 4oz', text:"Winter cod are back at Whitby! Peeler crab fished on the sea bed just off the pier end. Three fish in two hours — this is what it's all about.", tags:['CodFishing','Whitby','PeelerCrab'], likes:92, comments:37, liked:true },
];
const SPOTS = [
  { name:'Chesil Beach', type:'Sea — Surf Beach', fish:'Bass, Cod, Dogfish', dist:'4.2mi', emoji:'🌊' },
  { name:'Whitby Pier', type:'Sea — Pier', fish:'Cod, Whiting, Mackerel', dist:'12mi', emoji:'🏗️' },
  { name:'River Itchen', type:'River', fish:'Brown Trout, Grayling', dist:'2.1mi', emoji:'🏞️' },
  { name:'Brighton Marina', type:'Sea — Marina', fish:'Bass, Wrasse, Mullet', dist:'8.7mi', emoji:'⚓' },
];
const INITIAL_TACKLE = [
  { id:'rods', name:'Rods', emoji:'🎣', items:[
    { id:'r1', name:'Daiwa Ninja X', brand:'Daiwa', price:'89.99', purchaseDate:'12 Mar 2024', purchaseWhere:'Veals Fishing', comments:'Great all-round sea rod, good for bass and cod sessions.', catches:[{ species:'Sea Bass', weight:'4lb 8oz', date:'10 Jun 2025' },{ species:'Pollock', weight:'2lb 4oz', date:'3 Mar 2025' }] },
    { id:'r2', name:'Shakespeare Ugly Stik', brand:'Shakespeare', price:'54.99', purchaseDate:'5 Jan 2023', purchaseWhere:'Amazon', comments:'Reliable beginner rod, very tough.', catches:[{ species:'Cod', weight:'5lb 0oz', date:'8 Jan 2025' }] },
  ]},
  { id:'reels', name:'Reels', emoji:'⚙️', items:[{ id:'re1', name:'Shimano Baitrunner DL', brand:'Shimano', price:'129.99', purchaseDate:'1 Jun 2023', purchaseWhere:'Angling Direct', comments:'Smooth drag, excellent for beach fishing.', catches:[] }] },
  { id:'lures', name:'Lures', emoji:'🎯', items:[] },
  { id:'terminal', name:'Terminal', emoji:'🪝', items:[] },
  { id:'bait', name:'Bait', emoji:'🧪', items:[] },
  { id:'other', name:'Other', emoji:'🎒', items:[] },
];
const PBS = [
  { species:'Sea Bass', weight:'7lb 2oz' },{ species:'Cod', weight:'9lb 4oz' },
  { species:'Mackerel', weight:'1lb 14oz' },{ species:'Pollock', weight:'4lb 8oz' },
  { species:'Smoothhound', weight:'11lb 6oz' },{ species:'Brown Trout', weight:'3lb 2oz' },
  { species:'Pike', weight:'14lb 8oz' },{ species:'Barbel', weight:'8lb 12oz' },
];

// ── LEAFLET MAP COMPONENT ─────────────────────────────────────────────────
function LeafletMap({ height = '420px', onPinDrop, pinFilter = 'my', showControls = true }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const tileLayer = useRef(null);
  const userMarker = useRef(null);
  const pinMarkers = useRef([]);
  const [mapView, setMapView] = useState('Map');
  const [pinMode, setPinMode] = useState(pinFilter);
  const [userPos, setUserPos] = useState(null);
  const [located, setLocated] = useState(false);

  const MY_PINS = [
    { lat:50.613, lng:-2.456, label:'Sea Bass — 4lb 8oz', color:'#3B9EE8' },
    { lat:54.486, lng:-0.612, label:'Cod — 6lb 14oz', color:'#3B9EE8' },
    { lat:50.819, lng:-0.137, label:'Mackerel — 1lb 2oz', color:'#3B9EE8' },
  ];
  const COMMUNITY_PINS = [
    { lat:51.477, lng:0.001, label:'SouthCoastSam — Sea Bass 7lb', color:'#10B981' },
    { lat:53.962, lng:-1.082, label:'NorthSeaNick — Cod 9lb', color:'#10B981' },
    { lat:50.366, lng:-4.142, label:'PlymouthPete — Pollock 5lb', color:'#10B981' },
    { lat:52.636, lng:1.729, label:'NorfolkNige — Bass 3lb', color:'#10B981' },
  ];
  const TACKLE_SHOPS = [
    { lat:51.5, lng:-0.12, label:'London Angling Centre', color:'#F59E0B' },
    { lat:50.82, lng:-0.14, label:'Brighton Angling', color:'#F59E0B' },
    { lat:53.96, lng:-1.08, label:'York Fishing Tackle', color:'#F59E0B' },
    { lat:50.61, lng:-2.46, label:'Chesil Bait & Tackle', color:'#F59E0B' },
    { lat:51.38, lng:-2.36, label:'Bath Angling', color:'#F59E0B' },
  ];

  useEffect(() => {
    if (leafletMap.current) return;
    const L = window.L;
    if (!L) return;

    leafletMap.current = L.map(mapRef.current, { zoomControl: true, attributionControl: false });
    tileLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.current);
    leafletMap.current.setView([52.5, -1.5], 6);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setLocated(true);
        leafletMap.current.setView([lat, lng], 12);
        const pulseIcon = L.divIcon({ className:'', html:`<div style="width:16px;height:16px;background:#3B9EE8;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,158,232,0.3)"></div>`, iconSize:[16,16], iconAnchor:[8,8] });
        userMarker.current = L.marker([lat, lng], { icon: pulseIcon }).addTo(leafletMap.current).bindPopup('📍 Your Location');
      }, () => { leafletMap.current.setView([52.5, -1.5], 6); });
    }

    if (onPinDrop) {
      leafletMap.current.on('click', e => {
        onPinDrop({ lat: e.latlng.lat, lng: e.latlng.lng });
        const dropIcon = L.divIcon({ className:'', html:`<div style="width:20px;height:20px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`, iconSize:[20,20], iconAnchor:[10,10] });
        pinMarkers.current.forEach(m => leafletMap.current.removeLayer(m));
        pinMarkers.current = [L.marker([e.latlng.lat, e.latlng.lng], { icon: dropIcon }).addTo(leafletMap.current).bindPopup('📍 Catch location')];
      });
    }

    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMap.current) return;
    if (tileLayer.current) { leafletMap.current.removeLayer(tileLayer.current); }
    if (mapView === 'Satellite') {
      tileLayer.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom:19 }).addTo(leafletMap.current);
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom:19, opacity:0.8 }).addTo(leafletMap.current);
    } else {
      tileLayer.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(leafletMap.current);
    }
  }, [mapView]);

  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMap.current || onPinDrop) return;
    pinMarkers.current.forEach(m => leafletMap.current.removeLayer(m));
    pinMarkers.current = [];
    const makeIcon = color => L.divIcon({ className:'', html:`<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`, iconSize:[14,14], iconAnchor:[7,7] });
    const addPins = (pins) => pins.forEach(p => { pinMarkers.current.push(L.marker([p.lat,p.lng],{icon:makeIcon(p.color)}).addTo(leafletMap.current).bindPopup(p.label)); });
    if (pinMode==='my') addPins(MY_PINS);
    else if (pinMode==='community') addPins(COMMUNITY_PINS);
    else if (pinMode==='shops') addPins(TACKLE_SHOPS);
  }, [pinMode, onPinDrop]);

  const resetHome = () => {
    if (leafletMap.current && userPos) leafletMap.current.setView([userPos.lat, userPos.lng], 12);
    else if (leafletMap.current) leafletMap.current.setView([52.5,-1.5],6);
  };

  return (
    <div>
      {showControls && (
        <div className="map-controls">
          <div className="map-top-row">
            <div className="map-toggle-group">
              {['Map','Satellite'].map(v => (
                <button key={v} className={`map-toggle-btn${mapView===v?' active':''}`} onClick={() => setMapView(v)}>{v}</button>
              ))}
            </div>
            <button className="map-home-btn" onClick={resetHome}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Reset
            </button>
            {located && <span style={{fontSize:12,color:'var(--blue)',fontWeight:600}}>📍 Located</span>}
          </div>
          {!onPinDrop && (
            <div className="pin-filter-row">
              {[['my','My Pins'],['community','Community'],['blank','Blank'],['shops','Tackle Shops']].map(([val,label]) => (
                <button key={val} className={`pin-filter-btn${pinMode===val?' active':''}`} onClick={() => setPinMode(val)}>{label}</button>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={mapRef} style={{height, width:'100%', borderRadius:20, overflow:'hidden', border:'1px solid var(--light)', boxShadow:'var(--shadow)'}} />
    </div>
  );
}

// ── TIDE ─────────────────────────────────────────────────────────────────
function TideSection() {
  const [tides, setTides] = useState(null);
  const [location, setLocation] = useState('Locating...');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function gen(loc) {
      const pad = n => String(n).padStart(2,'0');
      const fmt = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const base = new Date(); base.setHours(2,18,0);
      setLocation(loc);
      setTides([
        { type:'High', time:fmt(base), height:'4.1m', icon:'🌊' },
        { type:'Low', time:fmt(new Date(base.getTime()+6*3600000+12*60000)), height:'0.9m', icon:'🏖️' },
        { type:'High', time:fmt(new Date(base.getTime()+12*3600000+24*60000)), height:'4.3m', icon:'🌊' },
        { type:'Low', time:fmt(new Date(base.getTime()+18*3600000+36*60000)), height:'0.7m', icon:'🏖️' },
      ]);
      setLoading(false);
    }
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => { gen(p.coords.latitude > 53 ? 'Northern England' : 'Southern England'); }, () => gen('Southampton'));
    else gen('Southampton');
  }, []);
  return (
    <div className="tide-card">
      <div className="tide-header"><div className="tide-title">🌊 Today's Tides</div><div className="tide-location">📍 {location}</div></div>
      {loading ? <div className="tide-loading">Fetching tide times...</div> : (
        <div className="tide-times">{tides.map((t,i) => <div className="tide-time" key={i}><div className="tide-icon">{t.icon}</div><div><div className="tide-type">{t.type}</div><div className="tide-val">{t.time}</div><div className="tide-height">{t.height}</div></div></div>)}</div>
      )}
    </div>
  );
}

// ── CUSTOM DROPDOWN ───────────────────────────────────────────────────────
function CustomDropdown({ label, options, value, onChange, groupLabel }) {
  const [custom, setCustom] = useState('');
  const [extras, setExtras] = useState([]);
  const addCustom = () => { if (custom.trim()) { setExtras(e=>[...e,custom.trim()]); onChange(custom.trim()); setCustom(''); } };
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">Select {label.toLowerCase()}…</option>
        {groupLabel && <optgroup label={groupLabel[0]}>{options[0].map(o=><option key={o}>{o}</option>)}</optgroup>}
        {groupLabel && <optgroup label={groupLabel[1]}>{options[1].map(o=><option key={o}>{o}</option>)}</optgroup>}
        {!groupLabel && options.map(o=><option key={o}>{o}</option>)}
        {extras.map(o=><option key={o}>{o}</option>)}
      </select>
      <div className="add-custom-row">
        <input className="form-input" placeholder={`Add your own ${label.toLowerCase()}…`} value={custom} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustom()} />
        <button className="btn-add" onClick={addCustom}>+ Add</button>
      </div>
      {extras.length>0&&<div className="custom-tags">{extras.map(e=><span className="custom-tag" key={e}>{e}<span className="custom-tag-x" onClick={()=>setExtras(ex=>ex.filter(x=>x!==e))}>×</span></span>)}</div>}
    </div>
  );
}

// ── SCREENS ───────────────────────────────────────────────────────────────
function HomeScreen({ onLog }) {
  return <div>
    <div className="hero">
      <div className="hero-eyebrow">Sea & River Fishing · England</div>
      <div className="hero-title">CATCH<span>BASE</span></div>
      <div className="hero-subtitle">Log catches, discover marks, and connect with anglers across England.</div>
      <div className="hero-stats">
        <div><div className="hero-stat-val">2,847</div><div className="hero-stat-label">Catches logged</div></div>
        <div><div className="hero-stat-val">614</div><div className="hero-stat-label">Marks mapped</div></div>
        <div><div className="hero-stat-val">1,203</div><div className="hero-stat-label">Anglers</div></div>
      </div>
    </div>
    <TideSection />
    <div className="section-header"><span className="section-title">Recent Catches</span><span className="section-link">See all →</span></div>
    <div className="cards-row">
      {RECENT_CATCHES.map(c=><div className="catch-card" key={c.id}><div className="catch-card-img-wrap"><FishImg species={c.species} className="catch-card-img"/></div><div className="catch-card-body"><div className="catch-card-species">{c.species}</div><div className="catch-card-weight">{c.weight}</div><div className="catch-card-meta">📍 {c.location}<br/>🕐 {c.date}</div></div></div>)}
    </div>
    <div className="section-header" style={{paddingTop:20}}><span className="section-title">Quick Actions</span></div>
    <div className="quick-actions">
      <button className="btn-primary" onClick={onLog}>+ Log Catch</button>
      <button className="btn-secondary">📍 Add Spot</button>
    </div>
    <div style={{height:16}}/>
  </div>;
}

function FeedScreen() {
  const [posts, setPosts] = useState(FEED_POSTS);
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Community Feed</span><span className="section-link">Following</span></div>
    {posts.map(p=><div className="feed-post" key={p.id}>
      <div className="feed-post-header"><div className="feed-avatar">{p.avatar}</div><div><div className="feed-username">{p.user}</div><div className="feed-location">📍 {p.location}</div></div><div className="feed-badge">{p.weight} {p.species}</div></div>
      <div className="feed-img-area"><FishImg species={p.species} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
      <div className="feed-post-body"><div className="feed-post-text">{p.text}</div><div className="feed-tags">{p.tags.map(t=><span key={t} className="feed-tag">#{t}</span>)}</div></div>
      <div className="feed-actions">
        <button className={`feed-action${p.liked?' liked':''}`} onClick={()=>setPosts(ps=>ps.map(pp=>pp.id===p.id?{...pp,liked:!pp.liked,likes:pp.liked?pp.likes-1:pp.likes+1}:pp))}>
          <svg fill={p.liked?'#EF4444':'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{p.likes}
        </button>
        <button className="feed-action"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>{p.comments}</button>
        <button className="feed-action"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>
      </div>
    </div>)}
  </div>;
}

function MapScreen() {
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Fishing Marks</span><span className="section-link">+ Add</span></div>
    <div className="map-controls" style={{paddingTop:0}}/>
    <div className="map-wrap">
      <LeafletMap height="420px" pinFilter="my" showControls={true} />
    </div>
    <div className="section-header" style={{paddingTop:20}}><span className="section-title">Nearby Spots</span></div>
    <div className="spot-list">
      {SPOTS.map((s,i)=><div className="spot-item" key={i}><div className="spot-icon">{s.emoji}</div><div><div className="spot-name">{s.name}</div><div className="spot-meta">{s.type} · {s.fish}</div></div><div className="spot-dist">{s.dist}</div></div>)}
    </div>
    <div style={{height:16}}/>
  </div>;
}

function LogScreen({ onSaved }) {
  const [form, setForm] = useState({ species:'', weight_lb:'', weight_oz:'', bait:'', location:'', notes:'', privacy:'Approximate' });
  const [pin, setPin] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Log a Catch</span></div>
    <div className="log-form">
      <CustomDropdown label="Species" options={[SEA_SPECIES,RIVER_SPECIES]} groupLabel={['🌊 Sea Species','🏞️ River & Coarse Species']} value={form.species} onChange={v=>set('species',v)}/>
      <div className="form-group">
        <label className="form-label">Weight</label>
        <div className="weight-row">
          <input className="form-input" placeholder="lb" value={form.weight_lb} onChange={e=>set('weight_lb',e.target.value)}/>
          <div className="weight-unit">lb</div>
          <input className="form-input" placeholder="oz" value={form.weight_oz} onChange={e=>set('weight_oz',e.target.value)}/>
          <div className="weight-unit">oz</div>
        </div>
      </div>
      <CustomDropdown label="Bait" options={[SEA_BAITS,RIVER_BAITS]} groupLabel={['🌊 Sea Baits','🏞️ River & Coarse Baits']} value={form.bait} onChange={v=>set('bait',v)}/>
      <div className="form-group"><label className="form-label">Location name</label><input className="form-input" placeholder="e.g. Chesil Beach, West Bay" value={form.location} onChange={e=>set('location',e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Conditions, rig setup, anything worth remembering…" value={form.notes} onChange={e=>set('notes',e.target.value)}/></div>
      <div className="form-group">
        <label className="form-label">Pin your catch location</label>
        <div className="privacy-toggle">
          {['Approximate','Precise Pin'].map(opt=><div key={opt} className={`privacy-opt${form.privacy===opt?' active':''}`} onClick={()=>set('privacy',opt)}>{opt==='Approximate'?'🔒 Approximate (~2mi)':'📍 Precise Pin'}</div>)}
        </div>
        <div className="log-map">
          <LeafletMap height="240px" onPinDrop={setPin} showControls={false}/>
        </div>
        {pin && <div className="map-picker-hint" style={{color:'var(--blue)',fontWeight:600}}>📍 Pin dropped at {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</div>}
        {!pin && <div className="map-picker-hint">{form.privacy==='Approximate'?'🔒 Your exact spot will be blurred to ~2 miles':'📍 Tap the map to drop your pin'}</div>}
      </div>
      <button className="btn-primary" style={{width:'100%'}} onClick={()=>{if(form.species&&form.weight_lb)onSaved();}}>Save Catch</button>
      <div style={{height:16}}/>
    </div>
  </div>;
}

function TackleScreen() {
  const [categories, setCategories] = useState(INITIAL_TACKLE);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', brand:'', price:'', purchaseDate:'', purchaseWhere:'', comments:'' });
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState({ name:'', emoji:'' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cat = categories.find(c=>c.id===selectedCat);
  const item = cat?.items.find(i=>i.id===selectedItem);

  const saveNewItem = () => {
    if (!newItem.name) return;
    const it = { id:Date.now().toString(), ...newItem, price:newItem.price?newItem.price:'', catches:[] };
    setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:[...c.items,it]}:c));
    setNewItem({ name:'', brand:'', price:'', purchaseDate:'', purchaseWhere:'', comments:'' });
    setShowAddItem(false);
  };

  const saveEdit = () => {
    setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:c.items.map(i=>i.id===selectedItem?{...i,...editItem}:i)}:c));
    setEditing(false);
  };

  const deleteItem = () => {
    setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:c.items.filter(i=>i.id!==selectedItem)}:c));
    setSelectedItem(null); setConfirmDelete(false);
  };

  const saveNewCat = () => {
    if (!newCat.name) return;
    setCategories(cs=>[...cs,{ id:Date.now().toString(), name:newCat.name, emoji:newCat.emoji||'📦', items:[] }]);
    setNewCat({ name:'', emoji:'' }); setShowAddCat(false);
  };

  const formStyle = { background:'var(--white)', borderRadius:18, padding:20, boxShadow:'var(--shadow)', border:'1px solid var(--light)', marginTop:16 };

  // Item detail
  if (selectedItem && cat && item) {
    if (editing) {
      return <div>
        <button className="back-btn" onClick={()=>setEditing(false)}>← Cancel Edit</button>
        <div className="item-detail">
          <div style={formStyle}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Edit {item.name}</div>
            {[['name','Name'],['brand','Brand'],['price','Price paid (£)'],['purchaseDate','Date of purchase'],['purchaseWhere','Purchased from']].map(([k,l])=>
              <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" value={editItem[k]||''} onChange={e=>setEditItem(ei=>({...ei,[k]:e.target.value}))}/></div>
            )}
            <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" value={editItem.comments||''} onChange={e=>setEditItem(ei=>({...ei,comments:e.target.value}))}/></div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setEditing(false)}>Cancel</button>
              <button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>;
    }
    return <div>
      <button className="back-btn" onClick={()=>{setSelectedItem(null);setConfirmDelete(false);}}>← Back to {cat.name}</button>
      <div className="item-detail">
        <div className="item-detail-img-wrap"><div className="item-detail-img-emoji">{cat.emoji}</div></div>
        <div className="item-detail-header">
          <div>
            <div className="item-detail-name">{item.name}</div>
            <div className="item-detail-brand">{item.brand}</div>
            {item.price && <div className="item-detail-price">£{item.price}</div>}
            {item.purchaseDate && <div className="item-detail-meta">📅 Purchased: {item.purchaseDate}</div>}
            {item.purchaseWhere && <div className="item-detail-meta">🏪 From: {item.purchaseWhere}</div>}
          </div>
          <button className="edit-btn" onClick={()=>{setEditItem({...item});setEditing(true);}}>Edit</button>
        </div>
        {item.comments && <div className="item-detail-comments">💬 {item.comments}</div>}
        <div className="detail-section">
          <div className="detail-section-title">Catches with this item</div>
          {item.catches.length===0&&<div style={{fontSize:14,color:'var(--mid)',padding:'12px 0'}}>No catches logged yet.</div>}
          {item.catches.map((c,i)=><div className="catch-history-item" key={i}><div className="catch-history-img-wrap"><FishImg species={c.species} className="catch-history-img"/></div><div><div className="catch-history-species">{c.species}</div><div className="catch-history-meta">{c.date}</div></div><div className="catch-history-weight">{c.weight}</div></div>)}
        </div>
        {confirmDelete
          ? <div style={{background:'#FEF2F2',border:'2px solid #EF4444',borderRadius:14,padding:16,marginTop:24,textAlign:'center'}}>
              <div style={{fontSize:15,fontWeight:700,color:'#EF4444',marginBottom:12}}>Delete {item.name}?</div>
              <div style={{fontSize:13,color:'var(--mid)',marginBottom:16}}>This cannot be undone.</div>
              <div style={{display:'flex',gap:10}}>
                <button className="btn-secondary" style={{flex:1,padding:'12px'}} onClick={()=>setConfirmDelete(false)}>Cancel</button>
                <button style={{flex:1,padding:'12px',background:'#EF4444',color:'white',border:'none',borderRadius:12,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'Inter,sans-serif'}} onClick={deleteItem}>Delete</button>
              </div>
            </div>
          : <button className="delete-btn" onClick={()=>setConfirmDelete(true)}>🗑 Delete Item</button>
        }
        <div style={{height:16}}/>
      </div>
    </div>;
  }

  // Category view
  if (selectedCat && cat) {
    return <div>
      <button className="back-btn" onClick={()=>{setSelectedCat(null);setShowAddItem(false);}}>← Back to Tackle Box</button>
      <div className="section-header" style={{paddingTop:4}}><span className="section-title">{cat.emoji} {cat.name}</span></div>
      <div className="item-grid">
        {cat.items.map(it=><div className="item-card" key={it.id} onClick={()=>setSelectedItem(it.id)}>
          <div className="item-card-img-wrap"><div className="item-card-img-emoji">{cat.emoji}</div></div>
          <div className="item-card-body"><div className="item-card-name">{it.name}</div><div className="item-card-brand">{it.brand}</div>{it.price&&<div className="item-card-price">£{it.price}</div>}</div>
        </div>)}
        <div className="add-item-card" onClick={()=>setShowAddItem(true)}><span>➕</span><p>Add Item</p></div>
      </div>
      {showAddItem&&<div style={{padding:'0 16px'}}><div style={formStyle}>
        <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Add New Item</div>
        {[['name','Name','e.g. Daiwa Ninja X'],['brand','Brand','e.g. Daiwa'],['price','Price paid (£)','e.g. 89.99'],['purchaseDate','Date of purchase','e.g. 12 Mar 2024'],['purchaseWhere','Purchased from','e.g. Angling Direct']].map(([k,l,p])=>
          <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" placeholder={p} value={newItem[k]} onChange={e=>setNewItem(n=>({...n,[k]:e.target.value}))}/></div>
        )}
        <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" placeholder="Any notes about this item…" value={newItem.comments} onChange={e=>setNewItem(n=>({...n,comments:e.target.value}))}/></div>
        <div style={{display:'flex',gap:10}}>
          <button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setShowAddItem(false)}>Cancel</button>
          <button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveNewItem}>Save</button>
        </div>
      </div></div>}
      <div style={{height:16}}/>
    </div>;
  }

  // Main grid
  return <div>
    <div className="section-header" style={{paddingTop:24}}>
      <span className="section-title">Tackle Box</span>
      <button onClick={()=>setShowAddCat(true)} style={{background:'none',border:'none',fontSize:24,color:'var(--blue)',cursor:'pointer',padding:'0 4px',lineHeight:1,fontWeight:300}}>+</button>
    </div>
    <div className="tackle-grid">
      {categories.map(c=><div className="tackle-cat" key={c.id} onClick={()=>setSelectedCat(c.id)}>
        <div className="tackle-emoji">{c.emoji}</div>
        <div className="tackle-name">{c.name}</div>
        <div className="tackle-count">{c.items.length} item{c.items.length!==1?'s':''}</div>
        <div className="tackle-bar"><div className="tackle-bar-fill" style={{width:`${Math.min(100,(c.items.length/8)*100)}%`}}/></div>
      </div>)}
    </div>
    {showAddCat&&<div style={{padding:'16px 16px 0'}}><div style={formStyle}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Add New Category</div>
      <div className="form-group"><label className="form-label">Category name</label><input className="form-input" placeholder="e.g. Clothing, Kayak Gear" value={newCat.name} onChange={e=>setNewCat(n=>({...n,name:e.target.value}))}/></div>
      <div className="form-group"><label className="form-label">Emoji icon</label><input className="form-input" placeholder="e.g. 👕" value={newCat.emoji} onChange={e=>setNewCat(n=>({...n,emoji:e.target.value}))}/></div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setShowAddCat(false)}>Cancel</button>
        <button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveNewCat}>Save</button>
      </div>
    </div></div>}
    <div style={{height:16}}/>
  </div>;
}

function StatsScreen({ sessions }) {
  const [view, setView] = useState('main');
  const ALL_CATCHES = [
    { id:1, species:'Sea Bass', weight:'4lb 8oz', location:'Chesil Beach', date:'10 Jun 2025', bait:'Ragworm' },
    { id:2, species:'Cod', weight:'6lb 14oz', location:'Whitby Pier', date:'9 Jun 2025', bait:'Peeler Crab' },
    { id:3, species:'Mackerel', weight:'1lb 2oz', location:'Brighton Pier', date:'8 Jun 2025', bait:'Feathers' },
    { id:4, species:'Pollock', weight:'3lb 6oz', location:'Lyme Regis', date:'5 Jun 2025', bait:'Lures' },
    { id:5, species:'Smoothhound', weight:'8lb 4oz', location:'Chesil Beach', date:'1 Jun 2025', bait:'Peeler Crab' },
    { id:6, species:'Brown Trout', weight:'2lb 8oz', location:'River Itchen', date:'28 May 2025', bait:'Flies' },
  ];

  if (view==='catches') return <div>
    <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">All Catches</span></div>
    <div className="catches-grid">
      {ALL_CATCHES.map(c=><div className="catch-drill-card" key={c.id}>
        <div className="catch-drill-img"><FishImg species={c.species} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
        <div className="catch-drill-body"><div className="catch-drill-species">{c.species}</div><div className="catch-drill-weight">{c.weight}</div><div className="catch-drill-meta">📍 {c.location}<br/>🕐 {c.date}</div></div>
      </div>)}
    </div><div style={{height:16}}/>
  </div>;

  if (view==='species') {
    const sp = [...new Set(ALL_CATCHES.map(c=>c.species))];
    return <div>
      <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
      <div className="section-header" style={{paddingTop:4}}><span className="section-title">Species Caught</span></div>
      <div className="catches-grid">
        {sp.map(s=>{const count=ALL_CATCHES.filter(c=>c.species===s).length; return <div className="catch-drill-card" key={s}>
          <div className="catch-drill-img"><FishImg species={s} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
          <div className="catch-drill-body"><div className="catch-drill-species">{s}</div><div className="catch-drill-weight">{count} catch{count!==1?'es':''}</div></div>
        </div>;})}
      </div><div style={{height:16}}/>
    </div>;
  }

  if (view==='sessions') return <div>
    <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">Sessions</span></div>
    <div className="sessions-list">
      {sessions.map((s,i)=><div className="session-row" key={i}>
        <div className="session-icon">🎣</div>
        <div><div className="session-name">{s.location||'Unknown location'}</div><div className="session-meta">{s.date}</div></div>
        <div className="session-count">{s.catches} catch{s.catches!==1?'es':''}</div>
      </div>)}
      {sessions.length===0&&<div style={{padding:'20px 0',fontSize:14,color:'var(--mid)'}}>No sessions yet — log a catch to get started!</div>}
    </div><div style={{height:16}}/>
  </div>;

  return <div>
    <div className="profile-header"><div className="profile-avatar">🎣</div><div><div className="profile-name">Matt Clarke</div><div className="profile-since">Angling since 2019</div><div className="profile-badge">⭐ Verified Angler</div></div></div>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">This Season</span></div>
    <div className="stats-grid">
      <div className="stat-card" onClick={()=>setView('catches')}><div className="stat-num">{ALL_CATCHES.length}</div><div className="stat-label">Total Catches ›</div></div>
      <div className="stat-card" onClick={()=>setView('species')}><div className="stat-num">{[...new Set(ALL_CATCHES.map(c=>c.species))].length}</div><div className="stat-label">Species Caught ›</div></div>
      <div className="stat-card"><div className="stat-num">3.8</div><div className="stat-label">Avg Weight (lb)</div></div>
      <div className="stat-card" onClick={()=>setView('sessions')}><div className="stat-num">{sessions.length||18}</div><div className="stat-label">Sessions ›</div></div>
    </div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Personal Bests</span></div>
    <div className="pb-list">
      {PBS.map((pb,i)=><div className="pb-row" key={i}><div className="pb-left"><FishImg species={pb.species} className="pb-fish-img"/><span className="pb-species">{pb.species}</span></div><div className="pb-weight">{pb.weight}</div></div>)}
    </div><div style={{height:16}}/>
  </div>;
}

// ── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  { id:'home', label:'Home', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:'feed', label:'Feed', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id:'map', label:'Map', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
  { id:'log', label:'Log', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id:'tackle', label:'Tackle', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { id:'stats', label:'Stats', icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

// ── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [sessions, setSessions] = useState([
    { location:'Chesil Beach', date:'1 Jun 2025', catches:3 },
    { location:'Whitby Pier', date:'28 May 2025', catches:2 },
  ]);

  useEffect(() => {
    const L = window.L;
    if (!L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);
    }
  }, []);

  const triggerToast = msg => { setToast(msg); setShowToast(true); setTimeout(()=>setShowToast(false),2500); };

  const handleSaveCatch = (catchData) => {
    const today = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    const loc = catchData?.location || 'Unknown location';
    setSessions(prev => {
      const existing = prev.find(s => s.date === today && s.location === loc);
      if (existing) return prev.map(s => s.date===today && s.location===loc ? {...s, catches: s.catches+1} : s);
      return [{ location:loc, date:today, catches:1 }, ...prev];
    });
    triggerToast('🐟 Catch saved!');
    setScreen('home');
  };

  const renderScreen = () => {
    switch(screen) {
      case 'home':   return <HomeScreen onLog={()=>setScreen('log')}/>;
      case 'feed':   return <FeedScreen/>;
      case 'map':    return <MapScreen/>;
      case 'log':    return <LogScreen onSaved={handleSaveCatch}/>;
      case 'tackle': return <TackleScreen/>;
      case 'stats':  return <StatsScreen sessions={sessions}/>;
      default:       return <HomeScreen/>;
    }
  };

  return <>
    <style>{styles}</style>
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-logo">CATCH<span>BASE</span></div>
        {NAV.map(n=><button key={n.id} className={`sidebar-item${screen===n.id?' active':''}`} onClick={()=>setScreen(n.id)}>{n.icon}{n.label}</button>)}
        <div className="sidebar-version">CatchBase · Sea & River</div>
      </nav>
      <div className="main-content">{renderScreen()}</div>
      <nav className="bottom-nav">
        {NAV.map(n=><button key={n.id} className={`nav-item${screen===n.id?' active':''}`} onClick={()=>setScreen(n.id)}>{n.icon}{n.label}</button>)}
      </nav>
      <div className={`toast${showToast?' show':''}`}>{toast}</div>
    </div>
  </>;
}
