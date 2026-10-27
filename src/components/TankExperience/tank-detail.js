import * as THREE from 'three';

// Original cosmetic RC model detail. Every fitting stays attached to its animated assembly.
export function addTankDetails({root,chassis,hull,turret,gun,tracks,box,cylinder,painted,edge,rubber,metal,dark,orange,glass}) {
  function tube(points,radius,material,parent,segments=24){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,6,false),material);parent.add(mesh);return mesh;
  }
  function ring(radius,thickness,material,parent,x,y,z,axis='y'){
    const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,thickness,8,40),material);
    mesh.position.set(x,y,z);if(axis==='y')mesh.rotation.x=Math.PI/2;if(axis==='x')mesh.rotation.y=Math.PI/2;parent.add(mesh);return mesh;
  }
  function handle(parent,x,y,z,width=.23,axis='x'){
    const p=axis==='x'?[[x-width/2,y,z],[x-width/2,y+.09,z],[x+width/2,y+.09,z],[x+width/2,y,z]]:[[x,y,z-width/2],[x,y+.09,z-width/2],[x,y+.09,z+width/2],[x,y,z+width/2]];
    tube(p,.018,metal,parent,12);
    for(const sign of [-1,1])box(.055,.025,.055,edge,parent,x+(axis==='x'?sign*width/2:0),y,z+(axis==='z'?sign*width/2:0),.006);
  }
  // Recessed wheel faces, bearing caps and a distinct toothed drive wheel.
  tracks.forEach((track,index)=>{
    const side=index===0?-1:1;
    for(let i=0;i<7;i++){
      const x=-1.7+i*3.4/6,rr=i===0||i===6?.40:.36;
      ring(rr*.77,.018,metal,track,x,.53,side*.229,'z');
      ring(rr*.91,.016,rubber,track,x,.53,side*.208,'z');
      cylinder(.106,.106,.035,edge,track,x,.53,side*.274,'z',48);
      ring(.096,.01,metal,track,x,.53,side*.295,'z');
      cylinder(.046,.046,.045,metal,track,x,.53,side*.30,'z',6);
      for(let j=0;j<8;j++){
        const a=j*Math.PI/4;
        cylinder(.043,.043,.008,dark,track,x+Math.cos(a)*rr*.53,.53+Math.sin(a)*rr*.53,side*.223,'z',16);
        cylinder(.016,.016,.014,metal,track,x+Math.cos(a)*.15,.53+Math.sin(a)*.15,side*.25,'z',6);
      }
      if(i===6)for(let j=0;j<16;j++){
        const a=j*Math.PI/8;
        const tooth=box(.085,.07,.05,metal,track,x+Math.cos(a)*.38,.53+Math.sin(a)*.38,side*.20,.009);tooth.rotation.z=a;
      }
      // Suspension fittings are revealed when the track assembly moves outwards.
      tube([[x-.13,.78,-side*.17],[x+.07,.58,-side*.19],[x,.53,-side*.20]],.035,edge,track,10);
    }
    // Pivot-pin ends follow the same capsule path as the individual links.
    const coords=[];
    for(let i=0;i<22;i++){coords.push([-1.7+i*3.4/22,1.04]);coords.push([1.7-i*3.4/22,.02]);}
    for(let i=0;i<12;i++){
      const a=Math.PI/2-i*Math.PI/12;
      coords.push([1.7+.51*Math.cos(a),.53+.51*Math.sin(a)]);
      coords.push([-1.7-.51*Math.cos(a),.53-.51*Math.sin(a)]);
    }
    const pins=new THREE.InstancedMesh(new THREE.CylinderGeometry(.026,.026,.024,8),metal,coords.length);
    const dummy=new THREE.Object3D();dummy.rotation.x=Math.PI/2;
    coords.forEach(([x,y],i)=>{dummy.position.set(x,y,side*.303);dummy.updateMatrix();pins.setMatrixAt(i,dummy.matrix);});track.add(pins);
  });
  // Deck panels: hinges, inset seams and a finned cooling grille.
  for(const z of [-.74,.74]){
    const panel=box(.65,.035,.42,edge,hull,-.53,1.666,z,.025);
    box(.60,.022,.37,painted,hull,-.53,1.693,z,.025);
    handle(hull,-.53,1.71,z,.20);
    for(const x of [-.8,-.26])cylinder(.025,.025,.018,metal,hull,x,1.713,z+.13,'y',6);
    cylinder(.035,.035,.34,metal,hull,-.83,1.70,z,'z',16);
    box(.32,.028,.18,edge,hull,.50,1.672,z,.025);
    for(let j=0;j<5;j++)box(.018,.035,.15,dark,hull,.39+j*.055,1.693,z,.003);
  }
  for(const z of [-.5,.5]){
    cylinder(.17,.17,.04,edge,hull,-1.34,1.71,z,'y',48);
    cylinder(.14,.14,.045,dark,hull,-1.34,1.735,z,'y',48);
    ring(.15,.012,metal,hull,-1.34,1.76,z);
    for(let i=-3;i<=3;i++)box(.012,.014,.21,metal,hull,-1.34+i*.034,1.765,z,.003);
  }
  // Front access panel follows the sloped hull face, avoiding floating fittings.
  const frontPanel=new THREE.Group();frontPanel.position.set(1.955,1.31,0);frontPanel.rotation.z=.63;hull.add(frontPanel);
  box(.025,.40,1.47,edge,frontPanel,0,0,0,.018);
  box(.03,.35,1.40,painted,frontPanel,.024,0,0,.018);
  for(const y of [-.13,.13])for(const z of [-.62,.62])cylinder(.023,.023,.026,metal,frontPanel,.05,y,z,'x',6);
  for(const z of [-.46,.46]){
    ring(.09,.023,metal,hull,2.12,1.06,z,'x');
    box(.10,.12,.10,edge,hull,2.05,1.12,z,.018);
  }
  // Folded side skirts, brackets and narrow trim catches.
  for(const side of [-1,1]){
    for(let i=0;i<5;i++){
      const x=-1.72+i*.86;
      box(.74,.028,.25,painted,hull,x,1.25,side*1.32,.014);
      box(.09,.15,.026,edge,hull,x-.27,1.16,side*1.488,.006);
      cylinder(.022,.022,.018,metal,hull,x-.27,1.19,side*1.507,'z',6);
    }
    // Rear exhaust details and restrained protective tubing.
    cylinder(.075,.075,.48,edge,hull,-1.98,1.43,side*.61,'z',24);
    ring(.074,.013,metal,hull,-1.98,1.43,side*.86,'z');
    tube([[-2.05,1.18,side*.96],[-2.19,1.28,side*.96],[-2.19,1.53,side*.96],[-2.04,1.60,side*.96]],.023,metal,hull,16);
  }
  // Turret roof: two-part hatch, optical windows, hinges, grab handles.
  ring(.32,.018,metal,turret,-.35,.923,-.18);
  ring(.24,.012,edge,turret,-.35,.971,-.18);
  for(let j=0;j<8;j++){const a=j*Math.PI/4;cylinder(.016,.016,.018,metal,turret,-.35+Math.cos(a)*.28,.953,-.18+Math.sin(a)*.28,'y',6);}
  handle(turret,-.35,.993,-.18,.22);
  cylinder(.24,.25,.055,edge,turret,.39,.83,.20,'y',48);
  cylinder(.20,.20,.035,painted,turret,.39,.876,.20,'y',48);
  handle(turret,.39,.901,.20,.17);
  for(const z of [-.52,.52]){
    handle(turret,-.30,.84,z,.38);
    box(.22,.065,.095,edge,turret,.24,.828,z,.014);
    box(.15,.04,.012,glass,turret,.24,.84,z+Math.sign(z)*.052,.004);
    // Fine panel seams break up the large side face without random surface noise.
    tube([[-.91,.32,z*1.43],[-.91,.62,z*1.38],[-.62,.70,z*1.34]],.009,edge,turret,12);
  }
  // Lightweight rear stowage rail; fixed to the turret for the explode sequence.
  tube([[-1.18,.30,-.76],[-1.60,.30,-.76],[-1.60,.30,.76],[-1.18,.30,.76]],.023,metal,turret,24);
  tube([[-1.18,.65,-.76],[-1.60,.65,-.76],[-1.60,.65,.76],[-1.18,.65,.76]],.023,metal,turret,24);
  for(const z of [-.72,-.36,0,.36,.72])tube([[-1.60,.30,z],[-1.60,.65,z]],.016,edge,turret,2);
  for(let i=0;i<6;i++){
    const x=1.07+i*.061;
    ring(.185-i*.004,.018,rubber,gun,x,.46,0,'x');
  }
  // A recessed muzzle face with concentric lip, plus narrow sleeve retaining rings.
  ring(.095,.018,metal,gun,3.497,.46,0,'x');
  for(const x of [1.58,2.25,3.16])ring(.093,.009,edge,gun,x,.46,0,'x');
  // RC-only internal components become visible during disassembly.
  for(const z of [-.70,.70]){
    cylinder(.16,.16,.63,metal,chassis,.96,1.09,z,'x',40);
    cylinder(.17,.17,.08,edge,chassis,.65,1.09,z,'x',32);
    for(let i=0;i<4;i++)ring(.16,.011,dark,chassis,.78+i*.11,1.09,z,'x');
    tube([[.64,1.18,z],[.36,1.30,z],[-.1,1.30,z*.65],[-.27,1.18,z*.6]],.018,orange,chassis,24);
    tube([[.64,1.12,z],[.30,1.24,z],[-.12,1.24,z*.55],[-.25,1.15,z*.6]],.018,rubber,chassis,24);
  }
  for(const x of [-.92,-.42])box(.11,.025,1.13,rubber,chassis,x,1.235,0,.007);
  box(.48,.012,.63,metal,chassis,-.65,1.227,0,.014);
  box(.30,.03,.36,dark,chassis,.03,1.24,0,.015);
  for(let i=0;i<8;i++)box(.018,.04,.05,metal,chassis,-.08+i*.033,1.25,.20,.003);
  // Fold nested accessory groups into their parent before material-based batching.
  frontPanel.updateMatrix();
  for(const mesh of [...frontPanel.children]){mesh.applyMatrix4(frontPanel.matrix);hull.add(mesh);}hull.remove(frontPanel);
}

export function createPaintTexture(){
  const size=256,data=new Uint8Array(size*size*4);let seed=9127;
  for(let i=0;i<size*size;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=140+(seed>>>27);data.set([v,v,v,255],i*4);}
  const texture=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(5,5);texture.needsUpdate=true;return texture;
}
