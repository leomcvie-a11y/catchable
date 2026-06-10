import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import {
  SEA_SPECIES, RIVER_SPECIES, SEA_BAITS, RIVER_BAITS, SEA_LURES, RIVER_LURES,
  FISH_PHOTOS, TACKLE_PHOTOS, RECENT_CATCHES, FEED_POSTS_FOLLOWING, FEED_POSTS_EXPLORE,
  SPOTS, INITIAL_TACKLE, PBS, ALL_CATCHES
} from './data';

// ── FISH IMAGE ────────────────────────────────────────────────────────────
function FishImg({ species, className, style }) {
  const [err, setErr] = useState(false);
  const src = FISH_PHOTOS[species] || FISH_PHOTOS['Sea Bass'];
  if (err) return <span style={{ fontSize: 32 }}>🐟</span>;
  return <img src={src} alt={species} className={className} style={style} onError={() => setErr(true)} />;
}

// ── TACKLE IMAGE ──────────────────────────────────────────────────────────
function TackleImg({ catName, photo, className, emojiSize = 32 }) {
  const [err, setErr] = useState(false);
  if (photo) return <img src={photo} alt={catName} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const src = TACKLE_PHOTOS[catName];
  if (src && !err) return <img src={src} alt={catName} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />;
  return <span style={{ fontSize: emojiSize }}>🎣</span>;
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────────────
function PhotoUpload({ value, onChange, label = 'Add Photo' }) {
  const inputRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="photo-upload" onClick={() => inputRef.current.click()}>
        {value ? (
          <div className="photo-preview">
            <img src={value} alt="preview" />
            <button className="photo-remove" onClick={e => { e.stopPropagation(); onChange(null); }}>×</button>
          </div>
        ) : (
          <div className="photo-upload-empty">
            <div className="photo-upload-icon">📷</div>
            <div className="photo-upload-text">{label}</div>
            <div className="photo-upload-sub">Tap to take a photo or choose from gallery</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

// ── SEARCHABLE DROPDOWN ───────────────────────────────────────────────────
function SearchDropdown({ label, seaOptions, riverOptions, customItems = [], value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newCustom, setNewCustom] = useState('');
  const [customs, setCustoms] = useState(customItems);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSea = [...seaOptions];
  const allRiver = [...riverOptions];
  const allCustom = customs;

  const filterItems = (items) => items.filter(i => i.toLowerCase().includes(query.toLowerCase()));
  const filteredSea = filterItems(allSea);
  const filteredRiver = filterItems(allRiver);
  const filteredCustom = filterItems(allCustom);
  const hasResults = filteredSea.length || filteredRiver.length || filteredCustom.length;

  const addCustom = () => {
    if (!newCustom.trim()) return;
    setCustoms(c => [...c, newCustom.trim()]);
    onChange(newCustom.trim());
    setQuery('');
    setOpen(false);
    setNewCustom('');
  };

  const select = (item) => { onChange(item); setQuery(''); setOpen(false); };
  const clear = () => { onChange(''); setQuery(''); };

  return (
    <div className="form-group" ref={ref}>
      <label className="form-label">{label}</label>
      <div className="search-dropdown">
        <span className="search-icon">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input
          className="search-dropdown-input"
          placeholder={`Search ${label.toLowerCase()}…`}
          value={value || query}
          onChange={e => { setQuery(e.target.value); onChange(''); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {(value || query) && <button className="search-clear" onClick={clear}>×</button>}
      </div>
      {value && (
        <div className="selected-badge">
          {value}
          <span className="selected-badge-x" onClick={clear}>×</span>
        </div>
      )}
      {open && (
        <div className="dropdown-list">
          {customs.length > 0 && filteredCustom.length > 0 && (
            <>
              <div className="dropdown-group-label">⭐ My Custom</div>
              {filteredCustom.map(i => <div key={i} className={`dropdown-item custom${value===i?' selected':''}`} onClick={() => select(i)}>{i}</div>)}
            </>
          )}
          {filteredSea.length > 0 && (
            <>
              <div className="dropdown-group-label">🌊 Sea</div>
              {filteredSea.map(i => <div key={i} className={`dropdown-item${value===i?' selected':''}`} onClick={() => select(i)}>{i}</div>)}
            </>
          )}
          {filteredRiver.length > 0 && (
            <>
              <div className="dropdown-group-label">🏞️ River & Coarse</div>
              {filteredRiver.map(i => <div key={i} className={`dropdown-item${value===i?' selected':''}`} onClick={() => select(i)}>{i}</div>)}
            </>
          )}
          {!hasResults && query && (
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 13, color: 'var(--mid)', marginBottom: 8 }}>No results for "{query}"</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="form-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                  placeholder={`Add "${query}" as custom`}
                  value={newCustom || query}
                  onChange={e => setNewCustom(e.target.value)}
                />
                <button className="btn-add" style={{ padding: '8px 12px', fontSize: 13 }} onClick={addCustom}>Add</button>
              </div>
            </div>
          )}
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--light)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="form-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                placeholder={`Add your own ${label.toLowerCase()}…`}
                value={newCustom}
                onChange={e => setNewCustom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom()}
              />
              <button className="btn-add" style={{ padding: '8px 12px', fontSize: 13 }} onClick={addCustom}>+ Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LEAFLET MAP ───────────────────────────────────────────────────────────
function LeafletMap({ height = '420px', onPinDrop, pinFilter = 'my', showControls = true, catchPins = [], circleRadius = 2000 }) {
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

  const MY_PINS = [
    { lat: 50.613, lng: -2.456, label: 'Sea Bass — 4lb 8oz · Chesil Beach', color: '#3B9EE8' },
    { lat: 54.486, lng: -0.612, label: 'Cod — 6lb 14oz · Whitby Pier', color: '#3B9EE8' },
    { lat: 50.819, lng: -0.137, label: 'Mackerel — 1lb 2oz · Brighton Pier', color: '#3B9EE8' },
    ...catchPins,
  ];
  const COMMUNITY_PINS = [
    { lat: 51.477, lng: 0.001, label: 'SouthCoastSam — Sea Bass 7lb', color: '#10B981' },
    { lat: 53.962, lng: -1.082, label: 'NorthSeaNick — Cod 9lb', color: '#10B981' },
    { lat: 50.366, lng: -4.142, label: 'PlymouthPete — Pollock 5lb', color: '#10B981' },
  ];
  const TACKLE_SHOPS = [
    { lat: 51.5, lng: -0.12, label: '🏪 London Angling Centre', color: '#F59E0B' },
    { lat: 50.82, lng: -0.14, label: '🏪 Brighton Angling', color: '#F59E0B' },
    { lat: 53.96, lng: -1.08, label: '🏪 York Fishing Tackle', color: '#F59E0B' },
    { lat: 50.61, lng: -2.46, label: '🏪 Chesil Bait & Tackle', color: '#F59E0B' },
    { lat: 51.38, lng: -2.36, label: '🏪 Bath Angling', color: '#F59E0B' },
  ];

  const makeIcon = (color, size = 14) => {
    const L = window.L;
    return L.divIcon({ className: '', html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  };

  useEffect(() => {
    if (leafletMap.current) return;
    const L = window.L;
    if (!L) return;
    leafletMap.current = L.map(mapRef.current, { zoomControl: true, attributionControl: false });
    tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.current);
    leafletMap.current.setView([52.5, -1.5], 6);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setLocated(true);
        leafletMap.current.setView([lat, lng], 12);
        const icon = L.divIcon({ className: '', html: `<div style="width:16px;height:16px;background:#3B9EE8;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,158,232,0.3)"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
        userMarkerRef.current = L.marker([lat, lng], { icon }).addTo(leafletMap.current).bindPopup('📍 Your Location');
      }, () => leafletMap.current.setView([52.5, -1.5], 6));
    }

    if (onPinDrop) {
      leafletMap.current.on('click', e => {
        const L = window.L;
        const { lat, lng } = e.latlng;
        if (draggableMarkerRef.current) { leafletMap.current.removeLayer(draggableMarkerRef.current); draggableMarkerRef.current = null; }
        if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current = null; }
        const dragIcon = L.divIcon({ className: '', html: `<div style="width:22px;height:22px;background:#EF4444;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:grab"></div>`, iconSize: [22, 22], iconAnchor: [11, 11] });
        draggableMarkerRef.current = L.marker([lat, lng], { icon: dragIcon, draggable: true }).addTo(leafletMap.current);
        draggableMarkerRef.current.on('dragend', ev => {
          const pos = ev.target.getLatLng();
          if (circleRef.current) { circleRef.current.setLatLng([pos.lat, pos.lng]); }
          onPinDrop({ lat: pos.lat, lng: pos.lng, hasPin: true });
        });
        circleRef.current = L.circle([lat, lng], { radius: circleRadiusRef.current, color: '#3B9EE8', fillColor: '#3B9EE8', fillOpacity: 0.12, weight: 2 }).addTo(leafletMap.current);
        onPinDrop({ lat, lng, hasPin: true });
      });
    }
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMap.current) return;
    if (tileLayerRef.current) leafletMap.current.removeLayer(tileLayerRef.current);
    if (labelsLayerRef.current) { leafletMap.current.removeLayer(labelsLayerRef.current); labelsLayerRef.current = null; }
    if (mapView === 'Satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(leafletMap.current);
      labelsLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, opacity: 0.8 }).addTo(leafletMap.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.current);
    }
  }, [mapView]);

  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMap.current || onPinDrop) return;
    pinMarkersRef.current.forEach(m => leafletMap.current.removeLayer(m));
    pinMarkersRef.current = [];
    const addPins = (pins) => pins.forEach(p => { pinMarkersRef.current.push(L.marker([p.lat, p.lng], { icon: makeIcon(p.color) }).addTo(leafletMap.current).bindPopup(p.label)); });
    if (pinMode === 'my') addPins(MY_PINS);
    else if (pinMode === 'community') addPins(COMMUNITY_PINS);
    else if (pinMode === 'shops') addPins(TACKLE_SHOPS);
  }, [pinMode, catchPins]);

  const resetHome = () => {
    if (leafletMap.current) leafletMap.current.setView(userPos ? [userPos.lat, userPos.lng] : [52.5, -1.5], userPos ? 12 : 6);
  };

  const removePin = () => {
    if (draggableMarkerRef.current) { leafletMap.current.removeLayer(draggableMarkerRef.current); draggableMarkerRef.current = null; }
    if (circleRef.current) { leafletMap.current.removeLayer(circleRef.current); circleRef.current = null; }
    if (onPinDrop) onPinDrop(null);
  };

  return (
    <div>
      {showControls && (
        <div className="map-controls">
          <div className="map-top-row">
            <div className="map-toggle-group">
              {['Map', 'Satellite'].map(v => <button key={v} className={`map-toggle-btn${mapView === v ? ' active' : ''}`} onClick={() => setMapView(v)}>{v}</button>)}
            </div>
            <button className="map-home-btn" onClick={resetHome}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Reset
            </button>
            {located && <span style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>📍 Located</span>}
          </div>
          {!onPinDrop && (
            <div className="pin-filter-row">
              {[['my', 'My Pins'], ['community', 'Community'], ['blank', 'Blank'], ['shops', 'Tackle Shops']].map(([val, lbl]) => (
                <button key={val} className={`pin-filter-btn${pinMode === val ? ' active' : ''}`} onClick={() => setPinMode(val)}>{lbl}</button>
              ))}
            </div>
          )}
          {onPinDrop && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="map-toggle-group">
                {['Map', 'Satellite'].map(v => <button key={v} className={`map-toggle-btn${mapView === v ? ' active' : ''}`} onClick={() => setMapView(v)}>{v}</button>)}
              </div>
              <button className="map-home-btn" onClick={removePin} style={{ borderColor: '#EF4444', color: '#EF4444' }}>✕ Remove pin</button>
            </div>
          )}
        </div>
      )}
      <div ref={mapRef} style={{ height, width: '100%', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--light)', boxShadow: 'var(--shadow)' }} />
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
      const pad = n => String(n).padStart(2, '0');
      const fmt = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const base = new Date(); base.setHours(2, 18, 0);
      setLocation(loc);
      setTides([
        { type: 'High', time: fmt(base), height: '4.1m', icon: '🌊' },
        { type: 'Low', time: fmt(new Date(base.getTime() + 6 * 3600000 + 12 * 60000)), height: '0.9m', icon: '🏖️' },
        { type: 'High', time: fmt(new Date(base.getTime() + 12 * 3600000 + 24 * 60000)), height: '4.3m', icon: '🌊' },
        { type: 'Low', time: fmt(new Date(base.getTime() + 18 * 3600000 + 36 * 60000)), height: '0.7m', icon: '🏖️' },
      ]);
      setLoading(false);
    }
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => gen(p.coords.latitude > 53 ? 'Northern England' : 'Southern England'), () => gen('Southampton'));
    else gen('Southampton');
  }, []);
  return (
    <div className="tide-card">
      <div className="tide-header"><div className="tide-title">🌊 Today's Tides</div><div className="tide-location">📍 {location}</div></div>
      {loading ? <div className="tide-loading">Fetching tide times...</div> : (
        <div className="tide-times">{tides.map((t, i) => <div className="tide-time" key={i}><div className="tide-icon">{t.icon}</div><div><div className="tide-type">{t.type}</div><div className="tide-val">{t.time}</div><div className="tide-height">{t.height}</div></div></div>)}</div>
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
    <TideSection />
    <div className="section-header"><span className="section-title">Recent Catches</span><span className="section-link">See all →</span></div>
    <div className="cards-row">
      {RECENT_CATCHES.map(c => <div className="catch-card" key={c.id}>
        <div className="catch-card-img-wrap"><FishImg species={c.species} className="catch-card-img" /></div>
        <div className="catch-card-body">
          <div className="catch-card-species">{c.species}</div>
          <div className="catch-card-weight">{c.weight}</div>
          <div className="catch-card-meta">📍 {c.location}<br />🕐 {c.date}</div>
        </div>
      </div>)}
    </div>
    <div className="section-header" style={{ paddingTop: 20 }}><span className="section-title">Quick Actions</span></div>
    <div className="quick-actions">
      <button className="btn-primary" onClick={onLog}>+ Log Catch</button>
      <button className="btn-secondary">📍 Add Spot</button>
    </div>
    <div style={{ height: 16 }} />
  </div>;
}

function FeedScreen() {
  const [tab, setTab] = useState('following');
  const [following, setFollowing] = useState(FEED_POSTS_FOLLOWING);
  const [explore, setExplore] = useState([...FEED_POSTS_EXPLORE].sort((a, b) => a.dist - b.dist));

  const toggleLike = (id, isFollowing) => {
    if (isFollowing) setFollowing(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    else setExplore(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const PostCard = ({ p, isFollowing }) => (
    <div className="feed-post">
      <div className="feed-post-header">
        <div className="feed-avatar">{p.avatar}</div>
        <div>
          <div className="feed-username">{p.user}</div>
          <div className="feed-location">📍 {p.location}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 'auto' }}>
          <div className="feed-badge">{p.weight} {p.species}</div>
          {!isFollowing && <span className="dist-badge">{p.dist}mi away</span>}
        </div>
      </div>
      <div className="feed-img-area"><FishImg species={p.species} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
      <div className="feed-post-body">
        <div className="feed-post-text">{p.text}</div>
        <div className="feed-tags">{p.tags.map(t => <span key={t} className="feed-tag">#{t}</span>)}</div>
      </div>
      <div className="feed-actions">
        <button className={`feed-action${p.liked ? ' liked' : ''}`} onClick={() => toggleLike(p.id, isFollowing)}>
          <svg fill={p.liked ? '#EF4444' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          {p.likes}
        </button>
        <button className="feed-action">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          {p.comments}
        </button>
        <button className="feed-action">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          Share
        </button>
      </div>
    </div>
  );

  return <div>
    <div className="feed-tabs">
      <button className={`feed-tab${tab === 'following' ? ' active' : ''}`} onClick={() => setTab('following')}>Following</button>
      <button className={`feed-tab${tab === 'explore' ? ' active' : ''}`} onClick={() => setTab('explore')}>🌍 Explore</button>
    </div>
    <div style={{ height: 16 }} />
    {tab === 'following' && following.map(p => <PostCard key={p.id} p={p} isFollowing={true} />)}
    {tab === 'explore' && <div>
      <div style={{ padding: '0 16px 12px', fontSize: 12, color: 'var(--mid)', fontWeight: 600 }}>Showing catches nearest to you first</div>
      {explore.map(p => <PostCard key={p.id} p={p} isFollowing={false} />)}
    </div>}
  </div>;
}

function MapScreen({ catchPins }) {
  return <div>
    <div className="section-header" style={{ paddingTop: 24 }}><span className="section-title">Fishing Marks</span><span className="section-link">+ Add</span></div>
    <div className="map-controls" style={{ paddingTop: 0 }} />
    <div className="map-wrap">
      <LeafletMap height="420px" pinFilter="my" showControls={true} catchPins={catchPins} />
    </div>
    <div className="section-header" style={{ paddingTop: 20 }}><span className="section-title">Nearby Spots</span></div>
    <div className="spot-list">
      {SPOTS.map((s, i) => <div className="spot-item" key={i}>
        <div className="spot-icon">{s.emoji}</div>
        <div><div className="spot-name">{s.name}</div><div className="spot-meta">{s.type} · {s.fish}</div></div>
        <div className="spot-dist">{s.dist}</div>
      </div>)}
    </div>
    <div style={{ height: 16 }} />
  </div>;
}

function LogScreen({ onSaved, customBaits, customLures, onAddCustomBait, onAddCustomLure }) {
  const [form, setForm] = useState({ species: '', weight_lb: '', weight_oz: '', length_cm: '', length_in: '', bait: '', lure: '', location: '', notes: '', privacy: 'Approximate', photo: null });
  const [pin, setPin] = useState(null);
  const [circleRadius, setCircleRadius] = useState(2000);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const radiusMiles = (circleRadius / 1609).toFixed(1);

  return <div>
    <div className="section-header" style={{ paddingTop: 24 }}><span className="section-title">Log a Catch</span></div>
    <div className="log-form">
      <PhotoUpload value={form.photo} onChange={v => set('photo', v)} label="Catch Photo" />

      <SearchDropdown label="Species" seaOptions={SEA_SPECIES} riverOptions={RIVER_SPECIES} value={form.species} onChange={v => set('species', v)} />

      <div className="form-group">
        <label className="form-label">Weight</label>
        <div className="weight-row">
          <input className="form-input" placeholder="lb" value={form.weight_lb} onChange={e => set('weight_lb', e.target.value)} />
          <div className="weight-unit">lb</div>
          <input className="form-input" placeholder="oz" value={form.weight_oz} onChange={e => set('weight_oz', e.target.value)} />
          <div className="weight-unit">oz</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Length</label>
        <div className="weight-row">
          <input className="form-input" placeholder="cm" value={form.length_cm} onChange={e => set('length_cm', e.target.value)} />
          <div className="weight-unit">cm</div>
          <input className="form-input" placeholder="in" value={form.length_in} onChange={e => set('length_in', e.target.value)} />
          <div className="weight-unit">in</div>
        </div>
      </div>

      <div className="bait-lure-row">
        <SearchDropdown label="Bait" seaOptions={SEA_BAITS} riverOptions={RIVER_BAITS} customItems={customBaits} value={form.bait} onChange={v => { set('bait', v); if (v && !SEA_BAITS.includes(v) && !RIVER_BAITS.includes(v)) onAddCustomBait(v); }} />
        <SearchDropdown label="Lure" seaOptions={SEA_LURES} riverOptions={RIVER_LURES} customItems={customLures} value={form.lure} onChange={v => { set('lure', v); if (v && !SEA_LURES.includes(v) && !RIVER_LURES.includes(v)) onAddCustomLure(v); }} />
      </div>

      <div className="form-group"><label className="form-label">Location name</label><input className="form-input" placeholder="e.g. Chesil Beach, West Bay" value={form.location} onChange={e => set('location', e.target.value)} /></div>
      <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Conditions, rig setup, anything worth remembering…" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>

      <div className="form-group">
        <label className="form-label">Pin your catch location</label>
        <div className="privacy-toggle">
          {['Approximate', 'Precise Pin'].map(opt => <div key={opt} className={`privacy-opt${form.privacy === opt ? ' active' : ''}`} onClick={() => set('privacy', opt)}>{opt === 'Approximate' ? '🔒 Approximate' : '📍 Precise Pin'}</div>)}
        </div>
        {form.privacy === 'Approximate' && (
          <div className="circle-slider">
            <label><span>Zone size</span><span style={{ color: 'var(--blue)', fontWeight: 700 }}>{radiusMiles} miles</span></label>
            <input type="range" min="500" max="8000" step="100" value={circleRadius} onChange={e => setCircleRadius(Number(e.target.value))} />
          </div>
        )}
        <div className="log-map">
          <LeafletMap height="260px" onPinDrop={setPin} showControls={true} circleRadius={form.privacy === 'Approximate' ? circleRadius : 0} />
        </div>
        {pin ? <div className="map-picker-hint" style={{ color: 'var(--blue)', fontWeight: 600 }}>📍 Pin set — drag to adjust position</div>
          : <div className="map-picker-hint">{form.privacy === 'Approximate' ? '🔒 Tap the map to place your zone — drag pin to adjust' : '📍 Tap the map to drop your exact pin — drag to adjust'}</div>}
      </div>

      <button className="btn-primary" style={{ width: '100%' }} onClick={() => { if (form.species && form.weight_lb) onSaved({ ...form, pin }); }}>Save Catch</button>
      <div style={{ height: 16 }} />
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
  const [newItem, setNewItem] = useState({ name: '', brand: '', price: '', purchaseDate: '', purchaseWhere: '', comments: '', photo: null });
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState({ name: '', emoji: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cat = categories.find(c => c.id === selectedCat);
  const item = cat?.items.find(i => i.id === selectedItem);
  const formStyle = { background: 'var(--white)', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--light)', marginTop: 16 };

  const saveNewItem = () => {
    if (!newItem.name) return;
    setCategories(cs => cs.map(c => c.id === selectedCat ? { ...c, items: [...c.items, { id: Date.now().toString(), ...newItem, catches: [] }] } : c));
    setNewItem({ name: '', brand: '', price: '', purchaseDate: '', purchaseWhere: '', comments: '', photo: null });
    setShowAddItem(false);
  };

  const saveEdit = () => {
    setCategories(cs => cs.map(c => c.id === selectedCat ? { ...c, items: c.items.map(i => i.id === selectedItem ? { ...i, ...editItem } : i) } : c));
    setEditing(false);
  };

  const deleteItem = () => {
    setCategories(cs => cs.map(c => c.id === selectedCat ? { ...c, items: c.items.filter(i => i.id !== selectedItem) } : c));
    setSelectedItem(null); setConfirmDelete(false);
  };

  const saveNewCat = () => {
    if (!newCat.name) return;
    setCategories(cs => [...cs, { id: Date.now().toString(), name: newCat.name, emoji: newCat.emoji || '📦', items: [] }]);
    setNewCat({ name: '', emoji: '' }); setShowAddCat(false);
  };

  if (selectedItem && cat && item) {
    if (editing) return <div>
      <button className="back-btn" onClick={() => setEditing(false)}>← Cancel Edit</button>
      <div className="item-detail">
        <div style={formStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Edit {item.name}</div>
          <PhotoUpload value={editItem.photo} onChange={v => setEditItem(ei => ({ ...ei, photo: v }))} label="Item Photo" />
          {[['name', 'Name'], ['brand', 'Brand'], ['price', 'Price paid (£)'], ['purchaseDate', 'Date of purchase'], ['purchaseWhere', 'Purchased from']].map(([k, l]) =>
            <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" value={editItem[k] || ''} onChange={e => setEditItem(ei => ({ ...ei, [k]: e.target.value }))} /></div>
          )}
          <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" value={editItem.comments || ''} onChange={e => setEditItem(ei => ({ ...ei, comments: e.target.value }))} /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '13px' }} onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, padding: '13px' }} onClick={saveEdit}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>;

    return <div>
      <button className="back-btn" onClick={() => { setSelectedItem(null); setConfirmDelete(false); }}>← Back to {cat.name}</button>
      <div className="item-detail">
        <div className="item-detail-img-wrap">
          {item.photo ? <img src={item.photo} alt={item.name} className="item-detail-img" /> : <TackleImg catName={cat.name} photo={null} emojiSize={80} />}
        </div>
        <div className="item-detail-header">
          <div>
            <div className="item-detail-name">{item.name}</div>
            <div className="item-detail-brand">{item.brand}</div>
            {item.price && <div className="item-detail-price">£{item.price}</div>}
            {item.purchaseDate && <div className="item-detail-meta">📅 {item.purchaseDate}</div>}
            {item.purchaseWhere && <div className="item-detail-meta">🏪 {item.purchaseWhere}</div>}
          </div>
          <button className="edit-btn" onClick={() => { setEditItem({ ...item }); setEditing(true); }}>Edit</button>
        </div>
        {item.comments && <div className="item-detail-comments">💬 {item.comments}</div>}
        <div className="detail-section">
          <div className="detail-section-title">Catches with this item</div>
          {item.catches.length === 0 && <div style={{ fontSize: 14, color: 'var(--mid)', padding: '12px 0' }}>No catches logged yet.</div>}
          {item.catches.map((c, i) => <div className="catch-history-item" key={i}>
            <div className="catch-history-img-wrap"><FishImg species={c.species} className="catch-history-img" /></div>
            <div><div className="catch-history-species">{c.species}</div><div className="catch-history-meta">{c.date}</div></div>
            <div className="catch-history-weight">{c.weight}</div>
          </div>)}
        </div>
        {confirmDelete
          ? <div style={{ background: '#FEF2F2', border: '2px solid #EF4444', borderRadius: 14, padding: 16, marginTop: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#EF4444', marginBottom: 12 }}>Delete {item.name}?</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }} onClick={deleteItem}>Delete</button>
            </div>
          </div>
          : <button className="delete-btn" onClick={() => setConfirmDelete(true)}>🗑 Delete Item</button>
        }
        <div style={{ height: 16 }} />
      </div>
    </div>;
  }

  if (selectedCat && cat) return <div>
    <button className="back-btn" onClick={() => { setSelectedCat(null); setShowAddItem(false); }}>← Back to Tackle Box</button>
    <div className="section-header" style={{ paddingTop: 4 }}><span className="section-title">{cat.emoji} {cat.name}</span></div>
    <div className="item-grid">
      {cat.items.map(it => <div className="item-card" key={it.id} onClick={() => setSelectedItem(it.id)}>
        <div className="item-card-img-wrap">
          {it.photo ? <img src={it.photo} alt={it.name} className="item-card-img" /> : <TackleImg catName={cat.name} photo={null} />}
        </div>
        <div className="item-card-body">
          <div className="item-card-name">{it.name}</div>
          <div className="item-card-brand">{it.brand}</div>
          {it.price && <div className="item-card-price">£{it.price}</div>}
        </div>
      </div>)}
      <div className="add-item-card" onClick={() => setShowAddItem(true)}><span>➕</span><p>Add Item</p></div>
    </div>
    {showAddItem && <div style={{ padding: '0 16px' }}><div style={formStyle}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add New Item</div>
      <PhotoUpload value={newItem.photo} onChange={v => setNewItem(n => ({ ...n, photo: v }))} label="Item Photo" />
      {[['name', 'Name', 'e.g. Daiwa Ninja X'], ['brand', 'Brand', 'e.g. Daiwa'], ['price', 'Price paid (£)', 'e.g. 89.99'], ['purchaseDate', 'Date of purchase', 'e.g. 12 Mar 2024'], ['purchaseWhere', 'Purchased from', 'e.g. Angling Direct']].map(([k, l, p]) =>
        <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" placeholder={p} value={newItem[k]} onChange={e => setNewItem(n => ({ ...n, [k]: e.target.value }))} /></div>
      )}
      <div className="form-group"><label className="form-label">Comments</label><textarea className="form-textarea" placeholder="Any notes…" value={newItem.comments} onChange={e => setNewItem(n => ({ ...n, comments: e.target.value }))} /></div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: '13px' }} onClick={() => setShowAddItem(false)}>Cancel</button>
        <button className="btn-primary" style={{ flex: 1, padding: '13px' }} onClick={saveNewItem}>Save</button>
      </div>
    </div></div>}
    <div style={{ height: 16 }} />
  </div>;

  return <div>
    <div className="section-header" style={{ paddingTop: 24 }}>
      <span className="section-title">Tackle Box</span>
      <button onClick={() => setShowAddCat(true)} style={{ background: 'none', border: 'none', fontSize: 24, color: 'var(--blue)', cursor: 'pointer', padding: '0 4px', lineHeight: 1, fontWeight: 300 }}>+</button>
    </div>
    <div className="tackle-grid">
      {categories.map(c => <div className="tackle-cat" key={c.id} onClick={() => setSelectedCat(c.id)}>
        <div className="tackle-cat-img">
          <TackleImg catName={c.name} photo={null} />
        </div>
        <div className="tackle-name">{c.name}</div>
        <div className="tackle-count">{c.items.length} item{c.items.length !== 1 ? 's' : ''}</div>
        <div className="tackle-bar"><div className="tackle-bar-fill" style={{ width: `${Math.min(100, (c.items.length / 8) * 100)}%` }} /></div>
      </div>)}
    </div>
    {showAddCat && <div style={{ padding: '16px 16px 0' }}><div style={formStyle}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add New Category</div>
      <div className="form-group"><label className="form-label">Category name</label><input className="form-input" placeholder="e.g. Clothing, Kayak Gear" value={newCat.name} onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))} /></div>
      <div className="form-group"><label className="form-label">Emoji icon</label><input className="form-input" placeholder="e.g. 👕" value={newCat.emoji} onChange={e => setNewCat(n => ({ ...n, emoji: e.target.value }))} /></div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1, padding: '13px' }} onClick={() => setShowAddCat(false)}>Cancel</button>
        <button className="btn-primary" style={{ flex: 1, padding: '13px' }} onClick={saveNewCat}>Save</button>
      </div>
    </div></div>}
    <div style={{ height: 16 }} />
  </div>;
}

function StatsScreen({ sessions }) {
  const [view, setView] = useState('main');
  const sp = [...new Set(ALL_CATCHES.map(c => c.species))];

  if (view === 'catches') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop: 4 }}><span className="section-title">All Catches</span></div>
    <div className="catches-grid">
      {ALL_CATCHES.map(c => <div className="catch-drill-card" key={c.id}>
        <div className="catch-drill-img"><FishImg species={c.species} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        <div className="catch-drill-body"><div className="catch-drill-species">{c.species}</div><div className="catch-drill-weight">{c.weight}</div><div className="catch-drill-meta">📍 {c.location}<br />🕐 {c.date}</div></div>
      </div>)}
    </div><div style={{ height: 16 }} />
  </div>;

  if (view === 'species') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop: 4 }}><span className="section-title">Species Caught</span></div>
    <div className="catches-grid">
      {sp.map(s => { const count = ALL_CATCHES.filter(c => c.species === s).length; return <div className="catch-drill-card" key={s}>
        <div className="catch-drill-img"><FishImg species={s} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        <div className="catch-drill-body"><div className="catch-drill-species">{s}</div><div className="catch-drill-weight">{count} catch{count !== 1 ? 'es' : ''}</div></div>
      </div>; })}
    </div><div style={{ height: 16 }} />
  </div>;

  if (view === 'sessions') return <div>
    <button className="back-btn" onClick={() => setView('main')}>← Back to Stats</button>
    <div className="section-header" style={{ paddingTop: 4 }}><span className="section-title">Sessions</span></div>
    <div className="sessions-list">
      {sessions.map((s, i) => <div className="session-row" key={i}>
        <div className="session-icon">🎣</div>
        <div><div className="session-name">{s.location || 'Unknown location'}</div><div className="session-meta">{s.date}</div></div>
        <div className="session-count">{s.catches} catch{s.catches !== 1 ? 'es' : ''}</div>
      </div>)}
      {sessions.length === 0 && <div style={{ padding: '20px 0', fontSize: 14, color: 'var(--mid)' }}>No sessions yet — log a catch to get started!</div>}
    </div><div style={{ height: 16 }} />
  </div>;

  return <div>
    <div className="profile-header">
      <div className="profile-avatar-wrap">
        <div className="profile-avatar">🎣</div>
      </div>
      <div>
        <div className="profile-name">Matt Clarke</div>
        <div className="profile-since">Angling since 2019</div>
        <div className="profile-badge">⭐ Verified Angler</div>
      </div>
    </div>
    <div className="section-header" style={{ paddingTop: 4 }}><span className="section-title">This Season</span></div>
    <div className="stats-grid">
      <div className="stat-card" onClick={() => setView('catches')}><div className="stat-num">{ALL_CATCHES.length}</div><div className="stat-label">Total Catches ›</div></div>
      <div className="stat-card" onClick={() => setView('species')}><div className="stat-num">{sp.length}</div><div className="stat-label">Species Caught ›</div></div>
      <div className="stat-card"><div className="stat-num">3.8</div><div className="stat-label">Avg Weight (lb)</div></div>
      <div className="stat-card" onClick={() => setView('sessions')}><div className="stat-num">{sessions.length || 18}</div><div className="stat-label">Sessions ›</div></div>
    </div>
    <div className="section-header" style={{ paddingTop: 24 }}><span className="section-title">Personal Bests</span></div>
    <div className="pb-list">
      {PBS.map((pb, i) => <div className="pb-row" key={i}>
        <div className="pb-left"><FishImg species={pb.species} className="pb-fish-img" /><span className="pb-species">{pb.species}</span></div>
        <div className="pb-weight">{pb.weight}</div>
      </div>)}
    </div><div style={{ height: 16 }} />
  </div>;
}

function AccountScreen({ profile, onUpdate }) {
  const [form, setForm] = useState({ ...profile });
  const [notifs, setNotifs] = useState({ newFollower: true, communityNearby: true, appUpdates: false });
  const inputRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('photo', ev.target.result);
    reader.readAsDataURL(file);
  };

  const Toggle = ({ k }) => (
    <button className={`toggle-switch ${notifs[k] ? 'on' : 'off'}`} onClick={() => setNotifs(n => ({ ...n, [k]: !n[k] }))}>
      <div className="toggle-knob" />
    </button>
  );

  return <div>
    <div className="section-header" style={{ paddingTop: 24 }}><span className="section-title">Account</span></div>
    <div className="account-avatar-section">
      <button className="account-avatar" onClick={() => inputRef.current.click()}>
        {form.photo ? <img src={form.photo} alt="avatar" /> : <span>{form.emoji || '🎣'}</span>}
      </button>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
      <div className="account-avatar-label">Change profile photo</div>
    </div>
    <div className="account-form">
      <div className="account-section-title">Profile</div>
      {[['name', 'Full name', 'e.g. Matt Clarke'], ['username', 'Username', 'e.g. @mattfishes'], ['location', 'Location', 'e.g. Southampton, Hampshire'], ['bio', 'Bio', 'A short description about you…']].map(([k, l, p]) =>
        <div className="form-group" key={k}><label className="form-label">{l}</label>
          {k === 'bio' ? <textarea className="form-textarea" placeholder={p} value={form[k] || ''} onChange={e => set(k, e.target.value)} /> : <input className="form-input" placeholder={p} value={form[k] || ''} onChange={e => set(k, e.target.value)} />}
        </div>
      )}
      <div className="form-group"><label className="form-label">Angling since</label><input className="form-input" placeholder="e.g. 2019" value={form.anglingYear || ''} onChange={e => set('anglingYear', e.target.value)} /></div>

      <div className="account-section-title">Account Details</div>
      {[['email', 'Email address', 'e.g. matt@email.com'], ['password', 'Change password', '••••••••']].map(([k, l, p]) =>
        <div className="form-group" key={k}><label className="form-label">{l}</label><input className="form-input" type={k === 'password' ? 'password' : 'email'} placeholder={p} value={form[k] || ''} onChange={e => set(k, e.target.value)} /></div>
      )}

      <div className="account-section-title">Notifications</div>
      {[['newFollower', 'New follower', 'When someone follows you'], ['communityNearby', 'Nearby catches', 'Catches logged near your location'], ['appUpdates', 'App updates', 'News and new features']].map(([k, l, sub]) =>
        <div className="toggle-row" key={k}>
          <div><div className="toggle-label">{l}</div><div className="toggle-sub">{sub}</div></div>
          <Toggle k={k} />
        </div>
      )}

      <button className="account-save-btn" onClick={() => onUpdate(form)}>Save Changes</button>
      <div style={{ height: 24 }} />
    </div>
  </div>;
}

// ── NAV ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'home', label: 'Home', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { id: 'feed', label: 'Feed', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { id: 'map', label: 'Map', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg> },
  { id: 'log', label: 'Log', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg> },
  { id: 'tackle', label: 'Tackle', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg> },
  { id: 'stats', label: 'Stats', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
  { id: 'account', label: 'Account', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
];

// ── APP ROOT ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [sessions, setSessions] = useState([
    { location: 'Chesil Beach', date: '1 Jun 2025', catches: 3 },
    { location: 'Whitby Pier', date: '28 May 2025', catches: 2 },
  ]);
  const [catchPins, setCatchPins] = useState([]);
  const [customBaits, setCustomBaits] = useState([]);
  const [customLures, setCustomLures] = useState([]);
  const [profile, setProfile] = useState({ name: 'Matt Clarke', username: '@mattfishes', location: 'Southampton, Hampshire', anglingYear: '2019', bio: 'Passionate sea and river angler based on the south coast.', email: '', photo: null, emoji: '🎣' });

  useEffect(() => {
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);
    }
  }, []);

  const triggerToast = msg => { setToast(msg); setShowToast(true); setTimeout(() => setShowToast(false), 2500); };

  const handleSaveCatch = (catchData) => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const loc = catchData?.location || 'Unknown location';
    setSessions(prev => {
      const existing = prev.find(s => s.date === today && s.location === loc);
      if (existing) return prev.map(s => s.date === today && s.location === loc ? { ...s, catches: s.catches + 1 } : s);
      return [{ location: loc, date: today, catches: 1 }, ...prev];
    });
    if (catchData?.pin) {
      setCatchPins(p => [...p, { lat: catchData.pin.lat, lng: catchData.pin.lng, label: `${catchData.species} — ${catchData.weight_lb}lb · ${loc}`, color: '#3B9EE8' }]);
    }
    triggerToast('🐟 Catch saved!');
    setScreen('home');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen onLog={() => setScreen('log')} />;
      case 'feed': return <FeedScreen />;
      case 'map': return <MapScreen catchPins={catchPins} />;
      case 'log': return <LogScreen onSaved={handleSaveCatch} customBaits={customBaits} customLures={customLures} onAddCustomBait={b => setCustomBaits(p => p.includes(b) ? p : [...p, b])} onAddCustomLure={l => setCustomLures(p => p.includes(l) ? p : [...p, l])} />;
      case 'tackle': return <TackleScreen />;
      case 'stats': return <StatsScreen sessions={sessions} />;
      case 'account': return <AccountScreen profile={profile} onUpdate={p => { setProfile(p); triggerToast('✅ Profile saved!'); }} />;
      default: return <HomeScreen onLog={() => setScreen('log')} />;
    }
  };

  return <>
    <style>{styles}</style>
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-logo">CATCH<span>BASE</span></div>
        {NAV.map(n => <button key={n.id} className={`sidebar-item${screen === n.id ? ' active' : ''}`} onClick={() => setScreen(n.id)}>{n.icon}{n.label}</button>)}
        <div className="sidebar-version">CatchBase · Sea & River</div>
      </nav>
      <div className="main-content">{renderScreen()}</div>
      <nav className="bottom-nav">
        {NAV.map(n => <button key={n.id} className={`nav-item${screen === n.id ? ' active' : ''}`} onClick={() => setScreen(n.id)}>{n.icon}{n.label}</button>)}
      </nav>
      <div className={`toast${showToast ? ' show' : ''}`}>{toast}</div>
    </div>
  </>;
}
