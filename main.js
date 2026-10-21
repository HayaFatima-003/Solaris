import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TAU = Math.PI * 2;
const DAY = 86400;
const J2000 = Date.UTC(2000, 0, 1, 12);
const worldData = [
  {id:'mercury',name:'Mercury',type:'TERRESTRIAL PLANET',symbol:'☿',color:'#aaa49a',size:.39,a:.387,e:.2056,inc:7.00,node:48.33,peri:29.12,M:174.796,period:87.969,day:58.646,gravity:3.7,temp:'167°C avg.',moons:[],distance:'0.39 AU',description:'The smallest planet and the closest world to the Sun. Its ancient, cratered surface records billions of years of impacts.',atmosphere:'Almost no atmosphere — a thin exosphere.',note:'A cratered, airless world with extreme temperature swings.',rotation:'58.6 Earth days',year:'88 Earth days',compare:'One Mercury year is shorter than three Earth months. Its solar day lasts about 176 Earth days.',mass:'0.055 Earths',surface:'Rocky, cratered terrain'},
  {id:'venus',name:'Venus',type:'TERRESTRIAL PLANET',symbol:'♀',color:'#d6ae78',size:.95,a:.723,e:.0068,inc:3.39,node:76.68,peri:54.88,M:50.115,period:224.701,day:-243.025,gravity:8.87,temp:'464°C avg.',moons:[],distance:'0.72 AU',description:'A rocky planet wrapped in dense clouds. A runaway greenhouse effect makes its surface hotter than Mercury’s.',atmosphere:'Dense carbon dioxide, with sulfuric-acid clouds.',note:'A bright cloud-covered world with a crushing atmosphere.',rotation:'243 Earth days (retrograde)',year:'225 Earth days',compare:'A Venusian day (one rotation) is longer than its year, and Venus rotates in the opposite direction to most planets.',mass:'0.815 Earths',surface:'Volcanic rocky plains'},
  {id:'earth',name:'Earth',type:'TERRESTRIAL PLANET',symbol:'⊕',color:'#418ad4',size:1,a:1,e:.0167,inc:0,node:-11.26,peri:114.21,M:357.517,period:365.256,day:.9973,gravity:9.81,temp:'15°C avg.',moons:[{name:'Moon',size:.27,period:27.32,color:'#bfc2c8' }],distance:'1.00 AU',description:'Our home world: liquid oceans, a protective atmosphere, a magnetic field, and the only world currently known to host life.',atmosphere:'Mostly nitrogen and oxygen.',note:'Blue oceans, cloud systems, continents and a thin protective atmosphere.',rotation:'23 h 56 min',year:'365.25 days',compare:'Earth is our reference point: gravity is 1 g and one solar day is about 24 hours.',mass:'1 Earth',surface:'Oceans, continents and clouds'},
  {id:'mars',name:'Mars',type:'TERRESTRIAL PLANET',symbol:'♂',color:'#c65d3d',size:.53,a:1.524,e:.0934,inc:1.85,node:49.56,peri:286.5,M:19.373,period:686.98,day:1.02596,gravity:3.71,temp:'−65°C avg.',moons:[{name:'Phobos',size:.10,period:.319,color:'#9d8e80'},{name:'Deimos',size:.08,period:1.263,color:'#b2a394'}],distance:'1.52 AU',description:'A cold desert world with giant volcanoes, deep canyons, ancient river channels and two small, irregular moons.',atmosphere:'Thin atmosphere, mostly carbon dioxide.',note:'Rust-red terrain, dusty plains, craters and towering volcanoes.',rotation:'24 h 37 min',year:'687 Earth days',compare:'A Martian day is only about 37 minutes longer than an Earth day. A year lasts 687 Earth days.',mass:'0.107 Earths',surface:'Rocky desert and ancient river valleys'},
  {id:'jupiter',name:'Jupiter',type:'GAS GIANT',symbol:'♃',color:'#d0a47c',size:3.15,a:5.203,e:.0489,inc:1.30,node:100.46,peri:273.87,M:20.020,period:4332.59,day:.4135,gravity:24.79,temp:'−110°C cloud tops',moons:[{name:'Io',size:.22,period:1.769,color:'#d8b55d'},{name:'Europa',size:.20,period:3.551,color:'#c9c3ad'},{name:'Ganymede',size:.29,period:7.155,color:'#a69b8b'},{name:'Callisto',size:.26,period:16.689,color:'#73695f'}],distance:'5.20 AU',description:'The largest planet, a vast gas giant with banded clouds, powerful storms and a family of fascinating icy and volcanic moons.',atmosphere:'Mostly hydrogen and helium, with colorful cloud bands.',note:'Banded clouds, huge storms and the Great Red Spot swirl above a deep atmosphere.',rotation:'About 9 h 56 min',year:'11.86 Earth years',compare:'Jupiter rotates in under 10 hours, yet takes almost 12 Earth years to orbit the Sun.',mass:'317.8 Earths',surface:'No solid surface; cloud-top view'},
  {id:'saturn',name:'Saturn',type:'GAS GIANT',symbol:'♄',color:'#d7c08a',size:2.65,a:9.537,e:.0565,inc:2.49,node:113.66,peri:339.39,M:317.02,period:10759.22,day:.444,gravity:10.44,temp:'−140°C cloud tops',moons:[{name:'Titan',size:.27,period:15.945,color:'#d6a45f'},{name:'Enceladus',size:.13,period:1.37,color:'#e1e5e8'},{name:'Rhea',size:.16,period:4.518,color:'#b8b6b2'},{name:'Iapetus',size:.15,period:79.32,color:'#9d9183'}],distance:'9.54 AU',description:'A low-density gas giant best known for its immense rings, made primarily of countless pieces of water ice and rocky debris.',atmosphere:'Hydrogen and helium with subtle golden cloud bands.',note:'A golden gas giant surrounded by a broad, icy ring system.',rotation:'About 10 h 39 min',year:'29.4 Earth years',compare:'Saturn’s year lasts nearly three decades on Earth. Its rings span a huge distance but are remarkably thin.',mass:'95.2 Earths',surface:'No solid surface; ring and cloud view'},
  {id:'uranus',name:'Uranus',type:'ICE GIANT',symbol:'♅',color:'#8edbdc',size:1.55,a:19.191,e:.0472,inc:.77,node:74.01,peri:96.99,M:142.238,period:30688.5,day:-.7183,gravity:8.69,temp:'−195°C avg.',moons:[{name:'Titania',size:.18,period:8.706,color:'#aaa9a4'},{name:'Oberon',size:.17,period:13.463,color:'#8d8982'},{name:'Miranda',size:.12,period:1.413,color:'#c0b9ad'},{name:'Ariel',size:.14,period:2.52,color:'#b3b2ae'}],distance:'19.19 AU',description:'A pale cyan ice giant that rotates on its side. Its unusual axial tilt creates extreme seasonal cycles.',atmosphere:'Hydrogen, helium and methane, which absorbs red light.',note:'A smooth blue-green atmosphere and faint rings around a dramatically tilted planet.',rotation:'About 17 h 14 min (retrograde)',year:'84 Earth years',compare:'Uranus takes 84 Earth years to orbit the Sun and has an axial tilt of about 98 degrees.',mass:'14.5 Earths',surface:'No solid surface; atmospheric view'},
  {id:'neptune',name:'Neptune',type:'ICE GIANT',symbol:'♆',color:'#416fe0',size:1.50,a:30.07,e:.0086,inc:1.77,node:131.78,peri:273.19,M:256.228,period:60182,day:.6713,gravity:11.15,temp:'−200°C avg.',moons:[{name:'Triton',size:.22,period:-5.877,color:'#c4bdb6'},{name:'Proteus',size:.13,period:1.122,color:'#7c7a78'},{name:'Nereid',size:.10,period:360.14,color:'#a3a09b'}],distance:'30.07 AU',description:'A distant, dynamic ice giant with supersonic winds, dark storms and a deep blue atmosphere.',atmosphere:'Hydrogen, helium and methane, with trace compounds.',note:'Deep-blue cloud layers and fast-moving atmospheric storms.',rotation:'About 16 h 6 min',year:'165 Earth years',compare:'Neptune has completed less than two full solar orbits since its discovery in 1846.',mass:'17.1 Earths',surface:'No solid surface; atmospheric view'},
  {id:'pluto',name:'Pluto',type:'DWARF PLANET',symbol:'♇',color:'#b9a18b',size:.28,a:39.482,e:.2488,inc:17.14,node:110.30,peri:113.76,M:14.53,period:90560,day:-6.387,gravity:.62,temp:'−229°C avg.',moons:[{name:'Charon',size:.18,period:6.387,color:'#b0aaa2'},{name:'Nix',size:.07,period:24.9,color:'#a8a29a'},{name:'Hydra',size:.07,period:38.2,color:'#8b857d'}],distance:'39.48 AU avg.',description:'A complex icy dwarf planet in the Kuiper Belt, with mountains, glaciers, a thin atmosphere and a famous heart-shaped region.',atmosphere:'Thin nitrogen atmosphere that changes with distance from the Sun.',note:'Icy mountains, nitrogen glaciers and the bright Tombaugh Regio heart region.',rotation:'6.39 Earth days (retrograde)',year:'248 Earth years',compare:'Pluto’s orbit is highly elliptical and tilted. Its year lasts 248 Earth years, and it has a large companion moon, Charon.',mass:'0.0022 Earths',surface:'Icy terrain and nitrogen glaciers'}
];
const sunData = {id:'sun',name:'Sun',type:'STAR',symbol:'☼',color:'#ffd27a',size:5.6,a:0,period:0,day:25.4,gravity:274,temp:'5,500°C surface',moons:[],distance:'Center',description:'The star at the center of our planetary system. Its gravity governs planetary orbits, while nuclear fusion powers its light and heat.',atmosphere:'Hot plasma; a photosphere, chromosphere and corona.',note:'A luminous star with granular surface texture and a dynamic corona.',rotation:'About 25–35 days',year:'Galactic orbit: ~230 million years',compare:'The Sun contains about 99.86% of the solar system’s total mass.',mass:'333,000 Earths',surface:'Hot plasma — no solid surface'};
const allWorlds = [sunData, ...worldData];
const moonSets = {
  mercury:['No confirmed natural moons'],venus:['No confirmed natural moons'],
  earth:['Moon'],mars:['Phobos','Deimos'],
  jupiter:['Io','Europa','Ganymede','Callisto','Amalthea','Himalia'],
  saturn:['Titan','Enceladus','Rhea','Iapetus','Dione','Tethys','Mimas'],
  uranus:['Titania','Oberon','Miranda','Ariel','Umbriel'],
  neptune:['Triton','Proteus','Nereid'],pluto:['Charon','Nix','Hydra','Kerberos','Styx']
};
// Expand the visible moon catalogue. Orbital periods are in Earth days; a few outer moons
// use approximate values for an educational visualization rather than a precision ephemeris.
const extraMoonData = {
  Amalthea:{period:.498,color:0x9b8d7c,size:.055},Himalia:{period:250.6,color:0xaaa29a,size:.065},
  Dione:{period:2.737,color:0xc4c2bd,size:.11},Tethys:{period:1.888,color:0xd4d1cb,size:.11},Mimas:{period:.942,color:0xb7b2a9,size:.08},
  Umbriel:{period:4.144,color:0x777773,size:.11},Ariel:{period:2.52,color:0xb5b4ae,size:.12},
  Kerberos:{period:32.2,color:0x8c857d,size:.045},Styx:{period:20.2,color:0x9b9388,size:.04}
};
const fallbackMoonPeriod = {Amalthea:.498,Himalia:250.6,Dione:2.737,Tethys:1.888,Mimas:.942,Umbriel:4.144,Ariel:2.52,Kerberos:32.2,Styx:20.2};
worldData.forEach(d=>{
  const names=moonSets[d.id]||[];
  if(!names.length||names[0].startsWith('No confirmed'))return;
  const existing=new Map((d.moons||[]).map(m=>[m.name,m]));
  d.moons=names.map((name,i)=>existing.get(name)||({name,size:extraMoonData[name]?.size||Math.max(.045,.12-i*.009),period:extraMoonData[name]?.period||fallbackMoonPeriod[name]||Math.max(1,(i+1)*2.7),color:extraMoonData[name]?.color||0xb8b5b0}));
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050711);
scene.fog = new THREE.FogExp2(0x050711, 0.00048);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1600);
camera.position.set(0, 66, 108);
const renderer = new THREE.WebGLRenderer({canvas:$('universe'),antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.32;
const controls = new OrbitControls(camera,renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .075; controls.zoomSpeed = 1.15; controls.minDistance = 2.2; controls.maxDistance = 420; controls.maxPolarAngle = Math.PI*.94;
scene.add(new THREE.AmbientLight(0x9aa9d8,.42));
const sunLight = new THREE.PointLight(0xffd5a0,2600,1200,1.05); sunLight.position.set(0,0,0); scene.add(sunLight);
const fillLight = new THREE.HemisphereLight(0x91a9e9,0x100b18,.7); scene.add(fillLight);
const textureLoader = new THREE.TextureLoader();
const texCache = new Map();
const texUrls = {
  mercury:'https://threejs.org/examples/textures/planets/mercury.jpg',
  venus:'https://threejs.org/examples/textures/planets/venus.jpg',
  earth:'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  mars:'https://threejs.org/examples/textures/planets/mars_1k_color.jpg',
  jupiter:'https://threejs.org/examples/textures/planets/jupiter.jpg',
  saturn:'https://threejs.org/examples/textures/planets/saturn.jpg',
  uranus:'https://threejs.org/examples/textures/planets/uranus.jpg',
  neptune:'https://threejs.org/examples/textures/planets/neptune.jpg',
  pluto:'https://threejs.org/examples/textures/planets/pluto.jpg'
};
const fallbackColors = {mercury:0x9c958d,venus:0xc9a273,earth:0x1e5eaa,mars:0xb74e2e,jupiter:0xcba27e,saturn:0xd4bd8c,uranus:0x83cdd0,neptune:0x315fe2,pluto:0xa99b8b};
function loadTexture(key){
  if(texCache.has(key)) return texCache.get(key);
  const promise = new Promise(resolve=>{
    if(!texUrls[key]) return resolve(null);
    textureLoader.load(texUrls[key], t=>{t.colorSpace=THREE.SRGBColorSpace;resolve(t)},undefined,()=>resolve(null));
  });
  texCache.set(key,promise); return promise;
}
function makeProceduralTexture(baseHex,key){
  const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');
  const base=new THREE.Color(baseHex);ctx.fillStyle=`#${base.getHexString()}`;ctx.fillRect(0,0,512,256);
  let seed=key.split('').reduce((a,x)=>a+x.charCodeAt(0),37);
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<2600;i++){let x=rand()*512,y=rand()*256,w=rand()*48+2,h=rand()*5+1;ctx.globalAlpha=rand()*.19;ctx.fillStyle=rand()>.5?'#fff0d4':'#080d22';ctx.beginPath();ctx.ellipse(x,y,w,h,rand()*Math.PI,0,TAU);ctx.fill()}
  if(key==='jupiter'||key==='saturn'){for(let y=15;y<256;y+=13+rand()*11){ctx.globalAlpha=.13+rand()*.22;ctx.fillStyle=rand()>.5?'#fff4d5':'#4e3428';ctx.fillRect(0,y,512,2+rand()*8)}}
  if(key==='earth'){ctx.globalAlpha=.65;ctx.fillStyle='#64ad77';for(let i=0;i<30;i++){ctx.beginPath();ctx.ellipse(rand()*512,rand()*256,rand()*65+8,rand()*22+3,rand()*Math.PI,0,TAU);ctx.fill()}}
  if(key==='mars'){ctx.globalAlpha=.25;ctx.fillStyle='#e4b080';for(let i=0;i<90;i++){ctx.beginPath();ctx.arc(rand()*512,rand()*256,rand()*10+2,0,TAU);ctx.fill()}}
  ctx.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function makeStars(){
  const count=6500, pos=new Float32Array(count*3), cols=new Float32Array(count*3);
  for(let i=0;i<count;i++){const r=320+Math.random()*450,theta=Math.random()*TAU,phi=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(phi)*Math.cos(theta);pos[i*3+1]=r*Math.cos(phi);pos[i*3+2]=r*Math.sin(phi)*Math.sin(theta);const v=.45+Math.random()*.55;cols[i*3]=v*.78;cols[i*3+1]=v*.84;cols[i*3+2]=v}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(cols,3));
  const m=new THREE.PointsMaterial({size:.75,vertexColors:true,sizeAttenuation:true,transparent:true,opacity:.95,depthWrite:false});scene.add(new THREE.Points(g,m));
}
makeStars();
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(sunData.size,64,48),new THREE.MeshBasicMaterial({color:0xffc66f}));
scene.add(sunMesh);
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({map:createGlowTexture(),color:0xffb44e,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.85}));
sunGlow.scale.set(42,42,1);sunMesh.add(sunGlow);
function createGlowTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(64,64,2,64,64,64);g.addColorStop(0,'rgba(255,235,160,1)');g.addColorStop(.18,'rgba(255,170,70,.5)');g.addColorStop(1,'rgba(255,100,30,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
const sunCorona = new THREE.Mesh(new THREE.SphereGeometry(sunData.size*1.15,48,32),new THREE.MeshBasicMaterial({color:0xff9b42,transparent:true,opacity:.22,side:THREE.BackSide,blending:THREE.AdditiveBlending}));sunMesh.add(sunCorona);
const planetObjects=new Map(), orbitObjects=new Map(), labelObjects=new Map();
const worldGroup = new THREE.Group(); scene.add(worldGroup);
const planetScale=1.72;
function orbitalRadius(a){return 7.5 + Math.pow(a,0.72)*3.9}
function solveKepler(M,e){let E=M;for(let i=0;i<8;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
function positionFor(d,days){
  if(d.id==='sun')return new THREE.Vector3(0,0,0);
  const M0=THREE.MathUtils.degToRad(d.M), n=TAU/d.period;
  const M=M0+n*days, E=solveKepler(M,d.e), a=orbitalRadius(d.a), x=a*(Math.cos(E)-d.e), z=a*Math.sqrt(1-d.e*d.e)*Math.sin(E);
  const inc=THREE.MathUtils.degToRad(d.inc), node=THREE.MathUtils.degToRad(d.node), peri=THREE.MathUtils.degToRad(d.peri);
  const p=new THREE.Vector3(x*Math.cos(peri)-z*Math.sin(peri),x*Math.sin(peri)+z*Math.cos(peri),0);
  const y=p.y*Math.cos(inc), zz=p.y*Math.sin(inc);p.y=y;p.z=zz;
  const xx=p.x*Math.cos(node)-p.z*Math.sin(node), z2=p.x*Math.sin(node)+p.z*Math.cos(node);p.x=xx;p.z=z2;
  return p;
}
function makeOrbit(d){
  if(d.id==='sun')return;
  const points=[];for(let i=0;i<=360;i++){const E=TAU*i/360,a=orbitalRadius(d.a),x=a*(Math.cos(E)-d.e),z=a*Math.sqrt(1-d.e*d.e)*Math.sin(E);const inc=THREE.MathUtils.degToRad(d.inc),node=THREE.MathUtils.degToRad(d.node),peri=THREE.MathUtils.degToRad(d.peri);const px=x*Math.cos(peri)-z*Math.sin(peri),py=x*Math.sin(peri)+z*Math.cos(peri);const y=py*Math.cos(inc),zz=py*Math.sin(inc);points.push(new THREE.Vector3(px*Math.cos(node)-zz*Math.sin(node),y,px*Math.sin(node)+zz*Math.cos(node)))}
  const geo=new THREE.BufferGeometry().setFromPoints(points);const mat=new THREE.LineBasicMaterial({color:new THREE.Color(d.color),transparent:true,opacity:.34});const line=new THREE.Line(geo,mat);worldGroup.add(line);orbitObjects.set(d.id,line);
}
function makeLabel(d){
  const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.font='500 25px DM Mono, monospace';ctx.fillStyle='rgba(232,238,255,.92)';ctx.textAlign='center';ctx.fillText(d.name.toUpperCase(),128,39);const tex=new THREE.CanvasTexture(c);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sprite.scale.set(d.name.length>7?7.5:5.5,1.38,1);scene.add(sprite);labelObjects.set(d.id,sprite);return sprite;
}
function makePlanet(d){
  const g=new THREE.Group();worldGroup.add(g);
  const geo=new THREE.SphereGeometry(d.size,48,36);
  const mat=new THREE.MeshStandardMaterial({color:fallbackColors[d.id]||new THREE.Color(d.color),roughness:.86,metalness:.01});
  const mesh=new THREE.Mesh(geo,mat);g.add(mesh);
  loadTexture(d.id).then(t=>{if(t){mat.map=t;mat.color.set(0xffffff);mat.needsUpdate=true}else{mat.map=makeProceduralTexture(fallbackColors[d.id],d.id);mat.needsUpdate=true}});
  if(d.id==='earth'){
    const cloudMat=new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.16,roughness:1,depthWrite:false});
    const clouds=new THREE.Mesh(new THREE.SphereGeometry(d.size*1.018,40,32),cloudMat);g.add(clouds);g.userData.clouds=clouds;
    const atmo=new THREE.Mesh(new THREE.SphereGeometry(d.size*1.07,40,32),new THREE.MeshBasicMaterial({color:0x5bb7ff,transparent:true,opacity:.12,side:THREE.BackSide}));g.add(atmo);
  }
  if(d.id==='saturn'){
    const ring=new THREE.Mesh(new THREE.RingGeometry(d.size*1.35,d.size*2.3,128),new THREE.MeshStandardMaterial({color:0xcbb78f,side:THREE.DoubleSide,transparent:true,opacity:.82,roughness:.8}));ring.rotation.x=Math.PI/2.18;g.add(ring);
    const inner=new THREE.Mesh(new THREE.RingGeometry(d.size*1.12,d.size*1.35,128),new THREE.MeshStandardMaterial({color:0x88765b,side:THREE.DoubleSide,transparent:true,opacity:.6}));inner.rotation.x=Math.PI/2.18;g.add(inner);
  }
  if(d.id==='jupiter'){
    const spot=new THREE.Mesh(new THREE.SphereGeometry(d.size*.12,24,16),new THREE.MeshBasicMaterial({color:0xb95837}));spot.position.set(d.size*.55,d.size*.17,d.size*.81);g.add(spot);
  }
  if(d.id==='pluto'){
    const heart=new THREE.Mesh(new THREE.CircleGeometry(d.size*.18,32),new THREE.MeshBasicMaterial({color:0xe6d7c5,transparent:true,opacity:.85,side:THREE.DoubleSide}));heart.position.set(-d.size*.18,d.size*.2,d.size*.94);g.add(heart);
  }
  // Small visible satellites orbit each planet in the main solar-system view.
  const orbiters=[];
  (d.moons||[]).forEach((moon,i)=>{
    const radius=d.size*(1.8+i*.48)+.75;
    const points=Array.from({length:64},(_,j)=>new THREE.Vector3(Math.cos(j/64*TAU)*radius,Math.sin(j/64*TAU)*radius*.16,Math.sin(j/64*TAU)*radius));
    const orbit=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x9aa8ce,transparent:true,opacity:.28,depthWrite:false}));g.add(orbit);
    const moonMesh=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.075,Math.min(.19,moon.size*.8)),16,12),new THREE.MeshStandardMaterial({color:moon.color||0xb7b3aa,roughness:.9,emissive:moon.color||0x777777,emissiveIntensity:.08}));g.add(moonMesh);
    orbiters.push({mesh:moonMesh,radius,phase:i*1.8,period:Math.abs(moon.period)||2});
  });
  if(d.id==='uranus'){g.rotation.z=THREE.MathUtils.degToRad(98)}
  if(d.id==='neptune'){const darkSpot=new THREE.Mesh(new THREE.SphereGeometry(d.size*.12,20,16),new THREE.MeshBasicMaterial({color:0x172b79}));darkSpot.position.set(d.size*.48,d.size*.12,d.size*.86);g.add(darkSpot)}
  const hit=new THREE.Mesh(new THREE.SphereGeometry(d.size*1.28,16,12),new THREE.MeshBasicMaterial({visible:false,transparent:true,opacity:0}));g.add(hit);hit.userData.worldId=d.id;
  planetObjects.set(d.id,{group:g,mesh,hit,data:d,orbiters});
  makeOrbit(d);makeLabel(d);
}
worldData.forEach(makePlanet);
function addSunLabel(){makeLabel(sunData)}
addSunLabel();
const raycaster=new THREE.Raycaster();raycaster.params.Points.threshold=1;const pointer=new THREE.Vector2();let selected='mars',simSpeed=3,paused=false,simDays=0,showOrbits=true,showLabels=true,visitMode=false,visitTarget=null,toastTimer=null;
const speedDaysPerSec=[0,.1,.25,1,5,30,100,365,3650];
function speedName(){const v=speedDaysPerSec[simSpeed];if(v===0)return 'Paused';if(v<1)return `${v} day / sec`;if(v===1)return '1 day / sec';if(v<365)return `${v} days / sec`;return `${(v/365.256).toFixed(v>=3650?0:1)} year / sec`}
function showToast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2200)}
function setSelected(id,focus=true){
  const d=allWorlds.find(x=>x.id===id);if(!d)return;selected=id;
  document.querySelectorAll('.world-item').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));
  $('planet-panel').classList.remove('closed');$('panel-kicker').textContent=d.id==='sun'?'STELLAR PROFILE':d.type+' PROFILE';$('planet-symbol').textContent=d.symbol;$('planet-symbol').style.background=`radial-gradient(circle at 30% 25%,${d.color},#171927 75%)`;$('planet-name').textContent=d.name;$('planet-subtitle').textContent=d.type;$('planet-description').textContent=d.description;
  $('stats-grid').innerHTML=[
    ['ONE DAY',d.rotation||d.day+' Earth days','Rotation period'],
    ['ONE YEAR',d.year|| (d.period?`${(d.period/365.256).toFixed(2)} Earth years`:'—'),'Orbital period'],
    ['GRAVITY',`${d.gravity} m/s²`,'Surface / cloud-top reference'],
    ['TEMPERATURE',d.temp,'Typical conditions']
  ].map(s=>`<div class="stat-card"><div class="stat-label">${s[0]}</div><div class="stat-value">${s[1]}</div><div class="stat-unit">${s[2]}</div></div>`).join('');
  $('earth-comparison').textContent=d.compare;$('moons-button').disabled=d.id==='sun';$('moons-button').style.opacity=d.id==='sun'?'.45':'1';$('moons-button').querySelector('span').textContent=d.id==='sun'?'No moon system':'Explore moons';
  $('moon-section').classList.add('hidden');$('moon-stage').classList.add('hidden');
  $('visit-button').textContent=d.id==='sun'?'View star':'Visit world';$('visit-button').disabled=d.id==='sun';$('visit-button').style.opacity=d.id==='sun'?'.45':'1';
  if(focus&&planetObjects.has(id)){const p=planetObjects.get(id).group.position;const dir=new THREE.Vector3().subVectors(camera.position,controls.target).normalize();const target=p.clone();controls.target.copy(target);camera.position.copy(target.clone().add(dir.multiplyScalar(Math.max(12,d.size*7+14))));controls.update()}
}
function buildSidebar(){
  const list=$('world-list');list.innerHTML='';
  allWorlds.forEach(d=>{const b=document.createElement('button');b.className='world-item';b.dataset.id=d.id;b.innerHTML=`<span class="world-dot ${d.id==='saturn'?'ring':''}" style="background:radial-gradient(circle at 30% 25%,${d.color},#101321 85%)"></span><span class="world-item-text"><span class="world-item-name">${d.name}</span><span class="world-item-sub">${d.type}</span></span><span class="world-item-arrow">›</span>`;b.addEventListener('click',()=>setSelected(d.id));list.appendChild(b)})
}
buildSidebar();
function buildMoonList(){
  const d=allWorlds.find(x=>x.id===selected);if(!d||d.id==='sun')return;
  $('moon-section').classList.remove('hidden');const names=moonSets[d.id]||[];$('moon-count').textContent=names.length?`${names[0].startsWith('No confirmed')?0:names.length} IN CATALOGUE`:'0';const list=$('moon-list');list.innerHTML='';
  names.forEach((name,i)=>{const b=document.createElement('button');b.className='moon-chip';b.textContent=name;b.addEventListener('click',()=>{document.querySelectorAll('.moon-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');showToast(name==='No confirmed natural moons'?'No confirmed natural moons are known for this planet.':`${name} selected — moon data view`);$('moon-stage-title').textContent=`${name} · ${d.name} system`;createMoonStage(d,name)});list.appendChild(b)});
  $('moon-stage').classList.remove('hidden');$('moon-stage-title').textContent=`Moons of ${d.name}`;createMoonStage(d,null);
}
let moonRenderer=null,moonScene=null,moonCamera=null,moonControls=null,moonAnim=null;
function createMoonStage(d,chosen){
  const wrap=$('moon-canvas-wrap');if(moonRenderer){moonRenderer.dispose();moonRenderer.domElement.remove();moonRenderer=null}if(moonAnim)cancelAnimationFrame(moonAnim);wrap.innerHTML='';
  if(!(d.moons&&d.moons.length)){wrap.innerHTML='<div style="height:100%;display:grid;place-items:center;color:#8994b0;font:10px DM Mono,monospace;text-align:center">NO CONFIRMED NATURAL MOONS</div>';return}
  moonScene=new THREE.Scene();moonScene.background=new THREE.Color(0x070a14);moonCamera=new THREE.PerspectiveCamera(42,wrap.clientWidth/205,.1,140);moonCamera.position.set(0,13,20);moonRenderer=new THREE.WebGLRenderer({antialias:true,alpha:false});moonRenderer.setPixelRatio(Math.min(devicePixelRatio,2));moonRenderer.setSize(wrap.clientWidth,205);wrap.appendChild(moonRenderer.domElement);moonControls=new OrbitControls(moonCamera,moonRenderer.domElement);moonControls.enableDamping=true;moonControls.minDistance=4;moonControls.maxDistance=55;moonScene.add(new THREE.AmbientLight(0xffffff,1.8));const central=new THREE.Mesh(new THREE.SphereGeometry(1.8,32,24),new THREE.MeshStandardMaterial({color:fallbackColors[d.id]||0xaaaaaa,roughness:.8}));moonScene.add(central);
  const moons=[];d.moons.forEach((m,i)=>{const radius=3.5+i*1.65;const ring=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:90},(_,j)=>new THREE.Vector3(Math.cos(j/90*TAU)*radius,0,Math.sin(j/90*TAU)*radius))),new THREE.LineBasicMaterial({color:0x707b9b,transparent:true,opacity:.5}));moonScene.add(ring);const mesh=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.22,m.size*1.2),20,16),new THREE.MeshStandardMaterial({color:m.color||0xb7b3aa,roughness:1}));moonScene.add(mesh);moons.push({mesh,radius,phase:i*1.6,period:m.period,name:m.name})});
  const tick=()=>{if(!moonRenderer)return;moonAnim=requestAnimationFrame(tick);const t=performance.now()*.00045;moons.forEach(m=>{const rate=TAU/(Math.abs(m.period)||1);const angle=m.phase+t*rate*3;m.mesh.position.set(Math.cos(angle)*m.radius,Math.sin(angle*.4)*.25,Math.sin(angle)*m.radius);m.mesh.scale.setScalar(chosen&&chosen===m.name?1.4:1)});moonControls.update();moonRenderer.render(moonScene,moonCamera)};tick();
}
function enterVisit(){
  const d=allWorlds.find(x=>x.id===selected);if(!d||d.id==='sun')return;
  visitMode=true;visitTarget=d.id;$('visit-overlay').classList.remove('hidden');$('visit-name').textContent=d.name;$('visit-location').textContent=d.surface||'Planetary environment';$('visit-atmosphere').textContent=d.atmosphere;$('visit-note').textContent=d.note;
  $('planet-panel').classList.add('closed');$('sidebar').style.display='none';$('bottom-controls').style.display='none';
  const obj=planetObjects.get(d.id);if(!obj)return;
  const target=obj.group.position.clone();
  // Give the visit camera a low, close-to-ground viewpoint instead of leaving it at orbit distance.
  const terrainName='visitTerrain';const old=scene.getObjectByName(terrainName);if(old){scene.remove(old);old.geometry?.dispose();old.material?.dispose()}
  const terrainColor=d.id==='mars'?0x9c4932:d.id==='pluto'?0x9b8b7c:d.id==='earth'?0x315f43:d.id==='venus'?0x98734b:d.id==='mercury'?0x77736d:d.id==='jupiter'?0x92765d:d.id==='saturn'?0x9c895f:d.id==='uranus'?0x526e70:0x34527c;
  const terrainMat=new THREE.MeshStandardMaterial({color:terrainColor,roughness:1,metalness:0,side:THREE.DoubleSide});
  const terrain=new THREE.Mesh(new THREE.PlaneGeometry(220,220,150,150),terrainMat);
  const positions=terrain.geometry.attributes.position;
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),y=positions.getY(i);
    let h=Math.sin(x*.12)*1.0+Math.cos(y*.16)*.8+Math.sin((x+y)*.075)*.65;
    if(d.id==='mars'||d.id==='mercury'||d.id==='pluto')h+=Math.sin(x*.42)*Math.cos(y*.34)*.32;
    positions.setZ(i,h);
  }
  terrain.geometry.computeVertexNormals();terrain.rotation.x=-Math.PI/2;terrain.position.copy(target).add(new THREE.Vector3(0,-d.size*.88-.15,0));terrain.name=terrainName;scene.add(terrain);
  // Scatter rocky features into the foreground so the view reads as a landscape, not a flat plane.
  const rocks=new THREE.Group();rocks.name='visitRocks';
  const rockMat=new THREE.MeshStandardMaterial({color:d.id==='earth'?0x52684a:terrainColor,roughness:1});
  for(let i=0;i<90;i++){
    const a=Math.random()*TAU,dist=3+Math.random()*65;
    const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.12+Math.random()*.65,0),rockMat);
    rock.position.set(Math.cos(a)*dist,target.y-d.size*.88+Math.random()*.45,Math.sin(a)*dist-12);
    rock.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);rock.scale.y=.35+Math.random()*.6;rocks.add(rock);
  }
  scene.add(rocks);
  obj.mesh.visible=false;obj.hit.visible=false;
  const eyeHeight= d.id==='earth'?4.2 : d.id==='jupiter'||d.id==='saturn'||d.id==='uranus'||d.id==='neptune'?3.2:2.8;
  camera.position.copy(target).add(new THREE.Vector3(0,eyeHeight,-8));
  controls.target.copy(target).add(new THREE.Vector3(0,eyeHeight-1.2,-24));
  controls.minDistance=.25;controls.maxDistance=90;controls.maxPolarAngle=Math.PI*.49;controls.enablePan=true;controls.update();
  scene.fog=new THREE.Fog(terrainColor,24,155);
  $('visit-profile').onclick=()=>{exitVisit();setSelected(d.id,false)};
  showToast(`Landing view: ${d.name}`);
}
function exitVisit(){
  const id=visitTarget||selected;visitMode=false;$('visit-overlay').classList.add('hidden');$('sidebar').style.display='flex';$('bottom-controls').style.display='flex';
  for(const name of ['visitTerrain','visitRocks']){const o=scene.getObjectByName(name);if(o){scene.remove(o);o.traverse?.(child=>{child.geometry?.dispose();if(child.material&&!Array.isArray(child.material))child.material.dispose()})}}
  if(id&&planetObjects.has(id)){const obj=planetObjects.get(id);obj.mesh.visible=true;obj.hit.visible=true}
  scene.fog=new THREE.FogExp2(0x050711,.00032);controls.minDistance=2.2;controls.maxDistance=420;controls.maxPolarAngle=Math.PI*.94;controls.enablePan=false;
  setSelected(id,false);controls.target.set(0,0,0);camera.position.set(0,66,108);controls.update();visitTarget=null;
}
$('moons-button').addEventListener('click',buildMoonList);
$('visit-button').addEventListener('click',enterVisit);
$('return-orbit').addEventListener('click',exitVisit);
$('close-panel').addEventListener('click',()=>$('planet-panel').classList.toggle('closed'));
$('close-moon-stage').addEventListener('click',()=>$('moon-stage').classList.add('hidden'));
$('zoom-in').addEventListener('click',()=>{camera.position.copy(controls.target.clone().add(camera.position.clone().sub(controls.target).multiplyScalar(.72)));controls.update()});
$('zoom-out').addEventListener('click',()=>{camera.position.copy(controls.target.clone().add(camera.position.clone().sub(controls.target).multiplyScalar(1.38)));controls.update()});
$('reset-camera').addEventListener('click',()=>{camera.position.set(0,66,108);controls.target.set(0,0,0);controls.minDistance=2.2;controls.maxDistance=420;controls.update();showToast('Camera reset')});
$('toggle-orbits').addEventListener('click',e=>{showOrbits=!showOrbits;e.currentTarget.classList.toggle('active',showOrbits);orbitObjects.forEach(o=>o.visible=showOrbits)});
$('toggle-labels').addEventListener('click',e=>{showLabels=!showLabels;e.currentTarget.classList.toggle('active',showLabels);labelObjects.forEach(o=>o.visible=showLabels)});
$('help-button').addEventListener('click',()=>$('help-modal').classList.remove('hidden'));
$('close-help').addEventListener('click',()=>$('help-modal').classList.add('hidden'));
$('help-modal').addEventListener('click',e=>{if(e.target===$('help-modal'))$('help-modal').classList.add('hidden')});
$('play-pause').addEventListener('click',()=>{paused=!paused;$('play-pause').textContent=paused?'▶':'Ⅱ';$('play-pause').setAttribute('aria-label',paused?'Resume simulation':'Pause simulation');if(paused)showToast('Simulation paused');else showToast('Simulation resumed')});
$('speed-slider').addEventListener('input',e=>{simSpeed=Number(e.target.value);paused=simSpeed===0;$('play-pause').textContent=paused?'▶':'Ⅱ';$('speed-readout').textContent=speedName();document.querySelectorAll('.speed-presets button').forEach(b=>b.classList.toggle('selected',Number(b.dataset.speed)===simSpeed))});
document.querySelectorAll('.speed-presets button').forEach(b=>b.addEventListener('click',()=>{$('speed-slider').value=b.dataset.speed;$('speed-slider').dispatchEvent(new Event('input'))}));
$('slower').addEventListener('click',()=>{$('speed-slider').value=Math.max(0,Number($('speed-slider').value)-1);$('speed-slider').dispatchEvent(new Event('input'))});
$('faster').addEventListener('click',()=>{$('speed-slider').value=Math.min(8,Number($('speed-slider').value)+1);$('speed-slider').dispatchEvent(new Event('input'))});
$('sim-date').textContent='SIM DATE — '+new Date().toISOString().slice(0,10);
const clickables=[];planetObjects.forEach(o=>clickables.push(o.hit));
renderer.domElement.addEventListener('click',e=>{if(controls.state===-1)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(clickables,false);if(hits.length){const id=hits[0].object.userData.worldId;setSelected(id)}});
let downPos=null;renderer.domElement.addEventListener('pointerdown',e=>{downPos={x:e.clientX,y:e.clientY}});renderer.domElement.addEventListener('pointerup',e=>{if(downPos&&Math.hypot(e.clientX-downPos.x,e.clientY-downPos.y)>5)downPos=null});
let last=performance.now();
function animate(now){
  requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;
  if(!paused)simDays+=dt*speedDaysPerSec[simSpeed];
  worldData.forEach(d=>{
    const obj=planetObjects.get(d.id);if(!obj)return;obj.group.position.copy(positionFor(d,simDays));obj.mesh.rotation.y+=dt*(d.day<0?-1:1)*.18/Math.max(.4,Math.abs(d.day));if(obj.group.userData.clouds)obj.group.userData.clouds.rotation.y+=dt*.025;
    (obj.orbiters||[]).forEach(m=>{const angle=m.phase+simDays*TAU/m.period;m.mesh.position.set(Math.cos(angle)*m.radius,Math.sin(angle*.31)*m.radius*.16,Math.sin(angle)*m.radius)});
    const label=labelObjects.get(d.id);if(label){label.position.copy(obj.group.position);label.position.y+=d.size+1.15;label.visible=showLabels;const distance=camera.position.distanceTo(label.position);label.material.opacity=clamp(1-distance/220,.28,.95)}
  });
  const sunLabel=labelObjects.get('sun');if(sunLabel){sunLabel.position.set(0,8,0);sunLabel.visible=showLabels}
  sunMesh.rotation.y+=dt*.025;sunGlow.material.opacity=.72+Math.sin(now*.001)*.08;
  
  controls.update();renderer.render(scene,camera);
}
requestAnimationFrame(animate);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(moonRenderer&&$('moon-canvas-wrap').clientWidth){moonRenderer.setSize($('moon-canvas-wrap').clientWidth,205);moonCamera.aspect=$('moon-canvas-wrap').clientWidth/205;moonCamera.updateProjectionMatrix()}});
setSelected('earth',false);
controls.target.set(0,0,0);camera.position.set(0,66,108);controls.update();
$('speed-readout').textContent=speedName();
