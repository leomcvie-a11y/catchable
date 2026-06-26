import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase';

// ── STYLES ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F8F7F4; --white: #FFFFFF; --blue: #3B9EE8; --blue2: #2B8ED8;
    --dark: #1A1A1F; --mid: #6B7280; --light: #E5E7EB; --red: #EF4444;
    --shadow: 0 2px 12px rgba(0,0,0,0.08); --shadow2: 0 4px 24px rgba(0,0,0,0.12);
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--dark); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  /* LOADING */
  .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); gap: 20px; }
  .loading-logo { font-family: 'Bebas Neue', sans-serif; font-size: 56px; color: var(--dark); letter-spacing: 0.02em; }
  .loading-logo span { color: var(--blue); }
  .loading-spinner { width: 32px; height: 32px; border: 3px solid var(--light); border-top-color: var(--blue); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* AUTH */
  .auth-screen { min-height: 100vh; background: linear-gradient(150deg, #3B9EE8 0%, #2B8ED8 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
  .auth-card { background: var(--white); border-radius: 24px; padding: 36px 32px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .auth-logo { font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: var(--dark); text-align: center; letter-spacing: 0.02em; margin-bottom: 4px; }
  .auth-logo span { color: var(--blue); }
  .auth-tagline { font-size: 13px; color: var(--mid); text-align: center; margin-bottom: 32px; font-weight: 500; }
  .auth-tabs { display: flex; background: var(--bg); border-radius: 14px; padding: 4px; gap: 4px; margin-bottom: 24px; }
  .auth-tab { flex: 1; padding: 11px; text-align: center; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--mid); transition: all 0.2s; border: none; background: none; font-family: 'Inter', sans-serif; }
  .auth-tab.active { background: var(--white); color: var(--blue); box-shadow: var(--shadow); }
  .auth-label { font-size: 12px; font-weight: 700; color: var(--mid); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  .auth-input { width: 100%; background: var(--bg); border: 2px solid var(--light); border-radius: 12px; padding: 14px 16px; color: var(--dark); font-size: 15px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; margin-bottom: 14px; -webkit-appearance: none; }
  .auth-input:focus { border-color: var(--blue); }
  .auth-input::placeholder { color: var(--mid); }
  .auth-btn { width: 100%; padding: 16px; border: none; border-radius: 14px; background: var(--blue); color: white; font-size: 16px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 4px; box-shadow: 0 4px 16px rgba(59,158,232,0.35); transition: background 0.2s; }
  .auth-btn:hover { background: var(--blue2); }
  .auth-btn:disabled { background: var(--light); color: var(--mid); box-shadow: none; cursor: not-allowed; }
  .auth-error { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--red); margin-bottom: 16px; font-weight: 500; line-height: 1.5; }
  .auth-success { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #16A34A; margin-bottom: 16px; font-weight: 500; line-height: 1.5; }
  .auth-switch { font-size: 13px; color: var(--mid); text-align: center; margin-top: 20px; }
  .auth-switch span { color: var(--blue); font-weight: 600; cursor: pointer; }

  /* APP LAYOUT */
  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  @media (min-width: 768px) {
    body { background: #ECEAE6; }
    .app { flex-direction: row; }
    .bottom-nav { display: none !important; }
    .sidebar { display: flex !important; }
    .main-content { flex: 1; overflow-y: auto; }
    .page-pad { padding: 0 32px; }
    .section-header { padding: 24px 32px 14px; }
    .cards-row { padding: 0 32px 4px; }
    .tide-card { margin: 32px 32px 0; }
    .hero { padding: 48px 48px 44px; }
    .feed-post { margin: 0 32px 14px; }
    .map-wrap { padding: 0 32px; }
    .map-controls { padding: 0 32px 8px; }
    .spot-list { padding: 0 32px; }
    .stats-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr 1fr; }
    .catches-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr; }
    .tackle-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr; }
    .item-grid { padding: 0 32px; grid-template-columns: 1fr 1fr 1fr; }
    .pb-list { padding: 0 32px; }
    .profile-header { padding: 24px 32px; }
    .back-btn { padding: 20px 32px 8px; }
    .item-detail { padding: 0 32px; }
    .sessions-list { padding: 0 32px; }
  }

  /* SIDEBAR */
  .sidebar { display: none; flex-direction: column; width: 240px; min-width: 240px; background: var(--white); border-right: 1px solid var(--light); padding: 32px 16px 24px; gap: 4px; box-shadow: 2px 0 12px rgba(0,0,0,0.04); }
  .sidebar-logo { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--dark); padding: 0 12px 24px; letter-spacing: 0.02em; }
  .sidebar-logo span { color: var(--blue); }
  .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: none; background: none; color: var(--mid); font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 600; transition: all 0.2s; width: 100%; text-align: left; }
  .sidebar-item svg { width: 20px; height: 20px; flex-shrink: 0; }
  .sidebar-item:hover { background: var(--bg); color: var(--dark); }
  .sidebar-item.active { background: rgba(59,158,232,0.1); color: var(--blue); }
  .sidebar-item.danger { color: var(--red); }
  .sidebar-item.danger:hover { background: #FEF2F2; }
  .sidebar-user { padding: 0 12px 16px; border-bottom: 1px solid var(--light); margin-bottom: 8px; }
  .sidebar-user-name { font-size: 14px; font-weight: 700; color: var(--dark); }
  .sidebar-user-email { font-size: 12px; color: var(--mid); margin-top: 2px; }

  /* BOTTOM NAV */
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: var(--white); border-top: 1px solid var(--light); display: flex; z-index: 100; padding: 8px 0 max(8px, env(safe-area-inset-bottom)); box-shadow: 0 -4px 20px rgba(0,0,0,0.06); }
  .nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0; cursor: pointer; border: none; background: none; color: var(--mid); font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; transition: color 0.2s; }
  .nav-item.active { color: var(--blue); }
  .nav-item svg { width: 22px; height: 22px; }

  .screen { flex: 1; overflow-y: auto; padding-bottom: 120px; background: var(--bg); }
  .main-content { flex: 1; overflow-y: auto; background: var(--bg); padding-bottom: 40px; }

  /* HERO */
  .hero { background: linear-gradient(150deg, #3B9EE8 0%, #2B8ED8 100%); padding: 48px 24px 36px; position: relative; overflow: hidden; }
  .hero::after { content: ''; position: absolute; bottom: -30px; left: -10%; right: -10%; height: 60px; background: var(--bg); border-radius: 50% 50% 0 0 / 100% 100% 0 0; }
  .hero-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 10px; }
  .hero-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 13vw, 80px); line-height: 0.92; color: white; }
  .hero-title span { color: rgba(255,255,255,0.6); }
  .hero-subtitle { margin-top: 12px; font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.6; max-width: 400px; }
  .hero-stats { display: flex; gap: 28px; margin-top: 28px; flex-wrap: wrap; }
  .hero-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: white; line-height: 1; }
  .hero-stat-label { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 2px; }

  /* TIDE & WEATHER */
  .tide-card { margin: 32px 16px 0; background: var(--white); border-radius: 20px; box-shadow: var(--shadow); overflow: hidden; border: 1px solid var(--light); }
  .tide-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--light); }
  .tide-title { font-size: 13px; font-weight: 700; color: var(--dark); }
  .tide-location { font-size: 12px; color: var(--blue); font-weight: 600; }
  .tide-times { display: flex; flex-wrap: wrap; border-bottom: 1px solid var(--light); }
  .tide-time { flex: 1; min-width: 70px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--light); }
  .tide-time:last-child { border-right: none; }
  .tide-type { font-size: 10px; color: var(--mid); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .tide-val { font-size: 15px; font-weight: 700; color: var(--dark); margin-top: 1px; }
  .tide-height { font-size: 11px; color: var(--blue); font-weight: 600; }
  .weather-row { display: flex; }
  .weather-item { flex: 1; padding: 12px 14px; display: flex; align-items: center; gap: 10px; border-right: 1px solid var(--light); }
  .weather-item:last-child { border-right: none; }
  .weather-icon-img { font-size: 20px; flex-shrink: 0; }
  .weather-label { font-size: 10px; color: var(--mid); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .weather-val { font-size: 15px; font-weight: 700; color: var(--dark); margin-top: 1px; }
  .weather-sub { font-size: 11px; color: var(--mid); margin-top: 1px; }
  .tide-loading { padding: 20px; font-size: 14px; color: var(--mid); text-align: center; }

  /* SECTION */
  .section-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 16px 12px; }
  .section-title { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); }
  .section-link { font-size: 13px; color: var(--blue); font-weight: 600; cursor: pointer; border: none; background: none; font-family: 'Inter', sans-serif; }

  /* CATCH CARDS */
  .cards-row { display: flex; gap: 12px; padding: 0 16px 4px; overflow-x: auto; }
  .cards-row::-webkit-scrollbar { display: none; }
  .catch-card { flex-shrink: 0; width: 160px; background: var(--white); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid var(--light); }
  .catch-card:hover { transform: translateY(-2px); box-shadow: var(--shadow2); }
  .catch-card-img-wrap { width: 100%; height: 100px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; }
  .catch-card-img { width: 100%; height: 100%; object-fit: cover; }
  .catch-card-body { padding: 10px 12px; }
  .catch-card-species { font-size: 13px; font-weight: 700; color: var(--dark); }
  .catch-card-weight { font-size: 12px; color: var(--blue); font-weight: 600; margin-top: 2px; }
  .catch-card-meta { font-size: 11px; color: var(--mid); margin-top: 5px; line-height: 1.5; }

  /* EMPTY STATE */
  .empty-state { padding: 40px 24px; text-align: center; }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; line-height: 1; }
  .empty-state-icon svg { width: 48px; height: 48px; color: var(--light); }
  .empty-state-title { font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
  .empty-state-text { font-size: 14px; color: var(--mid); line-height: 1.6; margin-bottom: 24px; max-width: 280px; margin-left: auto; margin-right: auto; }

  /* BUTTONS */
  .btn-primary { padding: 16px 24px; border: none; border-radius: 14px; background: var(--blue); color: white; font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.2s, transform 0.1s; box-shadow: 0 4px 16px rgba(59,158,232,0.3); display: inline-block; }
  .btn-primary:hover { background: var(--blue2); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary.full { width: 100%; text-align: center; }
  .btn-secondary { padding: 16px 24px; border: 2px solid var(--blue); border-radius: 14px; background: white; color: var(--blue); font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; display: inline-block; }
  .btn-secondary:hover { background: rgba(59,158,232,0.05); }
  .quick-actions { display: flex; gap: 10px; padding: 0 16px; }
  .quick-actions .btn-primary, .quick-actions .btn-secondary { flex: 1; text-align: center; }

  /* FEED */
  .feed-tabs { display: flex; margin: 16px 16px 0; background: var(--light); border-radius: 14px; padding: 4px; gap: 4px; }
  .feed-tab { flex: 1; padding: 10px; text-align: center; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--mid); transition: all 0.2s; border: none; background: none; font-family: 'Inter', sans-serif; }
  .feed-tab.active { background: var(--white); color: var(--blue); box-shadow: var(--shadow); }
  /* FEED DESKTOP LAYOUT */
  .feed-layout { max-width: 680px; margin: 0 auto; }
  .feed-post { margin: 0 16px 14px; background: var(--white); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--light); transition: box-shadow 0.2s; }
  .feed-post:hover { box-shadow: var(--shadow2); }
  @media (min-width: 768px) {
    .feed-layout { padding: 0 32px; }
    .feed-post { margin: 0 0 16px; border-radius: 16px; }
    .feed-tabs { margin: 16px 32px 0; }
  }
  .feed-post-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
  .feed-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), #0055AA); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: white; flex-shrink: 0; overflow: hidden; }
  .feed-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .feed-username { font-size: 15px; font-weight: 700; color: var(--dark); }
  .feed-location { font-size: 12px; color: var(--mid); margin-top: 1px; }
  .feed-badge { font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 20px; background: rgba(59,158,232,0.1); color: var(--blue); border: 1px solid rgba(59,158,232,0.2); white-space: nowrap; }
  .dist-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: rgba(59,158,232,0.08); color: var(--blue); border: 1px solid rgba(59,158,232,0.15); }
  .feed-img-area { width: 100%; height: 200px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; }
  .feed-img-area img { width: 100%; height: 100%; object-fit: cover; }
  .feed-post-body { padding: 14px 16px; }
  .feed-post-text { font-size: 14px; line-height: 1.6; color: var(--dark); }
  .feed-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .feed-tag { font-size: 12px; color: var(--blue); padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(59,158,232,0.3); background: rgba(59,158,232,0.05); }
  .feed-actions { display: flex; border-top: 1px solid var(--light); }
  .feed-action { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 13px; cursor: pointer; border: none; background: none; color: var(--mid); font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif; transition: color 0.2s; }
  .feed-action:hover { color: var(--blue); }
  .feed-action.liked { color: var(--red); }
  .feed-action svg { width: 17px; height: 17px; }

  /* MAP */
  .map-wrap { padding: 0 16px; }
  .map-controls { padding: 0 16px 8px; }
  .map-top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
  .map-toggle-group { display: flex; background: var(--white); border: 1px solid var(--light); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow); }
  .map-toggle-btn { padding: 8px 16px; font-size: 13px; font-weight: 600; border: none; background: none; color: var(--mid); cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
  .map-toggle-btn.active { background: var(--blue); color: white; }
  .map-home-btn { padding: 8px 14px; font-size: 13px; font-weight: 600; border: 2px solid var(--light); border-radius: 20px; background: var(--white); color: var(--mid); cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: var(--shadow); transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
  .map-home-btn:hover { border-color: var(--blue); color: var(--blue); }
  .pin-filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .pin-filter-btn { padding: 7px 14px; font-size: 12px; font-weight: 600; border: 2px solid var(--light); border-radius: 20px; background: var(--white); color: var(--mid); cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
  .pin-filter-btn.active { border-color: var(--blue); color: var(--blue); background: rgba(59,158,232,0.05); }
  .spot-list { padding: 0 16px; }
  .spot-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--light); }
  .spot-icon { width: 44px; height: 44px; border-radius: 14px; background: rgba(59,158,232,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .spot-icon svg { width: 20px; height: 20px; color: var(--blue); }
  .spot-name { font-size: 15px; font-weight: 600; color: var(--dark); }
  .spot-meta { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .spot-dist { font-size: 13px; color: var(--blue); font-weight: 700; margin-left: auto; white-space: nowrap; }

  /* FORMS */
  .page-pad { padding: 0 16px; }
  .form-label { font-size: 13px; font-weight: 700; color: var(--dark); margin-bottom: 8px; display: block; }
  .form-group { margin-bottom: 20px; }
  .form-input, .form-select, .form-textarea { width: 100%; background: var(--white); border: 2px solid var(--light); border-radius: 12px; padding: 14px 16px; color: var(--dark); font-size: 15px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; -webkit-appearance: none; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--blue); }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--mid); }
  .form-textarea { resize: none; height: 90px; line-height: 1.6; }
  .weight-row { display: flex; gap: 10px; }
  .weight-row .form-input { flex: 1; }
  .weight-unit { width: 56px; background: var(--light); border: 2px solid var(--light); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--mid); }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* SEARCH DROPDOWN */
  .search-dropdown { position: relative; }
  .search-dropdown-wrap { position: relative; }
  .search-icon-pos { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--mid); pointer-events: none; }
  .search-dropdown-input { width: 100%; background: var(--white); border: 2px solid var(--light); border-radius: 12px; padding: 14px 40px; color: var(--dark); font-size: 15px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; -webkit-appearance: none; }
  .search-dropdown-input:focus { border-color: var(--blue); }
  .search-dropdown-input::placeholder { color: var(--mid); }
  .search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--mid); font-size: 20px; line-height: 1; padding: 2px; }
  .dropdown-list { background: var(--white); border: 2px solid var(--blue); border-radius: 12px; margin-top: 4px; max-height: 220px; overflow-y: auto; box-shadow: var(--shadow2); z-index: 50; position: relative; }
  .dropdown-group-label { padding: 8px 14px 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mid); background: var(--bg); border-bottom: 1px solid var(--light); }
  .dropdown-item { padding: 12px 14px; font-size: 14px; color: var(--dark); cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--light); }
  .dropdown-item:last-child { border-bottom: none; }
  .dropdown-item:hover, .dropdown-item.selected { background: rgba(59,158,232,0.08); color: var(--blue); font-weight: 600; }
  .selected-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(59,158,232,0.1); border: 1px solid rgba(59,158,232,0.3); border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--blue); margin-top: 8px; }
  .selected-badge-x { cursor: pointer; font-size: 18px; color: var(--mid); line-height: 1; background: none; border: none; }

  /* PHOTO UPLOAD */
  .photo-upload { border: 2px dashed var(--light); border-radius: 14px; overflow: hidden; cursor: pointer; transition: border-color 0.2s; }
  .photo-upload:hover { border-color: var(--blue); }
  .photo-upload-empty { padding: 28px 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .photo-upload-icon svg { width: 32px; height: 32px; color: var(--blue); }
  .photo-upload-text { font-size: 14px; font-weight: 600; color: var(--blue); }
  .photo-upload-sub { font-size: 12px; color: var(--mid); }
  .photo-preview { position: relative; width: 100%; height: 200px; }
  .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
  .photo-remove { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }

  /* PRIVACY TOGGLE */
  .privacy-toggle { display: flex; background: var(--light); border-radius: 12px; padding: 4px; gap: 4px; }
  .privacy-opt { flex: 1; padding: 11px 8px; text-align: center; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--mid); transition: all 0.2s; border-radius: 9px; }
  .privacy-opt.active { background: var(--white); color: var(--blue); box-shadow: var(--shadow); }
  .circle-slider { margin-top: 12px; }
  .circle-slider-label { font-size: 12px; color: var(--mid); font-weight: 600; display: flex; justify-content: space-between; margin-bottom: 6px; }
  .circle-slider input[type=range] { width: 100%; accent-color: var(--blue); }
  .log-map { border-radius: 14px; overflow: hidden; border: 2px solid var(--blue); margin-top: 12px; position: relative; z-index: 1; }
  .map-hint { font-size: 12px; color: var(--mid); margin-top: 6px; text-align: center; }
  .map-hint.confirmed { color: var(--blue); font-weight: 600; }

  /* TACKLE */
  .tackle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .tackle-cat { background: var(--white); border: 2px solid var(--light); border-radius: 18px; padding: 18px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow); }
  .tackle-cat:hover { border-color: var(--blue); transform: translateY(-2px); box-shadow: var(--shadow2); }
  .tackle-cat-img { width: 100%; height: 80px; border-radius: 10px; overflow: hidden; margin-bottom: 12px; background: #E8F4FD; display: flex; align-items: center; justify-content: center; }
  .tackle-cat-img img { width: 100%; height: 100%; object-fit: cover; }
  .tackle-name { font-size: 15px; font-weight: 700; color: var(--dark); }
  .tackle-count { font-size: 12px; color: var(--mid); margin-top: 3px; }
  .tackle-bar { height: 4px; background: var(--light); border-radius: 2px; margin-top: 14px; }
  .tackle-bar-fill { height: 100%; border-radius: 2px; background: var(--blue); }
  .add-dashed { background: rgba(59,158,232,0.04); border: 2px dashed rgba(59,158,232,0.3); border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 130px; cursor: pointer; transition: all 0.2s; gap: 8px; }
  .add-dashed:hover { background: rgba(59,158,232,0.08); }
  .add-dashed-text { font-size: 13px; font-weight: 600; color: var(--blue); }
  .back-btn { display: flex; align-items: center; gap: 8px; padding: 20px 16px 8px; cursor: pointer; border: none; background: none; font-size: 15px; font-weight: 600; color: var(--blue); font-family: 'Inter', sans-serif; }
  .back-btn svg { width: 18px; height: 18px; }
  .item-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .item-card { background: var(--white); border: 2px solid var(--light); border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow); }
  .item-card:hover { border-color: var(--blue); transform: translateY(-2px); }
  .item-card-img { width: 100%; height: 100px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; }
  .item-card-img img { width: 100%; height: 100%; object-fit: cover; }
  .item-card-img svg { width: 36px; height: 36px; color: var(--blue); opacity: 0.4; }
  .item-card-body { padding: 10px 12px; }
  .item-card-name { font-size: 14px; font-weight: 700; color: var(--dark); }
  .item-card-brand { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .item-card-price { font-size: 13px; color: var(--blue); font-weight: 700; margin-top: 4px; }
  .item-detail { padding: 0 16px; }
  .item-detail-img { width: 100%; height: 220px; border-radius: 18px; background: #E8F4FD; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 2px solid var(--light); overflow: hidden; }
  .item-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .item-detail-img svg { width: 64px; height: 64px; color: var(--blue); opacity: 0.3; }
  .item-detail-row { display: flex; align-items: flex-start; justify-content: space-between; }
  .item-detail-name { font-size: 22px; font-weight: 800; color: var(--dark); }
  .item-detail-brand { font-size: 14px; color: var(--mid); margin-top: 4px; }
  .item-detail-price { font-size: 20px; font-weight: 700; color: var(--blue); margin-top: 8px; }
  .item-detail-meta { font-size: 13px; color: var(--mid); margin-top: 4px; display: flex; align-items: center; gap: 6px; }
  .item-detail-comments { background: var(--bg); border-radius: 12px; padding: 14px; margin-top: 12px; font-size: 14px; color: var(--dark); line-height: 1.6; border: 1px solid var(--light); }
  .edit-btn { padding: 9px 18px; border: 2px solid var(--blue); border-radius: 20px; background: white; color: var(--blue); font-size: 13px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; }
  .delete-btn { width: 100%; padding: 13px; border: 2px solid var(--red); border-radius: 12px; background: white; color: var(--red); font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 12px; }
  .catch-history-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--white); border-radius: 12px; margin-bottom: 8px; border: 1px solid var(--light); }
  .catch-history-img { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .catch-history-img img { width: 100%; height: 100%; object-fit: cover; }
  .catch-history-species { font-size: 15px; font-weight: 700; color: var(--dark); }
  .catch-history-meta { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .catch-history-weight { font-size: 14px; font-weight: 700; color: var(--blue); margin-left: auto; white-space: nowrap; }
  .detail-section { margin-top: 24px; }
  .detail-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--mid); margin-bottom: 12px; }
  .confirm-delete-box { background: #FEF2F2; border: 2px solid #FECACA; border-radius: 14px; padding: 16px; margin-top: 20px; text-align: center; }
  .confirm-delete-title { font-size: 15px; font-weight: 700; color: var(--red); margin-bottom: 12px; }
  .confirm-delete-btns { display: flex; gap: 10px; }

  /* STATS */
  .profile-header { display: flex; align-items: center; gap: 16px; padding: 20px 16px 24px; }
  .profile-avatar { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), #0055AA); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: white; flex-shrink: 0; box-shadow: 0 0 0 4px rgba(59,158,232,0.2); overflow: hidden; }
  .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .profile-name { font-size: 22px; font-weight: 800; color: var(--dark); }
  .profile-since { font-size: 13px; color: var(--mid); margin-top: 2px; }
  .profile-badge { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: rgba(59,158,232,0.1); color: var(--blue); border: 1px solid rgba(59,158,232,0.3); }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .stat-card { background: var(--white); border: 1px solid var(--light); border-radius: 16px; padding: 20px 16px; text-align: center; box-shadow: var(--shadow); cursor: pointer; transition: all 0.2s; }
  .stat-card:hover { border-color: var(--blue); transform: translateY(-2px); }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--blue); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--mid); margin-top: 4px; font-weight: 600; }
  .pb-list { padding: 0 16px; margin-top: 4px; }
  .pb-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--light); }
  .pb-left { display: flex; align-items: center; gap: 10px; }
  .pb-fish-img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; background: #E8F4FD; flex-shrink: 0; }
  .pb-species { font-size: 15px; font-weight: 600; color: var(--dark); }
  .pb-weight { font-size: 14px; font-weight: 700; color: var(--blue); }
  .catches-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px; }
  .catch-drill-card { background: var(--white); border: 2px solid var(--light); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); }
  .catch-drill-img { width: 100%; height: 90px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; }
  .catch-drill-img img { width: 100%; height: 100%; object-fit: cover; }
  .catch-drill-body { padding: 10px 12px; }
  .catch-drill-species { font-size: 14px; font-weight: 700; color: var(--dark); }
  .catch-drill-weight { font-size: 13px; color: var(--blue); font-weight: 600; margin-top: 2px; }
  .catch-drill-meta { font-size: 11px; color: var(--mid); margin-top: 4px; line-height: 1.5; }
  .sessions-list { padding: 0 16px; }
  .session-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--light); }
  .session-icon { width: 44px; height: 44px; border-radius: 14px; background: rgba(59,158,232,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .session-icon svg { width: 20px; height: 20px; color: var(--blue); }
  .session-name { font-size: 15px; font-weight: 600; color: var(--dark); }
  .session-meta { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .session-count { font-size: 13px; color: var(--blue); font-weight: 700; margin-left: auto; white-space: nowrap; }

  /* ACCOUNT */
  .account-avatar-section { display: flex; flex-direction: column; align-items: center; padding: 28px 16px 20px; }
  .account-avatar-btn { width: 90px; height: 90px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), #0055AA); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; color: white; overflow: hidden; box-shadow: 0 0 0 4px rgba(59,158,232,0.2); cursor: pointer; border: none; }
  .account-avatar-btn img { width: 100%; height: 100%; object-fit: cover; }
  .account-avatar-label { font-size: 13px; color: var(--blue); font-weight: 600; margin-top: 10px; cursor: pointer; }
  .account-inner { max-width: 520px; margin: 0 auto; padding: 0 16px; }
  .account-section-title { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); padding: 20px 0 12px; }
  .account-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .account-field-group { margin-bottom: 12px; }
  .account-field-label { font-size: 12px; font-weight: 700; color: var(--dark); display: block; margin-bottom: 6px; }
  .account-input { width: 100%; background: var(--white); border: 2px solid var(--light); border-radius: 10px; padding: 12px 14px; color: var(--dark); font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; -webkit-appearance: none; }
  .account-input:focus { border-color: var(--blue); }
  .account-input::placeholder { color: var(--mid); }
  .account-textarea { width: 100%; background: var(--white); border: 2px solid var(--light); border-radius: 10px; padding: 12px 14px; color: var(--dark); font-size: 14px; font-family: 'Inter', sans-serif; outline: none; resize: none; height: 80px; line-height: 1.6; transition: border-color 0.2s; }
  .account-textarea:focus { border-color: var(--blue); }
  .account-save-btn { display: block; padding: 14px 32px; border: none; border-radius: 14px; background: var(--blue); color: white; font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 8px; box-shadow: 0 4px 16px rgba(59,158,232,0.3); transition: background 0.2s; }
  .account-save-btn:hover { background: var(--blue2); }
  .account-logout-btn { display: block; padding: 13px 32px; border: 2px solid var(--red); border-radius: 14px; background: white; color: var(--red); font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 12px; transition: all 0.2s; }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--light); }
  .toggle-label { font-size: 15px; font-weight: 500; color: var(--dark); }
  .toggle-sub { font-size: 12px; color: var(--mid); margin-top: 2px; }
  .toggle-btn { width: 48px; height: 26px; border-radius: 13px; cursor: pointer; transition: background 0.2s; border: none; position: relative; flex-shrink: 0; }
  .toggle-btn.on { background: var(--blue); }
  .toggle-btn.off { background: var(--light); }
  .toggle-knob { width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 3px; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .toggle-btn.on .toggle-knob { left: 25px; }
  .toggle-btn.off .toggle-knob { left: 3px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
  .modal { background: var(--white); border-radius: 24px 24px 0 0; padding: 24px; width: 100%; max-width: 600px; max-height: 85vh; overflow-y: auto; }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-size: 18px; font-weight: 800; color: var(--dark); }
  .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--mid); line-height: 1; }

  /* TOAST */
  /* FEED PREVIEW */
  .feed-preview-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .feed-preview-inner { background: var(--white); border-radius: 24px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
  .feed-preview-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--light); }
  .feed-preview-title { font-size: 16px; font-weight: 700; color: var(--dark); }

  /* PUBLISH TOGGLE */
  .publish-toggle { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; background: var(--white); border: 2px solid var(--light); border-radius: 14px; margin-bottom: 20px; cursor: pointer; transition: border-color 0.2s; }
  .publish-toggle.on { border-color: var(--blue); background: rgba(59,158,232,0.04); }
  .publish-toggle-label { font-size: 14px; font-weight: 600; color: var(--dark); }
  .publish-toggle-sub { font-size: 12px; color: var(--mid); margin-top: 2px; }

  /* CATCH DETAIL */
  .catch-detail-img { width: 100%; height: 240px; border-radius: 16px; overflow: hidden; background: #E8F4FD; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .catch-detail-img img { width: 100%; height: 100%; object-fit: cover; }
  .catch-detail-row { display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--light); }
  .catch-detail-label { font-size: 12px; font-weight: 700; color: var(--mid); text-transform: uppercase; letter-spacing: 0.06em; width: 80px; flex-shrink: 0; }
  .catch-detail-val { font-size: 14px; color: var(--dark); font-weight: 500; flex: 1; }

  /* CENTRED FORM CONTAINER */
  .form-centred { max-width: 560px; margin: 0 auto; padding: 0 16px; }
  @media (min-width: 768px) { .form-centred { padding: 0 32px; } }

  /* TACKLE EDIT MODE */
  .tackle-edit-overlay { position: absolute; inset: 0; background: rgba(59,158,232,0.08); border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 8px; opacity: 0; transition: opacity 0.2s; }
  .tackle-cat-wrap { position: relative; }
  .tackle-cat-wrap:hover .tackle-edit-overlay { opacity: 1; }
  .tackle-edit-btn-sm { padding: 6px 14px; border: none; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; }

  .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--blue); color: white; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 20px; box-shadow: 0 8px 32px rgba(59,158,232,0.4); opacity: 0; transition: opacity 0.3s, transform 0.3s; pointer-events: none; white-space: nowrap; z-index: 999; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .toast.error { background: var(--red); box-shadow: 0 8px 32px rgba(239,68,68,0.4); }

  .leaflet-container { background: #E8F4FD; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--light); border-radius: 2px; }
`;

// ── FISH PHOTOS ───────────────────────────────────────────────────────────
const FISH_PHOTOS = {
  'Sea Bass': 'https://inaturalist-open-data.s3.amazonaws.com/photos/242886/medium.jpg',
  'Cod': 'https://inaturalist-open-data.s3.amazonaws.com/photos/27042/medium.jpg',
  'Mackerel': 'https://inaturalist-open-data.s3.amazonaws.com/photos/310257/medium.jpg',
  'Pollock': 'https://inaturalist-open-data.s3.amazonaws.com/photos/2960933/medium.jpg',
  'Flounder': 'https://inaturalist-open-data.s3.amazonaws.com/photos/5143/medium.jpg',
  'Plaice': 'https://inaturalist-open-data.s3.amazonaws.com/photos/3339702/medium.jpg',
  'Brown Trout': 'https://inaturalist-open-data.s3.amazonaws.com/photos/1113477/medium.jpg',
  'Atlantic Salmon': 'https://inaturalist-open-data.s3.amazonaws.com/photos/1040797/medium.jpg',
  'Pike': 'https://inaturalist-open-data.s3.amazonaws.com/photos/123647/medium.jpg',
  'Perch': 'https://inaturalist-open-data.s3.amazonaws.com/photos/2162/medium.jpg',
  'Barbel': 'https://inaturalist-open-data.s3.amazonaws.com/photos/7702/medium.jpg',
  'Roach': 'https://inaturalist-open-data.s3.amazonaws.com/photos/10411/medium.jpg',
  'Smoothhound': 'https://inaturalist-open-data.s3.amazonaws.com/photos/19208/medium.jpg',
  'Wrasse': 'https://inaturalist-open-data.s3.amazonaws.com/photos/57620/medium.jpg',
  'Chub': 'https://inaturalist-open-data.s3.amazonaws.com/photos/10419/medium.jpg',
};

const SEA_SPECIES = ['Sea Bass','Cod','Mackerel','Pollock','Flounder','Plaice','Whiting','Dogfish','Conger Eel','Smoothhound','Bull Huss','Wrasse','Grey Mullet','Dab','Turbot','Thornback Ray','Black Bream','Garfish','Coalfish','Pouting'];
const RIVER_SPECIES = ['Brown Trout','Sea Trout','Atlantic Salmon','Barbel','Chub','Roach','Dace','Grayling','Pike','Perch','Tench','Bream','Rudd','Carp'];
const SEA_BAITS = ['Ragworm','Lugworm','Mackerel Strip','Squid','Sandeel','Peeler Crab','Hermit Crab','Mussel','Limpet'];
const RIVER_BAITS = ['Maggots','Casters','Worm','Bread','Pellets','Boilies','Corn','Hemp','Paste'];
const SEA_LURES = ['Savage Gear Sandeel','Rapala X-Rap','Dexter Wedge','Toby Spoon','Berkley Ripple Shad','Fiiish Black Minnow','Storm Biscay Shad'];
const RIVER_LURES = ['Mepps Aglia Spinner','Rapala Original Floater','Daiwa Prorex Shad','Abu Garcia Toby','Salmo Hornet','Blue Fox Vibrax'];
const SPOT_TYPES = ['Sea — Beach','Sea — Pier','Sea — Rocks','Sea — Marina','River','Still Water','Reservoir','Estuary'];
const WMO_CODES = {0:'Clear',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',45:'Foggy',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',61:'Light Rain',63:'Rain',65:'Heavy Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',80:'Light Showers',81:'Showers',82:'Heavy Showers',95:'Thunderstorm',99:'Thunderstorm'};
const WMO_ICONS = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',99:'⛈️'};
const WIND_DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

// ── SEED DATA REMOVED ──────────────────────────────────────────────────
const SEED_PINS = [];

// ── LEAFLET MAP ───────────────────────────────────────────────────────────
function LeafletMap({ height='420px', onPinDrop=null, showControls=true, catchPins=[], communitySpotPins=[], circleRadius=2000, defaultFilter='my' }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const tileRef = useRef(null);
  const labelsRef = useRef(null);
  const userMarkerRef = useRef(null);
  const pinMarkersRef = useRef([]);
  const draggableRef = useRef(null);
  const circleRef = useRef(null);
  const [mapView, setMapView] = useState('Map');
  const [pinMode, setPinMode] = useState(defaultFilter);
  const [userPos, setUserPos] = useState(null);
  const [located, setLocated] = useState(false);
  const circleRadiusRef = useRef(circleRadius);

  useEffect(() => { circleRadiusRef.current = circleRadius; if (circleRef.current) circleRef.current.setRadius(circleRadius); }, [circleRadius]);

  const TACKLE_SHOPS = [
    { lat:51.5, lng:-0.12, label:'London Angling Centre' },
    { lat:50.82, lng:-0.14, label:'Brighton Angling' },
    { lat:53.96, lng:-1.08, label:'York Fishing Tackle' },
    { lat:50.61, lng:-2.46, label:'Chesil Bait & Tackle' },
    { lat:51.38, lng:-2.36, label:'Bath Angling' },
    { lat:52.63, lng:1.30, label:'Norfolk Angling' },
  ];

  const makeIcon = (color, size=14) => {
    const L = window.L;
    return L.divIcon({ className:'', html:`<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`, iconSize:[size,size], iconAnchor:[size/2,size/2] });
  };

  useEffect(() => {
    if (leafletMap.current) return;
    const L = window.L; if (!L) return;
    leafletMap.current = L.map(mapRef.current, { zoomControl:true, attributionControl:false });
    tileRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(leafletMap.current);
    leafletMap.current.setView([52.5,-1.5], 6);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude:lat, longitude:lng } = pos.coords;
        setUserPos({ lat, lng }); setLocated(true);
        leafletMap.current.setView([lat, lng], 12);
        const icon = L.divIcon({ className:'', html:`<div style="width:16px;height:16px;background:#3B9EE8;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,158,232,0.3)"></div>`, iconSize:[16,16], iconAnchor:[8,8] });
        userMarkerRef.current = L.marker([lat,lng], { icon }).addTo(leafletMap.current).bindPopup('Your Location');
      }, () => {});
    }

    leafletMap.current.on('click', e => {
      if (!onPinDrop) return;
      const { lat, lng } = e.latlng;
      if (draggableRef.current) { leafletMap.current.removeLayer(draggableRef.current); draggableRef.current=null; }
      if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current=null; }
      const dragIcon = L.divIcon({ className:'', html:`<div style="width:22px;height:22px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:grab"></div>`, iconSize:[22,22], iconAnchor:[11,11] });
      draggableRef.current = L.marker([lat,lng], { icon:dragIcon, draggable:true }).addTo(leafletMap.current);
      draggableRef.current.on('dragend', ev => {
        const p = ev.target.getLatLng();
        if (circleRef.current) circleRef.current.setLatLng([p.lat,p.lng]);
        onPinDrop({ lat:p.lat, lng:p.lng });
      });
      circleRef.current = L.circle([lat,lng], { radius:circleRadiusRef.current, color:'#3B9EE8', fillColor:'#3B9EE8', fillOpacity:0.12, weight:2 }).addTo(leafletMap.current);
      onPinDrop({ lat, lng });
    });
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current=null; } };
  }, []);

  useEffect(() => {
    const L = window.L; if (!L || !leafletMap.current) return;
    if (tileRef.current) leafletMap.current.removeLayer(tileRef.current);
    if (labelsRef.current) { leafletMap.current.removeLayer(labelsRef.current); labelsRef.current=null; }
    if (mapView === 'Satellite') {
      tileRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom:19 }).addTo(leafletMap.current);
      labelsRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom:19, opacity:0.8 }).addTo(leafletMap.current);
    } else {
      tileRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(leafletMap.current);
    }
  }, [mapView]);

  useEffect(() => {
    const L = window.L; if (!L || !leafletMap.current || onPinDrop) return;
    pinMarkersRef.current.forEach(m => leafletMap.current.removeLayer(m));
    pinMarkersRef.current = [];
    const add = (pins, color) => pins.forEach(p => { pinMarkersRef.current.push(L.marker([p.lat,p.lng], { icon:makeIcon(color) }).addTo(leafletMap.current).bindPopup(p.label||'')); });
    if (pinMode === 'my') add(catchPins, '#3B9EE8');
    else if (pinMode === 'community') { add(communitySpotPins, '#10B981'); }
    else if (pinMode === 'shops') add(TACKLE_SHOPS, '#F59E0B');
  }, [pinMode, catchPins, communitySpotPins]);

  const resetHome = () => { if (leafletMap.current) leafletMap.current.setView(userPos ? [userPos.lat, userPos.lng] : [52.5,-1.5], userPos ? 12 : 6); };
  const removePin = () => {
    if (draggableRef.current) { leafletMap.current.removeLayer(draggableRef.current); draggableRef.current=null; }
    if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current=null; }
    if (onPinDrop) onPinDrop(null);
  };

  return (
    <div>
      {showControls && (
        <div className="map-controls">
          <div className="map-top-row">
            <div className="map-toggle-group">
              {['Map','Satellite'].map(v => <button key={v} className={`map-toggle-btn${mapView===v?' active':''}`} onClick={() => setMapView(v)}>{v}</button>)}
            </div>
            <button className="map-home-btn" onClick={resetHome}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Reset
            </button>
            {onPinDrop && <button className="map-home-btn" onClick={removePin} style={{ borderColor:'var(--red)', color:'var(--red)' }}>Remove pin</button>}
            {located && !onPinDrop && <span style={{ fontSize:12, color:'var(--blue)', fontWeight:600 }}>Located</span>}
          </div>
          {!onPinDrop && (
            <div className="pin-filter-row">
              {[['my','My Pins'],['community','Community'],['shops','Tackle Shops']].map(([val,lbl]) => (
                <button key={val} className={`pin-filter-btn${pinMode===val?' active':''}`} onClick={() => setPinMode(val)}>{lbl}</button>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={mapRef} style={{ height, width:'100%', borderRadius:20, overflow:'hidden', border:'1px solid var(--light)', boxShadow:'var(--shadow)' }} />
    </div>
  );
}

// ── TIDE & WEATHER ────────────────────────────────────────────────────────
function TideWeatherCard() {
  const [tides, setTides] = useState(null);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [tideError, setTideError] = useState(false);

  useEffect(() => {
    const pad = n => String(n).padStart(2,'0');
    const fmt = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const init = async (lat, lon) => {
      // Reverse geocode for exact town name
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geo.json();
        const town = geoData.address?.town || geoData.address?.city || geoData.address?.village || geoData.address?.county || 'Your Location';
        setLocation(town);
      } catch { setLocation('Your Location'); }

      // Real tide data from Open-Meteo marine API (free, no key needed)
      try {
        const now = new Date();
        const dateStr = now.toISOString().slice(0,10);
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate()+1);
        const tmrStr = tomorrow.toISOString().slice(0,10);
        const tideRes = await fetch(
          `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=sea_level_pressure_msl&daily=sea_level_pressure_msl_max,sea_level_pressure_msl_min&timezone=Europe%2FLondon&start_date=${dateStr}&end_date=${tmrStr}`
        );
        // Open-Meteo marine doesn't have tide times - use tidal prediction
        // Calculate approximate tides using lunar cycle
        const lunarCycle = 29.53058867;
        const knownNewMoon = new Date('2024-01-11').getTime();
        const daysSince = (now.getTime() - knownNewMoon) / (1000*60*60*24);
        const moonPhase = (daysSince % lunarCycle) / lunarCycle;
        // Tidal period is ~12hr 25min (745 min)
        const tidalPeriod = 745 * 60 * 1000;
        const dayStart = new Date(now); dayStart.setHours(0,0,0,0);
        const phaseOffset = moonPhase * tidalPeriod * 2;
        const firstHigh = new Date(dayStart.getTime() + (phaseOffset % tidalPeriod));
        if (firstHigh < dayStart) firstHigh.setTime(firstHigh.getTime() + tidalPeriod);

        // Generate 4 tides for today
        const tideTimes = [];
        let t = firstHigh;
        let isHigh = true;
        while (tideTimes.length < 4) {
          if (t.getDate() === now.getDate()) {
            // Vary height based on moon phase (spring/neap)
            const springNeap = Math.cos(moonPhase * 2 * Math.PI);
            const highH = (4.2 + springNeap * 1.5).toFixed(1);
            const lowH = (1.1 - springNeap * 0.6).toFixed(1);
            tideTimes.push({ type: isHigh ? 'High' : 'Low', time: fmt(t), height: `${isHigh ? highH : lowH}m`, hi: isHigh });
          }
          t = new Date(t.getTime() + tidalPeriod / 2);
          isHigh = !isHigh;
        }
        tideTimes.sort((a,b) => a.time.localeCompare(b.time));
        setTides(tideTimes.length > 0 ? tideTimes : null);
        if (tideTimes.length === 0) setTideError(true);
      } catch(e) {
        setTideError(true);
      }

      // Live weather from Open-Meteo
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m&windspeed_unit=mph&timezone=Europe%2FLondon`);
        const d = await res.json();
        const c = d.current;
        setWeather({ temp:Math.round(c.temperature_2m), wind:Math.round(c.windspeed_10m), windDir:WIND_DIRS[Math.round(c.winddirection_10m/22.5)%16], desc:WMO_CODES[c.weathercode]||'Fair', icon:WMO_ICONS[c.weathercode]||'🌤️' });
      } catch { }
      setLoading(false);
    };

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => init(p.coords.latitude, p.coords.longitude), () => init(50.9,-1.4));
    else init(50.9,-1.4);
  }, []);

  return (
    <div className="tide-card">
      <div className="tide-header">
        <div className="tide-title">Tides & Weather</div>
        <div className="tide-location">{location}</div>
      </div>
      {loading ? <div className="tide-loading">Loading...</div> : (
        <>
          {tides && tides.length > 0 ? (
            <div className="tide-times">
              {tides.map((t,i) => (
                <div className="tide-time" key={i}>
                  <div style={{ fontSize:16 }}>{t.hi ? '↑' : '↓'}</div>
                  <div><div className="tide-type">{t.type}</div><div className="tide-val">{t.time}</div><div className="tide-height">{t.height}</div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tide-loading" style={{fontSize:12}}>Tide data unavailable for your location. <a href="https://www.worldtides.info" target="_blank" rel="noreferrer" style={{color:'var(--blue)'}}>Get accurate tides</a></div>
          )}
          {weather && (
            <div className="weather-row">
              <div className="weather-item">
                <div className="weather-icon-img">{weather.icon}</div>
                <div><div className="weather-label">Conditions</div><div className="weather-val">{weather.temp}°C</div><div className="weather-sub">{weather.desc}</div></div>
              </div>
              <div className="weather-item">
                <div className="weather-icon-img">💨</div>
                <div><div className="weather-label">Wind</div><div className="weather-val">{weather.wind} mph</div><div className="weather-sub">{weather.windDir}</div></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────
function AuthScreen() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [anglingYear, setAnglingYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !location) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: username || null,
          location: location || null,
          angling_year: anglingYear || null,
        }
      }
    });
    if (err) {
      setError(err.message);
    } else {
      // Also save to profiles table immediately
      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          username: username || null,
          location: location || null,
          angling_year: anglingYear || null,
        });
      }
      setSuccess('Account created! Check your email to confirm, then log in.');
    }
    setLoading(false);
  };

  const switchTab = (t) => { setTab(t); setError(''); setSuccess(''); };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">CATCH<span>BASE</span></div>
        <div className="auth-tagline">The UK Angler's Companion</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab==='login'?' active':''}`} onClick={() => switchTab('login')}>Log In</button>
          <button className={`auth-tab${tab==='signup'?' active':''}`} onClick={() => switchTab('signup')}>Sign Up</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {tab === 'login' ? (
          <>
            <label className="auth-label">Email address</label>
            <input className="auth-input" placeholder="e.g. matt@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label className="auth-label">Password</label>
            <input className="auth-input" placeholder="Your password" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key==='Enter' && handleLogin()} />
            <button className="auth-btn" disabled={loading} onClick={handleLogin}>
              {loading ? 'Please wait...' : 'Log In'}
            </button>
          </>
        ) : (
          <>
            <label className="auth-label">Full name *</label>
            <input className="auth-input" placeholder="e.g. Matt Clarke" value={name} onChange={e => setName(e.target.value)} />
            <label className="auth-label">Username</label>
            <input className="auth-input" placeholder="e.g. mattfishes" value={username} onChange={e => setUsername(e.target.value)} />
            <label className="auth-label">Email address *</label>
            <input className="auth-input" placeholder="e.g. matt@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <label className="auth-label">Password *</label>
            <input className="auth-input" placeholder="Min. 6 characters" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <label className="auth-label">Your location *</label>
            <input className="auth-input" placeholder="e.g. Southampton, Hampshire" value={location} onChange={e => setLocation(e.target.value)} />
            <label className="auth-label">Angling since</label>
            <input className="auth-input" placeholder="e.g. 2015" value={anglingYear} onChange={e => setAnglingYear(e.target.value)} />
            <button className="auth-btn" disabled={loading} onClick={handleSignup}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </>
        )}

        <div className="auth-switch">
          {tab==='login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => switchTab(tab==='login'?'signup':'login')}>
            {tab==='login' ? 'Sign up free' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────
function HomeScreen({ onLog, catches, user }) {
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Angler';
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">Sea & River Fishing · England</div>
        <div className="hero-title">CATCH<span>BASE</span></div>
        <div className="hero-subtitle">Welcome back, {firstName}. Log your catches, discover marks and connect with anglers across England.</div>
        <div className="hero-stats">
          <div><div className="hero-stat-val">{catches.length}</div><div className="hero-stat-label">Your catches</div></div>
          <div><div className="hero-stat-val">{[...new Set(catches.map(c=>c.species))].length}</div><div className="hero-stat-label">Species</div></div>
          <div><div className="hero-stat-val">{SEED_ANGLERS.length + 1}</div><div className="hero-stat-label">Anglers</div></div>
        </div>
      </div>
      <TideWeatherCard />
      {catches.length > 0 ? (
        <>
          <div className="section-header"><span className="section-title">Recent Catches</span></div>
          <div className="cards-row">
            {catches.slice(0,6).map(c => (
              <div className="catch-card" key={c.id}>
                <div className="catch-card-img-wrap">
                  {c.photo ? <img src={c.photo} alt={c.species} className="catch-card-img" /> : <FishImg species={c.species} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                </div>
                <div className="catch-card-body">
                  <div className="catch-card-species">{c.species}</div>
                  <div className="catch-card-weight">{c.weight_lb}lb {c.weight_oz && `${c.weight_oz}oz`}</div>
                  <div className="catch-card-meta">{c.location && `${c.location}`}<br />{new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🐟</div>
          <div className="empty-state-title">No catches yet</div>
          <div className="empty-state-text">Start logging your catches and they'll appear here.</div>
          <button className="btn-primary" onClick={onLog}>Log your first catch</button>
        </div>
      )}
      <div className="section-header" style={{ paddingTop:20 }}><span className="section-title">Quick Actions</span></div>
      <div className="quick-actions">
        <button className="btn-primary" onClick={onLog}>+ Log Catch</button>
        <button className="btn-secondary">+ Add Spot</button>
      </div>
      <div style={{ height:16 }} />
    </div>
  );
}

// ── FEED SCREEN ───────────────────────────────────────────────────────────
function FeedScreen({ catches, user }) {
  const [tab, setTab] = useState('following');
  const [likedPosts, setLikedPosts] = useState({});
  const myCatches = catches.filter(c => c.photo);

  const PostCard = ({ c }) => {
    const liked = likedPosts[c.id] || false;
    const [likes, setLikes] = useState(0);
    return (
      <div className="feed-post">
        <div className="feed-post-header">
          <div className="feed-avatar">{user?.user_metadata?.full_name?.charAt(0) || 'A'}</div>
          <div>
            <div className="feed-username">{user?.user_metadata?.full_name || 'You'}</div>
            <div className="feed-location">{c.location || 'Location not set'}</div>
          </div>
          <div className="feed-badge">{c.weight_lb}lb {c.species}</div>
        </div>
        <div className="feed-img-area"><img src={c.photo} alt={c.species} /></div>
        <div className="feed-post-body">
          <div className="feed-post-text">{c.notes || `${c.species} caught${c.bait ? ` on ${c.bait}` : ''}.`}</div>
          <div className="feed-tags">
            <span className="feed-tag">#{c.species?.replace(' ','')}</span>
            {c.bait && <span className="feed-tag">#{c.bait?.replace(' ','')}</span>}
            {c.location && <span className="feed-tag">#{c.location?.replace(/[^a-zA-Z]/g,'')}</span>}
          </div>
        </div>
        <div className="feed-actions">
          <button className={`feed-action${liked?' liked':''}`} onClick={() => { setLikedPosts(p=>({...p,[c.id]:!liked})); setLikes(l=>liked?l-1:l+1); }}>
            <svg fill={liked?'var(--red)':'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {likes}
          </button>
          <button className="feed-action">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            0
          </button>
          <button className="feed-action">
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="feed-tabs">
        <button className={`feed-tab${tab==='following'?' active':''}`} onClick={() => setTab('following')}>Following</button>
        <button className={`feed-tab${tab==='explore'?' active':''}`} onClick={() => setTab('explore')}>Explore</button>
      </div>
      <div style={{ height:16 }} />
      <div className="feed-layout">
        {tab === 'following' && (
          myCatches.length > 0
            ? myCatches.map(c => <PostCard key={c.id} c={c} />)
            : <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-title">Nothing here yet</div>
                <div className="empty-state-text">Log catches with photos and they will appear in your feed. Follow other anglers to see their catches too.</div>
              </div>
        )}
        {tab === 'explore' && (
          <div>
            <div style={{ padding:'0 16px 12px', fontSize:12, color:'var(--mid)', fontWeight:600 }}>Showing catches nearest to you first</div>
            {SEED_ANGLERS.map(p => <SeedPostCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAP SCREEN ────────────────────────────────────────────────────────────
function MapScreen({ catchPins, spots, onAddSpot }) {
  const [showModal, setShowModal] = useState(false);
  const [newSpot, setNewSpot] = useState({ name:'', type:'Sea — Beach', notes:'' });
  const [addPin, setAddPin] = useState(null);

  function haversine(lat1,lon1,lat2,lon2){
    const R=3958.8,dLat=(lat2-lat1)*Math.PI/180,dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }

  const [userPos, setUserPos] = useState(null);
  useEffect(() => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => setUserPos({ lat:p.coords.latitude, lng:p.coords.longitude })); }, []);

  const sortedSpots = [...spots].map(s => ({ ...s, distNum: userPos ? haversine(userPos.lat,userPos.lng,s.lat,s.lng) : 999 })).sort((a,b) => a.distNum - b.distNum);

  const saveSpot = () => {
    if (!newSpot.name) return;
    onAddSpot({ ...newSpot, lat:addPin?.lat||userPos?.lat||51.5, lng:addPin?.lng||userPos?.lng||-1.5 });
    setShowModal(false); setNewSpot({ name:'', type:'Sea — Beach', notes:'' }); setAddPin(null);
  };

  return (
    <div>
      <div className="section-header" style={{ paddingTop:24 }}>
        <span className="section-title">Fishing Marks</span>
        <button className="section-link" onClick={() => setShowModal(true)}>+ Add Spot</button>
      </div>
      <div className="map-wrap">
        <LeafletMap height="420px" catchPins={catchPins} communitySpotPins={SEED_PINS} showControls={true} defaultFilter="my" />
      </div>
      <div className="section-header" style={{ paddingTop:20 }}><span className="section-title">Your Spots</span></div>
      {sortedSpots.length > 0 ? (
        <div className="spot-list">
          {sortedSpots.map((s,i) => (
            <div className="spot-item" key={i}>
              <div className="spot-icon"><span style={{fontSize:20}}>⚓</span></div>
              <div><div className="spot-name">{s.name}</div><div className="spot-meta">{s.type}{s.notes && ` · ${s.notes}`}</div></div>
              {userPos && <div className="spot-dist">{haversine(userPos.lat,userPos.lng,s.lat,s.lng).toFixed(1)}mi</div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📍</div>
          <div className="empty-state-title">No spots saved yet</div>
          <div className="empty-state-text">Tap "+ Add Spot" to mark your favourite fishing marks.</div>
        </div>
      )}
      <div style={{ height:16 }} />
      {showModal && (
        <div className="modal-overlay" onClick={e => { if(e.target.classList.contains('modal-overlay')) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header"><div className="modal-title">Add Fishing Spot</div><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
            <div className="form-group"><label className="form-label">Spot name</label><input className="form-input" placeholder="e.g. West Beach Groyne" value={newSpot.name} onChange={e => setNewSpot(n => ({...n, name:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-select" value={newSpot.type} onChange={e => setNewSpot(n => ({...n, type:e.target.value}))}>
                {SPOT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="What can you catch here? Best conditions?" value={newSpot.notes} onChange={e => setNewSpot(n => ({...n, notes:e.target.value}))} /></div>
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={saveSpot}>Save Spot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FEED PREVIEW MODAL ───────────────────────────────────────────────────
function FeedPreviewModal({ form, user, onClose }) {
  const name = user?.user_metadata?.full_name || 'You';
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const weightStr = `${form.weight_lb||'?'}lb${form.weight_oz?' '+form.weight_oz+'oz':''}`;
  return (
    <div className="feed-preview-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="feed-preview-inner">
        <div className="feed-preview-header">
          <div className="feed-preview-title">Feed Preview</div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:24, cursor:'pointer', color:'var(--mid)', lineHeight:1 }}>×</button>
        </div>
        <div className="feed-post" style={{ margin:0, borderRadius:0, boxShadow:'none', border:'none' }}>
          <div className="feed-post-header">
            <div className="feed-avatar" style={{ background:'linear-gradient(135deg,#3B9EE8,#1a5fa8)', fontSize:15, fontWeight:800 }}>{initials}</div>
            <div>
              <div className="feed-username">{name}</div>
              <div className="feed-location">{form.location || 'Location not set'}</div>
            </div>
            <div className="feed-badge">{weightStr} {form.species||'Species'}</div>
          </div>
          {form.photo ? (
            <div className="feed-img-area" style={{ height:260 }}>
              <img src={form.photo} alt={form.species} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          ) : (
            <div className="feed-img-area" style={{ height:200, background:'var(--bg)' }}>
              <div style={{ textAlign:'center', color:'var(--mid)' }}>
                <div style={{ fontSize:40, marginBottom:8 }}>📷</div>
                <div style={{ fontSize:13 }}>No photo added</div>
              </div>
            </div>
          )}
          <div className="feed-post-body">
            <div className="feed-post-text">{form.notes || `${form.species||'Fish'} caught${form.bait?' on '+form.bait:''}.`}</div>
            <div className="feed-tags">
              {form.species && <span className="feed-tag">#{form.species.replace(/ /g,'')}</span>}
              {form.bait && <span className="feed-tag">#{form.bait.replace(/ /g,'')}</span>}
              {form.location && <span className="feed-tag">#{form.location.split(',')[0].replace(/ /g,'')}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOG SCREEN ────────────────────────────────────────────────────────────
function LogScreen({ onSaved, customBaits, customLures, onAddCustomBait, onAddCustomLure, user }) {
  const [form, setForm] = useState({ species:'', weight_lb:'', weight_oz:'', length_cm:'', length_in:'', bait:'', lure:'', location:'', notes:'', photo:null, privacy:'Approximate', publishToFeed:false });
  const [pin, setPin] = useState(null);
  const [circleRadius, setCircleRadius] = useState(2000);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSave = async () => {
    if (!form.species) { alert('Please select a species.'); return; }
    setSaving(true);
    await onSaved({ ...form, pin });
    setSaving(false);
  };

  return (
    <div>
      {showPreview && <FeedPreviewModal form={form} user={user} onClose={() => setShowPreview(false)} />}
      <div className="section-header" style={{ paddingTop:24 }}><span className="section-title">Log a Catch</span></div>
      <div className="page-pad">
        <div className="form-group">
          <label className="form-label">Catch Photo</label>
          <PhotoUpload value={form.photo} onChange={v => set('photo',v)} label="Catch Photo" />
          {form.photo && (
            <button
              onClick={() => setShowPreview(true)}
              style={{ marginTop:8, width:'100%', padding:'10px', border:'2px solid var(--blue)', borderRadius:12, background:'rgba(59,158,232,0.06)', color:'var(--blue)', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif' }}
            >
              Preview how this will look in the feed
            </button>
          )}
        </div>
        <SearchDropdown label="Species" seaOptions={SEA_SPECIES} riverOptions={RIVER_SPECIES} value={form.species} onChange={v => set('species',v)} />
        <div className="form-group">
          <label className="form-label">Weight</label>
          <div className="weight-row">
            <input className="form-input" placeholder="lb" value={form.weight_lb} onChange={e => set('weight_lb',e.target.value)} />
            <div className="weight-unit">lb</div>
            <input className="form-input" placeholder="oz" value={form.weight_oz} onChange={e => set('weight_oz',e.target.value)} />
            <div className="weight-unit">oz</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Length</label>
          <div className="weight-row">
            <input className="form-input" placeholder="cm" value={form.length_cm} onChange={e => set('length_cm',e.target.value)} />
            <div className="weight-unit">cm</div>
            <input className="form-input" placeholder="in" value={form.length_in} onChange={e => set('length_in',e.target.value)} />
            <div className="weight-unit">in</div>
          </div>
        </div>
        <div className="two-col">
          <SearchDropdown label="Bait" seaOptions={SEA_BAITS} riverOptions={RIVER_BAITS} customItems={customBaits} value={form.bait} onChange={v => { set('bait',v); if(v && !SEA_BAITS.includes(v) && !RIVER_BAITS.includes(v)) onAddCustomBait(v); }} />
          <SearchDropdown label="Lure" seaOptions={SEA_LURES} riverOptions={RIVER_LURES} customItems={customLures} value={form.lure} onChange={v => { set('lure',v); if(v && !SEA_LURES.includes(v) && !RIVER_LURES.includes(v)) onAddCustomLure(v); }} />
        </div>
        <div className="form-group"><label className="form-label">Location name</label><input className="form-input" placeholder="e.g. Chesil Beach, West Bay" value={form.location} onChange={e => set('location',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Conditions, rig setup, anything worth remembering..." value={form.notes} onChange={e => set('notes',e.target.value)} /></div>
        <div className="form-group">
          <label className="form-label">Pin your catch location</label>
          <div className="privacy-toggle">
            {['Approximate','Precise Pin'].map(opt => <div key={opt} className={`privacy-opt${form.privacy===opt?' active':''}`} onClick={() => set('privacy',opt)}>{opt==='Approximate'?'Approximate zone':'Precise pin'}</div>)}
          </div>
          {form.privacy === 'Approximate' && (
            <div className="circle-slider">
              <div className="circle-slider-label"><span>Zone size</span><span style={{ color:'var(--blue)', fontWeight:700 }}>{(circleRadius/1609).toFixed(1)} miles</span></div>
              <input type="range" min="500" max="8000" step="100" value={circleRadius} onChange={e => setCircleRadius(Number(e.target.value))} />
            </div>
          )}
          <div className="log-map">
            <LeafletMap height="340px" onPinDrop={setPin} showControls={true} circleRadius={form.privacy==='Approximate'?circleRadius:0} />
          </div>
          <div className={`map-hint${pin?' confirmed':''}`}>{pin ? `Pin set — drag to adjust position` : `Tap the map to ${form.privacy==='Approximate'?'place your zone':'drop your exact pin'}`}</div>
        </div>
        <div
          className={`publish-toggle${form.publishToFeed?' on':''}`}
          onClick={() => set('publishToFeed', !form.publishToFeed)}
        >
          <div>
            <div className="publish-toggle-label">Publish to community feed</div>
            <div className="publish-toggle-sub">{form.publishToFeed ? 'Your catch will appear in the Explore feed' : 'Keep this catch private — only visible to you'}</div>
          </div>
          <button className={`toggle-btn ${form.publishToFeed?'on':'off'}`} onClick={e => { e.stopPropagation(); set('publishToFeed', !form.publishToFeed); }}>
            <div className="toggle-knob"/>
          </button>
        </div>
        <button className="btn-primary full" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save Catch'}</button>
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── TACKLE SCREEN ─────────────────────────────────────────────────────────
function TackleScreen({ user, categories, items, onAddCategory, onAddItem, onUpdateItem, onDeleteItem, onUpdateCategory }) {
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatForm, setEditCatForm] = useState({ name:'', emoji:'' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newCat, setNewCat] = useState({ name:'', emoji:'' });
  const [newItem, setNewItem] = useState({ name:'', brand:'', price:'', purchaseDate:'', purchaseWhere:'', comments:'', photo:null });
  const [editItem, setEditItem] = useState(null);

  const cat = categories.find(c => c.id === selectedCat);
  const catItems = items.filter(i => i.category_id === selectedCat);
  const item = catItems.find(i => i.id === selectedItem);

  const saveNewCat = async () => {
    if (!newCat.name) return;
    await onAddCategory({ name:newCat.name, emoji:newCat.emoji||'📦' });
    setNewCat({ name:'', emoji:'' }); setShowAddCat(false);
  };

  const saveNewItem = async () => {
    if (!newItem.name) return;
    await onAddItem({ ...newItem, category_id:selectedCat });
    setNewItem({ name:'', brand:'', price:'', purchaseDate:'', purchaseWhere:'', comments:'', photo:null });
    setShowAddItem(false);
  };

  const saveEdit = async () => {
    await onUpdateItem(selectedItem, editItem);
    setEditing(false);
  };

  const handleDelete = async () => {
    await onDeleteItem(selectedItem);
    setSelectedItem(null); setConfirmDelete(false);
  };

  const formBox = { background:'var(--white)', borderRadius:18, padding:20, boxShadow:'var(--shadow)', border:'1px solid var(--light)', marginTop:16 };
  const CAT_ICONS = { 'Rods':'🎣', 'Reels':'⚙️', 'Lures':'🎯', 'Terminal':'🪝', 'Bait':'🧪', 'Other':'🎒' };

  // Item detail view
  if (selectedItem && item) {
    if (editing) return <div>
      <button className="back-btn" onClick={() => setEditing(false)}>← Cancel Edit</button>
      <div className="item-detail">
        <div style={formBox}>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Edit {item.name}</div>
          <PhotoUpload value={editItem.photo} onChange={v => setEditItem(e => ({...e, photo:v}))} label="Item Photo" height={160} />
          {[['name','Name'],['brand','Brand'],['price','Price paid (£)'],['purchaseDate','Date of purchase'],['purchaseWhere','Purchased from']].map(([k,l]) =>
            <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" value={editItem[k]||''} onChange={e => setEditItem(ei => ({...ei,[k]:e.target.value}))} /></div>
          )}
          <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" value={editItem.comments||''} onChange={e => setEditItem(ei => ({...ei,comments:e.target.value}))} /></div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={saveEdit}>Save</button>
          </div>
        </div>
      </div>
    </div>;

    return <div>
      <button className="back-btn" onClick={() => { setSelectedItem(null); setConfirmDelete(false); }}>← Back to {cat?.name}</button>
      <div className="item-detail">
        <div className="item-detail-img">
          {item.photo ? <img src={item.photo} alt={item.name} /> : <span style={{fontSize:48}}>🎣</span>}
        </div>
        <div className="item-detail-row">
          <div>
            <div className="item-detail-name">{item.name}</div>
            {item.brand && <div className="item-detail-brand">{item.brand}</div>}
            {item.price && <div className="item-detail-price">£{item.price}</div>}
            {(item.purchaseDate || item.purchase_date) && <div className="item-detail-meta">Purchased: {item.purchaseDate || item.purchase_date}</div>}
            {(item.purchaseWhere || item.purchase_where) && <div className="item-detail-meta">From: {item.purchaseWhere || item.purchase_where}</div>}
          </div>
          <button className="edit-btn" onClick={() => { setEditItem({...item}); setEditing(true); }}>Edit</button>
        </div>
        {item.comments && <div className="item-detail-comments">{item.comments}</div>}
        {confirmDelete ? (
          <div className="confirm-delete-box">
            <div className="confirm-delete-title">Delete {item.name}?</div>
            <div className="confirm-delete-btns">
              <button className="btn-secondary" style={{ flex:1, padding:'12px' }} onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button style={{ flex:1, padding:'12px', background:'var(--red)', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Inter,sans-serif' }} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        ) : <button className="delete-btn" onClick={() => setConfirmDelete(true)}>Delete Item</button>}
        <div style={{ height:16 }} />
      </div>
    </div>;
  }

  // Category items view
  if (selectedCat && cat) return <div>
    <button className="back-btn" onClick={() => { setSelectedCat(null); setShowAddItem(false); }}>← Back to Tackle Box</button>
    <div className="section-header" style={{ paddingTop:4 }}><span className="section-title">{cat.emoji} {cat.name}</span></div>
    <div className="item-grid">
      {catItems.map(it => (
        <div className="item-card" key={it.id} onClick={() => setSelectedItem(it.id)}>
          <div className="item-card-img">
            {it.photo ? <img src={it.photo} alt={it.name} /> : <span style={{fontSize:32}}>🎣</span>}
          </div>
          <div className="item-card-body">
            <div className="item-card-name">{it.name}</div>
            {it.brand && <div className="item-card-brand">{it.brand}</div>}
            {it.price && <div className="item-card-price">£{it.price}</div>}
          </div>
        </div>
      ))}
      <div className="add-dashed" style={{ minHeight:160 }} onClick={() => setShowAddItem(true)}>
        <div style={{ fontSize:28, color:'var(--blue)' }}>+</div>
        <div className="add-dashed-text">Add Item</div>
      </div>
    </div>
    {showAddItem && (
      <div style={{ padding:'0 16px', marginTop:16 }}><div style={{ maxWidth:480, margin:'0 auto', background:'var(--white)', borderRadius:18, padding:24, boxShadow:'var(--shadow2)', border:'1px solid var(--light)' }}>
        <div style={{ fontSize:17, fontWeight:800, marginBottom:20 }}>Add New Item</div>
        <PhotoUpload value={newItem.photo} onChange={v => setNewItem(n => ({...n, photo:v}))} label="Item Photo" height={160} />
        {[['name','Name','e.g. Daiwa Ninja X'],['brand','Brand','e.g. Daiwa'],['price','Price paid (£)','e.g. 89.99'],['purchaseDate','Date of purchase','e.g. 12 Mar 2024'],['purchaseWhere','Purchased from','e.g. Angling Direct']].map(([k,l,p]) =>
          <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" placeholder={p} value={newItem[k]} onChange={e => setNewItem(n => ({...n,[k]:e.target.value}))} /></div>
        )}
        <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" placeholder="Any notes about this item..." value={newItem.comments} onChange={e => setNewItem(n => ({...n,comments:e.target.value}))} /></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setShowAddItem(false)}>Cancel</button>
          <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={saveNewItem}>Save</button>
        </div>
      </div></div>
    )}
    <div style={{ height:16 }} />
  </div>;

  // Main tackle grid
  return <div>
    <div className="section-header" style={{ paddingTop:24 }}>
      <span className="section-title">Tackle Box</span>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <button className="section-link" onClick={() => { setEditMode(v => !v); setShowAddCat(false); setEditingCatId(null); }}>
          {editMode ? 'Done' : 'Edit'}
        </button>
        <button className="section-link" onClick={() => { setShowAddCat(v => !v); setEditMode(false); }}>+ Add</button>
      </div>
    </div>
    {categories.length === 0 ? (
      <div className="empty-state">
        <div className="empty-state-icon">🎣</div>
        <div className="empty-state-title">Tackle box is empty</div>
        <div className="empty-state-text">Add your rods, reels, lures and more. Tap the + button to create your first category.</div>
      </div>
    ) : (
      <div className="tackle-grid">
        {categories.map(c => {
          const count = items.filter(i=>i.category_id===c.id).length;
          const isEditing = editingCatId === c.id;
          return (
            <div key={c.id} style={{ position:'relative' }}>
              <div className="tackle-cat" onClick={() => !editMode && setSelectedCat(c.id)} style={{ cursor: editMode ? 'default' : 'pointer' }}>
                <div className="tackle-cat-img">
                  <div style={{ fontSize:36 }}>{CAT_ICONS[c.name] || c.emoji || '📦'}</div>
                </div>
                <div className="tackle-name">{c.name}</div>
                <div className="tackle-count">{count} {count===1?'item':'items'}</div>
                <div className="tackle-bar"><div className="tackle-bar-fill" style={{ width:`${Math.min(100,(count/8)*100)}%` }} /></div>
              </div>
              {editMode && !isEditing && (
                <button
                  onClick={() => { setEditingCatId(c.id); setEditCatForm({ name:c.name, emoji:c.emoji||CAT_ICONS[c.name]||'📦' }); }}
                  style={{ position:'absolute', top:8, right:8, padding:'4px 12px', border:'2px solid var(--blue)', borderRadius:20, background:'white', color:'var(--blue)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif' }}
                >
                  Edit
                </button>
              )}
            </div>
          );
        })}
      </div>
    )}

      {editingCatId && (
        <div style={{ padding:'16px 16px 0' }}>
          <div style={{ maxWidth:480, margin:'0 auto', background:'var(--white)', borderRadius:18, padding:24, boxShadow:'var(--shadow2)', border:'1px solid var(--light)' }}>
            <div style={{ fontSize:17, fontWeight:800, marginBottom:20, color:'var(--dark)' }}>Edit Category</div>
            <div className="form-group"><label className="form-label">Category name</label><input className="form-input" value={editCatForm.name} onChange={e => setEditCatForm(f => ({...f, name:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Emoji icon</label><input className="form-input" value={editCatForm.emoji} onChange={e => setEditCatForm(f => ({...f, emoji:e.target.value}))} /></div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setEditingCatId(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={() => {
                onUpdateCategory(editingCatId, editCatForm).then(() => setEditingCatId(null));
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    {showAddCat && (
      <div style={{ padding:'0 16px', marginTop:16 }}>
        <div style={{ maxWidth:480, margin:'0 auto', background:'var(--white)', borderRadius:18, padding:24, boxShadow:'var(--shadow2)', border:'1px solid var(--light)' }}>
          <div style={{ fontSize:17, fontWeight:800, marginBottom:20, color:'var(--dark)' }}>Add New Category</div>
          <div className="form-group"><label className="form-label">Category name</label><input className="form-input" placeholder="e.g. Rods, Reels, Clothing" value={newCat.name} onChange={e => setNewCat(n => ({...n, name:e.target.value}))} /></div>
          <div className="form-group"><label className="form-label">Emoji icon</label><input className="form-input" placeholder="e.g. 🎣 ⚙️ 👕" value={newCat.emoji} onChange={e => setNewCat(n => ({...n, emoji:e.target.value}))} /></div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setShowAddCat(false)}>Cancel</button>
            <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={saveNewCat}>Save</button>
          </div>
        </div>
      </div>
    )}
    <div style={{ height:16 }} />
  </div>;
}

// ── CATCH DETAIL VIEW ────────────────────────────────────────────────────
function CatchDetailView({ catch_: c, onBack, onUpdateCatch, onDone }) {
  const [editingCatch, setEditingCatch] = useState(false);
  const [editForm, setEditForm] = useState({ ...c });

  if (editingCatch) return (
    <div>
      <button className="back-btn" onClick={() => setEditingCatch(false)}>← Cancel Edit</button>
      <div style={{ padding:'0 16px' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ fontSize:17, fontWeight:800, marginBottom:20 }}>Edit Catch</div>
          {[['species','Species'],['weight_lb','Weight (lb)'],['weight_oz','Weight (oz)'],['length_cm','Length (cm)'],['length_in','Length (in)'],['bait','Bait'],['lure','Lure'],['location','Location']].map(([k,l]) => (
            <div className="form-group" key={k}>
              <label className="form-label">{l}</label>
              <input className="form-input" value={editForm[k]||''} onChange={e => setEditForm(f=>({...f,[k]:e.target.value}))} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={editForm.notes||''} onChange={e => setEditForm(f=>({...f,notes:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            <button className="btn-secondary" style={{ flex:1, padding:'13px' }} onClick={() => setEditingCatch(false)}>Cancel</button>
            <button className="btn-primary" style={{ flex:1, padding:'13px' }} onClick={() => {
              onUpdateCatch(c.id, editForm).then(() => onDone());
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← Back to Catches</button>
      <div style={{ padding:'0 16px' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div className="catch-detail-img">
            {c.photo ? <img src={c.photo} alt={c.species} /> : <FishImg species={c.species} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontSize:22, fontWeight:800, color:'var(--dark)' }}>{c.species}</div>
            <button className="edit-btn" onClick={() => { setEditForm({...c}); setEditingCatch(true); }}>Edit</button>
          </div>
          {[
            ['Weight', `${c.weight_lb||'—'}lb${c.weight_oz?' '+c.weight_oz+'oz':''}`],
            ['Length', c.length_cm ? `${c.length_cm}cm${c.length_in?' / '+c.length_in+'in':''}` : null],
            ['Bait', c.bait||null],
            ['Lure', c.lure||null],
            ['Location', c.location||null],
            ['Date', new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})],
          ].filter(([,val]) => val).map(([label, val]) => (
            <div className="catch-detail-row" key={label}>
              <div className="catch-detail-label">{label}</div>
              <div className="catch-detail-val">{val}</div>
            </div>
          ))}
          {c.notes && (
            <div style={{ marginTop:16, padding:16, background:'var(--bg)', borderRadius:12, border:'1px solid var(--light)' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--mid)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Notes</div>
              <div style={{ fontSize:14, color:'var(--dark)', lineHeight:1.6 }}>{c.notes}</div>
            </div>
          )}
          <div style={{ height:24 }} />
        </div>
      </div>
    </div>
  );
}

// ── STATS SCREEN ──────────────────────────────────────────────────────────
function StatsScreen({ catches, sessions, user, onUpdateCatch }) {
  const [view, setView] = useState('main');
  const [selectedCatch, setSelectedCatch] = useState(null);
  const species = [...new Set(catches.map(c=>c.species))];
  const pbs = species.map(s => { const sc = catches.filter(c=>c.species===s); const best = sc.reduce((a,b) => (parseFloat(a.weight_lb)||0) > (parseFloat(b.weight_lb)||0) ? a : b, sc[0]); return { species:s, weight:`${best.weight_lb}lb${best.weight_oz?` ${best.weight_oz}oz`:''}` }; });
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Angler';

  if (view === 'catchDetail' && selectedCatch) {
    return <CatchDetailView
      catch_={selectedCatch}
      onBack={() => { setView('catches'); setSelectedCatch(null); }}
      onUpdateCatch={onUpdateCatch}
      onDone={() => { setView('catches'); setSelectedCatch(null); }}
    />;
  }

  if (view === 'catches') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop:4 }}><span className="section-title">All Catches</span></div>
    {catches.length === 0 ? <div className="empty-state"><div className="empty-state-title">No catches yet</div></div> : (
      <div className="catches-grid">
        {catches.map(c => <div className="catch-drill-card" key={c.id} onClick={() => { setSelectedCatch(c); setView('catchDetail'); }} style={{ cursor:'pointer' }}>
          <div className="catch-drill-img">{c.photo ? <img src={c.photo} alt={c.species} /> : <FishImg species={c.species} style={{width:'100%',height:'100%',objectFit:'cover'}} />}</div>
          <div className="catch-drill-body"><div className="catch-drill-species">{c.species}</div><div className="catch-drill-weight">{c.weight_lb}lb {c.weight_oz&&`${c.weight_oz}oz`}</div><div className="catch-drill-meta">{c.location}<br/>{new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div></div>
        </div>)}
      </div>
    )}
    <div style={{ height:16 }} />
  </div>;

  if (view === 'species') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop:4 }}><span className="section-title">Species Caught</span></div>
    {species.length === 0 ? <div className="empty-state"><div className="empty-state-title">No species logged yet</div></div> : (
      <div className="catches-grid">
        {species.map(s => { const count = catches.filter(c=>c.species===s).length; return <div className="catch-drill-card" key={s}>
          <div className="catch-drill-img"><FishImg species={s} style={{width:'100%',height:'100%',objectFit:'cover'}} /></div>
          <div className="catch-drill-body"><div className="catch-drill-species">{s}</div><div className="catch-drill-weight">{count} catch{count!==1?'es':''}</div></div>
        </div>; })}
      </div>
    )}
    <div style={{ height:16 }} />
  </div>;

  if (view === 'sessions') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop:4 }}><span className="section-title">Sessions</span></div>
    {sessions.length === 0 ? <div className="empty-state"><div className="empty-state-title">No sessions yet</div><div className="empty-state-text">Sessions are created automatically when you log catches.</div></div> : (
      <div className="sessions-list">
        {sessions.map((s,i) => <div className="session-row" key={i}>
          <div className="session-icon"><span style={{fontSize:20}}>🎣</span></div>
          <div><div className="session-name">{s.location||'Unknown'}</div><div className="session-meta">{s.date}</div></div>
          <div className="session-count">{s.catches} catch{s.catches!==1?'es':''}</div>
        </div>)}
      </div>
    )}
    <div style={{ height:16 }} />
  </div>;

  return <div>
    <div className="profile-header">
      <div className="profile-avatar">{firstName.charAt(0)}</div>
      <div>
        <div className="profile-name">{user?.user_metadata?.full_name || 'Angler'}</div>
        <div className="profile-since">{user?.email}</div>
        <div className="profile-badge">CatchBase Angler</div>
      </div>
    </div>
    <div className="section-header" style={{ paddingTop:4 }}><span className="section-title">Your Season</span></div>
    <div className="stats-grid">
      <div className="stat-card" onClick={() => setView('catches')}><div className="stat-num">{catches.length}</div><div className="stat-label">Total Catches ›</div></div>
      <div className="stat-card" onClick={() => setView('species')}><div className="stat-num">{species.length}</div><div className="stat-label">Species ›</div></div>
      <div className="stat-card"><div className="stat-num">{catches.length ? (catches.reduce((a,c)=>a+(parseFloat(c.weight_lb)||0),0)/catches.length).toFixed(1) : 0}</div><div className="stat-label">Avg lb</div></div>
      <div className="stat-card" onClick={() => setView('sessions')}><div className="stat-num">{sessions.length}</div><div className="stat-label">Sessions ›</div></div>
    </div>
    {pbs.length > 0 && <>
      <div className="section-header" style={{ paddingTop:24 }}><span className="section-title">Personal Bests</span></div>
      <div className="pb-list">
        {pbs.map((pb,i) => <div className="pb-row" key={i}>
          <div className="pb-left"><FishImg species={pb.species} className="pb-fish-img" style={{width:36,height:36,borderRadius:8,objectFit:'cover',flexShrink:0}} /><span className="pb-species">{pb.species}</span></div>
          <div className="pb-weight">{pb.weight}</div>
        </div>)}
      </div>
    </>}
    <div style={{ height:16 }} />
  </div>;
}

// ── ACCOUNT SCREEN ────────────────────────────────────────────────────────
function AccountScreen({ user, profile, onUpdate, onLogout }) {
  const [form, setForm] = useState({ ...profile });
  const [notifs, setNotifs] = useState({ newFollower:true, nearbyActivity:true, appUpdates:false });
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const handlePhoto = e => { const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>set('photo',ev.target.result); r.readAsDataURL(file); };
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'A';

  const handleSave = async () => { setSaving(true); await onUpdate(form); setSaving(false); };

  const Toggle = ({ k }) => <button className={`toggle-btn ${notifs[k]?'on':'off'}`} onClick={() => setNotifs(n=>({...n,[k]:!n[k]}))}><div className="toggle-knob"/></button>;

  return <div>
    <div className="section-header" style={{ paddingTop:24 }}><span className="section-title">Account</span></div>
    <div className="account-avatar-section">
      <button className="account-avatar-btn" onClick={() => ref.current.click()}>
        {form.photo ? <img src={form.photo} alt="avatar" /> : firstName.charAt(0)}
      </button>
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto} />
      <div className="account-avatar-label">Change profile photo</div>
    </div>
    <div className="account-inner">
      <div className="account-section-title">Profile</div>
      <div className="account-field-row">
        <div className="account-field-group"><label className="account-field-label">Full name</label><input className="account-input" placeholder="e.g. Matt Clarke" value={form.name||''} onChange={e=>set('name',e.target.value)}/></div>
        <div className="account-field-group"><label className="account-field-label">Username</label><input className="account-input" placeholder="e.g. @mattfishes" value={form.username||''} onChange={e=>set('username',e.target.value)}/></div>
      </div>
      <div className="account-field-row">
        <div className="account-field-group"><label className="account-field-label">Location</label><input className="account-input" placeholder="e.g. Southampton" value={form.location||''} onChange={e=>set('location',e.target.value)}/></div>
        <div className="account-field-group"><label className="account-field-label">Angling since</label><input className="account-input" placeholder="e.g. 2019" value={form.anglingYear||''} onChange={e=>set('anglingYear',e.target.value)}/></div>
      </div>
      <div className="account-field-group"><label className="account-field-label">Bio</label><textarea className="account-textarea" placeholder="A short description about yourself..." value={form.bio||''} onChange={e=>set('bio',e.target.value)}/></div>

      <div className="account-section-title">Account Details</div>
      <div className="account-field-group"><label className="account-field-label">Email</label><input className="account-input" value={user?.email||''} disabled style={{ opacity:0.6 }}/></div>

      <div className="account-section-title">Notifications</div>
      {[['newFollower','New followers','When someone follows you'],['nearbyActivity','Nearby catches','Catches logged near your area'],['appUpdates','App updates','News and new features']].map(([k,l,sub])=>(
        <div className="toggle-row" key={k}>
          <div><div className="toggle-label">{l}</div><div className="toggle-sub">{sub}</div></div>
          <Toggle k={k}/>
        </div>
      ))}

      <div style={{ paddingTop:24, paddingBottom:8 }}>
        <button className="account-save-btn" disabled={saving} onClick={handleSave}>{saving?'Saving...':'Save Changes'}</button>
        <button className="account-logout-btn" onClick={onLogout}>Log Out</button>
      </div>
      <div style={{ height:24 }} />
    </div>
  </div>;
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────
const NAV = [
  { id:'home', label:'Home', icon:<Icon.Home/> },
  { id:'feed', label:'Feed', icon:<Icon.Feed/> },
  { id:'map', label:'Map', icon:<Icon.Map/> },
  { id:'log', label:'Log', icon:<Icon.Log/> },
  { id:'tackle', label:'Tackle', icon:<Icon.Tackle/> },
  { id:'stats', label:'Stats', icon:<Icon.Stats/> },
  { id:'account', label:'Account', icon:<Icon.Account/> },
];

// ── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState({ msg:'', type:'', show:false });
  const [profile, setProfile] = useState({ name:'', username:'', location:'', anglingYear:'', bio:'', photo:null });
  const [catches, setCatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [catchPins, setCatchPins] = useState([]);
  const [spots, setSpots] = useState([]);
  const [tackleCategories, setTackleCategories] = useState([]);
  const [tackleItems, setTackleItems] = useState([]);
  const [customBaits, setCustomBaits] = useState([]);
  const [customLures, setCustomLures] = useState([]);

  // Load Leaflet
  useEffect(() => {
    const link = document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const script = document.createElement('script'); script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(script);
  }, []);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) loadAllData(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadAllData(u.id);
      else { setCatches([]); setSessions([]); setCatchPins([]); setSpots([]); setTackleCategories([]); setTackleItems([]); setProfile({ name:'', username:'', location:'', anglingYear:'', bio:'', photo:null }); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const DEFAULT_CATEGORIES = [
    { name:'Rods', emoji:'🎣' },
    { name:'Reels', emoji:'⚙️' },
    { name:'Lures', emoji:'🎯' },
    { name:'Terminal', emoji:'🪝' },
    { name:'Bait', emoji:'🧪' },
    { name:'Other', emoji:'🎒' },
  ];

  const loadAllData = async (uid) => {
    const [{ data:cats }, { data:itms }, { data:catchData }, { data:spotData }, { data:prof }] = await Promise.all([
      supabase.from('tackle_categories').select('*').eq('user_id', uid).order('created_at'),
      supabase.from('tackle_items').select('*').eq('user_id', uid).order('created_at'),
      supabase.from('catches').select('*').eq('user_id', uid).order('created_at', { ascending:false }),
      supabase.from('spots').select('*').eq('user_id', uid).order('created_at'),
      supabase.from('profiles').select('*').eq('id', uid).single(),
    ]);

    // Auto-create default categories for new users
    if (cats !== null && cats.length === 0) {
      const inserts = DEFAULT_CATEGORIES.map(c => ({ user_id:uid, name:c.name, emoji:c.emoji }));
      const { data:newCats, error:catErr } = await supabase.from('tackle_categories').insert(inserts).select();
      if (catErr) {
        console.error('Default category creation error:', catErr);
        setTackleCategories(DEFAULT_CATEGORIES.map((c,i) => ({ id:'default_'+i, user_id:uid, ...c })));
      } else if (newCats) {
        setTackleCategories(newCats);
      }
    } else if (cats && cats.length > 0) {
      // Deduplicate by id before setting
      const unique = cats.filter((c, idx, arr) => arr.findIndex(x => x.id === c.id) === idx);
      setTackleCategories(unique);
    }
    if (itms) setTackleItems(itms);
    if (catchData) {
      setCatches(catchData);
      setCatchPins(catchData.filter(c=>c.pin_lat&&c.pin_lng).map(c=>({ lat:c.pin_lat, lng:c.pin_lng, label:`${c.species} — ${c.weight_lb}lb` })));
      const sessMap = {};
      catchData.forEach(c => {
        const key = `${c.location||'Unknown'}__${c.created_at?.slice(0,10)}`;
        if (!sessMap[key]) sessMap[key] = { location:c.location||'Unknown', date:new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}), catches:0 };
        sessMap[key].catches++;
      });
      setSessions(Object.values(sessMap));
    }
    if (spotData) setSpots(spotData);
    if (prof) setProfile({ name:prof.full_name||'', username:prof.username||'', location:prof.location||'', anglingYear:prof.angling_year||'', bio:prof.bio||'', photo:prof.avatar_url||null });
  };

  const showToast = (msg, type='success') => { setToast({ msg, type, show:true }); setTimeout(() => setToast(t => ({...t, show:false})), 2500); };

  const handleSaveCatch = async (data) => {
    // Note: photos stored as base64 in local state only; DB stores text reference
    const { data:saved, error } = await supabase.from('catches').insert({
      user_id: user.id,
      species: data.species || null,
      weight_lb: data.weight_lb || null,
      weight_oz: data.weight_oz || null,
      length_cm: data.length_cm || null,
      length_in: data.length_in || null,
      bait: data.bait || null,
      lure: data.lure || null,
      location: data.location || null,
      notes: data.notes || null,
      pin_lat: data.pin?.lat || null,
      pin_lng: data.pin?.lng || null,
      privacy: data.privacy || 'Approximate',
    }).select().single();
    if (error) {
      console.error('Save catch error:', error);
      showToast('Failed to save: ' + error.message, 'error');
      return;
    }
    const savedWithPhoto = { ...saved, photo: data.photo };
    setCatches(p => [savedWithPhoto, ...p]);
    if (savedWithPhoto.pin_lat && savedWithPhoto.pin_lng) setCatchPins(p => [...p, { lat:savedWithPhoto.pin_lat, lng:savedWithPhoto.pin_lng, label:`${savedWithPhoto.species} — ${savedWithPhoto.weight_lb}lb` }]);
    const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    const loc = data.location||'Unknown';
    setSessions(prev => { const ex=prev.find(s=>s.date===today&&s.location===loc); if(ex) return prev.map(s=>s.date===today&&s.location===loc?{...s,catches:s.catches+1}:s); return [{location:loc,date:today,catches:1},...prev]; });
    showToast('Catch saved!');
    setScreen('home');
  };

  const handleUpdateCatch = async (id, updates) => {
    const { error } = await supabase.from('catches').update({
      species: updates.species,
      weight_lb: updates.weight_lb,
      weight_oz: updates.weight_oz,
      length_cm: updates.length_cm,
      bait: updates.bait,
      lure: updates.lure,
      location: updates.location,
      notes: updates.notes,
    }).eq('id', id);
    if (!error) {
      setCatches(p => p.map(c => c.id===id ? {...c, ...updates} : c));
      showToast('Catch updated!');
    } else {
      showToast('Failed to update: ' + error.message, 'error');
    }
  };

  const handleAddSpot = async (spot) => {
    const { data, error } = await supabase.from('spots').insert({ user_id:user.id, ...spot }).select().single();
    if (!error && data) setSpots(p => [...p, data]);
    showToast('Spot saved!');
  };

  const handleAddCategory = async (cat) => {
    const { data, error } = await supabase.from('tackle_categories')
      .insert({ user_id: user.id, name: cat.name, emoji: cat.emoji })
      .select().single();
    if (error) {
      console.error('Category save error:', error);
      showToast('Failed to save: ' + error.message, 'error');
    } else if (data) {
      setTackleCategories(p => {
        // Only add if not already in list (prevent duplicates)
        if (p.find(c => c.id === data.id)) return p;
        return [...p, data];
      });
      showToast('Category saved!');
    }
  };

  const handleAddItem = async (item) => {
    const { data, error } = await supabase.from('tackle_items').insert({
      user_id: user.id,
      category_id: item.category_id,
      name: item.name || null,
      brand: item.brand || null,
      price: item.price || null,
      purchase_date: item.purchaseDate || null,
      purchase_where: item.purchaseWhere || null,
      comments: item.comments || null,
    }).select().single();
    if (error) {
      console.error('Item save error:', error);
      showToast('Failed to save item: ' + error.message, 'error');
    } else if (data) {
      setTackleItems(p => {
        if (p.find(i => i.id === data.id)) return p;
        return [...p, { ...data, photo: item.photo }];
      });
      showToast('Item saved!');
    }
  };

  const handleUpdateItem = async (id, updates) => {
    const dbUpdates = {
      name: updates.name || null,
      brand: updates.brand || null,
      price: updates.price || null,
      purchase_date: updates.purchaseDate || updates.purchase_date || null,
      purchase_where: updates.purchaseWhere || updates.purchase_where || null,
      comments: updates.comments || null,
    };
    const { error } = await supabase.from('tackle_items').update(dbUpdates).eq('id', id);
    if (!error) { setTackleItems(p => p.map(i => i.id===id ? {...i,...updates} : i)); showToast('Item updated!'); }
    else { console.error('Update error:', error); showToast('Failed to update: ' + error.message, 'error'); }
  };

  const handleDeleteItem = async (id) => {
    const { error } = await supabase.from('tackle_items').delete().eq('id', id);
    if (!error) { setTackleItems(p => p.filter(i => i.id!==id)); showToast('Item deleted!'); }
  };

  const handleUpdateCategory = async (id, updates) => {
    const { error } = await supabase.from('tackle_categories').update({ name: updates.name, emoji: updates.emoji }).eq('id', id);
    if (!error) { setTackleCategories(p => p.map(c => c.id===id ? {...c, ...updates} : c)); showToast('Category updated!'); }
    else { showToast('Failed to update: ' + error.message, 'error'); }
    return { error };
  };

  const handleUpdateProfile = async (p) => {
    setProfile(p);
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: p.name,
      username: p.username,
      location: p.location,
      angling_year: p.anglingYear,
      bio: p.bio,
    });
    if (profErr) console.error('Profile save error:', profErr);
    showToast('Profile saved!');
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setScreen('home'); };

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onLog={() => setScreen('log')} catches={catches} user={user} />;
      case 'feed': return <FeedScreen catches={catches} user={user} />;
      case 'map': return <MapScreen catchPins={catchPins} spots={spots} onAddSpot={handleAddSpot} />;
      case 'log': return <LogScreen onSaved={handleSaveCatch} customBaits={customBaits} customLures={customLures} onAddCustomBait={b => setCustomBaits(p => p.includes(b)?p:[...p,b])} onAddCustomLure={l => setCustomLures(p => p.includes(l)?p:[...p,l])} user={user} />;
      case 'tackle': return <TackleScreen user={user} categories={tackleCategories} items={tackleItems} onAddCategory={handleAddCategory} onAddItem={handleAddItem} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} onUpdateCategory={handleUpdateCategory} />;
      case 'stats': return <StatsScreen catches={catches} sessions={sessions} user={user} onUpdateCatch={handleUpdateCatch} />;
      case 'account': return <AccountScreen user={user} profile={profile} onUpdate={handleUpdateProfile} onLogout={handleLogout} />;
      default: return <HomeScreen onLog={() => setScreen('log')} catches={catches} user={user} />;
    }
  };

  if (authLoading) return <>
    <style>{styles}</style>
    <div className="loading-screen">
      <div className="loading-logo">CATCH<span>BASE</span></div>
      <div className="loading-spinner" />
    </div>
  </>;

  if (!user) return <>
    <style>{styles}</style>
    <AuthScreen />
  </>;

  return <>
    <style>{styles}</style>
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-logo">CATCH<span>BASE</span></div>
        <div className="sidebar-user">
          <div className="sidebar-user-name">{profile.name || user?.user_metadata?.full_name || 'Angler'}</div>
          <div className="sidebar-user-email">{user?.email}</div>
        </div>
        {NAV.map(n => <button key={n.id} className={`sidebar-item${screen===n.id?' active':''}`} onClick={() => setScreen(n.id)}>{n.icon}{n.label}</button>)}
        <button className="sidebar-item danger" style={{ marginTop:'auto' }} onClick={handleLogout}>Log Out</button>
      </nav>
      <div className="main-content">{renderScreen()}</div>
      <nav className="bottom-nav">
        {NAV.map(n => <button key={n.id} className={`nav-item${screen===n.id?' active':''}`} onClick={() => setScreen(n.id)}>{n.icon}{n.label}</button>)}
      </nav>
      <div className={`toast${toast.show?' show':''} ${toast.type==='error'?'error':''}`}>{toast.msg}</div>
    </div>
  </>;
}
