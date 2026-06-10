import React, { useState, useEffect, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #F8F7F4;
    --white:   #FFFFFF;
    --teal:    #00D4AA;
    --teal2:   #00B894;
    --dark:    #1A1A1F;
    --mid:     #6B7280;
    --light:   #E5E7EB;
    --shadow:  0 2px 12px rgba(0,0,0,0.08);
    --shadow2: 0 4px 24px rgba(0,0,0,0.12);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--dark); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .screen { flex: 1; overflow-y: auto; padding-bottom: 90px; background: var(--bg); }

  /* NAV */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--white); border-top: 1px solid var(--light);
    display: flex; z-index: 100;
    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
    box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 6px 0; cursor: pointer; border: none;
    background: none; color: var(--mid); font-family: 'Inter', sans-serif;
    font-size: 11px; font-weight: 500; transition: color 0.2s;
  }
  .nav-item.active { color: var(--teal); }
  .nav-item svg { width: 22px; height: 22px; }

  /* HERO */
  .hero {
    background: linear-gradient(150deg, #00D4AA 0%, #00B894 100%);
    padding: 48px 24px 36px; position: relative; overflow: hidden;
  }
  .hero::after {
    content: ''; position: absolute; bottom: -30px; left: -10%; right: -10%;
    height: 60px; background: var(--bg); border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }
  .hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 10px; }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px,13vw,80px); line-height: 0.92; color: white; letter-spacing: 0.01em; }
  .hero-title span { color: rgba(255,255,255,0.6); }
  .hero-subtitle { margin-top: 12px; font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.6; max-width: 300px; }
  .hero-stats { display: flex; gap: 28px; margin-top: 28px; }
  .hero-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: white; line-height: 1; }
  .hero-stat-label { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 2px; }

  /* TIDE CARD */
  .tide-card {
    margin: 32px 16px 0;
    background: var(--white); border-radius: 20px;
    box-shadow: var(--shadow); overflow: hidden;
  }
  .tide-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px 12px; border-bottom: 1px solid var(--light);
  }
  .tide-title { font-size: 14px; font-weight: 700; color: var(--dark); }
  .tide-location { font-size: 12px; color: var(--teal); font-weight: 600; }
  .tide-times { display: flex; padding: 4px 0; }
  .tide-time {
    flex: 1; padding: 12px 18px; display: flex; align-items: center; gap: 12px;
    border-right: 1px solid var(--light);
  }
  .tide-time:last-child { border-right: none; }
  .tide-icon { font-size: 22px; }
  .tide-type { font-size: 11px; color: var(--mid); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .tide-val { font-size: 16px; font-weight: 700; color: var(--dark); margin-top: 1px; }
  .tide-height { font-size: 12px; color: var(--teal); font-weight: 600; }
  .tide-loading { padding: 20px 18px; font-size: 14px; color: var(--mid); text-align: center; }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 18px 12px; }
  .section-title { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); }
  .section-link { font-size: 13px; color: var(--teal); font-weight: 600; cursor: pointer; }

  /* CATCH CARDS */
  .cards-row { display: flex; gap: 12px; padding: 0 16px 4px; overflow-x: auto; }
  .cards-row::-webkit-scrollbar { display: none; }
  .catch-card {
    flex-shrink: 0; width: 165px; background: var(--white);
    border-radius: 16px; overflow: hidden; box-shadow: var(--shadow);
    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--light);
  }
  .catch-card:hover { transform: translateY(-2px); box-shadow: var(--shadow2); }
  .catch-card-img { width: 100%; height: 100px; display: flex; align-items: center; justify-content: center; font-size: 44px; }
  .catch-card-body { padding: 12px; }
  .catch-card-species { font-size: 14px; font-weight: 700; color: var(--dark); }
  .catch-card-weight { font-size: 13px; color: var(--teal); font-weight: 600; margin-top: 2px; }
  .catch-card-meta { font-size: 11px; color: var(--mid); margin-top: 6px; line-height: 1.5; }

  /* QUICK ACTIONS */
  .quick-actions { display: flex; gap: 10px; padding: 0 16px; }
  .btn-primary {
    flex: 1; padding: 16px; border: none; border-radius: 14px;
    background: var(--teal); color: white;
    font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif;
    cursor: pointer; transition: background 0.2s, transform 0.1s;
    box-shadow: 0 4px 16px rgba(0,212,170,0.3);
  }
  .btn-primary:hover { background: var(--teal2); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-secondary {
    flex: 1; padding: 16px; border: 2px solid var(--teal); border-radius: 14px;
    background: white; color: var(--teal);
    font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(0,212,170,0.05); }

  /* FEED */
  .feed-post {
    margin: 0 16px 14px; background: var(--white);
    border-radius: 20px; overflow: hidden; box-shadow: var(--shadow);
    border: 1px solid var(--light);
  }
  .feed-post-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
  .feed-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), #0055AA);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .feed-username { font-size: 15px; font-weight: 700; color: var(--dark); }
  .feed-location { font-size: 12px; color: var(--mid); margin-top: 1px; }
  .feed-badge {
    margin-left: auto; font-size: 11px; font-weight: 700;
    padding: 5px 10px; border-radius: 20px;
    background: rgba(0,212,170,0.1); color: var(--teal);
    border: 1px solid rgba(0,212,170,0.2); white-space: nowrap;
  }
  .feed-img-area {
    width: 100%; height: 180px; background: #E8F8F5;
    display: flex; align-items: center; justify-content: center; font-size: 72px;
  }
  .feed-post-body { padding: 14px 16px; }
  .feed-post-text { font-size: 14px; line-height: 1.6; color: var(--dark); }
  .feed-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .feed-tag { font-size: 12px; color: var(--teal); padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(0,212,170,0.3); background: rgba(0,212,170,0.05); }
  .feed-actions { display: flex; border-top: 1px solid var(--light); }
  .feed-action {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 13px; cursor: pointer; border: none; background: none;
    color: var(--mid); font-size: 13px; font-weight: 600;
    font-family: 'Inter', sans-serif; transition: color 0.2s;
  }
  .feed-action:hover { color: var(--teal); }
  .feed-action.liked { color: #EF4444; }
  .feed-action svg { width: 17px; height: 17px; }

  /* MAP */
  .map-container { margin: 0 16px 16px; border-radius: 20px; overflow: hidden; border: 1px solid var(--light); height: 320px; box-shadow: var(--shadow); position: relative; }
  .map-container iframe { width: 100%; height: 100%; border: none; display: block; }
  .map-filters { display: flex; gap: 8px; padding: 0 16px 16px; flex-wrap: wrap; }
  .map-pill {
    font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 20px;
    border: 2px solid var(--light); background: var(--white); color: var(--mid);
    cursor: pointer; transition: all 0.2s;
  }
  .map-pill.active { border-color: var(--teal); color: var(--teal); background: rgba(0,212,170,0.05); }

  .spot-list { padding: 0 16px; }
  .spot-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid var(--light);
  }
  .spot-icon { width: 46px; height: 46px; border-radius: 14px; background: rgba(0,212,170,0.1); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .spot-name { font-size: 15px; font-weight: 600; color: var(--dark); }
  .spot-meta { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .spot-dist { font-size: 13px; color: var(--teal); font-weight: 700; margin-left: auto; white-space: nowrap; }

  /* LOG FORM */
  .log-form { padding: 0 16px; }
  .form-label { font-size: 13px; font-weight: 700; color: var(--dark); margin-bottom: 8px; display: block; }
  .form-group { margin-bottom: 20px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--white); border: 2px solid var(--light);
    border-radius: 12px; padding: 14px 16px; color: var(--dark);
    font-size: 15px; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s; -webkit-appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--teal); }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--mid); }
  .form-textarea { resize: none; height: 90px; line-height: 1.6; }
  .form-select option { background: white; color: var(--dark); }

  .add-custom-row { display: flex; gap: 8px; margin-top: 8px; }
  .add-custom-row .form-input { flex: 1; padding: 12px 14px; font-size: 14px; }
  .btn-add {
    padding: 12px 16px; border: 2px solid var(--teal); border-radius: 12px;
    background: rgba(0,212,170,0.08); color: var(--teal); font-size: 14px;
    font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; white-space: nowrap;
    transition: all 0.2s;
  }
  .btn-add:hover { background: rgba(0,212,170,0.15); }

  .custom-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .custom-tag {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; padding: 5px 12px; border-radius: 20px;
    background: rgba(0,212,170,0.1); color: var(--teal);
    border: 1px solid rgba(0,212,170,0.3); font-weight: 600;
  }
  .custom-tag-x { cursor: pointer; font-size: 16px; line-height: 1; color: var(--mid); }

  .weight-row { display: flex; gap: 10px; }
  .weight-row .form-input { flex: 1; }
  .weight-unit {
    width: 56px; background: var(--light); border: 2px solid var(--light);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: var(--mid);
  }

  .privacy-toggle { display: flex; background: var(--light); border-radius: 12px; overflow: hidden; padding: 4px; gap: 4px; }
  .privacy-opt {
    flex: 1; padding: 11px 8px; text-align: center; cursor: pointer;
    font-size: 13px; font-weight: 600; color: var(--mid);
    transition: all 0.2s; border-radius: 9px;
  }
  .privacy-opt.active { background: var(--white); color: var(--teal); box-shadow: var(--shadow); }

  .map-picker { margin-top: 12px; border-radius: 14px; overflow: hidden; border: 2px solid var(--teal); height: 220px; position: relative; }
  .map-picker iframe { width: 100%; height: 100%; border: none; display: block; }
  .map-picker-hint { font-size: 12px; color: var(--mid); margin-top: 6px; text-align: center; }

  /* TACKLE BOX */
  .tackle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .tackle-cat {
    background: var(--white); border: 2px solid var(--light);
    border-radius: 18px; padding: 18px; cursor: pointer;
    transition: all 0.2s; box-shadow: var(--shadow);
  }
  .tackle-cat:hover { border-color: var(--teal); transform: translateY(-2px); box-shadow: var(--shadow2); }
  .tackle-emoji { font-size: 30px; margin-bottom: 10px; }
  .tackle-name { font-size: 15px; font-weight: 700; color: var(--dark); }
  .tackle-count { font-size: 12px; color: var(--mid); margin-top: 3px; font-weight: 500; }
  .tackle-bar { height: 4px; background: var(--light); border-radius: 2px; margin-top: 14px; }
  .tackle-bar-fill { height: 100%; border-radius: 2px; background: var(--teal); }

  /* TACKLE CATEGORY VIEW */
  .back-btn {
    display: flex; align-items: center; gap: 8px; padding: 20px 16px 8px;
    cursor: pointer; border: none; background: none;
    font-size: 15px; font-weight: 600; color: var(--teal); font-family: 'Inter', sans-serif;
  }
  .item-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .item-card {
    background: var(--white); border: 2px solid var(--light);
    border-radius: 16px; overflow: hidden; cursor: pointer;
    transition: all 0.2s; box-shadow: var(--shadow);
  }
  .item-card:hover { border-color: var(--teal); transform: translateY(-2px); }
  .item-card-img { width: 100%; height: 90px; display: flex; align-items: center; justify-content: center; font-size: 40px; background: #F0FDF9; }
  .item-card-body { padding: 10px 12px; }
  .item-card-name { font-size: 14px; font-weight: 700; color: var(--dark); }
  .item-card-brand { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .item-card-price { font-size: 13px; color: var(--teal); font-weight: 700; margin-top: 4px; }

  .add-item-card {
    background: rgba(0,212,170,0.05); border: 2px dashed rgba(0,212,170,0.4);
    border-radius: 16px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; min-height: 160px;
    cursor: pointer; transition: all 0.2s; gap: 8px;
  }
  .add-item-card:hover { background: rgba(0,212,170,0.1); }
  .add-item-card span { font-size: 28px; }
  .add-item-card p { font-size: 13px; font-weight: 700; color: var(--teal); }

  /* ITEM DETAIL */
  .item-detail { padding: 0 16px; }
  .item-detail-img { width: 100%; height: 180px; border-radius: 18px; background: #F0FDF9; display: flex; align-items: center; justify-content: center; font-size: 80px; margin-bottom: 20px; border: 2px solid var(--light); }
  .item-detail-name { font-size: 22px; font-weight: 800; color: var(--dark); }
  .item-detail-brand { font-size: 14px; color: var(--mid); margin-top: 4px; }
  .item-detail-price { font-size: 20px; font-weight: 700; color: var(--teal); margin-top: 10px; }
  .detail-section { margin-top: 24px; }
  .detail-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mid); margin-bottom: 12px; }
  .catch-history-item {
    display: flex; align-items: center; gap: 12px; padding: 12px;
    background: var(--white); border-radius: 12px; margin-bottom: 8px;
    border: 1px solid var(--light); box-shadow: var(--shadow);
  }
  .catch-history-emoji { font-size: 28px; }
  .catch-history-species { font-size: 15px; font-weight: 700; color: var(--dark); }
  .catch-history-meta { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .catch-history-weight { font-size: 14px; font-weight: 700; color: var(--teal); margin-left: auto; white-space: nowrap; }

  /* STATS */
  .profile-header { display: flex; align-items: center; gap: 16px; padding: 20px 16px 24px; }
  .profile-avatar {
    width: 68px; height: 68px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), #0055AA);
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; flex-shrink: 0;
    box-shadow: 0 0 0 4px rgba(0,212,170,0.2);
  }
  .profile-name { font-size: 22px; font-weight: 800; color: var(--dark); }
  .profile-since { font-size: 13px; color: var(--mid); margin-top: 2px; }
  .profile-badge { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: rgba(0,212,170,0.1); color: var(--teal); border: 1px solid rgba(0,212,170,0.3); }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .stat-card { background: var(--white); border: 1px solid var(--light); border-radius: 16px; padding: 20px 16px; text-align: center; box-shadow: var(--shadow); }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--teal); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--mid); margin-top: 4px; font-weight: 600; }

  .pb-list { padding: 0 16px; margin-top: 4px; }
  .pb-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--light); }
  .pb-species { font-size: 15px; font-weight: 600; color: var(--dark); }
  .pb-weight { font-size: 14px; font-weight: 700; color: var(--teal); }

  /* TOAST */
  .toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: var(--teal); color: white; font-weight: 700; font-size: 15px;
    padding: 14px 28px; border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,212,170,0.4);
    opacity: 0; transition: opacity 0.3s, transform 0.3s;
    pointer-events: none; white-space: nowrap; z-index: 999;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--light); border-radius: 2px; }
