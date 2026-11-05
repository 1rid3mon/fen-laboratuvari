(function(w){'use strict';
const capacity=3600,emf=1.5,defs={C1:{name:'Pil 1',ports:['C1p','C1m'],x:220,y:130},C2:{name:'Pil 2',ports:['C2p','C2m'],x:220,y:340},L:{name:'Sabit dirençli yük',ports:['Ll','Lr'],x:670,y:240}};
function create(){return{parts:{},wires:[],load:6,health:'normal',q:{C1:capacity,C2:capacity},elapsed:0};}
function reset(s){s.q={C1:capacity,C2:capacity};s.elapsed=0;}
function add(s,id){if(!defs[id])throw RangeError('Eleman');if(!s.parts[id]){s.parts[id]={x:defs[id].x,y:defs[id].y,rotation:0};reset(s);}}
function remove(s,id){delete s.parts[id];s.wires=s.wires.filter(x=>!x.some(p=>defs[id].ports.includes(p)));reset(s);}
function positions(s){const out={};for(const [id,p]of Object.entries(s.parts))defs[id].ports.forEach((port,i)=>{const r=p.rotation*Math.PI/180,d=(i?1:-1)*65;out[port]=[p.x+d*Math.cos(r),p.y+d*Math.sin(r)];});return out;}
function wire(s,a,b){const p=positions(s);if(!p[a]||!p[b]||a===b)throw RangeError('Yerleştirilmiş farklı uçları seç');if(!s.wires.some(x=>x.includes(a)&&x.includes(b))){s.wires.push([a,b]);reset(s);}}
function nodes(s){const p=Object.fromEntries(Object.values(defs).flatMap(x=>x.ports).map(x=>[x,x]));function find(a){return p[a]===a?a:(p[a]=find(p[a]));}for(const [a,b]of s.wires)p[find(a)]=find(b);return find;}
function topology(s){const find=nodes(s),cells=['C1','C2'].filter(id=>s.parts[id]).map(id=>({id,p:find(id+'p'),m:find(id+'m')}));
 if(cells.some(c=>c.p===c.m))return{blocked:true,reason:'Pil uçları kısa devre oldu. Sanal koruma kaynakları ayırdı; kabloyu düzelt.'};
 if(cells.length===2&&cells[0].p===cells[1].m&&cells[0].m===cells[1].p)return{blocked:true,reason:'Ters kutuplu paralel bağlantı bloke edildi. Eş yönlü özdeş piller kullan; bu düzen ölçüm deneyi değildir.'};
 if(!s.parts.L)return{reason:'Yükü ve pilleri yerleştir, uçlarını kendin bağla.'};
 const start=find('Ll'),end=find('Lr');if(start===end)return{blocked:true,reason:'Yük kabloyla köprülendi. Sanal koruma kaynakları ayırdı.'};
 const paths=[];function visit(node,seen,ids,E){if(node===end){paths.push({ids,E});return;}for(const c of cells){if(ids.includes(c.id))continue;const next=c.p===node?c.m:c.m===node?c.p:null;if(next===null||seen.has(next))continue;visit(next,new Set([...seen,next]),[...ids,c.id],E+(node===c.m?emf:-emf));}}visit(start,new Set([start]),[],0);
 if(!paths.length)return{reason:'Yükten pil üzerinden geri dönen kapalı yol yok; akım yok.'};
 if(paths.length===2&&paths.every(p=>p.ids.length===1)&&paths[0].E===paths[1].E)return{kind:'parallel',ids:paths.map(p=>p.ids[0]),E:paths[0].E,reason:'Özdeş piller aynı yönde paralel; yük akımını paylaşırlar.'};
 if(paths.length===1){const p=paths[0];return{kind:p.ids.length===1?'single':p.E===0?'opposed':'series',ids:p.ids,E:p.E,reason:p.ids.length===1?'Tek pil yükü besliyor.':p.E===0?'Özdeş piller ters seri: etkileri dengelenir, akım oluşmaz.':'Piller aynı yönde seri: elektromotor kuvvetleri eklenir.'};}
 return{blocked:true,reason:'Bu tezgâhta yalnız tek pil, iki özdeş pilin seri/ters seri veya eş yönlü paralel düzeni incelenir.'};
}
function solve(s){const t=topology(s),zero={...t,current:0,voltage:0,power:0,loss:0,rates:{C1:0,C2:0},duration:Infinity};if(!t.kind||t.blocked||t.E===0||t.ids.some(id=>s.q[id]<=1e-8))return{...zero,depleted:!!t.ids?.some(id=>s.q[id]<=1e-8)};
 const r=s.health==='normal'?.04:.8,ri=t.kind==='parallel'?r/2:r*t.ids.length,I=t.E/(s.load+ri),per=Math.abs(I)/(t.kind==='parallel'?2:1),rates={C1:0,C2:0};for(const id of t.ids)rates[id]=per;
 return{...t,current:I,voltage:I*s.load,power:I*I*s.load,loss:I*I*ri,rates,duration:Math.min(...t.ids.map(id=>s.q[id]/per)),depleted:false};
}
function step(s,seconds){if(!Number.isFinite(seconds)||seconds<0)throw RangeError('Pozitif sonlu zaman');const r=solve(s);if(Math.abs(r.current)<1e-12)return r;const dt=Math.min(seconds,r.duration);for(const id of ['C1','C2'])s.q[id]=Math.max(0,s.q[id]-r.rates[id]*dt);s.elapsed+=dt;return solve(s);}
function record(s){const r=solve(s);if(!r.kind||r.blocked)return{ok:false,message:'Önce desteklenen kapalı pil–yük devresini kur.'};return{ok:true,sample:{kind:r.kind,load:s.load,health:s.health,elapsed:s.elapsed,voltage:Math.abs(r.voltage),current:Math.abs(r.current),q:{...s.q},depleted:r.depleted||false,wires:s.wires.map(x=>[...x])}};}
function compare(a,b){if(a.load!==b.load||a.health!==b.health)return'Aynı yük ve pil iç koşulunu koru; birden fazla değişkenin etkisini ayıramazsın.';if(a.kind===b.kind)return'Bağlama türü de aynı. Farklı tek/seri/paralel düzen kur.';if(a.depleted&&b.depleted)return'Tam dolu başlayan aynı model pillerin tükenme süreleri: '+(a.elapsed/3600).toFixed(2)+' → '+(b.elapsed/3600).toFixed(2)+' model saat. Sabit yükte seri daha yüksek akım, paralel akım paylaşımı sağlar; sonucu hangi pilin ne kadar akım verdiğiyle açıkla.';if(a.elapsed!==0||b.elapsed!==0)return'Elektriksel karşılaştırma için tam dolu başlangıç kayıtlarını veya iki tamamlanmış tükenme deneyini karşılaştır.';return'Başlangıç yük gerilimleri: '+a.voltage.toFixed(3)+' → '+b.voltage.toFixed(3)+' V. Seride gerilim artar; paralelde yaklaşık tek pil gerilimi korunur, iç kayıp azalır. Ters seride iki özdeş pilin etkisi dengelenir.';}
w.GeneratorLab=Object.freeze({defs,capacity,create,reset,add,remove,positions,wire,topology,solve,step,record,compare});
})(window);
