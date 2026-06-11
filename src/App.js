import React, { useState, useEffect, useRef } from 'react';

// ── STYLES ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#F8F7F4; --white:#FFFFFF; --blue:#3B9EE8; --blue2:#2B8ED8;
    --dark:#1A1A1F; --mid:#6B7280; --light:#E5E7EB;
    --shadow:0 2px 12px rgba(0,0,0,0.08); --shadow2:0 4px 24px rgba(0,0,0,0.12);
  }
  html,body,#root { height:100%; background:var(--bg); color:var(--dark); font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }
  .app { display:flex; flex-direction:column; height:100vh; overflow:hidden; }
  @media(min-width:768px){
    body{background:#ECEAE6;}
    .app{flex-direction:row;}
    .bottom-nav{display:none!important;}
    .sidebar{display:flex!important;}
    .main-content{flex:1;overflow-y:auto;padding-bottom:40px;}
    .hero{padding:48px 48px 44px;}
    .cards-row{padding:0 32px 4px;}
    .section-header{padding:24px 32px 12px;}
    .quick-actions{padding:0 32px;}
    .feed-post{margin:0 32px 14px;}
    .map-wrap{padding:0 32px;}
    .map-controls{padding:0 32px 8px;}
    .spot-list{padding:0 32px;}
    .log-form{padding:0 32px;}
    .tackle-grid{padding:0 32px;grid-template-columns:1fr 1fr 1fr;}
    .item-grid{padding:0 32px;grid-template-columns:1fr 1fr 1fr;}
    .stats-grid{padding:0 32px;grid-template-columns:1fr 1fr 1fr 1fr;}
    .pb-list{padding:0 32px;}
    .profile-header{padding:24px 32px;}
    .back-btn{padding:20px 32px 8px;}
    .item-detail{padding:0 32px;}
    .tide-card{margin:32px 32px 0;}
    .catches-grid{padding:0 32px;}
    .sessions-list{padding:0 32px;}
    .account-form{padding:0 32px;}
    .account-fields-grid{grid-template-columns:1fr 1fr!important;}
  }
  .sidebar{display:none;flex-direction:column;width:240px;min-width:240px;background:var(--white);border-right:1px solid var(--light);padding:32px 16px;gap:4px;box-shadow:2px 0 12px rgba(0,0,0,0.04);}
  .sidebar-logo{font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--dark);padding:0 12px 24px;letter-spacing:0.02em;}
  .sidebar-logo span{color:var(--blue);}
  .sidebar-item{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;cursor:pointer;border:none;background:none;color:var(--mid);font-family:'Inter',sans-serif;font-size:15px;font-weight:600;transition:all 0.2s;width:100%;text-align:left;}
  .sidebar-item svg{width:20px;height:20px;flex-shrink:0;}
  .sidebar-item:hover{background:var(--bg);color:var(--dark);}
  .sidebar-item.active{background:rgba(59,158,232,0.1);color:var(--blue);}
  .sidebar-version{margin-top:auto;font-size:11px;color:var(--mid);padding:0 12px;}
  .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:var(--white);border-top:1px solid var(--light);display:flex;z-index:100;padding:8px 0 max(8px,env(safe-area-inset-bottom));box-shadow:0 -4px 20px rgba(0,0,0,0.06);}
  .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;cursor:pointer;border:none;background:none;color:var(--mid);font-family:'Inter',sans-serif;font-size:11px;font-weight:500;transition:color 0.2s;}
  .nav-item.active{color:var(--blue);}
  .nav-item svg{width:22px;height:22px;}
  .screen{flex:1;overflow-y:auto;padding-bottom:120px;background:var(--bg);}
  .main-content{flex:1;overflow-y:auto;background:var(--bg);padding-bottom:120px;}
  .hero{background:linear-gradient(150deg,#3B9EE8 0%,#2B8ED8 100%);padding:48px 24px 36px;position:relative;overflow:hidden;}
  .hero::after{content:'';position:absolute;bottom:-30px;left:-10%;right:-10%;height:60px;background:var(--bg);border-radius:50% 50% 0 0/100% 100% 0 0;}
  .hero-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:10px;}
  .hero-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,13vw,80px);line-height:0.92;color:white;}
  .hero-title span{color:rgba(255,255,255,0.6);}
  .hero-subtitle{margin-top:12px;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;max-width:400px;}
  .hero-stats{display:flex;gap:28px;margin-top:28px;flex-wrap:wrap;}
  .hero-stat-val{font-family:'Bebas Neue',sans-serif;font-size:28px;color:white;line-height:1;}
  .hero-stat-label{font-size:11px;color:rgba(255,255,255,0.7);margin-top:2px;}
  .tide-card{margin:32px 16px 0;background:var(--white);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;}
  .tide-header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid var(--light);}
  .tide-title{font-size:14px;font-weight:700;color:var(--dark);}
  .tide-location{font-size:12px;color:var(--blue);font-weight:600;}
  .tide-times{display:flex;flex-wrap:wrap;}
  .tide-time{flex:1;min-width:80px;padding:12px 14px;display:flex;align-items:center;gap:10px;border-right:1px solid var(--light);}
  .tide-time:last-child{border-right:none;}
  .tide-icon{font-size:20px;}
  .tide-type{font-size:10px;color:var(--mid);font-weight:700;text-transform:uppercase;letter-spacing:0.05em;}
  .tide-val{font-size:15px;font-weight:700;color:var(--dark);margin-top:1px;}
  .tide-height{font-size:12px;color:var(--blue);font-weight:600;}
  .tide-loading{padding:20px;font-size:14px;color:var(--mid);text-align:center;}
  .section-header{display:flex;align-items:center;justify-content:space-between;padding:24px 18px 12px;}
  .section-title{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);}
  .section-link{font-size:13px;color:var(--blue);font-weight:600;cursor:pointer;}
  .cards-row{display:flex;gap:12px;padding:0 16px 4px;overflow-x:auto;}
  .cards-row::-webkit-scrollbar{display:none;}
  .catch-card{flex-shrink:0;width:165px;background:var(--white);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;border:1px solid var(--light);}
  .catch-card:hover{transform:translateY(-2px);box-shadow:var(--shadow2);}
  .catch-card-img-wrap{width:100%;height:100px;overflow:hidden;background:#E8F4FD;display:flex;align-items:center;justify-content:center;}
  .catch-card-img{width:100%;height:100%;object-fit:cover;}
  .catch-card-body{padding:12px;}
  .catch-card-species{font-size:14px;font-weight:700;color:var(--dark);}
  .catch-card-weight{font-size:13px;color:var(--blue);font-weight:600;margin-top:2px;}
  .catch-card-meta{font-size:11px;color:var(--mid);margin-top:6px;line-height:1.5;}
  .quick-actions{display:flex;gap:10px;padding:0 16px;flex-wrap:wrap;}
  .btn-primary{flex:1;padding:16px;border:none;border-radius:14px;background:var(--blue);color:white;font-size:15px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:background 0.2s,transform 0.1s;box-shadow:0 4px 16px rgba(59,158,232,0.3);}
  .btn-primary:hover{background:var(--blue2);}
  .btn-primary:active{transform:scale(0.98);}
  .btn-secondary{flex:1;padding:16px;border:2px solid var(--blue);border-radius:14px;background:white;color:var(--blue);font-size:15px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:all 0.2s;}
  .btn-secondary:hover{background:rgba(59,158,232,0.05);}
  .feed-tabs{display:flex;margin:16px 16px 0;background:var(--light);border-radius:14px;padding:4px;gap:4px;}
  .feed-tab{flex:1;padding:10px;text-align:center;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--mid);transition:all 0.2s;border:none;background:none;font-family:'Inter',sans-serif;}
  .feed-tab.active{background:var(--white);color:var(--blue);box-shadow:var(--shadow);}
  .dist-badge{font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:rgba(59,158,232,0.1);color:var(--blue);border:1px solid rgba(59,158,232,0.2);white-space:nowrap;}
  .feed-post{margin:0 16px 14px;background:var(--white);border-radius:20px;overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--light);}
  .feed-post-header{display:flex;align-items:center;gap:12px;padding:16px;}
  .feed-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--blue),#0055AA);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
  .feed-username{font-size:15px;font-weight:700;color:var(--dark);}
  .feed-location{font-size:12px;color:var(--mid);margin-top:1px;}
  .feed-badge{font-size:11px;font-weight:700;padding:5px 10px;border-radius:20px;background:rgba(59,158,232,0.1);color:var(--blue);border:1px solid rgba(59,158,232,0.2);white-space:nowrap;}
  .feed-img-area{width:100%;height:200px;overflow:hidden;background:#E8F4FD;display:flex;align-items:center;justify-content:center;}
  .feed-img-area img{width:100%;height:100%;object-fit:cover;}
  .feed-post-body{padding:14px 16px;}
  .feed-post-text{font-size:14px;line-height:1.6;color:var(--dark);}
  .feed-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
  .feed-tag{font-size:12px;color:var(--blue);padding:3px 10px;border-radius:20px;border:1px solid rgba(59,158,232,0.3);background:rgba(59,158,232,0.05);}
  .feed-actions{display:flex;border-top:1px solid var(--light);}
  .feed-action{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:13px;cursor:pointer;border:none;background:none;color:var(--mid);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;transition:color 0.2s;}
  .feed-action:hover{color:var(--blue);}
  .feed-action.liked{color:#EF4444;}
  .feed-action svg{width:17px;height:17px;}
  .map-wrap{padding:0 16px;}
  .map-controls{padding:0 16px 8px;}
  .map-top-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;}
  .map-toggle-group{display:flex;background:var(--white);border:1px solid var(--light);border-radius:20px;overflow:hidden;box-shadow:var(--shadow);}
  .map-toggle-btn{padding:8px 16px;font-size:13px;font-weight:600;border:none;background:none;color:var(--mid);cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
  .map-toggle-btn.active{background:var(--blue);color:white;}
  .map-home-btn{padding:8px 14px;font-size:13px;font-weight:600;border:2px solid var(--light);border-radius:20px;background:var(--white);color:var(--mid);cursor:pointer;font-family:'Inter',sans-serif;box-shadow:var(--shadow);transition:all 0.2s;display:flex;align-items:center;gap:6px;}
  .map-home-btn:hover{border-color:var(--blue);color:var(--blue);}
  .pin-filter-row{display:flex;gap:8px;flex-wrap:wrap;}
  .pin-filter-btn{padding:7px 14px;font-size:12px;font-weight:600;border:2px solid var(--light);border-radius:20px;background:var(--white);color:var(--mid);cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
  .pin-filter-btn.active{border-color:var(--blue);color:var(--blue);background:rgba(59,158,232,0.05);}
  .spot-list{padding:0 16px;}
  .spot-item{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--light);}
  .spot-icon{width:46px;height:46px;border-radius:14px;background:rgba(59,158,232,0.1);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
  .spot-name{font-size:15px;font-weight:600;color:var(--dark);}
  .spot-meta{font-size:12px;color:var(--mid);margin-top:2px;}
  .spot-dist{font-size:13px;color:var(--blue);font-weight:700;margin-left:auto;white-space:nowrap;}
  .log-form{padding:0 16px;}
  .form-label{font-size:13px;font-weight:700;color:var(--dark);margin-bottom:8px;display:block;}
  .form-group{margin-bottom:20px;}
  .form-input,.form-select,.form-textarea{width:100%;background:var(--white);border:2px solid var(--light);border-radius:12px;padding:14px 16px;color:var(--dark);font-size:15px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
  .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--blue);}
  .form-input::placeholder,.form-textarea::placeholder{color:var(--mid);}
  .form-textarea{resize:none;height:90px;line-height:1.6;}
  .search-dropdown{position:relative;}
  .search-dropdown-input{width:100%;background:var(--white);border:2px solid var(--light);border-radius:12px;padding:12px 16px 12px 40px;color:var(--dark);font-size:15px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;}
  .search-dropdown-input:focus{border-color:var(--blue);}
  .search-dropdown-input::placeholder{color:var(--mid);}
  .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--mid);pointer-events:none;}
  .search-clear{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--mid);font-size:18px;line-height:1;padding:2px;}
  .dropdown-list{background:var(--white);border:2px solid var(--blue);border-radius:12px;margin-top:4px;max-height:200px;overflow-y:auto;box-shadow:var(--shadow2);position:relative;z-index:50;}
  .dropdown-group-label{padding:8px 14px 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--mid);background:var(--bg);border-bottom:1px solid var(--light);}
  .dropdown-item{padding:11px 14px;font-size:14px;color:var(--dark);cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--light);}
  .dropdown-item:last-child{border-bottom:none;}
  .dropdown-item:hover,.dropdown-item.selected{background:rgba(59,158,232,0.08);color:var(--blue);font-weight:600;}
  .dropdown-item.custom{color:var(--blue);font-weight:600;}
  .selected-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(59,158,232,0.1);border:1px solid rgba(59,158,232,0.3);border-radius:10px;font-size:14px;font-weight:600;color:var(--blue);margin-top:6px;}
  .selected-badge-x{cursor:pointer;font-size:16px;color:var(--mid);line-height:1;}
  .bait-lure-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .photo-upload{border:2px dashed var(--light);border-radius:14px;overflow:hidden;cursor:pointer;transition:border-color 0.2s;}
  .photo-upload:hover{border-color:var(--blue);}
  .photo-upload-empty{padding:24px;display:flex;flex-direction:column;align-items:center;gap:8px;}
  .photo-upload-icon{font-size:32px;}
  .photo-upload-text{font-size:14px;font-weight:600;color:var(--blue);}
  .photo-upload-sub{font-size:12px;color:var(--mid);}
  .photo-preview{position:relative;width:100%;height:200px;}
  .photo-preview img{width:100%;height:100%;object-fit:cover;}
  .photo-remove{position:absolute;top:8px;right:8px;width:28px;height:28px;background:rgba(0,0,0,0.6);border:none;border-radius:50%;color:white;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;}
  .weight-row{display:flex;gap:10px;}
  .weight-row .form-input{flex:1;}
  .weight-unit{width:56px;background:var(--light);border:2px solid var(--light);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--mid);}
  .privacy-toggle{display:flex;background:var(--light);border-radius:12px;padding:4px;gap:4px;}
  .privacy-opt{flex:1;padding:11px 8px;text-align:center;cursor:pointer;font-size:13px;font-weight:600;color:var(--mid);transition:all 0.2s;border-radius:9px;}
  .privacy-opt.active{background:var(--white);color:var(--blue);box-shadow:var(--shadow);}
  .log-map{border-radius:14px;overflow:hidden;border:2px solid var(--blue);margin-top:12px;position:relative;z-index:1;}
  .map-picker-hint{font-size:12px;color:var(--mid);margin-top:6px;text-align:center;}
  .circle-slider{margin-top:12px;}
  .circle-slider label{font-size:12px;color:var(--mid);font-weight:600;display:flex;justify-content:space-between;margin-bottom:6px;}
  .circle-slider input[type=range]{width:100%;accent-color:var(--blue);}
  .tackle-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px;}
  .tackle-cat{background:var(--white);border:2px solid var(--light);border-radius:18px;padding:18px;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
  .tackle-cat:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:var(--shadow2);}
  .tackle-cat-img{width:100%;height:80px;border-radius:10px;overflow:hidden;margin-bottom:12px;background:#E8F4FD;display:flex;align-items:center;justify-content:center;}
  .tackle-cat-img img{width:100%;height:100%;object-fit:cover;}
  .tackle-name{font-size:15px;font-weight:700;color:var(--dark);}
  .tackle-count{font-size:12px;color:var(--mid);margin-top:3px;}
  .tackle-bar{height:4px;background:var(--light);border-radius:2px;margin-top:14px;}
  .tackle-bar-fill{height:100%;border-radius:2px;background:var(--blue);}
  .back-btn{display:flex;align-items:center;gap:8px;padding:20px 16px 8px;cursor:pointer;border:none;background:none;font-size:15px;font-weight:600;color:var(--blue);font-family:'Inter',sans-serif;}
  .item-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px;}
  .item-card{background:var(--white);border:2px solid var(--light);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
  .item-card:hover{border-color:var(--blue);transform:translateY(-2px);}
  .item-card-img-wrap{width:100%;height:100px;overflow:hidden;background:#E8F4FD;display:flex;align-items:center;justify-content:center;}
  .item-card-img{width:100%;height:100%;object-fit:cover;}
  .item-card-img-emoji{font-size:40px;}
  .item-card-body{padding:10px 12px;}
  .item-card-name{font-size:14px;font-weight:700;color:var(--dark);}
  .item-card-brand{font-size:12px;color:var(--mid);margin-top:2px;}
  .item-card-price{font-size:13px;color:var(--blue);font-weight:700;margin-top:4px;}
  .add-item-card{background:rgba(59,158,232,0.05);border:2px dashed rgba(59,158,232,0.4);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:160px;cursor:pointer;transition:all 0.2s;gap:8px;}
  .add-item-card:hover{background:rgba(59,158,232,0.1);}
  .add-item-card span{font-size:28px;}
  .add-item-card p{font-size:13px;font-weight:700;color:var(--blue);}
  .add-cat-card{background:rgba(59,158,232,0.04);border:2px dashed rgba(59,158,232,0.3);border-radius:18px;padding:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:130px;cursor:pointer;transition:all 0.2s;gap:6px;}
  .add-cat-card:hover{background:rgba(59,158,232,0.08);}
  .add-cat-card span{font-size:24px;color:var(--blue);}
  .add-cat-card p{font-size:13px;font-weight:600;color:var(--blue);}
  .item-detail{padding:0 16px;}
  .item-detail-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
  .item-detail-img-wrap{width:100%;height:200px;border-radius:18px;background:#E8F4FD;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border:2px solid var(--light);overflow:hidden;}
  .item-detail-img{width:100%;height:100%;object-fit:cover;}
  .item-detail-img-emoji{font-size:80px;}
  .item-detail-name{font-size:22px;font-weight:800;color:var(--dark);}
  .item-detail-brand{font-size:14px;color:var(--mid);margin-top:4px;}
  .item-detail-price{font-size:20px;font-weight:700;color:var(--blue);margin-top:6px;}
  .item-detail-meta{font-size:13px;color:var(--mid);margin-top:4px;}
  .item-detail-comments{background:var(--bg);border-radius:12px;padding:14px;margin-top:8px;font-size:14px;color:var(--dark);line-height:1.6;border:1px solid var(--light);}
  .edit-btn{padding:8px 16px;border:2px solid var(--blue);border-radius:20px;background:white;color:var(--blue);font-size:13px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
  .delete-btn{padding:12px 16px;border:2px solid #EF4444;border-radius:12px;background:white;color:#EF4444;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;margin-top:8px;width:100%;}
  .detail-section{margin-top:24px;}
  .detail-section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--mid);margin-bottom:12px;}
  .catch-history-item{display:flex;align-items:center;gap:12px;padding:12px;background:var(--white);border-radius:12px;margin-bottom:8px;border:1px solid var(--light);box-shadow:var(--shadow);}
  .catch-history-img-wrap{width:44px;height:44px;border-radius:10px;overflow:hidden;background:#E8F4FD;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .catch-history-img{width:100%;height:100%;object-fit:cover;}
  .catch-history-species{font-size:15px;font-weight:700;color:var(--dark);}
  .catch-history-meta{font-size:12px;color:var(--mid);margin-top:2px;}
  .catch-history-weight{font-size:14px;font-weight:700;color:var(--blue);margin-left:auto;white-space:nowrap;}
  .profile-header{display:flex;align-items:center;gap:16px;padding:20px 16px 24px;}
  .profile-avatar-wrap{position:relative;width:68px;height:68px;flex-shrink:0;}
  .profile-avatar{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,var(--blue),#0055AA);display:flex;align-items:center;justify-content:center;font-size:30px;box-shadow:0 0 0 4px rgba(59,158,232,0.2);overflow:hidden;}
  .profile-avatar img{width:100%;height:100%;object-fit:cover;}
  .profile-name{font-size:22px;font-weight:800;color:var(--dark);}
  .profile-since{font-size:13px;color:var(--mid);margin-top:2px;}
  .profile-badge{display:inline-block;margin-top:6px;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;background:rgba(59,158,232,0.1);color:var(--blue);border:1px solid rgba(59,158,232,0.3);}
  .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px;}
  .stat-card{background:var(--white);border:1px solid var(--light);border-radius:16px;padding:20px 16px;text-align:center;box-shadow:var(--shadow);cursor:pointer;transition:all 0.2s;}
  .stat-card:hover{border-color:var(--blue);transform:translateY(-2px);}
  .stat-num{font-family:'Bebas Neue',sans-serif;font-size:44px;color:var(--blue);line-height:1;}
  .stat-label{font-size:12px;color:var(--mid);margin-top:4px;font-weight:600;}
  .pb-list{padding:0 16px;margin-top:4px;}
  .pb-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--light);}
  .pb-left{display:flex;align-items:center;gap:10px;}
  .pb-fish-img{width:36px;height:36px;border-radius:8px;object-fit:cover;background:#E8F4FD;}
  .pb-species{font-size:15px;font-weight:600;color:var(--dark);}
  .pb-weight{font-size:14px;font-weight:700;color:var(--blue);}
  .catches-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px;}
  .catch-drill-card{background:var(--white);border:2px solid var(--light);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);}
  .catch-drill-img{width:100%;height:90px;background:#E8F4FD;display:flex;align-items:center;justify-content:center;overflow:hidden;}
  .catch-drill-body{padding:10px 12px;}
  .catch-drill-species{font-size:14px;font-weight:700;color:var(--dark);}
  .catch-drill-weight{font-size:13px;color:var(--blue);font-weight:600;margin-top:2px;}
  .catch-drill-meta{font-size:11px;color:var(--mid);margin-top:4px;line-height:1.5;}
  .sessions-list{padding:0 16px;}
  .session-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--light);}
  .session-icon{width:46px;height:46px;border-radius:14px;background:rgba(59,158,232,0.1);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
  .session-name{font-size:15px;font-weight:600;color:var(--dark);}
  .session-meta{font-size:12px;color:var(--mid);margin-top:2px;}
  .session-count{font-size:13px;color:var(--blue);font-weight:700;margin-left:auto;white-space:nowrap;}

  /* ── ACCOUNT PAGE ── */
  .account-form{padding:0 16px;}
  .account-inner{max-width:520px;margin:0 auto;}
  .account-avatar-section{display:flex;flex-direction:column;align-items:center;padding:24px 16px 16px;}
  .account-avatar{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,var(--blue),#0055AA);display:flex;align-items:center;justify-content:center;font-size:40px;overflow:hidden;box-shadow:0 0 0 4px rgba(59,158,232,0.2);cursor:pointer;border:none;}
  .account-avatar img{width:100%;height:100%;object-fit:cover;}
  .account-avatar-label{font-size:13px;color:var(--blue);font-weight:600;margin-top:10px;cursor:pointer;}
  .account-section-title{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);padding:20px 0 12px;}
  .account-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
  .account-field-group{margin-bottom:12px;}
  .account-field-label{font-size:12px;font-weight:700;color:var(--dark);display:block;margin-bottom:6px;letter-spacing:0.04em;}
  .account-input{width:100%;background:var(--white);border:2px solid var(--light);border-radius:10px;padding:11px 14px;color:var(--dark);font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
  .account-input:focus{border-color:var(--blue);}
  .account-input::placeholder{color:var(--mid);}
  .account-textarea{width:100%;background:var(--white);border:2px solid var(--light);border-radius:10px;padding:11px 14px;color:var(--dark);font-size:14px;font-family:'Inter',sans-serif;outline:none;resize:none;height:80px;line-height:1.6;transition:border-color 0.2s;}
  .account-textarea:focus{border-color:var(--blue);}
  .account-textarea::placeholder{color:var(--mid);}
  .account-save-btn{display:block;width:100%;max-width:240px;padding:14px;border:none;border-radius:14px;background:var(--blue);color:white;font-size:15px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;margin-top:8px;box-shadow:0 4px 16px rgba(59,158,232,0.3);transition:background 0.2s;}
  .account-save-btn:hover{background:var(--blue2);}
  .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--light);}
  .toggle-label{font-size:15px;font-weight:500;color:var(--dark);}
  .toggle-sub{font-size:12px;color:var(--mid);margin-top:2px;}
  .toggle-switch{width:48px;height:26px;border-radius:13px;cursor:pointer;transition:background 0.2s;border:none;position:relative;flex-shrink:0;}
  .toggle-switch.on{background:var(--blue);}
  .toggle-switch.off{background:var(--light);}
  .toggle-knob{width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.2);}
  .toggle-switch.on .toggle-knob{left:25px;}
  .toggle-switch.off .toggle-knob{left:3px;}

  .toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--blue);color:white;font-weight:700;font-size:15px;padding:14px 28px;border-radius:20px;box-shadow:0 8px 32px rgba(59,158,232,0.4);opacity:0;transition:opacity 0.3s,transform 0.3s;pointer-events:none;white-space:nowrap;z-index:999;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  .leaflet-container{background:#E8F4FD;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--light);border-radius:2px;}
  .btn-add{padding:12px 16px;border:2px solid var(--blue);border-radius:12px;background:rgba(59,158,232,0.08);color:var(--blue);font-size:14px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;transition:all 0.2s;}
  .btn-add:hover{background:rgba(59,158,232,0.15);}
`;

// ── DATA ──────────────────────────────────────────────────────────────────
const SEA_SPECIES = ['Sea Bass','Cod','Mackerel','Pollock','Flounder','Plaice','Whiting','Dogfish','Conger Eel','Smoothhound','Bull Huss','Wrasse','Grey Mullet','Dab','Turbot','Thornback Ray','Black Bream','Garfish','Coalfish','Pouting'];
const RIVER_SPECIES = ['Brown Trout','Sea Trout','Atlantic Salmon','Barbel','Chub','Roach','Dace','Grayling','Pike','Perch','Tench','Bream','Rudd','Carp'];
const SEA_BAITS = ['Ragworm','Lugworm','Mackerel Strip','Squid','Sandeel','Peeler Crab','Hermit Crab','Mussel','Limpet'];
const RIVER_BAITS = ['Maggots','Casters','Worm','Bread','Pellets','Boilies','Corn','Hemp','Paste'];
const SEA_LURES = ['Savage Gear Sandeel','Rapala X-Rap','Dexter Wedge','Toby Spoon','Berkley Ripple Shad','Fiiish Black Minnow','Storm Biscay Shad','Westin Sandy Andy'];
const RIVER_LURES = ['Mepps Aglia Spinner','Rapala Original Floater','Daiwa Prorex Shad','Abu Garcia Toby','Salmo Hornet','Blue Fox Vibrax','Savage Gear 3D Roach'];

const FISH_PHOTOS = {
  'Sea Bass':'https://inaturalist-open-data.s3.amazonaws.com/photos/242886/medium.jpg',
  'Cod':'https://inaturalist-open-data.s3.amazonaws.com/photos/27042/medium.jpg',
  'Mackerel':'https://inaturalist-open-data.s3.amazonaws.com/photos/310257/medium.jpg',
  'Pollock':'https://inaturalist-open-data.s3.amazonaws.com/photos/2960933/medium.jpg',
  'Flounder':'https://inaturalist-open-data.s3.amazonaws.com/photos/5143/medium.jpg',
  'Plaice':'https://inaturalist-open-data.s3.amazonaws.com/photos/3339702/medium.jpg',
  'Whiting':'https://inaturalist-open-data.s3.amazonaws.com/photos/1063916/medium.jpg',
  'Brown Trout':'https://inaturalist-open-data.s3.amazonaws.com/photos/1113477/medium.jpg',
  'Atlantic Salmon':'https://inaturalist-open-data.s3.amazonaws.com/photos/1040797/medium.jpg',
  'Pike':'https://inaturalist-open-data.s3.amazonaws.com/photos/123647/medium.jpg',
  'Perch':'https://inaturalist-open-data.s3.amazonaws.com/photos/2162/medium.jpg',
  'Barbel':'https://inaturalist-open-data.s3.amazonaws.com/photos/7702/medium.jpg',
  'Roach':'https://inaturalist-open-data.s3.amazonaws.com/photos/10411/medium.jpg',
  'Tench':'https://inaturalist-open-data.s3.amazonaws.com/photos/35329/medium.jpg',
  'Bream':'https://inaturalist-open-data.s3.amazonaws.com/photos/10430/medium.jpg',
  'Carp':'https://inaturalist-open-data.s3.amazonaws.com/photos/20034/medium.jpg',
  'Smoothhound':'https://inaturalist-open-data.s3.amazonaws.com/photos/19208/medium.jpg',
  'Wrasse':'https://inaturalist-open-data.s3.amazonaws.com/photos/57620/medium.jpg',
  'Chub':'https://inaturalist-open-data.s3.amazonaws.com/photos/10419/medium.jpg',
  'Grayling':'https://inaturalist-open-data.s3.amazonaws.com/photos/1478218/medium.jpg',
};

const TACKLE_PHOTOS = {
  'Rods':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Fishing_rod_with_reel.jpg/400px-Fishing_rod_with_reel.jpg',
  'Reels':'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Shimano_reel.jpg/400px-Shimano_reel.jpg',
  'Lures':'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Fishing_lures.jpg/400px-Fishing_lures.jpg',
  'Terminal':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Fishing_hooks.jpg/400px-Fishing_hooks.jpg',
  'Bait':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Lugworm_bait.jpg/400px-Lugworm_bait.jpg',
  'Other':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Fishing_tackle_box.jpg/400px-Fishing_tackle_box.jpg',
};

const RECENT_CATCHES = [
  {id:1,species:'Sea Bass',weight:'4lb 8oz',location:'Chesil Beach',date:'Today'},
  {id:2,species:'Cod',weight:'6lb 14oz',location:'Whitby Pier',date:'Yesterday'},
  {id:3,species:'Mackerel',weight:'1lb 2oz',location:'Brighton Pier',date:'2 days ago'},
  {id:4,species:'Pollock',weight:'3lb 6oz',location:'Lyme Regis',date:'3 days ago'},
];
const FEED_POSTS_FOLLOWING = [
  {id:1,user:'SouthCoastSam',avatar:'🎣',location:'Chesil Beach, Dorset',lat:50.613,lng:-2.456,species:'Sea Bass',weight:'7lb 2oz',text:"Incredible dawn session at Chesil this morning. Used ragworm on a running leger rig — took about 40 minutes but absolutely worth the wait. Biggest bass of the year!",tags:['SeaBass','ChesilBeach','Ragworm'],likes:54,comments:18,liked:false,dist:4.2},
  {id:2,user:'NorthSeaNick',avatar:'🦅',location:'Whitby Pier, Yorkshire',lat:54.486,lng:-0.612,species:'Cod',weight:'9lb 4oz',text:"Winter cod are back at Whitby! Peeler crab fished on the sea bed just off the pier end. Three fish in two hours — this is what it's all about.",tags:['CodFishing','Whitby','PeelerCrab'],likes:92,comments:37,liked:true,dist:234},
];
const FEED_POSTS_EXPLORE = [
  {id:3,user:'WestCountryWill',avatar:'🌊',location:'Lyme Regis, Dorset',lat:50.723,lng:-2.938,species:'Pollock',weight:'5lb 2oz',text:"Great session off the Cobb this evening. Fiiish Black Minnow on the drop — three pollock in an hour.",tags:['Pollock','LymeRegis','Lure'],likes:31,comments:9,liked:false,dist:8.7},
  {id:4,user:'KentCoastKev',avatar:'🐟',location:'Dungeness, Kent',lat:50.914,lng:0.978,species:'Mackerel',weight:'1lb 8oz',text:"Mackerel and whiting coming thick and fast off Dungeness this weekend. Feathers on a 4oz lead.",tags:['Mackerel','Dungeness','Feathers'],likes:44,comments:12,liked:false,dist:18.3},
  {id:5,user:'NorfolkNige',avatar:'🦈',location:'Cromer Pier, Norfolk',lat:52.931,lng:1.302,species:'Cod',weight:'4lb 8oz',text:"First cod of the season off Cromer! Lugworm tipped with squid, night session. Worth every cold minute.",tags:['Cod','Cromer','Lugworm'],likes:67,comments:22,liked:false,dist:112},
  {id:6,user:'PlymouthPete',avatar:'🎣',location:'Plymouth Sound',lat:50.366,lng:-4.142,species:'Sea Bass',weight:'6lb 0oz',text:"Surface lure fishing in the Sound producing some cracking bass. Savage Gear Sandeel walk-the-dog retrieve.",tags:['SeaBass','Plymouth','SurfaceLure'],likes:88,comments:31,liked:false,dist:156},
];
const SPOTS = [
  {name:'Chesil Beach',type:'Sea — Surf Beach',fish:'Bass, Cod, Dogfish',dist:'4.2mi',emoji:'🌊'},
  {name:'Whitby Pier',type:'Sea — Pier',fish:'Cod, Whiting, Mackerel',dist:'12mi',emoji:'🏗️'},
  {name:'River Itchen',type:'River',fish:'Brown Trout, Grayling',dist:'2.1mi',emoji:'🏞️'},
  {name:'Brighton Marina',type:'Sea — Marina',fish:'Bass, Wrasse, Mullet',dist:'8.7mi',emoji:'⚓'},
];
const INITIAL_TACKLE = [
  {id:'rods',name:'Rods',emoji:'🎣',items:[
    {id:'r1',name:'Daiwa Ninja X',brand:'Daiwa',price:'89.99',purchaseDate:'12 Mar 2024',purchaseWhere:'Veals Fishing',comments:'Great all-round sea rod.',photo:null,catches:[{species:'Sea Bass',weight:'4lb 8oz',date:'10 Jun 2025'},{species:'Pollock',weight:'2lb 4oz',date:'3 Mar 2025'}]},
    {id:'r2',name:'Shakespeare Ugly Stik',brand:'Shakespeare',price:'54.99',purchaseDate:'5 Jan 2023',purchaseWhere:'Amazon',comments:'Reliable beginner rod.',photo:null,catches:[{species:'Cod',weight:'5lb 0oz',date:'8 Jan 2025'}]},
  ]},
  {id:'reels',name:'Reels',emoji:'⚙️',items:[{id:'re1',name:'Shimano Baitrunner DL',brand:'Shimano',price:'129.99',purchaseDate:'1 Jun 2023',purchaseWhere:'Angling Direct',comments:'Smooth drag, excellent for beach fishing.',photo:null,catches:[]}]},
  {id:'lures',name:'Lures',emoji:'🎯',items:[]},
  {id:'terminal',name:'Terminal',emoji:'🪝',items:[]},
  {id:'bait',name:'Bait',emoji:'🧪',items:[]},
  {id:'other',name:'Other',emoji:'🎒',items:[]},
];
const PBS = [
  {species:'Sea Bass',weight:'7lb 2oz'},{species:'Cod',weight:'9lb 4oz'},
  {species:'Mackerel',weight:'1lb 14oz'},{species:'Pollock',weight:'4lb 8oz'},
  {species:'Smoothhound',weight:'11lb 6oz'},{species:'Brown Trout',weight:'3lb 2oz'},
  {species:'Pike',weight:'14lb 8oz'},{species:'Barbel',weight:'8lb 12oz'},
];
const ALL_CATCHES = [
  {id:1,species:'Sea Bass',weight:'4lb 8oz',location:'Chesil Beach',date:'10 Jun 2025',bait:'Ragworm'},
  {id:2,species:'Cod',weight:'6lb 14oz',location:'Whitby Pier',date:'9 Jun 2025',bait:'Peeler Crab'},
  {id:3,species:'Mackerel',weight:'1lb 2oz',location:'Brighton Pier',date:'8 Jun 2025',bait:'Feathers'},
  {id:4,species:'Pollock',weight:'3lb 6oz',location:'Lyme Regis',date:'5 Jun 2025',bait:'Lures'},
  {id:5,species:'Smoothhound',weight:'8lb 4oz',location:'Chesil Beach',date:'1 Jun 2025',bait:'Peeler Crab'},
  {id:6,species:'Brown Trout',weight:'2lb 8oz',location:'River Itchen',date:'28 May 2025',bait:'Flies'},
];

// ── FISH IMAGE ────────────────────────────────────────────────────────────
const FISH_EMOJI = {'Sea Bass':'🐟','Cod':'🐠','Mackerel':'🐡','Pollock':'🐟','Flounder':'🐠','Plaice':'🐡','Brown Trout':'🐟','Atlantic Salmon':'🐟','Pike':'🦈','Perch':'🐠','Barbel':'🐟','Roach':'🐟','Tench':'🐟','Bream':'🐟','Carp':'🐠','Smoothhound':'🦈','Wrasse':'🐡','Chub':'🐟','Dace':'🐟','Grayling':'🐟'};
function FishImg({ species, className, style }) {
  const [err, setErr] = useState(false);
  const src = FISH_PHOTOS[species];
  if (!src || err) return (
    <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#E8F4FD,#C8E8F8)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,...(style||{})}}>
      <span style={{fontSize:36}}>{FISH_EMOJI[species]||'🐟'}</span>
      <span style={{fontSize:10,color:'#6B7280',fontWeight:600,textAlign:'center',padding:'0 4px'}}>{species}</span>
    </div>
  );
  return <img src={src} alt={species} className={className} style={style} onError={()=>setErr(true)}/>;
}

// ── TACKLE IMAGE ──────────────────────────────────────────────────────────
const TACKLE_EMOJI = {'Rods':'🎣','Reels':'⚙️','Lures':'🎯','Terminal':'🪝','Bait':'🧪','Other':'🎒'};
function TackleImg({ catName, photo, emojiSize=32 }) {
  const [err, setErr] = useState(false);
  if (photo) return <img src={photo} alt={catName} style={{width:'100%',height:'100%',objectFit:'cover'}}/>;
  const src = TACKLE_PHOTOS[catName];
  if (src && !err) return <img src={src} alt={catName} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>setErr(true)}/>;
  return (
    <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg,#E8F4FD,#C8E8F8)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4}}>
      <span style={{fontSize:emojiSize}}>{TACKLE_EMOJI[catName]||'📦'}</span>
      <span style={{fontSize:10,color:'#6B7280',fontWeight:600}}>{catName}</span>
    </div>
  );
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────────────
function PhotoUpload({ value, onChange, label='Add Photo' }) {
  const inputRef = useRef(null);
  const handleFile = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="photo-upload" onClick={()=>inputRef.current.click()}>
        {value ? (
          <div className="photo-preview">
            <img src={value} alt="preview"/>
            <button className="photo-remove" onClick={e=>{e.stopPropagation();onChange(null);}}>×</button>
          </div>
        ) : (
          <div className="photo-upload-empty">
            <div className="photo-upload-icon">📷</div>
            <div className="photo-upload-text">{label}</div>
            <div className="photo-upload-sub">Tap to take a photo or choose from gallery</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={handleFile}/>
    </div>
  );
}

// ── SEARCHABLE DROPDOWN ───────────────────────────────────────────────────
function SearchDropdown({ label, seaOptions, riverOptions, customItems=[], value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newCustom, setNewCustom] = useState('');
  const [customs, setCustoms] = useState(customItems);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const filter = items => items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
  const fSea = filter(seaOptions), fRiver = filter(riverOptions), fCustom = filter(customs);
  const hasResults = fSea.length || fRiver.length || fCustom.length;
  const addCustom = () => {
    const v = (newCustom || query).trim(); if (!v) return;
    setCustoms(c=>[...c,v]); onChange(v); setQuery(''); setOpen(false); setNewCustom('');
  };
  const select = item => { onChange(item); setQuery(''); setOpen(false); };
  const clear = () => { onChange(''); setQuery(''); };
  return (
    <div className="form-group" ref={ref}>
      <label className="form-label">{label}</label>
      <div className="search-dropdown">
        <span className="search-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
        <input className="search-dropdown-input" placeholder={`Search ${label.toLowerCase()}…`} value={value||query} onChange={e=>{setQuery(e.target.value);onChange('');setOpen(true);}} onFocus={()=>setOpen(true)}/>
        {(value||query)&&<button className="search-clear" onClick={clear}>×</button>}
      </div>
      {value&&<div className="selected-badge">{value}<span className="selected-badge-x" onClick={clear}>×</span></div>}
      {open&&(
        <div className="dropdown-list">
          {customs.length>0&&fCustom.length>0&&<><div className="dropdown-group-label">⭐ My Custom</div>{fCustom.map(i=><div key={i} className={`dropdown-item custom${value===i?' selected':''}`} onClick={()=>select(i)}>{i}</div>)}</>}
          {fSea.length>0&&<><div className="dropdown-group-label">🌊 Sea</div>{fSea.map(i=><div key={i} className={`dropdown-item${value===i?' selected':''}`} onClick={()=>select(i)}>{i}</div>)}</>}
          {fRiver.length>0&&<><div className="dropdown-group-label">🏞️ River & Coarse</div>{fRiver.map(i=><div key={i} className={`dropdown-item${value===i?' selected':''}`} onClick={()=>select(i)}>{i}</div>)}</>}
          {!hasResults&&query&&<div style={{padding:'10px 14px'}}><div style={{fontSize:13,color:'var(--mid)',marginBottom:8}}>No results for "{query}"</div><div style={{display:'flex',gap:6}}><input className="form-input" style={{flex:1,padding:'8px 12px',fontSize:13}} placeholder={`Add "${query}"`} value={newCustom||query} onChange={e=>setNewCustom(e.target.value)}/><button className="btn-add" style={{padding:'8px 12px',fontSize:13}} onClick={addCustom}>Add</button></div></div>}
          <div style={{padding:'8px 14px',borderTop:'1px solid var(--light)'}}><div style={{display:'flex',gap:6}}><input className="form-input" style={{flex:1,padding:'8px 12px',fontSize:13}} placeholder={`Add your own ${label.toLowerCase()}…`} value={newCustom} onChange={e=>setNewCustom(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustom()}/><button className="btn-add" style={{padding:'8px 12px',fontSize:13}} onClick={addCustom}>+ Add</button></div></div>
        </div>
      )}
    </div>
  );
}

// ── LEAFLET MAP ───────────────────────────────────────────────────────────
function LeafletMap({ height='420px', onPinDrop, pinFilter='my', showControls=true, catchPins=[], circleRadius=2000 }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const tileLayerRef = useRef(null);
  const labelsLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const pinMarkersRef = useRef([]);
  const draggableMarkerRef = useRef(null);
  const circleRef = useRef(null);
  const [mapView, setMapView] = useState('Map');
  const [pinMode, setPinMode] = useState(pinFilter);
  const [userPos, setUserPos] = useState(null);
  const [located, setLocated] = useState(false);
  const circleRadiusRef = useRef(circleRadius);
  useEffect(() => { circleRadiusRef.current = circleRadius; if (circleRef.current) circleRef.current.setRadius(circleRadius); }, [circleRadius]);

  const MY_PINS = [{lat:50.613,lng:-2.456,label:'Sea Bass — 4lb 8oz · Chesil Beach',color:'#3B9EE8'},{lat:54.486,lng:-0.612,label:'Cod — 6lb 14oz · Whitby Pier',color:'#3B9EE8'},{lat:50.819,lng:-0.137,label:'Mackerel — 1lb 2oz · Brighton Pier',color:'#3B9EE8'},...catchPins];
  const COMMUNITY_PINS = [{lat:51.477,lng:0.001,label:'SouthCoastSam — Sea Bass 7lb',color:'#10B981'},{lat:53.962,lng:-1.082,label:'NorthSeaNick — Cod 9lb',color:'#10B981'},{lat:50.366,lng:-4.142,label:'PlymouthPete — Pollock 5lb',color:'#10B981'}];
  const TACKLE_SHOPS = [{lat:51.5,lng:-0.12,label:'🏪 London Angling Centre',color:'#F59E0B'},{lat:50.82,lng:-0.14,label:'🏪 Brighton Angling',color:'#F59E0B'},{lat:53.96,lng:-1.08,label:'🏪 York Fishing Tackle',color:'#F59E0B'},{lat:50.61,lng:-2.46,label:'🏪 Chesil Bait & Tackle',color:'#F59E0B'}];
  const makeIcon = (color,size=14) => { const L=window.L; return L.divIcon({className:'',html:`<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]}); };

  useEffect(() => {
    if (leafletMap.current) return;
    const L = window.L; if (!L) return;
    leafletMap.current = L.map(mapRef.current, {zoomControl:true,attributionControl:false});
    tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(leafletMap.current);
    leafletMap.current.setView([52.5,-1.5],6);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const {latitude:lat,longitude:lng} = pos.coords;
        setUserPos({lat,lng}); setLocated(true);
        leafletMap.current.setView([lat,lng],12);
        const icon = L.divIcon({className:'',html:`<div style="width:16px;height:16px;background:#3B9EE8;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,158,232,0.3)"></div>`,iconSize:[16,16],iconAnchor:[8,8]});
        userMarkerRef.current = L.marker([lat,lng],{icon}).addTo(leafletMap.current).bindPopup('📍 Your Location');
      }, () => leafletMap.current.setView([52.5,-1.5],6));
    }
    if (onPinDrop) {
      leafletMap.current.on('click', e => {
        const {lat,lng} = e.latlng;
        if (draggableMarkerRef.current) { leafletMap.current.removeLayer(draggableMarkerRef.current); draggableMarkerRef.current=null; }
        if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current=null; }
        const dragIcon = L.divIcon({className:'',html:`<div style="width:22px;height:22px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:grab"></div>`,iconSize:[22,22],iconAnchor:[11,11]});
        draggableMarkerRef.current = L.marker([lat,lng],{icon:dragIcon,draggable:true}).addTo(leafletMap.current);
        draggableMarkerRef.current.on('dragend', ev => {
          const pos = ev.target.getLatLng();
          if (circleRef.current) circleRef.current.setLatLng([pos.lat,pos.lng]);
          onPinDrop({lat:pos.lat,lng:pos.lng,hasPin:true});
        });
        circleRef.current = L.circle([lat,lng],{radius:circleRadiusRef.current,color:'#3B9EE8',fillColor:'#3B9EE8',fillOpacity:0.12,weight:2}).addTo(leafletMap.current);
        onPinDrop({lat,lng,hasPin:true});
      });
    }
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current=null; } };
  }, []);

  useEffect(() => {
    const L = window.L; if (!L||!leafletMap.current) return;
    if (tileLayerRef.current) leafletMap.current.removeLayer(tileLayerRef.current);
    if (labelsLayerRef.current) { leafletMap.current.removeLayer(labelsLayerRef.current); labelsLayerRef.current=null; }
    if (mapView==='Satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19}).addTo(leafletMap.current);
      labelsLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,opacity:0.8}).addTo(leafletMap.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(leafletMap.current);
    }
  }, [mapView]);

  useEffect(() => {
    const L = window.L; if (!L||!leafletMap.current||onPinDrop) return;
    pinMarkersRef.current.forEach(m=>leafletMap.current.removeLayer(m));
    pinMarkersRef.current = [];
    const addPins = pins => pins.forEach(p => { pinMarkersRef.current.push(L.marker([p.lat,p.lng],{icon:makeIcon(p.color)}).addTo(leafletMap.current).bindPopup(p.label)); });
    if (pinMode==='my') addPins(MY_PINS);
    else if (pinMode==='community') addPins(COMMUNITY_PINS);
    else if (pinMode==='shops') addPins(TACKLE_SHOPS);
  }, [pinMode, catchPins]);

  const resetHome = () => { if (leafletMap.current) leafletMap.current.setView(userPos?[userPos.lat,userPos.lng]:[52.5,-1.5],userPos?12:6); };
  const removePin = () => {
    if (draggableMarkerRef.current) { leafletMap.current.removeLayer(draggableMarkerRef.current); draggableMarkerRef.current=null; }
    if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current=null; }
    if (onPinDrop) onPinDrop(null);
  };

  return (
    <div>
      {showControls&&(
        <div className="map-controls">
          <div className="map-top-row">
            <div className="map-toggle-group">
              {['Map','Satellite'].map(v=><button key={v} className={`map-toggle-btn${mapView===v?' active':''}`} onClick={()=>setMapView(v)}>{v}</button>)}
            </div>
            <button className="map-home-btn" onClick={resetHome}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Reset
            </button>
            {onPinDrop&&<button className="map-home-btn" onClick={removePin} style={{borderColor:'#EF4444',color:'#EF4444'}}>✕ Remove pin</button>}
            {located&&<span style={{fontSize:12,color:'var(--blue)',fontWeight:600}}>📍 Located</span>}
          </div>
          {!onPinDrop&&(
            <div className="pin-filter-row">
              {[['my','My Pins'],['community','Community'],['blank','Blank'],['shops','Tackle Shops']].map(([val,lbl])=>(
                <button key={val} className={`pin-filter-btn${pinMode===val?' active':''}`} onClick={()=>setPinMode(val)}>{lbl}</button>
              ))}
            </div>
          )}
        </div>
      )}
      <div ref={mapRef} style={{height,width:'100%',borderRadius:20,overflow:'hidden',border:'1px solid var(--light)',boxShadow:'var(--shadow)'}}/>
    </div>
  );
}

