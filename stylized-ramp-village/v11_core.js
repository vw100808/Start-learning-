import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const profile=new URLSearchParams(location.search).get('profile') || 'chrome';
const isSafari=profile==='safari';
const DPR=Math.min(window.devicePixelRatio||1,isSafari?1.15:1.35);
const W=260,H=260,HALF=W/2;

const scene=new THREE.Scene();
scene.background=new THREE.Color('#b9d7da');
scene.fog=new THREE.Fog('#b9d7da',78,235);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,420);
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(DPR);renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.NoToneMapping;document.body.appendChild(renderer.domElement);

const RAMPS=[
 ['#385147','#91ad6c'], // grass
 ['#66727a','#eee8d9'], // limestone/concrete
 ['#4d302d','#b56a50'], // brick
 ['#39312c','#876952'], // wood
 ['#334650','#aabbbd'], // bluestone
 ['#30453b','#d8c58f'], // warm accent
 ['#29444e','#6d98a0'], // glass
 ['#5c352f','#c47a62'], // terracotta
 ['#2f3438','#727a80'], // dark metal
 ['#6f4a3e','#d09a80']  // skin
];
const lutCanvas=document.createElement('canvas');lutCanvas.width=256;lutCanvas.height=RAMPS.length;
const lctx=lutCanvas.getContext('2d',{alpha:false});
RAMPS.forEach((r,i)=>{lctx.fillStyle=r[0];lctx.fillRect(0,i,84,1);lctx.fillStyle=r[1];lctx.fillRect(84,i,172,1)});
const lut=new THREE.CanvasTexture(lutCanvas);lut.magFilter=lut.minFilter=THREE.NearestFilter;lut.generateMipmaps=false;lut.flipY=false;lut.colorSpace=THREE.SRGBColorSpace;
const SUN=new THREE.Vector3(-0.55,0.76,0.35).normalize();
function mat(row){const m=new THREE.ShaderMaterial({uniforms:{uLut:{value:lut},uRows:{value:RAMPS.length},uRow:{value:row},uSun:{value:SUN}},vertexShader:`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(mat3(modelMatrix)*normal);vP=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0);}`,fragmentShader:`uniform sampler2D uLut;uniform float uRows;uniform float uRow;uniform vec3 uSun;varying vec3 vN;varying vec3 vP;void main(){float d=dot(normalize(vN),normalize(uSun))*0.5+0.5;float ambient=0.12+0.18*clamp(normalize(vN).y*0.5+0.5,0.0,1.0);float u=clamp(d*0.82+ambient,0.0,1.0);gl_FragColor=texture2D(uLut,vec2(u,(uRow+0.5)/uRows));}`,flatShading:true});return m}
const M={grass:mat(0),concrete:mat(1),brick:mat(2),wood:mat(3),stone:mat(4),accent:mat(5),glass:mat(6),terracotta:mat(7),metal:mat(8),skin:mat(9)};

const world=new THREE.Group();scene.add(world);
function box(parent,s,p,m,rotY=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...s),m);mesh.position.set(...p);mesh.rotation.y=rotY;parent.add(mesh);return mesh}
function cyl(parent,r,h,p,m,seg=8){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.02,h,seg),m);mesh.position.set(...p);parent.add(mesh);return mesh}
function roof(parent,w,d,y,m){const g=new THREE.ConeGeometry(Math.max(w,d)*0.62,.8,4);g.scale(w/Math.max(w,d),1,d/Math.max(w,d));g.rotation.y=Math.PI/4;const x=new THREE.Mesh(g,m);x.position.y=y;parent.add(x);return x}

// Ground + Hoddle-grid inspired street network.
box(world,[W,.1,W],[0,-.05,0],M.grass);
const roads=new THREE.Group();world.add(roads);
const gridX=[-96,-64,-32,0,32,64,96],gridZ=[-64,-32,0,32,64];
for(const x of gridX){box(roads,[7.2,.08,210],[x,.01,0],M.concrete);box(roads,[6.2,.085,210],[x,.055,0],M.stone)}
for(const z of gridZ){box(roads,[210,.08,7.2],[0,.01,z],M.concrete);box(roads,[210,.085,6.2],[0,.055,z],M.stone)}
// laneways + tram corridors
for(const x of [-80,-48,-16,16,48,80])box(roads,[2.2,.05,28],[x,.07,-16],M.metal);
for(const z of [-48,-16,16,48])box(roads,[28,.05,2.2],[-16,.07,z],M.metal);
for(const z of [-8,8])box(roads,[200,.025,.14],[0,.11,z],M.accent);

