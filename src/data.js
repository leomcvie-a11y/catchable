export const SEA_SPECIES = ['Sea Bass','Cod','Mackerel','Pollock','Flounder','Plaice','Whiting','Dogfish','Conger Eel','Smoothhound','Bull Huss','Wrasse','Grey Mullet','Dab','Turbot','Thornback Ray','Black Bream','Garfish','Coalfish','Pouting'];
export const RIVER_SPECIES = ['Brown Trout','Sea Trout','Atlantic Salmon','Barbel','Chub','Roach','Dace','Grayling','Pike','Perch','Tench','Bream','Rudd','Carp'];
export const SEA_BAITS = ['Ragworm','Lugworm','Mackerel Strip','Squid','Sandeel','Peeler Crab','Hermit Crab','Mussel','Limpet'];
export const RIVER_BAITS = ['Maggots','Casters','Worm','Bread','Pellets','Boilies','Corn','Hemp','Paste'];
export const SEA_LURES = ['Savage Gear Sandeel','Rapala X-Rap','Dexter Wedge','Toby Spoon','Berkley Ripple Shad','Fiiish Black Minnow','Storm Biscay Shad','Westin Sandy Andy'];
export const RIVER_LURES = ['Mepps Aglia Spinner','Rapala Original Floater','Daiwa Prorex Shad','Abu Garcia Toby','Salmo Hornet','Blue Fox Vibrax','Savage Gear 3D Roach'];

export const FISH_PHOTOS = {
  'Sea Bass':'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Dicentrarchus_labrax.jpg/400px-Dicentrarchus_labrax.jpg',
  'Cod':'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Atlantic_cod.jpg/400px-Atlantic_cod.jpg',
  'Mackerel':'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scomber_scombrus.jpg/400px-Scomber_scombrus.jpg',
  'Pollock':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Pollachius_pollachius.jpg/400px-Pollachius_pollachius.jpg',
  'Flounder':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Platichthys_flesus.jpg/400px-Platichthys_flesus.jpg',
  'Brown Trout':'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Brown_trout_Salmo_trutta.jpg/400px-Brown_trout_Salmo_trutta.jpg',
  'Pike':'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Esox_lucius.jpg/400px-Esox_lucius.jpg',
  'Barbel':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Barbus_barbus.jpg/400px-Barbus_barbus.jpg',
  'Smoothhound':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Mustelus_mustelus.jpg/400px-Mustelus_mustelus.jpg',
  'Wrasse':'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Labrus_bergylta.jpg/400px-Labrus_bergylta.jpg',
  'Perch':'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Perca_fluviatilis.jpg/400px-Perca_fluviatilis.jpg',
  'Roach':'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Rutilus_rutilus.jpg/400px-Rutilus_rutilus.jpg',
};

export const TACKLE_PHOTOS = {
  'Rods':'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
  'Reels':'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
  'Lures':'https://images.unsplash.com/photo-1612698093347-8c7a2b9bc4d3?w=400&q=80',
  'Terminal':'https://images.unsplash.com/photo-1567598508481-65985588e295?w=400&q=80',
  'Bait':'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  'Other':'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
};

export const RECENT_CATCHES = [
  { id:1, species:'Sea Bass', weight:'4lb 8oz', location:'Chesil Beach', date:'Today' },
  { id:2, species:'Cod', weight:'6lb 14oz', location:'Whitby Pier', date:'Yesterday' },
  { id:3, species:'Mackerel', weight:'1lb 2oz', location:'Brighton Pier', date:'2 days ago' },
  { id:4, species:'Pollock', weight:'3lb 6oz', location:'Lyme Regis', date:'3 days ago' },
];

export const FEED_POSTS_FOLLOWING = [
  { id:1, user:'SouthCoastSam', avatar:'🎣', location:'Chesil Beach, Dorset', lat:50.613, lng:-2.456, species:'Sea Bass', weight:'7lb 2oz', text:"Incredible dawn session at Chesil this morning. Used ragworm on a running leger rig — took about 40 minutes but absolutely worth the wait. Biggest bass of the year!", tags:['SeaBass','ChesilBeach','Ragworm'], likes:54, comments:18, liked:false, dist:4.2 },
  { id:2, user:'NorthSeaNick', avatar:'🦅', location:'Whitby Pier, Yorkshire', lat:54.486, lng:-0.612, species:'Cod', weight:'9lb 4oz', text:"Winter cod are back at Whitby! Peeler crab fished on the sea bed just off the pier end. Three fish in two hours — this is what it's all about.", tags:['CodFishing','Whitby','PeelerCrab'], likes:92, comments:37, liked:true, dist:234 },
];

