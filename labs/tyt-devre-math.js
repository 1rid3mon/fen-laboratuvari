/* TYT Fizik 2018 MEB 10.1 — actual wiring and circuit behavior.
 * Nodal conductance is an INTERNAL solver. Kirchhoff laws are NOT taught in UI.
 * Ideal wires, ideal voltage source, ideal ammeter (0.002 ohm), 1GΩ voltmeter.
 */
(function(w){'use strict';
const PORTS=Object.freeze(['Bp','Bm','Sl','Sr','Rl','Rr','L1l','L1r','L2l','L2r','Al','Ar','Vl','Vr']);
const K={serial:[['Bp','Sl'],['Sr','L1l'],['L1r','L2l'],['L2r','Bm']],
parallel:[['Bp','Sl'],['Sr','L1l'],['Sr','L2l'],['L1r','Bm'],['L2r','Bm']],
ohm:[['Bp','Sl'],['Sr','Al'],['Ar','Rl'],['Rr','Bm'],['Vl','Rl'],['Vr','Bm']],
single:[['Bp','Sl'],['Sr','L1l'],['L1r','Bm']],
meters:[['Bp','Sl'],['Sr','Al'],['Ar','L1l'],['L1r','Bm'],['Vl','L1l'],['Vr','L1r']],
short:[['Bp','Sl'],['Sr','Bm']]};
function normalizeWires(wires){
 if(!Array.isArray(wires)||wires.length>36)throw RangeError('wire count');
 const out=[],seen=new Set();
 for(const wire of wires){if(!Array.isArray(wire)||wire.length!==2||!PORTS.includes(wire[0])||!PORTS.includes(wire[1])||wire[0]===wire[1])throw RangeError('ports');
 const key=[...wire].sort().join(':');if(seen.has(key))continue;seen.add(key);out.push([...wire]);}
 return out;
}
function equivalent({r1=6,r2=6,mode='series'}={}){
 if(![r1,r2].every(x=>Number.isFinite(x)&&x>0))throw RangeError('resistance');
 return mode==='series'?r1+r2:mode==='parallel'?(r1*r2)/(r1+r2):(()=>{throw RangeError('mode')})();
}
function solve({wires=K.single,voltage=6,r=8,lamp1=6,lamp2=6,closed=true}={}){
 if(![voltage,r,lamp1,lamp2].every(Number.isFinite)||voltage<0||voltage>24||r<=0||lamp1<=0||lamp2<=0)throw RangeError('parameters');
 const lines=normalizeWires(wires),parent=Object.fromEntries(PORTS.map(p=>[p,p]));
 const find=p=>{let x=p;while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;};
 const join=(a,b)=>{const x=find(a),y=find(b);if(x!==y)parent[y]=x;};
 for(const [a,b] of lines)join(a,b);
 const pos=find('Bp'),neg=find('Bm');
 if(pos===neg)return {short:true,overload:true,complete:true,reason:'Doğrudan kısa devre',totalCurrent:0,readings:{A:0,V:0},elements:{},wireCurrents:lines.map(()=>0),brightness:{L1:0,L2:0},ports:PORTS,lines,potentials:{}};
 const elements=[
 {id:'R',a:'Rl',b:'Rr',res:r},
 {id:'L1',a:'L1l',b:'L1r',res:lamp1},
 {id:'L2',a:'L2l',b:'L2r',res:lamp2},
 {id:'A',a:'Al',b:'Ar',res:.002},
 {id:'V',a:'Vl',b:'Vr',res:1e9}];
 if(closed)elements.push({id:'S',a:'Sl',b:'Sr',res:.0001});
 const edges=elements.map(e=>({...e,n1:find(e.a),n2:find(e.b)})).filter(e=>e.n1!==e.n2);
 const nodes=[...new Set(PORTS.map(find))];
 const graph=new Map(nodes.map(n=>[n,[]]));
 for(const e of edges){graph.get(e.n1).push(e.n2);graph.get(e.n2).push(e.n1);}
 const reach=new Set([pos]),queue=[pos];for(let i=0;i<queue.length;i++)for(const next of graph.get(queue[i]))if(!reach.has(next)){reach.add(next);queue.push(next);}
 const connected=reach.has(neg);const V=Object.fromEntries(nodes.map(n=>[n,0]));
 const readings={A:0,V:0};
 const stats=Object.fromEntries(elements.map(e=>[e.id,{current:0,voltage:0,power:0,resistance:e.res}]));
 if(!connected)return {short:false,overload:false,complete:false,reason:'Devre açık: pilin iki ucu arasında kapalı yol yok',totalCurrent:0,readings,elements:stats,wireCurrents:lines.map(()=>0),brightness:{L1:0,L2:0},ports:PORTS,lines,potentials:V};
 V[pos]=voltage;V[neg]=0;
 const unknown=[...reach].filter(n=>n!==pos&&n!==neg),index=new Map(unknown.map((n,i)=>[n,i]));
 const size=unknown.length,matrix=Array.from({length:size},()=>Array(size+1).fill(0));
 for(const e of edges){const conductance=1/e.res,ua=index.get(e.n1),ub=index.get(e.n2);
  if(ua!==undefined){matrix[ua][ua]+=conductance;if(ub!==undefined)matrix[ua][ub]-=conductance;else matrix[ua][size]+=conductance*V[e.n2];}
  if(ub!==undefined){matrix[ub][ub]+=conductance;if(ua!==undefined)matrix[ub][ua]-=conductance;else matrix[ub][size]+=conductance*V[e.n1];}
 }
 for(let i=0;i<size;i++){
  let best=i;for(let j=i+1;j<size;j++)if(Math.abs(matrix[j][i])>Math.abs(matrix[best][i]))best=j;
  if(Math.abs(matrix[best][i])<1e-17)throw Error('Unexpected singular connected graph');
  [matrix[i],matrix[best]]=[matrix[best],matrix[i]];
  const pivot=matrix[i][i];for(let k=i;k<=size;k++)matrix[i][k]/=pivot;
  for(let j=0;j<size;j++)if(j!==i){const f=matrix[j][i];for(let k=i;k<=size;k++)matrix[j][k]-=f*matrix[i][k];}
 }
 unknown.forEach((n,i)=>{V[n]=matrix[i][size];});
 let total=0;for(const e of edges){
  const diff=V[e.n1]-V[e.n2],current=diff/e.res;
  stats[e.id]={current,voltage:diff,power:current*current*e.res,resistance:e.res};
  if(e.n1===pos)total+=current;if(e.n2===pos)total-=current;
 }
 readings.A=stats.A.current;readings.V=stats.V.voltage;
 const overload=total>8.01;
 const brightness={L1:overload?0:Math.min(1,Math.sqrt(stats.L1.power/6)),L2:overload?0:Math.min(1,Math.sqrt(stats.L2.power/6))};
 // Conserved wire flow: distribute each node's element currents along a spanning
 // tree of ideal wires. Cycles of ideal wires have indeterminate unique currents;
 // a deterministic spanning tree is selected solely for visual animation.
 const portDemand=Object.fromEntries(PORTS.map(p=>[p,0]));
 for(const e of edges){const I=stats[e.id].current;portDemand[e.a]+=I;portDemand[e.b]-=I;}
 portDemand.Bp-=total;portDemand.Bm+=total;
 const wireCurrents=Array(lines.length).fill(0),adj=Object.fromEntries(PORTS.map(p=>[p,[]]));
 lines.forEach(([a,b],i)=>{adj[a].push({other:b,i});adj[b].push({other:a,i});});
 const seen=new Set();
 function walk(port){seen.add(port);let net=portDemand[port];for(const {other,i} of adj[port])if(!seen.has(other)){
 const subtotal=walk(other),from=lines[i][0]===port;wireCurrents[i]=from?subtotal:-subtotal;net+=subtotal;
 }return net;}
 for(const port of PORTS)if(!seen.has(port))walk(port);
 return {short:false,overload,complete:true,reason:overload?'Aşırı akım! Bu bağlantı güvenli değil.':'Kapalı devre',totalCurrent:total,readings,elements:stats,wireCurrents,brightness,ports:PORTS,lines,potentials:V};
}
function wireResistanceTrend({length=5,area=5,material='copper'}={}){
 if(!Number.isFinite(length)||!Number.isFinite(area)||length<=0||area<=0)throw RangeError('geometry');
 const rho={copper:1,iron:5,nichrome:25};if(!rho[material])throw RangeError('material');
 const relative=rho[material]*length/area;
 return {relative,trend:relative<1?'Düşük':relative<6?'Orta':'Yüksek',formula:'R ∝ ρ·L/A'};
}
function generators({count=2,mode='series',reversed=false,load=6}={}){
 if(!Number.isInteger(count)||count<1||count>3||load<=0||!Number.isFinite(load)||!['series','parallel'].includes(mode))throw RangeError('generators');
 if(mode==='parallel'&&reversed)throw RangeError('opposite cells in parallel excluded');
 const E=mode==='parallel'?1.5:(reversed?(count-2)*1.5:count*1.5);
 const I=Math.abs(E)/load;
 const runtime=I>0?(mode==='parallel'?count:1)/I:Infinity;
 return {E,I,runtime,mode,count,reversed,ratioE:E/1.5,runtimeScale:Math.min(2.5,runtime*1.5/6),currentTrend:E===0?'Yok':I<.26?'Az':'Artar'};
}
function compass({north=true,current=1,distance=2,earth=true}={}){
 if(!Number.isFinite(current)||!Number.isFinite(distance)||distance<=0)throw RangeError('compass');
 const strength=Math.abs(current)/distance,dir=Math.sign(current),turn=earth?(strength/(1+strength))*(Math.PI/2)*dir:(dir||0)*Math.PI/2;
 return {strength,turn,north,arrowDirection:dir,earth,fieldTrend:strength>.7?'Güçlü':'Zayıf'};
}
function safety({wet=false,frayed=false,grounded=true,fuse=true}={}){
 const danger=wet||frayed||!grounded||!fuse;
 return {danger,notes:[wet?'Islak elle dokunma: çarpılma riski':'Eller kuru',frayed?'İzolasyon hasarlı':'İzolasyon sağlam',grounded?'Topraklama var':'Koruyucu topraklama eksik',fuse?'Sigorta var':'Aşırı akım koruması eksik']};
}
w.TytDevreMath=Object.freeze({PORTS,presets:K,normalizeWires,equivalent,solve,wireResistanceTrend,generators,compass,safety});
})(window);