// Yarra River placed to create a recognizable south-side spatial frame.
const river=new THREE.Group();world.add(river);box(river,[210,.10,27],[0,-.03,92],M.glass); 
for(let x=-95;x<=95;x+=19){box(river,[15,.05,.7],[x,.035,77+Math.sin(x*.11)],M.stone);box(river,[15,.05,.7],[x,.035,107+Math.cos(x*.10)],M.stone)}
// Princes Bridge simplified but recognizable.
box(river,[17,.55,28],[0,.32,79],M.wood);for(const sx of [-6.5,6.5])for(let i=-3;i<=3;i++)cyl(river,.42,1.5,[sx,.95,79+i*4.2],M.stone,8);

// Building blocks: dense CBD wall with varied massing.
const buildings=new THREE.Group();world.add(buildings);const data=[];
function building(x,z,w,d,h,style){const g=new THREE.Group();g.position.set(x,0,z);const base=style===1?M.brick:style===2?M.stone:M.concrete;box(g,[w,h,d],[0,h/2,0],base);const podium=Math.min(3.8,h*.22);box(g,[w*1.05,podium,d*1.04],[0,podium/2,0],style===1?M.brick:M.stone);if(h<17)roof(g,w,d,h+.35,style===1?M.terracotta:M.metal);else box(g,[w*.7,.55,d*.7],[0,h+.28,0],M.metal);
  if(style===1){for(let yy=2.2;yy<h-.6;yy+=2.3){box(g,[w*.8,.07,.07],[0,yy,d*.505],M.accent);box(g,[w*.8,.07,.07],[0,yy,-d*.505],M.accent)}}
  data.push({g,x,z,w,d,h});buildings.add(g);
}
const xs=[-112,-80,-48,-16,16,48,80,112],zs=[-80,-48,-16,16,48,112];let seed=0;
for(const x of xs)for(const z of zs){if(Math.abs(x)<35&&Math.abs(z-95)<26)continue;if(Math.hypot(x,z-45)<38)continue;const n=(Math.sin(++seed*12.41)*43758.5)%1;const q=Math.abs(n);building(x,z,13+q*7,13+(1-q)*7,8+q*24+(Math.max(0,80-Math.hypot(x,z))*0.06),seed%3)}

// Major Melbourne landmarks, with silhouette-first modeling.
const landmarks=new THREE.Group();world.add(landmarks);
function landmarkFed(){const g=new THREE.Group();g.position.set(-17,0,28);for(const p of [[-10,0,7],[10,0,7],[-4,0,-5],[7,0,-6]]){const h=6.5+Math.abs(p[0])*0.12;const q=box(g,[11,h,8],[p[0],h/2,p[2]],M.concrete,p[0]*0.018);q.rotation.z=(p[0]+p[2])*0.012}box(g,[25,.35,18],[0,.18,2],M.stone);return g}
landmarks.add(landmarkFed());
function landmarkFlinders(){const g=new THREE.Group();g.position.set(16,0,31);box(g,[39,8.2,12],[0,4.1,0],M.brick);box(g,[17,11,10],[0,5.5,0],M.brick);cyl(g,4.5,1.0,[0,8.4,0],M.terracotta,16);for(const sx of [-13,13]){cyl(g,2.1,6.8,[sx,5.5,0],M.terracotta,14)}for(let i=-6;i<=6;i++)box(g,[1.6,3.2,.18],[i*2.8,3.2,6.12],M.accent);return g}
landmarks.add(landmarkFlinders());
function landmarkEureka(){const g=new THREE.Group();g.position.set(61,0,28);const base=box(g,[10,42,10],[0,21,0],M.glass);base.scale.y=1;box(g,[13,3,13],[0,42.5,0],M.metal);box(g,[5,10,5],[0,48,0],M.accent);return g}
landmarks.add(landmarkEureka());
function landmarkArts(){const g=new THREE.Group();g.position.set(45,0,62);box(g,[18,6,14],[0,3,0],M.stone);cyl(g,1.4,27,[0,19,0],M.metal,12);box(g,[7,4,7],[0,8,0],M.terracotta);return g}
landmarks.add(landmarkArts());
function landmarkQVM(){const g=new THREE.Group();g.position.set(-62,0,-59);box(g,[34,6,16],[0,3,0],M.brick);roof(g,34,16,6.3,M.terracotta);for(let x=-12;x<=12;x+=6)box(g,[.8,3.4,.22],[x,2.1,8.15],M.accent);return g}
landmarks.add(landmarkQVM());

