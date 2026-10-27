import * as THREE from 'three';
import {addTankDetails,createPaintTexture} from './tank-detail.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Original, deliberately non-technical RC concept. Dimensions are visual proportions,
// not measurements or construction instructions for any real vehicle.
export function createTankScene(host) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 100);
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x101212,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room,.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .8;
  room.dispose();
  const key = new THREE.DirectionalLight(0xffffff,3.0); key.position.set(-3,8,5); key.castShadow=true; key.shadow.mapSize.set(2048,2048); Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.1,far:30}); key.shadow.bias=-.0002; key.shadow.normalBias=.025; key.shadow.radius=4; scene.add(key);
  const rim = new THREE.DirectionalLight(0xdce5ee,1.8); rim.position.set(-4,3,-5); scene.add(rim);
  const fill = new THREE.HemisphereLight(0xffffff,0x636970,1.3); scene.add(fill);
  const root = new THREE.Group(); scene.add(root);
  const painted = new THREE.MeshStandardMaterial({color:0x444a4d,metalness:.75,roughness:.32});
  const edge = new THREE.MeshStandardMaterial({color:0x282d30,metalness:.85,roughness:.29});
  const rubber = new THREE.MeshStandardMaterial({color:0x171b1c,metalness:.15,roughness:.82});
  const metal = new THREE.MeshStandardMaterial({color:0x8b9594,metalness:.9,roughness:.24});
  const dark = new THREE.MeshStandardMaterial({color:0x252a2b,metalness:.72,roughness:.3});
  const orange = new THREE.MeshStandardMaterial({color:0xc97142,metalness:.4,roughness:.4});
  const glass = new THREE.MeshStandardMaterial({color:0x4e6a6a,metalness:.88,roughness:.12});
  const white = new THREE.MeshStandardMaterial({color:0xdde3dc,metalness:.3,roughness:.5});
  const paintTexture=createPaintTexture();
  painted.bumpMap=paintTexture;painted.bumpScale=.008;
  painted.roughness=.43;painted.metalness=.58;
  const geometries = new Map();
  function box(w,h,d,mat,parent,x=0,y=0,z=0,r=.035) {
    const key = [w,h,d,r].join();
    if(!geometries.has(key)) geometries.set(key,new RoundedBoxGeometry(w,h,d,2,r));
    const m = new THREE.Mesh(geometries.get(key),mat); m.position.set(x,y,z); parent.add(m); return m;
  }
  function cylinder(rt,rb,h,mat,parent,x=0,y=0,z=0,axis='y',segments=32) {
    const key = ['c',rt,rb,h,segments].join();
    if(!geometries.has(key)) geometries.set(key,new THREE.CylinderGeometry(rt,rb,h,segments));
    const m=new THREE.Mesh(geometries.get(key),mat);m.position.set(x,y,z);
    if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=-Math.PI/2;
    parent.add(m);return m;
  }
  function prism(outline,depth,mat,parent,x,y,z) {
    const shape=new THREE.Shape();outline.forEach(([a,b],i)=>i?shape.lineTo(a,b):shape.moveTo(a,b));shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.045,bevelThickness:.045});
    const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z-depth/2);parent.add(m);return m;
  }
  const chassis=new THREE.Group();root.add(chassis);
  box(3.75,.55,1.9,dark,chassis,0,.5,0,.1);
  box(3.2,.22,1.65,metal,chassis,0,.84,0);
  // A visible orange radio-control module under the removable upper shell.
  box(.85,.28,1.12,orange,chassis,-.65,1.08,0,.06);
  box(.95,.22,1.12,dark,chassis,.45,1.05,0,.04);
  for(let i=0;i<6;i++)box(.05,.03,.8,metal,chassis,.16+i*.12,1.18,0,.005);
  for(const z of [-.7,.7])cylinder(.055,.055,3.3,metal,chassis,0,.87,z,'x',12);
  const tracks=[];
  for(const side of [-1,1]) {
    const track=new THREE.Group(); track.position.z=side*1.28;root.add(track);tracks.push(track);
    // Each tread follows a capsule-shaped path with separate visible pads.
    const points=[];const straight=3.4,r=.51;
    for(let i=0;i<22;i++)points.push({x:-straight/2+i*straight/22,y:r,a:0});
    for(let i=0;i<12;i++){const a=Math.PI/2-i*Math.PI/12;points.push({x:straight/2+r*Math.cos(a),y:r*Math.sin(a),a:a-Math.PI/2});}
    for(let i=0;i<22;i++)points.push({x:straight/2-i*straight/22,y:-r,a:Math.PI});
    for(let i=0;i<12;i++){const a=-Math.PI/2-i*Math.PI/12;points.push({x:-straight/2+r*Math.cos(a),y:r*Math.sin(a),a:a-Math.PI/2});}
    const treadGeo=new RoundedBoxGeometry(.135,.1,.57,1,.013);
    const padGeo=new THREE.BoxGeometry(.08,.035,.47);
    const treads=new THREE.InstancedMesh(treadGeo,dark,points.length);
    const pads=new THREE.InstancedMesh(padGeo,rubber,points.length);
    const dummy=new THREE.Object3D();
    points.forEach((p,i)=>{dummy.position.set(p.x,p.y+.53,0);dummy.rotation.set(0,0,p.a);dummy.updateMatrix();treads.setMatrixAt(i,dummy.matrix);dummy.translateY(.067);dummy.updateMatrix();pads.setMatrixAt(i,dummy.matrix);});track.add(treads,pads);
    for(let i=0;i<7;i++) {
      const x=-1.7+i*3.4/6;const radius=i===0||i===6?.40:.36;
      cylinder(radius,radius,.40,rubber,track,x,.53,0,'z');
      cylinder(radius*.79,radius*.79,.43,painted,track,x,.53,0,'z');
      cylinder(.13,.13,.48,metal,track,x,.53,0,'z');
      cylinder(.07,.07,.51,dark,track,x,.53,0,'z',12);
      for(let j=0;j<6;j++){const a=j*Math.PI/3;cylinder(.022,.022,.45,metal,track,x+Math.cos(a)*.2,.53+Math.sin(a)*.2,0,'z',6);}
    }
    for(let i=0;i<4;i++)cylinder(.12,.12,.3,rubber,track,-1.25+i*.83,.91,0,'z');
  }
  const hull=new THREE.Group();root.add(hull);
  prism([[-2.12,1.0],[2.16,1.0],[1.72,1.6],[-1.85,1.6]],2.05,painted,hull,0,0,0);
  box(4.48,.10,2.97,edge,hull,0,1.1,0,.035);
  for(const z of [-1.44,1.44]){
    box(4.35,.12,.14,painted,hull,0,1.22,z);
    for(let i=0;i<5;i++)box(.72,.27,.07,painted,hull,-1.72+i*.86,1.1,z);
    for(let i=0;i<10;i++)cylinder(.027,.027,.045,metal,hull,-1.93+i*.43,1.3,z,'y',6);
  }
  for(let i=0;i<13;i++)box(.048,.045,1.1,dark,hull,-1.75+i*.065,1.67,0,.005);
  box(.66,.04,1.18,edge,hull,-1.34,1.64,0);
  for(let i=0;i<10;i++)box(.035,.022,1.07,metal,hull,-1.61+i*.059,1.676,0,.004);
  box(.7,.08,.62,edge,hull,1.2,1.64,0,.07);
  box(.47,.04,.12,glass,hull,1.33,1.7,0);
  for(const z of [-.85,.85]){
    cylinder(.11,.11,.15,dark,hull,1.88,1.30,z,'x');
    cylinder(.075,.075,.16,white,hull,1.9,1.3,z,'x');
    box(.06,.16,.25,orange,hull,-2.05,1.25,z,.01);
    box(.55,.09,.07,metal,hull,-.35,1.69,z);
  }
  const turret=new THREE.Group();turret.position.set(-.15,1.65,0);root.add(turret);
  cylinder(.73,.77,.19,dark,turret,0,.07,0);
  // Faceted turret with chamfered corners and sloped side panels.
  const footprint=new THREE.Shape();footprint.moveTo(-1.0,-.75);footprint.lineTo(.52,-.75);footprint.lineTo(1.04,-.39);footprint.lineTo(1.04,.39);footprint.lineTo(.52,.75);footprint.lineTo(-1,.75);footprint.lineTo(-1.16,.5);footprint.lineTo(-1.16,-.5);footprint.closePath();
  const tgeo=new THREE.ExtrudeGeometry(footprint,{depth:.54,bevelEnabled:true,bevelSegments:4,bevelSize:.08,bevelThickness:.08});tgeo.rotateX(-Math.PI/2);
  // Taper the turret roof and preserve the bevels instead of a vertical extrusion.
  const turretVertices=tgeo.attributes.position;
  for(let i=0;i<turretVertices.count;i++){
    const height=THREE.MathUtils.clamp((turretVertices.getY(i)+.08)/.70,0,1);
    turretVertices.setX(i,turretVertices.getX(i)*(1-height*.075));
    turretVertices.setZ(i,turretVertices.getZ(i)*(1-height*.11));
  }
  tgeo.computeVertexNormals();
  const shell=new THREE.Mesh(tgeo,painted);shell.position.y=.2;turret.add(shell);
  cylinder(.34,.34,.08,edge,turret,-.35,.87,-.18);
  cylinder(.26,.26,.05,painted,turret,-.35,.94,-.18);
  box(.25,.04,.04,metal,turret,-.35,.98,-.18,.01);
  box(.22,.16,.15,dark,turret,.17,.88,.27,.02);
  box(.15,.07,.02,glass,turret,.17,.9,.352,.005);
  for(const z of [-.75,.75])for(let i=0;i<5;i++)cylinder(.018,.018,.035,metal,turret,-.84+i*.3,.73,z,'y',6);
  box(.58,.38,1.20,edge,turret,-1.13,.48,0,.06);
  for(let i=0;i<8;i++)box(.045,.27,.02,metal,turret,-1.44,.48,-.48+i*.137,.006);
  cylinder(.035,.045,.21,dark,turret,-.75,.92,.47,'y',12);
  cylinder(.008,.014,1.15,metal,turret,-.75,1.56,.47,'y',8);
  box(.28,.025,.24,orange,turret,.55,.83,-.26,.015);
  const gun=new THREE.Group();turret.add(gun);
  box(.45,.43,.64,edge,gun,.98,.46,0,.09);
  cylinder(.16,.19,.51,painted,gun,1.29,.46,0,'x');
  cylinder(.075,.11,1.76,painted,gun,2.34,.46,0,'x');
  cylinder(.13,.13,.30,edge,gun,2.05,.46,0,'x');
  for(const x of [1.56,2.22,3.17])cylinder(.088,.088,.05,metal,gun,x,.46,0,'x');
  cylinder(.12,.10,.34,painted,gun,3.31,.46,0,'x');
  cylinder(.07,.07,.01,rubber,gun,3.49,.46,0,'x');
  // Panel seams and fittings add readable scale to the original concept model.
  for(const z of [-.86,.86]) {
    box(.68,.025,.018,dark,hull,.5,1.652,z,.004);
    for(const x of [-1.7,-.45,.8,1.6])cylinder(.023,.023,.02,metal,hull,x,1.66,z,'y',6);
    box(.34,.14,.04,edge,turret,-.66,.47,z*.87,.015);
    box(.23,.035,.045,orange,turret,-.66,.49,z*.90,.008);
  }
  addTankDetails({root,chassis,hull,turret,gun,tracks,box,cylinder,painted,edge,rubber,metal,dark,orange,glass});
  const decalCanvas=document.createElement('canvas');decalCanvas.width=512;decalCanvas.height=128;
  const decalContext=decalCanvas.getContext('2d');decalContext.fillStyle='#d1d9ce';decalContext.font='bold 58px Arial';decalContext.fillText('ARNGREN',12,66);decalContext.font='22px monospace';decalContext.fillText('REMOTE CONTROL',16,103);
  const decalTexture=new THREE.CanvasTexture(decalCanvas);decalTexture.colorSpace=THREE.SRGBColorSpace;
  const decalMaterial=new THREE.MeshBasicMaterial({map:decalTexture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});
  const decal=new THREE.Mesh(new THREE.PlaneGeometry(.77,.20),decalMaterial);decal.position.set(-.13,.49,.793);decal.rotation.x=.13;turret.add(decal);
  // Merge static fittings by material within each independently moving part.
  // The result keeps the detailed tread/bolt silhouette with a small draw-call count.
  const sourceGeometries=new Set();
  for(const group of [chassis,hull,turret,gun,...tracks]) {
    const buckets=new Map();
    for(const child of [...group.children])if(child.isMesh&&!child.isInstancedMesh&&child!==decal){
      sourceGeometries.add(child.geometry);
      child.updateMatrix();const geo=(child.geometry.index?child.geometry.toNonIndexed():child.geometry.clone()).applyMatrix4(child.matrix);
      if(!buckets.has(child.material))buckets.set(child.material,[]);buckets.get(child.material).push(geo);group.remove(child);
    }
    buckets.forEach((parts,material)=>{const merged=mergeGeometries(parts);parts.forEach(g=>g.dispose());group.add(new THREE.Mesh(merged,material));});
  }
  sourceGeometries.forEach(geometry=>geometry.dispose());
  // Soft contact shadow without a second shadow-map render on every scroll frame.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
  const ctx=shadowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.75)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(9,6),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:.8}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.1;scene.add(shadow);
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x25282c,opacity:.18}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.105;floor.receiveShadow=true;scene.add(floor);
  let progress=0, width=1,height=1, pointerX=0,pointerY=0,currentX=0,currentY=0,dirty=true,visible=true,disposed=false;
  const smooth=(a,b,v)=>{const t=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
  function update(p) {progress=p;dirty=true;}
  function render() {
    if(disposed||!visible)return;
    const dx=pointerX-currentX,dy=pointerY-currentY;
    if(!dirty&&Math.abs(dx)+Math.abs(dy)<.0001)return;
    currentX+=dx*.07;currentY+=dy*.07;
    const p=progress,explode=smooth(.08,.26,p);
    const trackOut=explode*(1-smooth(.32,.46,p));
    const shellOut=explode*(1-smooth(.46,.61,p));
    const turretOut=explode*(1-smooth(.61,.76,p));
    const gunOut=explode*(1-smooth(.76,.88,p));
    tracks.forEach((g,i)=>{g.position.z=(i===0?-1:1)*(1.28+trackOut*1.25);g.position.y=trackOut*-.12;});
    hull.position.y=shellOut*1.22;
    turret.position.y=1.65+turretOut*2.16;
    gun.position.x=gunOut*1.25;
    turret.rotation.y=.05+smooth(.88,1,p)*-.22;
    root.rotation.y=-.15 + smooth(0,.28,p)*-.42 + smooth(.3,.85,p)*.68+smooth(.88,1,p)*.48+currentX*.1;
    root.rotation.x=currentY*.04;
    const mobile=width<700;
    const zoomOut=explode*(1-smooth(.81,1,p));
    root.position.set(mobile?-.10:1.10, mobile?-.2-zoomOut*1.9:.1+zoomOut*.2,0);
    const distance=mobile?24.2+zoomOut*8+smooth(.86,1,p)*5:14.5+zoomOut*5.5;
    camera.position.set(distance*.50, distance*.30+zoomOut*.7, distance*.69+zoomOut*.8);
    camera.lookAt(mobile?0:-.7,1.05+zoomOut*.65,0);
    shadow.material.opacity=.24-explode*.12;shadow.position.x=root.position.x;shadow.rotation.z=-root.rotation.y;
    renderer.render(scene,camera);dirty=false;
  }
  const resize=()=>{const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();dirty=true;render();};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const visibilityObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;dirty=true;render();});visibilityObserver.observe(host);
  resize();
  return {
    update,render,
    pointer(x,y){pointerX=x;pointerY=y;dirty=true;},
    finish(kind){painted.color.setHex(kind==='sand'?0x9c927b:0x444a4d);edge.color.setHex(kind==='sand'?0x5b574b:0x282d30);dirty=true;render();},
    dispose(){disposed=true;resizeObserver.disconnect();visibilityObserver.disconnect();const gs=new Set(geometries.values()),ms=new Set([painted,edge,rubber,metal,dark,orange,glass,white]);scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>ms.add(m));});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());paintTexture.dispose();key.shadow.dispose();shadowTexture.dispose();decalTexture.dispose();environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}