// ── TIDE ──────────────────────────────────────────────────────────────────
function TideSection() {
  const [tides, setTides] = useState(null);
  const [location, setLocation] = useState('Locating...');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function gen(loc) {
      const pad = n=>String(n).padStart(2,'0');
      const fmt = d=>`${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const base = new Date(); base.setHours(2,18,0);
      setLocation(loc);
      setTides([{type:'High',time:fmt(base),height:'4.1m',icon:'🌊'},{type:'Low',time:fmt(new Date(base.getTime()+6*3600000+12*60000)),height:'0.9m',icon:'🏖️'},{type:'High',time:fmt(new Date(base.getTime()+12*3600000+24*60000)),height:'4.3m',icon:'🌊'},{type:'Low',time:fmt(new Date(base.getTime()+18*3600000+36*60000)),height:'0.7m',icon:'🏖️'}]);
      setLoading(false);
    }
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>gen(p.coords.latitude>53?'Northern England':'Southern England'),()=>gen('Southampton'));
    else gen('Southampton');
  }, []);
  return (
    <div className="tide-card">
      <div className="tide-header"><div className="tide-title">🌊 Today's Tides</div><div className="tide-location">📍 {location}</div></div>
      {loading?<div className="tide-loading">Fetching tide times...</div>:(
        <div className="tide-times">{tides.map((t,i)=><div className="tide-time" key={i}><div className="tide-icon">{t.icon}</div><div><div className="tide-type">{t.type}</div><div className="tide-val">{t.time}</div><div className="tide-height">{t.height}</div></div></div>)}</div>
      )}
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
    <TideSection/>
    <div className="section-header"><span className="section-title">Recent Catches</span><span className="section-link">See all →</span></div>
    <div className="cards-row">
      {RECENT_CATCHES.map(c=><div className="catch-card" key={c.id}>
        <div className="catch-card-img-wrap"><FishImg species={c.species} className="catch-card-img"/></div>
        <div className="catch-card-body"><div className="catch-card-species">{c.species}</div><div className="catch-card-weight">{c.weight}</div><div className="catch-card-meta">📍 {c.location}<br/>🕐 {c.date}</div></div>
      </div>)}
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
  const [tab, setTab] = useState('following');
  const [following, setFollowing] = useState(FEED_POSTS_FOLLOWING);
  const [explore, setExplore] = useState([...FEED_POSTS_EXPLORE].sort((a,b)=>a.dist-b.dist));
  const toggleLike = (id, isF) => {
    const upd = ps=>ps.map(p=>p.id===id?{...p,liked:!p.liked,likes:p.liked?p.likes-1:p.likes+1}:p);
    if (isF) setFollowing(upd); else setExplore(upd);
  };
  const PostCard = ({p,isF}) => (
    <div className="feed-post">
      <div className="feed-post-header">
        <div className="feed-avatar">{p.avatar}</div>
        <div><div className="feed-username">{p.user}</div><div className="feed-location">📍 {p.location}</div></div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,marginLeft:'auto'}}>
          <div className="feed-badge">{p.weight} {p.species}</div>
          {!isF&&<span className="dist-badge">{p.dist}mi away</span>}
        </div>
      </div>
      <div className="feed-img-area"><FishImg species={p.species} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
      <div className="feed-post-body"><div className="feed-post-text">{p.text}</div><div className="feed-tags">{p.tags.map(t=><span key={t} className="feed-tag">#{t}</span>)}</div></div>
      <div className="feed-actions">
        <button className={`feed-action${p.liked?' liked':''}`} onClick={()=>toggleLike(p.id,isF)}>
          <svg fill={p.liked?'#EF4444':'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{p.likes}
        </button>
        <button className="feed-action"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>{p.comments}</button>
        <button className="feed-action"><svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>
      </div>
    </div>
  );
  return <div>
    <div className="feed-tabs">
      <button className={`feed-tab${tab==='following'?' active':''}`} onClick={()=>setTab('following')}>Following</button>
      <button className={`feed-tab${tab==='explore'?' active':''}`} onClick={()=>setTab('explore')}>🌍 Explore</button>
    </div>
    <div style={{height:16}}/>
    {tab==='following'&&following.map(p=><PostCard key={p.id} p={p} isF={true}/>)}
    {tab==='explore'&&<div><div style={{padding:'0 16px 12px',fontSize:12,color:'var(--mid)',fontWeight:600}}>Showing catches nearest to you first</div>{explore.map(p=><PostCard key={p.id} p={p} isF={false}/>)}</div>}
  </div>;
}

function MapScreen({ catchPins }) {
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Fishing Marks</span><span className="section-link">+ Add</span></div>
    <div className="map-wrap"><LeafletMap height="420px" pinFilter="my" showControls={true} catchPins={catchPins}/></div>
    <div className="section-header" style={{paddingTop:20}}><span className="section-title">Nearby Spots</span></div>
    <div className="spot-list">{SPOTS.map((s,i)=><div className="spot-item" key={i}><div className="spot-icon">{s.emoji}</div><div><div className="spot-name">{s.name}</div><div className="spot-meta">{s.type} · {s.fish}</div></div><div className="spot-dist">{s.dist}</div></div>)}</div>
    <div style={{height:16}}/>
  </div>;
}

function LogScreen({ onSaved, customBaits, customLures, onAddCustomBait, onAddCustomLure }) {
  const [form, setForm] = useState({species:'',weight_lb:'',weight_oz:'',length_cm:'',length_in:'',bait:'',lure:'',location:'',notes:'',privacy:'Approximate',photo:null});
  const [pin, setPin] = useState(null);
  const [circleRadius, setCircleRadius] = useState(2000);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Log a Catch</span></div>
    <div className="log-form">
      <PhotoUpload value={form.photo} onChange={v=>set('photo',v)} label="Catch Photo"/>
      <SearchDropdown label="Species" seaOptions={SEA_SPECIES} riverOptions={RIVER_SPECIES} value={form.species} onChange={v=>set('species',v)}/>
      <div className="form-group">
        <label className="form-label">Weight</label>
        <div className="weight-row">
          <input className="form-input" placeholder="lb" value={form.weight_lb} onChange={e=>set('weight_lb',e.target.value)}/>
          <div className="weight-unit">lb</div>
          <input className="form-input" placeholder="oz" value={form.weight_oz} onChange={e=>set('weight_oz',e.target.value)}/>
          <div className="weight-unit">oz</div>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Length</label>
        <div className="weight-row">
          <input className="form-input" placeholder="cm" value={form.length_cm} onChange={e=>set('length_cm',e.target.value)}/>
          <div className="weight-unit">cm</div>
          <input className="form-input" placeholder="in" value={form.length_in} onChange={e=>set('length_in',e.target.value)}/>
          <div className="weight-unit">in</div>
        </div>
      </div>
      <div className="bait-lure-row">
        <SearchDropdown label="Bait" seaOptions={SEA_BAITS} riverOptions={RIVER_BAITS} customItems={customBaits} value={form.bait} onChange={v=>{set('bait',v);if(v&&!SEA_BAITS.includes(v)&&!RIVER_BAITS.includes(v))onAddCustomBait(v);}}/>
        <SearchDropdown label="Lure" seaOptions={SEA_LURES} riverOptions={RIVER_LURES} customItems={customLures} value={form.lure} onChange={v=>{set('lure',v);if(v&&!SEA_LURES.includes(v)&&!RIVER_LURES.includes(v))onAddCustomLure(v);}}/>
      </div>
      <div className="form-group"><label className="form-label">Location name</label><input className="form-input" placeholder="e.g. Chesil Beach, West Bay" value={form.location} onChange={e=>set('location',e.target.value)}/></div>
      <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Conditions, rig setup, anything worth remembering…" value={form.notes} onChange={e=>set('notes',e.target.value)}/></div>
      <div className="form-group">
        <label className="form-label">Pin your catch location</label>
        <div className="privacy-toggle">
          {['Approximate','Precise Pin'].map(opt=><div key={opt} className={`privacy-opt${form.privacy===opt?' active':''}`} onClick={()=>set('privacy',opt)}>{opt==='Approximate'?'🔒 Approximate':'📍 Precise Pin'}</div>)}
        </div>
        {form.privacy==='Approximate'&&(
          <div className="circle-slider">
            <label><span>Zone size</span><span style={{color:'var(--blue)',fontWeight:700}}>{(circleRadius/1609).toFixed(1)} miles</span></label>
            <input type="range" min="500" max="8000" step="100" value={circleRadius} onChange={e=>setCircleRadius(Number(e.target.value))}/>
          </div>
        )}
        <div className="log-map"><LeafletMap height="380px" onPinDrop={setPin} showControls={true} circleRadius={form.privacy==='Approximate'?circleRadius:0}/></div>
        {pin?<div className="map-picker-hint" style={{color:'var(--blue)',fontWeight:600}}>📍 Pin set — drag to adjust position</div>
          :<div className="map-picker-hint">{form.privacy==='Approximate'?'🔒 Tap the map to place your zone':'📍 Tap the map to drop your exact pin — drag to adjust'}</div>}
      </div>
      <button className="btn-primary" style={{width:'100%'}} onClick={()=>{if(form.species&&form.weight_lb)onSaved({...form,pin});}}>Save Catch</button>
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
  const [newItem, setNewItem] = useState({name:'',brand:'',price:'',purchaseDate:'',purchaseWhere:'',comments:'',photo:null});
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState({name:'',emoji:''});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = categories.find(c=>c.id===selectedCat);
  const item = cat?.items.find(i=>i.id===selectedItem);
  const formStyle = {background:'var(--white)',borderRadius:18,padding:20,boxShadow:'var(--shadow)',border:'1px solid var(--light)',marginTop:16};
  const saveNewItem = () => {
    if (!newItem.name) return;
    setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:[...c.items,{id:Date.now().toString(),...newItem,catches:[]}]}:c));
    setNewItem({name:'',brand:'',price:'',purchaseDate:'',purchaseWhere:'',comments:'',photo:null}); setShowAddItem(false);
  };
  const saveEdit = () => { setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:c.items.map(i=>i.id===selectedItem?{...i,...editItem}:i)}:c)); setEditing(false); };
  const deleteItem = () => { setCategories(cs=>cs.map(c=>c.id===selectedCat?{...c,items:c.items.filter(i=>i.id!==selectedItem)}:c)); setSelectedItem(null); setConfirmDelete(false); };
  const saveNewCat = () => { if (!newCat.name) return; setCategories(cs=>[...cs,{id:Date.now().toString(),name:newCat.name,emoji:newCat.emoji||'📦',items:[]}]); setNewCat({name:'',emoji:''}); setShowAddCat(false); };
  if (selectedItem&&cat&&item) {
    if (editing) return <div>
      <button className="back-btn" onClick={()=>setEditing(false)}>← Cancel Edit</button>
      <div className="item-detail"><div style={formStyle}>
        <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Edit {item.name}</div>
        <PhotoUpload value={editItem.photo} onChange={v=>setEditItem(ei=>({...ei,photo:v}))} label="Item Photo"/>
        {[['name','Name'],['brand','Brand'],['price','Price paid (£)'],['purchaseDate','Date of purchase'],['purchaseWhere','Purchased from']].map(([k,l])=><div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" value={editItem[k]||''} onChange={e=>setEditItem(ei=>({...ei,[k]:e.target.value}))}/></div>)}
        <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" value={editItem.comments||''} onChange={e=>setEditItem(ei=>({...ei,comments:e.target.value}))}/></div>
        <div style={{display:'flex',gap:10}}><button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setEditing(false)}>Cancel</button><button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveEdit}>Save Changes</button></div>
      </div></div>
    </div>;
    return <div>
      <button className="back-btn" onClick={()=>{setSelectedItem(null);setConfirmDelete(false);}}>← Back to {cat.name}</button>
      <div className="item-detail">
        <div className="item-detail-img-wrap">{item.photo?<img src={item.photo} alt={item.name} className="item-detail-img"/>:<TackleImg catName={cat.name} photo={null} emojiSize={80}/>}</div>
        <div className="item-detail-header">
          <div>
            <div className="item-detail-name">{item.name}</div>
            <div className="item-detail-brand">{item.brand}</div>
            {item.price&&<div className="item-detail-price">£{item.price}</div>}
            {item.purchaseDate&&<div className="item-detail-meta">📅 {item.purchaseDate}</div>}
            {item.purchaseWhere&&<div className="item-detail-meta">🏪 {item.purchaseWhere}</div>}
          </div>
          <button className="edit-btn" onClick={()=>{setEditItem({...item});setEditing(true);}}>Edit</button>
        </div>
        {item.comments&&<div className="item-detail-comments">💬 {item.comments}</div>}
        <div className="detail-section">
          <div className="detail-section-title">Catches with this item</div>
          {item.catches.length===0&&<div style={{fontSize:14,color:'var(--mid)',padding:'12px 0'}}>No catches logged yet.</div>}
          {item.catches.map((c,i)=><div className="catch-history-item" key={i}><div className="catch-history-img-wrap"><FishImg species={c.species} className="catch-history-img"/></div><div><div className="catch-history-species">{c.species}</div><div className="catch-history-meta">{c.date}</div></div><div className="catch-history-weight">{c.weight}</div></div>)}
        </div>
        {confirmDelete?<div style={{background:'#FEF2F2',border:'2px solid #EF4444',borderRadius:14,padding:16,marginTop:24,textAlign:'center'}}><div style={{fontSize:15,fontWeight:700,color:'#EF4444',marginBottom:12}}>Delete {item.name}?</div><div style={{display:'flex',gap:10}}><button className="btn-secondary" style={{flex:1,padding:'12px'}} onClick={()=>setConfirmDelete(false)}>Cancel</button><button style={{flex:1,padding:'12px',background:'#EF4444',color:'white',border:'none',borderRadius:12,fontWeight:700,fontSize:14,cursor:'pointer',fontFamily:'Inter,sans-serif'}} onClick={deleteItem}>Delete</button></div></div>
        :<button className="delete-btn" onClick={()=>setConfirmDelete(true)}>🗑 Delete Item</button>}
        <div style={{height:16}}/>
      </div>
    </div>;
  }
  if (selectedCat&&cat) return <div>
    <button className="back-btn" onClick={()=>{setSelectedCat(null);setShowAddItem(false);}}>← Back to Tackle Box</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">{cat.emoji} {cat.name}</span></div>
    <div className="item-grid">
      {cat.items.map(it=><div className="item-card" key={it.id} onClick={()=>setSelectedItem(it.id)}>
        <div className="item-card-img-wrap">{it.photo?<img src={it.photo} alt={it.name} className="item-card-img"/>:<TackleImg catName={cat.name} photo={null}/>}</div>
        <div className="item-card-body"><div className="item-card-name">{it.name}</div><div className="item-card-brand">{it.brand}</div>{it.price&&<div className="item-card-price">£{it.price}</div>}</div>
      </div>)}
      <div className="add-item-card" onClick={()=>setShowAddItem(true)}><span>➕</span><p>Add Item</p></div>
    </div>
    {showAddItem&&<div style={{padding:'0 16px'}}><div style={formStyle}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Add New Item</div>
      <PhotoUpload value={newItem.photo} onChange={v=>setNewItem(n=>({...n,photo:v}))} label="Item Photo"/>
      {[['name','Name','e.g. Daiwa Ninja X'],['brand','Brand','e.g. Daiwa'],['price','Price paid (£)','e.g. 89.99'],['purchaseDate','Date of purchase','e.g. 12 Mar 2024'],['purchaseWhere','Purchased from','e.g. Angling Direct']].map(([k,l,p])=><div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" placeholder={p} value={newItem[k]} onChange={e=>setNewItem(n=>({...n,[k]:e.target.value}))}/></div>)}
      <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" placeholder="Any notes…" value={newItem.comments} onChange={e=>setNewItem(n=>({...n,comments:e.target.value}))}/></div>
      <div style={{display:'flex',gap:10}}><button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setShowAddItem(false)}>Cancel</button><button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveNewItem}>Save</button></div>
    </div></div>}
    <div style={{height:16}}/>
  </div>;
  return <div>
    <div className="section-header" style={{paddingTop:24}}>
      <span className="section-title">Tackle Box</span>
      <button onClick={()=>setShowAddCat(true)} style={{background:'none',border:'none',fontSize:24,color:'var(--blue)',cursor:'pointer',padding:'0 4px',lineHeight:1,fontWeight:300}}>+</button>
    </div>
    <div className="tackle-grid">
      {categories.map(c=><div className="tackle-cat" key={c.id} onClick={()=>setSelectedCat(c.id)}>
        <div className="tackle-cat-img"><TackleImg catName={c.name} photo={null}/></div>
        <div className="tackle-name">{c.name}</div>
        <div className="tackle-count">{c.items.length} item{c.items.length!==1?'s':''}</div>
        <div className="tackle-bar"><div className="tackle-bar-fill" style={{width:`${Math.min(100,(c.items.length/8)*100)}%`}}/></div>
      </div>)}
    </div>
    {showAddCat&&<div style={{padding:'16px 16px 0'}}><div style={formStyle}>
      <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Add New Category</div>
      <div className="form-group"><label className="form-label">Category name</label><input className="form-input" placeholder="e.g. Clothing, Kayak Gear" value={newCat.name} onChange={e=>setNewCat(n=>({...n,name:e.target.value}))}/></div>
      <div className="form-group"><label className="form-label">Emoji icon</label><input className="form-input" placeholder="e.g. 👕" value={newCat.emoji} onChange={e=>setNewCat(n=>({...n,emoji:e.target.value}))}/></div>
      <div style={{display:'flex',gap:10}}><button className="btn-secondary" style={{flex:1,padding:'13px'}} onClick={()=>setShowAddCat(false)}>Cancel</button><button className="btn-primary" style={{flex:1,padding:'13px'}} onClick={saveNewCat}>Save</button></div>
    </div></div>}
    <div style={{height:16}}/>
  </div>;
}

function StatsScreen({ sessions }) {
  const [view, setView] = useState('main');
  const sp = [...new Set(ALL_CATCHES.map(c=>c.species))];
  if (view==='catches') return <div>
    <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">All Catches</span></div>
    <div className="catches-grid">{ALL_CATCHES.map(c=><div className="catch-drill-card" key={c.id}><div className="catch-drill-img"><FishImg species={c.species} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><div className="catch-drill-body"><div className="catch-drill-species">{c.species}</div><div className="catch-drill-weight">{c.weight}</div><div className="catch-drill-meta">📍 {c.location}<br/>🕐 {c.date}</div></div></div>)}</div>
    <div style={{height:16}}/>
  </div>;
  if (view==='species') return <div>
    <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">Species Caught</span></div>
    <div className="catches-grid">{sp.map(s=>{const count=ALL_CATCHES.filter(c=>c.species===s).length;return <div className="catch-drill-card" key={s}><div className="catch-drill-img"><FishImg species={s} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><div className="catch-drill-body"><div className="catch-drill-species">{s}</div><div className="catch-drill-weight">{count} catch{count!==1?'es':''}</div></div></div>;})}</div>
    <div style={{height:16}}/>
  </div>;
  if (view==='sessions') return <div>
    <button className="back-btn" onClick={()=>setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">Sessions</span></div>
    <div className="sessions-list">{sessions.map((s,i)=><div className="session-row" key={i}><div className="session-icon">🎣</div><div><div className="session-name">{s.location||'Unknown location'}</div><div className="session-meta">{s.date}</div></div><div className="session-count">{s.catches} catch{s.catches!==1?'es':''}</div></div>)}{sessions.length===0&&<div style={{padding:'20px 0',fontSize:14,color:'var(--mid)'}}>No sessions yet — log a catch to get started!</div>}</div>
    <div style={{height:16}}/>
  </div>;
  return <div>
    <div className="profile-header"><div className="profile-avatar-wrap"><div className="profile-avatar">🎣</div></div><div><div className="profile-name">Matt Clarke</div><div className="profile-since">Angling since 2019</div><div className="profile-badge">⭐ Verified Angler</div></div></div>
    <div className="section-header" style={{paddingTop:4}}><span className="section-title">This Season</span></div>
    <div className="stats-grid">
      <div className="stat-card" onClick={()=>setView('catches')}><div className="stat-num">{ALL_CATCHES.length}</div><div className="stat-label">Total Catches ›</div></div>
      <div className="stat-card" onClick={()=>setView('species')}><div className="stat-num">{sp.length}</div><div className="stat-label">Species Caught ›</div></div>
      <div className="stat-card"><div className="stat-num">3.8</div><div className="stat-label">Avg Weight (lb)</div></div>
      <div className="stat-card" onClick={()=>setView('sessions')}><div className="stat-num">{sessions.length||18}</div><div className="stat-label">Sessions ›</div></div>
    </div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Personal Bests</span></div>
    <div className="pb-list">{PBS.map((pb,i)=><div className="pb-row" key={i}><div className="pb-left"><FishImg species={pb.species} className="pb-fish-img"/><span className="pb-species">{pb.species}</span></div><div className="pb-weight">{pb.weight}</div></div>)}</div>
    <div style={{height:16}}/>
  </div>;
}

function AccountScreen({ profile, onUpdate }) {
  const [form, setForm] = useState({...profile});
  const [notifs, setNotifs] = useState({newFollower:true,communityNearby:true,appUpdates:false});
  const inputRef = useRef(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handlePhoto = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('photo', ev.target.result);
    reader.readAsDataURL(file);
  };
  const Toggle = ({k}) => (
    <button className={`toggle-switch ${notifs[k]?'on':'off'}`} onClick={()=>setNotifs(n=>({...n,[k]:!n[k]}))}>
      <div className="toggle-knob"/>
    </button>
  );
  const Field = ({k, label, placeholder, type='text'}) => (
    <div className="account-field-group">
      <label className="account-field-label">{label}</label>
      <input className="account-input" type={type} placeholder={placeholder} value={form[k]||''} onChange={e=>set(k,e.target.value)}/>
    </div>
  );
  return <div>
    <div className="section-header" style={{paddingTop:24}}><span className="section-title">Account</span></div>
    <div className="account-avatar-section">
      <button className="account-avatar" onClick={()=>inputRef.current.click()}>
        {form.photo?<img src={form.photo} alt="avatar"/>:<span>{form.emoji||'🎣'}</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
      <div className="account-avatar-label">Change profile photo</div>
    </div>
    <div className="account-form">
      <div className="account-inner">
        <div className="account-section-title">Profile</div>
        <div className="account-field-row">
          <Field k="name" label="Full name" placeholder="e.g. Matt Clarke"/>
          <Field k="username" label="Username" placeholder="e.g. @mattfishes"/>
        </div>
        <div className="account-field-row">
          <Field k="location" label="Location" placeholder="e.g. Southampton"/>
          <Field k="anglingYear" label="Angling since" placeholder="e.g. 2019"/>
        </div>
        <div className="account-field-group">
          <label className="account-field-label">Bio</label>
          <textarea className="account-textarea" placeholder="A short bio about you…" value={form.bio||''} onChange={e=>set('bio',e.target.value)}/>
        </div>

        <div className="account-section-title">Account Details</div>
        <div className="account-field-row">
          <Field k="email" label="Email address" placeholder="e.g. matt@email.com" type="email"/>
          <Field k="password" label="New password" placeholder="••••••••" type="password"/>
        </div>

        <div className="account-section-title">Notifications</div>
        {[['newFollower','New follower','When someone follows you'],['communityNearby','Nearby catches','Catches logged near you'],['appUpdates','App updates','News and new features']].map(([k,l,sub])=>(
          <div className="toggle-row" key={k}>
            <div><div className="toggle-label">{l}</div><div className="toggle-sub">{sub}</div></div>
            <Toggle k={k}/>
          </div>
        ))}

        <div style={{paddingTop:20}}>
          <button className="account-save-btn" onClick={()=>onUpdate(form)}>Save Changes</button>
        </div>
        <div style={{height:24}}/>
      </div>
    </div>
  </div>;
}

// ── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  {id:'home',label:'Home',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
  {id:'feed',label:'Feed',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>},
  {id:'map',label:'Map',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>},
  {id:'log',label:'Log',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>},
  {id:'tackle',label:'Tackle',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>},
  {id:'stats',label:'Stats',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>},
  {id:'account',label:'Account',icon:<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
];

// ── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [sessions, setSessions] = useState([{location:'Chesil Beach',date:'1 Jun 2025',catches:3},{location:'Whitby Pier',date:'28 May 2025',catches:2}]);
  const [catchPins, setCatchPins] = useState([]);
  const [customBaits, setCustomBaits] = useState([]);
  const [customLures, setCustomLures] = useState([]);
  const [profile, setProfile] = useState({name:'Matt Clarke',username:'@mattfishes',location:'Southampton, Hampshire',anglingYear:'2019',bio:'Passionate sea and river angler based on the south coast.',email:'',photo:null,emoji:'🎣'});

  useEffect(() => {
    if (!window.L) {
      const link = document.createElement('link'); link.rel='stylesheet'; link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      const script = document.createElement('script'); script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(script);
    }
  }, []);

  const triggerToast = msg => { setToast(msg); setShowToast(true); setTimeout(()=>setShowToast(false),2500); };
  const handleSaveCatch = catchData => {
    const today = new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
    const loc = catchData?.location||'Unknown location';
    setSessions(prev => { const ex=prev.find(s=>s.date===today&&s.location===loc); if(ex) return prev.map(s=>s.date===today&&s.location===loc?{...s,catches:s.catches+1}:s); return [{location:loc,date:today,catches:1},...prev]; });
    if (catchData?.pin) setCatchPins(p=>[...p,{lat:catchData.pin.lat,lng:catchData.pin.lng,label:`${catchData.species} — ${catchData.weight_lb}lb · ${loc}`,color:'#3B9EE8'}]);
    triggerToast('🐟 Catch saved!'); setScreen('home');
  };

  const renderScreen = () => {
    switch(screen) {
      case 'home':    return <HomeScreen onLog={()=>setScreen('log')}/>;
      case 'feed':    return <FeedScreen/>;
      case 'map':     return <MapScreen catchPins={catchPins}/>;
      case 'log':     return <LogScreen onSaved={handleSaveCatch} customBaits={customBaits} customLures={customLures} onAddCustomBait={b=>setCustomBaits(p=>p.includes(b)?p:[...p,b])} onAddCustomLure={l=>setCustomLures(p=>p.includes(l)?p:[...p,l])}/>;
      case 'tackle':  return <TackleScreen/>;
      case 'stats':   return <StatsScreen sessions={sessions}/>;
      case 'account': return <AccountScreen profile={profile} onUpdate={p=>{setProfile(p);triggerToast('✅ Profile saved!');}}/>;
      default:        return <HomeScreen onLog={()=>setScreen('log')}/>;
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
      <nav className="bottom-nav">{NAV.map(n=><button key={n.id} className={`nav-item${screen===n.id?' active':''}`} onClick={()=>setScreen(n.id)}>{n.icon}{n.label}</button>)}</nav>
      <div className={`toast${showToast?' show':''}`}>{toast}</div>
    </div>
  </>;
}