// Efficient street furniture: instanced geometry.
const trees=new THREE.Group();world.add(trees);
const trunk=new THREE.InstancedMesh(new THREE.CylinderGeometry(.16,.19,2,7),M.wood,72);
const crown=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.86,1),M.grass,72);const dummy=new THREE.Object3D();let ti=0;
for(let x=-112;x<=112&&ti<72;x+=16)for(const z of [-54,-22,10,54]){if(ti>=72)break;dummy.position.set(x,.98,z);dummy.scale.setScalar(.86+((ti*17)%11)/50);dummy.updateMatrix();trunk.setMatrixAt(ti,dummy.matrix);dummy.position.y=2.25;dummy.updateMatrix();crown.setMatrixAt(ti,dummy.matrix);ti++}
trunk.instanceMatrix.needsUpdate=true;crown.instanceMatrix.needsUpdate=true;trees.add(trunk,crown);
const lamps=new THREE.InstancedMesh(new THREE.CylinderGeometry(.05,.06,2.9,6),M.metal,44);for(let i=0;i<44;i++){dummy.position.set(-108+(i%22)*10,1.45,i<22?-11:11);dummy.rotation.z=(i%2?-.05:.05);dummy.updateMatrix();lamps.setMatrixAt(i,dummy.matrix)}lamps.instanceMatrix.needsUpdate=true;trees.add(lamps);

// Windows: single instanced draw-call per facade family.
const winGeo=new THREE.BoxGeometry(.9,.62,.05);const win=new THREE.InstancedMesh(winGeo,M.glass,900);let wi=0;
for(const b of data){if(wi>=900)break;const rows=Math.min(8,Math.floor((b.h-2)/2.3)),cols=Math.min(8,Math.floor(b.w/1.8));for(let r=0;r<rows&&wi<900;r++)for(let c=0;c<cols&&wi<900;c++){dummy.position.set(b.x- b.w*.5+1.2+c*1.75,1.55+r*2.3,b.z+b.d*.5+.03);dummy.scale.set(1,1,1);dummy.rotation.set(0,0,0);dummy.updateMatrix();win.setMatrixAt(wi++,dummy.matrix)}}win.instanceMatrix.needsUpdate=true;world.add(win);

// Player: lightweight but readable fashion silhouette.
const player=new THREE.Group();player.position.set(-52,.08,-18);world.add(player);
box(player,[.48,1.45,.42],[0,.78,0],M.metal);box(player,[1.12,1.02,.62],[0,1.65,0],M.wood);box(player,[.75,.38,.67],[0,2.20,.02],M.concrete);cyl(player,.18,.24,[0,2.7,0],M.skin);const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.36,1),M.skin);head.position.y=3.0;player.add(head);const hair=new THREE.Mesh(new THREE.IcosahedronGeometry(.31,1),M.metal);hair.scale.y=.55;hair.position.y=3.25;player.add(hair);

// Camera-relative WASD with robust key state and no diagonal speed boost.
const keys=new Set();let yaw=.72,pitch=.30,distance=10.8,drag=false,lastX=0,lastY=0;
addEventListener('keydown',e=>{keys.add(e.code);if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>keys.clear());
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag=true;lastX=e.clientX;lastY=e.clientY}});addEventListener('pointerup',()=>drag=false);
addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-lastX)*.005;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-lastY)*.003,.10,.62);lastX=e.clientX;lastY=e.clientY});
addEventListener('wheel',e=>{distance=THREE.MathUtils.clamp(distance+e.deltaY*.012,7.5,15.5)},{passive:true});
function move(dt){let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);let z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);const l=Math.hypot(x,z);if(!l)return;x/=l;z/=l;const c=Math.cos(yaw),s=Math.sin(yaw);const dx=(x*c-z*s)*4.2*dt,dz=(x*s+z*c)*4.2*dt;player.position.x=THREE.MathUtils.clamp(player.position.x+dx,-HALF+4,HALF-4);player.position.z=THREE.MathUtils.clamp(player.position.z+dz,-HALF+4,HALF-4);player.rotation.y=Math.atan2(dx,dz)}
function cameraFollow(dt){const target=new THREE.Vector3(player.position.x,player.position.y+1.8,player.position.z);const cp=Math.cos(pitch),sp=Math.sin(pitch);const desired=target.clone().add(new THREE.Vector3(Math.sin(yaw)*cp*distance,sp*distance,Math.cos(yaw)*cp*distance));camera.position.lerp(desired,1-Math.pow(.0008,dt));camera.lookAt(target)}
function cull(){const px=player.position.x,pz=player.position.z;for(const b of data){const d=Math.hypot(b.x-px,b.z-pz);b.g.visible=d<185}}
let last=performance.now(),acc=0;const status=document.getElementById('status');
function loop(){requestAnimationFrame(loop);const now=performance.now();const dt=Math.min((now-last)/1000,.033);last=now;acc+=dt;move(dt);cameraFollow(dt);if(acc>.45){cull();acc=0}status.textContent=`${isSafari?'SAFARI':'CHROME'} · Melbourne CBD  · FPS ${Math.round(1/Math.max(dt,.001))} · DRAW ${renderer.info.render.calls}`;renderer.render(scene,camera)}

const loading=document.getElementById('loading');if(loading)loading.remove();loop();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