export const FEED_POSTS_EXPLORE = [
  { id:3, user:'WestCountryWill', avatar:'🌊', location:'Lyme Regis, Dorset', lat:50.723, lng:-2.938, species:'Pollock', weight:'5lb 2oz', text:"Great session off the Cobb this evening. Fiiish Black Minnow on the drop — three pollock in an hour. Water clarity was excellent.", tags:['Pollock','LymeRegis','Lure'], likes:31, comments:9, liked:false, dist:8.7 },
  { id:4, user:'KentCoastKev', avatar:'🐟', location:'Dungeness, Kent', lat:50.914, lng:0.978, species:'Cod', weight:'4lb 8oz', text:"Dungeness producing well at the moment. Lugworm tipped with squid doing the damage on the shingle.", tags:['Cod','Dungeness','Lugworm'], likes:44, comments:12, liked:false, dist:18.3 },
  { id:5, user:'NorfolkNige', avatar:'🦈', location:'Cromer Pier, Norfolk', lat:52.931, lng:1.302, species:'Mackerel', weight:'1lb 6oz', text:"Mackerel absolutely everywhere off Cromer today. Feathers doing the business, took 20 in an hour. Fresh bait sorted for the week!", tags:['Mackerel','Cromer','Feathers'], likes:67, comments:22, liked:false, dist:112 },
  { id:6, user:'PlymouthPete', avatar:'🎣', location:'Plymouth Sound', lat:50.366, lng:-4.142, species:'Sea Bass', weight:'6lb 0oz', text:"Surface lure fishing in the Sound producing some cracking bass. Savage Gear Sandeel on a walk-the-dog retrieve.", tags:['SeaBass','Plymouth','SurfaceLure'], likes:88, comments:31, liked:false, dist:156 },
];

export const SPOTS = [
  { name:'Chesil Beach', type:'Sea — Surf Beach', fish:'Bass, Cod, Dogfish', dist:'4.2mi', emoji:'🌊' },
  { name:'Whitby Pier', type:'Sea — Pier', fish:'Cod, Whiting, Mackerel', dist:'12mi', emoji:'🏗️' },
  { name:'River Itchen', type:'River', fish:'Brown Trout, Grayling', dist:'2.1mi', emoji:'🏞️' },
  { name:'Brighton Marina', type:'Sea — Marina', fish:'Bass, Wrasse, Mullet', dist:'8.7mi', emoji:'⚓' },
];

export const INITIAL_TACKLE = [
  { id:'rods', name:'Rods', emoji:'🎣', items:[
    { id:'r1', name:'Daiwa Ninja X', brand:'Daiwa', price:'89.99', purchaseDate:'12 Mar 2024', purchaseWhere:'Veals Fishing', comments:'Great all-round sea rod, good for bass and cod sessions.', photo:null, catches:[{ species:'Sea Bass', weight:'4lb 8oz', date:'10 Jun 2025' },{ species:'Pollock', weight:'2lb 4oz', date:'3 Mar 2025' }] },
    { id:'r2', name:'Shakespeare Ugly Stik', brand:'Shakespeare', price:'54.99', purchaseDate:'5 Jan 2023', purchaseWhere:'Amazon', comments:'Reliable beginner rod, very tough.', photo:null, catches:[{ species:'Cod', weight:'5lb 0oz', date:'8 Jan 2025' }] },
  ]},
  { id:'reels', name:'Reels', emoji:'⚙️', items:[{ id:'re1', name:'Shimano Baitrunner DL', brand:'Shimano', price:'129.99', purchaseDate:'1 Jun 2023', purchaseWhere:'Angling Direct', comments:'Smooth drag, excellent for beach fishing.', photo:null, catches:[] }] },
  { id:'lures', name:'Lures', emoji:'🎯', items:[] },
  { id:'terminal', name:'Terminal', emoji:'🪝', items:[] },
  { id:'bait', name:'Bait', emoji:'🧪', items:[] },
  { id:'other', name:'Other', emoji:'🎒', items:[] },
];

export const PBS = [
  { species:'Sea Bass', weight:'7lb 2oz' },{ species:'Cod', weight:'9lb 4oz' },
  { species:'Mackerel', weight:'1lb 14oz' },{ species:'Pollock', weight:'4lb 8oz' },
  { species:'Smoothhound', weight:'11lb 6oz' },{ species:'Brown Trout', weight:'3lb 2oz' },
  { species:'Pike', weight:'14lb 8oz' },{ species:'Barbel', weight:'8lb 12oz' },
];

export const ALL_CATCHES = [
  { id:1, species:'Sea Bass', weight:'4lb 8oz', location:'Chesil Beach', date:'10 Jun 2025', bait:'Ragworm' },
  { id:2, species:'Cod', weight:'6lb 14oz', location:'Whitby Pier', date:'9 Jun 2025', bait:'Peeler Crab' },
  { id:3, species:'Mackerel', weight:'1lb 2oz', location:'Brighton Pier', date:'8 Jun 2025', bait:'Feathers' },
  { id:4, species:'Pollock', weight:'3lb 6oz', location:'Lyme Regis', date:'5 Jun 2025', bait:'Lures' },
  { id:5, species:'Smoothhound', weight:'8lb 4oz', location:'Chesil Beach', date:'1 Jun 2025', bait:'Peeler Crab' },
  { id:6, species:'Brown Trout', weight:'2lb 8oz', location:'River Itchen', date:'28 May 2025', bait:'Flies' },
];
