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
    .main-content{flex:1;overflow-y:auto;}
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
  .screen{flex:1;overflow-y:auto;padding-bottom:90px;background:var(--bg);}
  .main-content{flex:1;overflow-y:auto;background:var(--bg);}
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

  /* FEED TABS */
  .feed-tabs{display:flex;margin:16px 16px 0;background:var(--light);border-radius:14px;padding:4px;gap:4px;}
  .feed-tab{flex:1;padding:10px;text-align:center;border-radius:10px;cursor:pointer;font-size:14px;font-weight:600;color:var(--mid);transition:all 0.2s;border:none;background:none;font-family:'Inter',sans-serif;}
  .feed-tab.active{background:var(--white);color:var(--blue);box-shadow:var(--shadow);}
  .dist-badge{font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;background:rgba(59,158,232,0.1);color:var(--blue);border:1px solid rgba(59,158,232,0.2);white-space:nowrap;margin-left:auto;}

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

  /* MAP */
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

  /* LOG FORM */
  .log-form{padding:0 16px;}
  .form-label{font-size:13px;font-weight:700;color:var(--dark);margin-bottom:8px;display:block;}
  .form-group{margin-bottom:20px;}
  .form-input,.form-select,.form-textarea{width:100%;background:var(--white);border:2px solid var(--light);border-radius:12px;padding:14px 16px;color:var(--dark);font-size:15px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;-webkit-appearance:none;}
  .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--blue);}
  .form-input::placeholder,.form-textarea::placeholder{color:var(--mid);}
  .form-textarea{resize:none;height:90px;line-height:1.6;}
  .form-row{display:flex;gap:12px;}
  .form-row .form-group{flex:1;}

  /* SEARCHABLE DROPDOWN */
  .search-dropdown{position:relative;}
  .search-dropdown-input{width:100%;background:var(--white);border:2px solid var(--light);border-radius:12px;padding:12px 16px 12px 40px;color:var(--dark);font-size:15px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;}
  .search-dropdown-input:focus{border-color:var(--blue);}
  .search-dropdown-input::placeholder{color:var(--mid);}
  .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--mid);pointer-events:none;}
  .search-clear{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--mid);font-size:18px;line-height:1;padding:2px;}
  .dropdown-list{background:var(--white);border:2px solid var(--blue);border-radius:12px;margin-top:4px;max-height:200px;overflow-y:auto;box-shadow:var(--shadow2);}
  .dropdown-group-label{padding:8px 14px 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--mid);background:var(--bg);border-bottom:1px solid var(--light);}
  .dropdown-item{padding:11px 14px;font-size:14px;color:var(--dark);cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--light);}
  .dropdown-item:last-child{border-bottom:none;}
  .dropdown-item:hover,.dropdown-item.selected{background:rgba(59,158,232,0.08);color:var(--blue);font-weight:600;}
  .dropdown-item.custom{color:var(--blue);font-weight:600;}
  .selected-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(59,158,232,0.1);border:1px solid rgba(59,158,232,0.3);border-radius:10px;font-size:14px;font-weight:600;color:var(--blue);margin-top:6px;}
  .selected-badge-x{cursor:pointer;font-size:16px;color:var(--mid);line-height:1;}

  /* BAIT LURE ROW */
  .bait-lure-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

  /* PHOTO UPLOAD */
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

  /* TACKLE */
  .tackle-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px;}
  .tackle-cat{background:var(--white);border:2px solid var(--light);border-radius:18px;padding:18px;cursor:pointer;transition:all 0.2s;box-shadow:var(--shadow);}
  .tackle-cat:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:var(--shadow2);}
  .tackle-cat-img{width:100%;height:80px;border-radius:10px;overflow:hidden;margin-bottom:12px;background:#E8F4FD;display:flex;align-items:center;justify-content:center;}
  .tackle-cat-img img{width:100%;height:100%;object-fit:cover;}
  .tackle-cat-img-emoji{font-size:32px;}
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

  /* STATS */
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
  .catch-drill-img{width:100%;height:90px;object-fit:cover;background:#E8F4FD;display:flex;align-items:center;justify-content:center;overflow:hidden;}
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

  /* ACCOUNT */
  .account-form{padding:0 16px;}
  .account-avatar-section{display:flex;flex-direction:column;align-items:center;padding:24px 16px 16px;}
  .account-avatar{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,var(--blue),#0055AA);display:flex;align-items:center;justify-content:center;font-size:40px;overflow:hidden;box-shadow:0 0 0 4px rgba(59,158,232,0.2);cursor:pointer;border:none;}
  .account-avatar img{width:100%;height:100%;object-fit:cover;}
  .account-avatar-label{font-size:13px;color:var(--blue);font-weight:600;margin-top:10px;cursor:pointer;}
  .account-section-title{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--mid);padding:20px 0 12px;}
  .account-save-btn{width:100%;padding:16px;border:none;border-radius:14px;background:var(--blue);color:white;font-size:16px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;margin-top:8px;box-shadow:0 4px 16px rgba(59,158,232,0.3);}
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
`;

export default styles;