`;

// ── DATA ──────────────────────────────────────────────────────────────────
const SEA_SPECIES = ['Sea Bass','Cod','Mackerel','Pollock','Flounder','Plaice','Whiting','Dogfish','Conger Eel','Smoothhound','Bull Huss','Wrasse','Grey Mullet','Dab','Turbot','Thornback Ray','Black Bream','Garfish','Coalfish','Pouting'];
const RIVER_SPECIES = ['Brown Trout','Sea Trout','Atlantic Salmon','Barbel','Chub','Roach','Dace','Grayling','Pike','Perch','Tench','Bream','Rudd','Carp'];
const SEA_BAITS = ['Ragworm','Lugworm','Mackerel Strip','Squid','Sandeel','Peeler Crab','Hermit Crab','Mussel','Limpet','Feathers','Lures / Spinners','Plugs','Soft Plastics'];
const RIVER_BAITS = ['Maggots','Casters','Worm','Bread','Pellets','Boilies','Corn','Hemp','Paste','Spoons','Flies'];

const RECENT_CATCHES = [
  { id:1, species:'Sea Bass', weight:'4lb 8oz', emoji:'🐟', location:'Chesil Beach', date:'Today', bg:'#E8F8F5' },
  { id:2, species:'Cod', weight:'6lb 14oz', emoji:'🦈', location:'Whitby Pier', date:'Yesterday', bg:'#FFF8E8' },
  { id:3, species:'Mackerel', weight:'1lb 2oz', emoji:'🐠', location:'Brighton Pier', date:'2 days ago', bg:'#E8F0F8' },
  { id:4, species:'Pollock', weight:'3lb 6oz', emoji:'🐡', location:'Lyme Regis', date:'3 days ago', bg:'#F8EBE8' },
];

const FEED_POSTS = [
  { id:1, user:'SouthCoastSam', avatar:'🎣', location:'Chesil Beach, Dorset', emoji:'🐟', weight:'7lb 2oz', species:'Sea Bass', text:'Incredible dawn session at Chesil this morning. Used ragworm on a running leger rig — took about 40 minutes but absolutely worth the wait. Biggest bass of the year!', tags:['SeaBass','ChesilBeach','Ragworm'], likes:54, comments:18, liked:false },
  { id:2, user:'NorthSeaNick', avatar:'🦅', location:'Whitby Pier, Yorkshire', emoji:'🦈', weight:'9lb 4oz', species:'Cod', text:'Winter cod are back at Whitby! Peeler crab fished on the sea bed just off the pier end. Three fish in two hours — this is what it\'s all about.', tags:['CodFishing','Whitby','PeelerCrab'], likes:92, comments:37, liked:true },
];

const SPOTS = [
  { name:'Chesil Beach', type:'Sea — Surf Beach', fish:'Bass, Cod, Dogfish', dist:'4.2mi', emoji:'🌊' },
  { name:'Whitby Pier', type:'Sea — Pier', fish:'Cod, Whiting, Mackerel', dist:'12mi', emoji:'🏗️' },
  { name:'River Itchen', type:'River', fish:'Brown Trout, Grayling', dist:'2.1mi', emoji:'🏞️' },
  { name:'Brighton Marina', type:'Sea — Marina', fish:'Bass, Wrasse, Mullet', dist:'8.7mi', emoji:'⚓' },
];

const TACKLE_CATEGORIES = [
  { id:'rods', name:'Rods', emoji:'🎣', items:[
    { id:'r1', name:'Daiwa Ninja X', brand:'Daiwa', price:'£89.99', emoji:'🎣', catches:[{ species:'Sea Bass', weight:'4lb 8oz', date:'12 Jun 2025', emoji:'🐟' },{ species:'Pollock', weight:'2lb 4oz', date:'3 Mar 2025', emoji:'🐠' }] },
    { id:'r2', name:'Shakespeare Ugly Stik', brand:'Shakespeare', price:'£54.99', emoji:'🎣', catches:[{ species:'Cod', weight:'5lb 0oz', date:'8 Jan 2025', emoji:'🦈' }] },
  ]},
  { id:'reels', name:'Reels', emoji:'⚙️', items:[
    { id:'re1', name:'Shimano Baitrunner DL', brand:'Shimano', price:'£129.99', emoji:'⚙️', catches:[] },
  ]},
  { id:'terminal', name:'Terminal', emoji:'🪝', items:[] },
  { id:'bait', name:'Bait', emoji:'🧪', items:[] },
  { id:'floats', name:'Floats', emoji:'🔴', items:[] },
  { id:'other', name:'Other', emoji:'🎒', items:[] },
];

const PBS = [
  { species:'Sea Bass', weight:'7lb 2oz', emoji:'🐟' },
  { species:'Cod', weight:'9lb 4oz', emoji:'🦈' },
  { species:'Mackerel', weight:'1lb 14oz', emoji:'🐠' },
  { species:'Pollock', weight:'4lb 8oz', emoji:'🐡' },
  { species:'Smoothhound', weight:'11lb 6oz', emoji:'🦈' },
  { species:'Brown Trout', weight:'3lb 2oz', emoji:'🐟' },
  { species:'Pike', weight:'14lb 8oz', emoji:'🦈' },
  { species:'Barbel', weight:'8lb 12oz', emoji:'🐟' },
];

// ── TIDE COMPONENT ────────────────────────────────────────────────────────
function TideSection() {
  const [tides, setTides] = useState(null);
  const [location, setLocation] = useState('Locating...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use WorldTides API-style simulation with realistic tide data
    // based on geolocation. In production this would call a real tide API.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Determine rough UK location name
          let loc = 'Your Location';
          if (latitude > 53) loc = 'Northern England';
          else if (latitude > 51.5 && longitude < -1) loc = 'South West England';
          else if (latitude > 51.5) loc = 'South East England';
          else loc = 'Southern England';
          setLocation(loc);

          // Generate realistic tide times based on current time
          const now = new Date();
          const h = now.getHours();
          const tideData = generateTides(now);
          setTides(tideData);
          setLoading(false);
        },
        () => {
          setLocation('Southampton');
          setTides(generateTides(new Date()));
          setLoading(false);
        }
      );
    } else {
      setLocation('Southampton');
      setTides(generateTides(new Date()));
      setLoading(false);
    }
  }, []);

  function generateTides(now) {
    const pad = n => String(n).padStart(2,'0');
    const fmt = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const h = now.getHours();
    // Simulate 4 tides across the day (roughly every 6h 12min)
    const base = new Date(now); base.setHours(2, 18, 0);
    const t = [
      { type:'High', time: fmt(base), height:'4.1m', icon:'🌊' },
      { type:'Low',  time: fmt(new Date(base.getTime() + 6*3600000 + 12*60000)), height:'0.9m', icon:'🏖️' },
      { type:'High', time: fmt(new Date(base.getTime() + 12*3600000 + 24*60000)), height:'4.3m', icon:'🌊' },
      { type:'Low',  time: fmt(new Date(base.getTime() + 18*3600000 + 36*60000)), height:'0.7m', icon:'🏖️' },
    ];
    return t;
  }

  return (
    <div className="tide-card">
      <div className="tide-header">
        <div className="tide-title">🌊 Today's Tides</div>
        <div className="tide-location">📍 {location}</div>
      </div>
      {loading ? (
        <div className="tide-loading">Fetching tide times...</div>
      ) : (
        <div className="tide-times">
          {tides.map((t,i) => (
            <div className="tide-time" key={i}>
              <div className="tide-icon">{t.icon}</div>
              <div>
                <div className="tide-type">{t.type}</div>
                <div className="tide-val">{t.time}</div>
                <div className="tide-height">{t.height}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SCREENS ───────────────────────────────────────────────────────────────
function HomeScreen({ onLog }) {
  return (
    <div className="screen">
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

      <div className="section-header" style={{ paddingTop: 20 }}>
        <span className="section-title">Quick Actions</span>
      </div>
      <div className="quick-actions">
        <button className="btn-primary" onClick={onLog}>+ Log Catch</button>
        <button className="btn-secondary">📍 Add Spot</button>
      </div>
      <div style={{height:16}}/>
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
            <button className={`feed-action${p.liked?' liked':''}`} onClick={() => setPosts(ps => ps.map(pp => pp.id===p.id ? {...pp, liked:!pp.liked, likes:pp.liked?pp.likes-1:pp.likes+1} : pp))}>
              <svg fill={p.liked?'#EF4444':'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
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
  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Fishing Marks</span>
        <span className="section-link">+ Add</span>
      </div>
      <div className="map-container">
        <iframe title="Map" sandbox="allow-scripts allow-same-origin" src="https://www.openstreetmap.org/export/embed.html?bbox=-2.5,51.3,0.3,52.8&layer=mapnik" loading="lazy"/>
      </div>
      <div className="map-filters">
        {['All','Sea','Rivers','Piers','Beaches'].map(f => (
          <button key={f} className={`map-pill${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
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

function CustomDropdown({ label, options, value, onChange, groupLabel }) {
  const [custom, setCustom] = useState('');
  const [extras, setExtras] = useState([]);

  const addCustom = () => {
    if (custom.trim() && !extras.includes(custom.trim())) {
      setExtras(e => [...e, custom.trim()]);
      onChange(custom.trim());
      setCustom('');
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select {label.toLowerCase()}…</option>
        {groupLabel && <optgroup label={groupLabel[0]}>{options[0].map(o => <option key={o}>{o}</option>)}</optgroup>}
        {groupLabel && <optgroup label={groupLabel[1]}>{options[1].map(o => <option key={o}>{o}</option>)}</optgroup>}
        {!groupLabel && options.map(o => <option key={o}>{o}</option>)}
        {extras.map(o => <option key={o}>{o}</option>)}
      </select>
      <div className="add-custom-row">
        <input className="form-input" placeholder={`Add your own ${label.toLowerCase()}…`} value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => e.key==='Enter' && addCustom()} />
        <button className="btn-add" onClick={addCustom}>+ Add</button>
      </div>
      {extras.length > 0 && (
        <div className="custom-tags">
          {extras.map(e => (
            <span className="custom-tag" key={e}>{e} <span className="custom-tag-x" onClick={() => setExtras(ex => ex.filter(x => x!==e))}>×</span></span>
          ))}
        </div>
      )}
    </div>
  );
}

function LogScreen({ onSaved }) {
  const [form, setForm] = useState({ species:'', weight_lb:'', weight_oz:'', bait:'', location:'', notes:'', privacy:'Approximate' });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Log a Catch</span>
      </div>
      <div className="log-form">
        <CustomDropdown
          label="Species"
          options={[SEA_SPECIES, RIVER_SPECIES]}
          groupLabel={['🌊 Sea Species','🏞️ River & Coarse Species']}
          value={form.species}
          onChange={v => set('species', v)}
        />
        <div className="form-group">
          <label className="form-label">Weight</label>
          <div className="weight-row">
            <input className="form-input" placeholder="lb" value={form.weight_lb} onChange={e => set('weight_lb', e.target.value)} />
            <div className="weight-unit">lb</div>
            <input className="form-input" placeholder="oz" value={form.weight_oz} onChange={e => set('weight_oz', e.target.value)} />
            <div className="weight-unit">oz</div>
          </div>
        </div>
        <CustomDropdown
          label="Bait"
          options={[SEA_BAITS, RIVER_BAITS]}
          groupLabel={['🌊 Sea Baits','🏞️ River & Coarse Baits']}
          value={form.bait}
          onChange={v => set('bait', v)}
        />
        <div className="form-group">
          <label className="form-label">Location name</label>
          <input className="form-input" placeholder="e.g. Chesil Beach, West Bay" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Conditions, rig setup, anything worth remembering…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location privacy</label>
          <div className="privacy-toggle">
            {['Approximate','Precise Pin'].map(opt => (
              <div key={opt} className={`privacy-opt${form.privacy===opt?' active':''}`} onClick={() => set('privacy', opt)}>
                {opt==='Approximate' ? '🔒 Approximate (~2mi)' : '📍 Precise Pin'}
              </div>
            ))}
          </div>
          {form.privacy==='Precise Pin' && (
            <>
              <div className="map-picker">
                <iframe
                  title="Pin location"
                  sandbox="allow-scripts allow-same-origin"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-5,50,2,55&layer=mapnik"
                  loading="lazy"
                />
              </div>
              <div className="map-picker-hint">Tap the map to drop your pin at the exact catch location</div>
            </>
          )}
        </div>
        <button className="btn-primary" style={{width:'100%'}} onClick={() => { if(form.species && form.weight_lb) onSaved(); }}>Save Catch</button>
        <div style={{height:16}}/>
      </div>
    </div>
  );
}

function TackleScreen() {
  const [categories, setCategories] = useState(TACKLE_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name:'', brand:'', price:'' });

  const cat = categories.find(c => c.id === selectedCat);

  const saveNewItem = () => {
    if (!newItem.name) return;
    const item = { id: Date.now().toString(), name: newItem.name, brand: newItem.brand, price: newItem.price ? `£${newItem.price}` : 'Price not set', emoji: cat.emoji, catches: [] };
    setCategories(cs => cs.map(c => c.id===selectedCat ? {...c, items:[...c.items, item]} : c));
    setNewItem({ name:'', brand:'', price:'' });
    setShowAddItem(false);
  };

  // Item detail view
  if (selectedItem) {
    const item = cat.items.find(i => i.id === selectedItem);
    return (
      <div className="screen">
        <button className="back-btn" onClick={() => setSelectedItem(null)}>← Back to {cat.name}</button>
        <div className="item-detail">
          <div className="item-detail-img">{item.emoji}</div>
          <div className="item-detail-name">{item.name}</div>
          <div className="item-detail-brand">{item.brand}</div>
          <div className="item-detail-price">{item.price}</div>
          <div className="detail-section">
            <div className="detail-section-title">Catches on this {cat.name.slice(0,-1)}</div>
            {item.catches.length === 0 && <div style={{fontSize:14,color:'var(--mid)',padding:'12px 0'}}>No catches logged with this item yet.</div>}
            {item.catches.map((c,i) => (
              <div className="catch-history-item" key={i}>
                <div className="catch-history-emoji">{c.emoji}</div>
                <div>
                  <div className="catch-history-species">{c.species}</div>
                  <div className="catch-history-meta">{c.date}</div>
                </div>
                <div className="catch-history-weight">{c.weight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Category item grid view
  if (selectedCat) {
    return (
      <div className="screen">
        <button className="back-btn" onClick={() => { setSelectedCat(null); setShowAddItem(false); }}>← Back to Tackle Box</button>
        <div className="section-header" style={{paddingTop:4}}>
          <span className="section-title">{cat.emoji} {cat.name}</span>
        </div>
        <div className="item-grid">
          {cat.items.map(item => (
            <div className="item-card" key={item.id} onClick={() => setSelectedItem(item.id)}>
              <div className="item-card-img">{item.emoji}</div>
              <div className="item-card-body">
                <div className="item-card-name">{item.name}</div>
                <div className="item-card-brand">{item.brand}</div>
                <div className="item-card-price">{item.price}</div>
              </div>
            </div>
          ))}
          <div className="add-item-card" onClick={() => setShowAddItem(true)}>
            <span>➕</span>
            <p>Add {cat.name.slice(0,-1)}</p>
          </div>
        </div>

        {showAddItem && (
          <div style={{padding:'20px 16px 0'}}>
            <div style={{background:'var(--white)',borderRadius:18,padding:20,boxShadow:'var(--shadow)',border:'1px solid var(--light)'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:16,color:'var(--dark)'}}>Add New {cat.name.slice(0,-1)}</div>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="e.g. Daiwa Ninja X" value={newItem.name} onChange={e => setNewItem(n=>({...n,name:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" placeholder="e.g. Daiwa" value={newItem.brand} onChange={e => setNewItem(n=>({...n,brand:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Price paid (£)</label>
                <input className="form-input" placeholder="e.g. 89.99" value={newItem.price} onChange={e => setNewItem(n=>({...n,price:e.target.value}))} />
              </div>
              <div style={{display:'flex',gap:10}}>
                <button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={() => setShowAddItem(false)}>Cancel</button>
                <button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveNewItem}>Save</button>
              </div>
            </div>
          </div>
        )}
        <div style={{height:16}}/>
      </div>
    );
  }

  // Main tackle grid
  return (
    <div className="screen">
      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Tackle Box</span>
      </div>
      <div className="tackle-grid">
        {categories.map(cat => (
          <div className="tackle-cat" key={cat.id} onClick={() => setSelectedCat(cat.id)}>
            <div className="tackle-emoji">{cat.emoji}</div>
            <div className="tackle-name">{cat.name}</div>
            <div className="tackle-count">{cat.items.length} item{cat.items.length!==1?'s':''}</div>
            <div className="tackle-bar">
              <div className="tackle-bar-fill" style={{width:`${Math.min(100,(cat.items.length/8)*100)}%`}}/>
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
      <div className="section-header" style={{paddingTop:4}}>
        <span className="section-title">This Season</span>
      </div>
      <div className="stats-grid">
        {[{val:'47',label:'Total Catches'},{val:'11',label:'Species Caught'},{val:'3.8',label:'Avg Weight (lb)'},{val:'18',label:'Sessions'}].map((s,i) => (
          <div className="stat-card" key={i}><div className="stat-num">{s.val}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="section-header" style={{paddingTop:24}}>
        <span className="section-title">Personal Bests</span>
      </div>
      <div className="pb-list">
        {PBS.map((pb,i) => (
          <div className="pb-row" key={i}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20}}>{pb.emoji}</span>
              <span className="pb-species">{pb.species}</span>
            </div>
            <div className="pb-weight">{pb.weight}</div>
          </div>
        ))}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

// ── NAV ICONS ─────────────────────────────────────────────────────────────
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

  const triggerToast = msg => { setToast(msg); setShowToast(true); setTimeout(() => setShowToast(false), 2500); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {screen==='home'   && <HomeScreen onLog={() => setScreen('log')} />}
        {screen==='feed'   && <FeedScreen />}
        {screen==='map'    && <MapScreen />}
        {screen==='log'    && <LogScreen onSaved={() => { triggerToast('🐟 Catch saved!'); setScreen('home'); }} />}
        {screen==='tackle' && <TackleScreen />}
        {screen==='stats'  && <StatsScreen />}
        <nav className="bottom-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-item${screen===n.id?' active':''}`} onClick={() => setScreen(n.id)}>
              {n.icon}{n.label}
            </button>
          ))}
        </nav>
        <div className={`toast${showToast?' show':''}`}>{toast}</div>
      </div>
    </>
  );
}
