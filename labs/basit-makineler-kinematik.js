/* Physical, visible motion for all eight simple machines.
 * SVG is rebuilt from the experiment's own state; pointer handling stays on #scene.
 * Geometry is an educational diagram, not a safety/engineering model.
 */
(function(w){'use strict';
const PI=Math.PI,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmt=x=>Number(x).toLocaleString('tr-TR',{maximumFractionDigits:2});
const attr=(name,val)=>' '+name+'="'+val+'"';
const group=(body,turns,x,y,drag,cls='')=>'<g transform="translate('+x+' '+y+') rotate('+(turns*360).toFixed(4)+')"'+(drag?' data-drag="'+drag+'" data-center-x="'+x+'" data-center-y="'+y+'"':'')+' class="'+cls+'">'+body+'</g>';
const handle=(x,y,key)=>'<circle cx="'+x+'" cy="'+y+'" r="23" fill="#6ce7c4" fill-opacity=".18" stroke="#bdfbee" stroke-width="2" data-drag="'+key+'"/>';
const line=(x1,y1,x2,y2,c='#a1d8e2',width=3)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+width+'" stroke-linecap="round"/>';
const circle=(x,y,r,c,stroke='#bddfed')=>'<circle cx="'+x+'" cy="'+y+'" r="'+Math.max(0,r)+'" fill="'+c+'" stroke="'+stroke+'" stroke-width="3"/>';
const label=(u,s,y=32)=>u.text(38,y,s,'#e4f3fb',18);
const hint=u=>u.text(38,335,'☝️ Parçayı parmağınla sürükle · ▶ Hareket ettir','#b8e9de',15);
function gearBody(teeth,r,color){
 let p='';const n=teeth;for(let i=0;i<n;i++){for(const [offset,delta] of [[0,-3],[.19,4],[.57,4],[.78,-3]]){const a=2*PI*(i+offset)/n;const rr=r+delta;p+=(p?' L':'M')+(rr*Math.cos(a)).toFixed(2)+','+(rr*Math.sin(a)).toFixed(2);}}
 p+=' Z';let spokes='';for(let j=0;j<6;j++){const a=2*PI*j/6;spokes+=line(0,0,r*.78*Math.cos(a),r*.78*Math.sin(a),'#9bdae5',5);}
 return '<path d="'+p+'" fill="'+color+'" stroke="#c7e8ed" stroke-width="2"/>'+circle(0,0,r*.69,'#102b40','#5b8da5')+spokes+circle(0,0,16,'#c4cdd6','#f1f5f7')+line(0,0,r*.74,0,'#ffe3ab',7);
}
function wheelBody(R,r){
 let b=circle(0,0,R,'#26506c')+circle(0,0,R-19,'#12324b','#73c6d5');
 for(let i=0;i<8;i++){const a=i*PI/4;b+=line(0,0,(R-8)*Math.cos(a),(R-8)*Math.sin(a),'#80bcd1',8);}
 return b+circle(0,0,r,'#a66f4a','#f7d49d')+line(0,0,R-8,0,'#ffe19f',7)+circle(0,0,12,'#e0ebef');
}
function lever(p,r,u){
 const ful=405,cy=213,scale=80,left=p.loadArm*scale,right=p.effortArm*scale;
 const angle=clamp(p.travel/p.effortArm*.14,0,.54);
 const l={x:ful-left*Math.cos(angle),y:cy-left*Math.sin(angle)},e={x:ful+right*Math.cos(angle),y:cy+right*Math.sin(angle)};
 let b=line(ful-left,305,ful+right,305,'#254963',1);
 b+='<g transform="rotate('+(angle*180/PI)+' '+ful+' '+cy+')"><rect x="'+(ful-left)+'" y="'+(cy-8)+'" width="'+(left+right)+'" height="16" rx="6" fill="#5da5b5" stroke="#d3f5f6" stroke-width="2"/></g>';
 b+='<path d="M385 277 L405 219 L425 277 Z" fill="#71899c" stroke="#d2ebee"/>'+circle(ful,cy,7,'#e2e7ea');
 b+='<rect x="'+(l.x-31)+'" y="'+(l.y-42)+'" width="62" height="34" rx="6" fill="#b97b4e" stroke="#ffe4aa"/>';
 b+=line(l.x,l.y-8,l.x,l.y-15,'#ffca8d',3)+u.arrow(e.x,e.y-65,0,45,'#80f1bc','F ↓');
 b+=handle(e.x,e.y,'travel')+label(u,'Kaldıraç: yük ↑   el ↓ · kol oranı '+fmt(p.effortArm/p.loadArm));
 b+=u.text(70,72,'Yük yolu = '+fmt(r.loadTravel)+' m · Kuvvet yolu = '+fmt(p.travel)+' m','#f4d9ab',17);
 return u.svg(b+hint(u),'Kaldıraç, desteğe göre yer değiştiren yük ve kuvvet kolu');
}
function pulley(p,r,u){
 const loadRise=clamp(Math.abs(r.loadTravel)*37,0,150),y=273-loadRise,freeY=clamp(122+p.travel*28,138,305);
 let b=line(110,74,692,74,'#a1c3d5',6);
 if(!p.moving){
  b+=circle(390,110,34,'#29526d','#badcec')+circle(390,110,9,'#a9e7da');
  b+=line(356,110,356,y,'#76dacc',5)+line(424,110,424,freeY,'#76dacc',5);
  b+='<path d="M356 110 A34 34 0 0 1 424 110" fill="none" stroke="#76dacc" stroke-width="5"/>';
  b+='<rect x="302" y="'+y+'" width="108" height="44" rx="6" fill="#bb8153" stroke="#fff"/>';
  b+=circle(424,freeY,12,'#ffe1a1')+handle(424,freeY,'travel')+u.text(46,39,'Sabit makara: ip ↓ · yük ↑ (eşit yol)','#d4f3ee',17);
 }else{
  const n=p.n;
  const left=235,sep=55;
  for(let i=0;i<n;i++){const x=left+i*sep;b+=line(x,74,x,y,'#6de1c7',4);b+=circle(x,y,7,'#ffdfb8');}
  b+=line(630,74,630,freeY,'#6de1c7',5)+circle(630,freeY,12,'#ffdfb8');
  b+='<rect x="'+(left-20)+'" y="'+y+'" width="'+((n-1)*sep+40)+'" height="39" rx="6" fill="#bd855d" stroke="#ffe8ba"/>';
  b+=u.text(45,39,'Taşıyan ip: '+n+' · ip ↓ '+fmt(p.travel)+' m / yük ↑ '+fmt(r.loadTravel)+' m','#d4f3ee',17);
  b+=handle(630,freeY,'travel');
 }
 return u.svg(b+hint(u),'Makara yükü yükseliyor, serbest ip ucu aşağı çekiliyor');
}
function incline(p,r,u){
 const x=135,y=291,dx=530,dy=clamp(300*p.height/p.length,32,250),q=clamp(p.progress,0,1);
 const bx=x+dx*q,by=y-dy*q,deg=-Math.atan2(dy,dx)*180/PI;
 let b='<path d="M'+x+' '+y+' L'+(x+dx)+' '+(y-dy)+' L'+(x+dx)+' '+y+' Z" fill="#27485e" stroke="#8ec3cf" stroke-width="4"/>';
 b+='<g transform="translate('+bx+' '+by+') rotate('+deg+')"><rect x="-30" y="-37" width="60" height="34" rx="6" fill="#d9a06d" stroke="#ffe7c4" data-drag="progress"/><path d="M-30 -3H30" stroke="#fff7d6" stroke-width="3"/></g>'+handle(bx,by-20,'progress');
 b+=u.arrow(bx+18,by-45,56,-56*dy/dx,'#78e8c4','hareket')+label(u,'Eğik düzlem: yük, yüzey üzerinde ilerliyor');
 b+=u.text(54,66,'İlerleme: %'+fmt(q*100)+' · h/L = '+fmt(p.height/p.length),'#f1d6a5',16);
 return u.svg(b+hint(u),'Eğik düzlem üzerinde yer değiştiren blok');
}
function wheel(p,r,u){
 const cx=327,cy=160,R=112,axle=clamp(R*p.axleRadius/p.wheelRadius,15,95),angle=p.turns;
 let b=group(wheelBody(R,axle),angle,cx,cy,'turns','rotating-wheel');
 const loadY=clamp(285-(p.turns*.37)*R*(p.axleRadius/p.wheelRadius),86,285);
 b+=line(cx+axle,cy,cx+axle,loadY,'#ffd89e',5);
 b+='<rect x="'+(cx+axle-21)+'" y="'+loadY+'" width="43" height="38" rx="6" fill="#bd8a57" stroke="#f8e5cb"/>';
 b+=circle(cx+R,cy,15,'#a2f3d9')+u.arrow(590,120,0,95,'#8be6c7','F');
 b+=label(u,'Çıkrık: tekeri çevir → mildeki yük hareket etsin');
 b+=u.text(565,222,'Tur: '+fmt(p.turns),'#ffe2af',22);
 b+=u.text(565,260,'Yük yolu: '+fmt(r.loadTravel)+' m','#b5e8dc',17);
 return u.svg(b+hint(u),'Birlikte dönen teker ve mil, ip üzerindeki yükün yükselmesi');
}
function screw(p,r,u){
 const cx=394,pitch=p.pitch,advance=p.turns*pitch,dy=clamp(advance*1100,0,190),nutY=286-dy;
 let b='<rect x="346" y="80" width="96" height="224" rx="6" fill="#15364c" stroke="#8ed0df" stroke-width="3"/>';
 for(let y=95;y<=295;y+=18){const shift=(p.turns%1)*18;b+=line(352,y+shift,435,y+shift,'#e4c18b',3);}
 b+='<rect x="316" y="'+(nutY-14)+'" width="156" height="28" rx="6" fill="#cf9966" stroke="#ffe3b5"/>';
 b+=group(line(-108,0,108,0,'#c7ebee',13)+line(0,0,72,0,'#ffbd75',8)+circle(0,0,12,'#d3e3e9'),p.turns,cx,75,'turns');
 b+=label(u,'Vida: kolu çevir → somun doğrusal ilerler');
 b+=u.text(55,73,'İlerleme: '+fmt(advance)+' m · Adım: '+fmt(pitch)+' m/tur','#f5dca8',16);
 return u.svg(b+hint(u),'Vida kolu dönerken somun diş adımına göre ilerler');
}
function gears(p,r,u){
 const sum=168,R1=sum*p.inputTeeth/(p.inputTeeth+p.outputTeeth),R2=sum-R1;
 const x1=315,x2=x1+sum,y=176;
 let b='<path d="M'+(x1-R1-16)+' 176 L'+(x2+R2+16)+' 176" stroke="#1b3b55" stroke-width="2" stroke-dasharray="8 6"/>';
 b+=group(gearBody(p.inputTeeth,R1,'#256481'),p.inputTurns,x1,y,'inputTurns');
 b+=group(gearBody(p.outputTeeth,R2,'#825f3c'),r.outputTurns+(.5/p.outputTeeth),x2,y,null);
 b+=label(u,'Dişli çarklar: temas noktasında kayma yok');
 b+=u.text(50,65,'1. çark: '+fmt(p.inputTurns)+' tur','#80e9cf',18);
 b+=u.text(470,65,'2. çark: '+fmt(r.outputTurns)+' tur','#ffdaab',18);
 b+=u.text(67,305,'Diş sayısı '+p.inputTeeth+' → '+p.outputTeeth+' · ters dönüş','#dbe6f0',17);
 return u.svg(b+hint(u),'Birinci dişli parmakla döndürülünce ikinci dişli ters yönde ve diş sayısı oranında döner');
}
function belt(p,r,u){
 const ratio=p.drivenRadius/p.driveRadius,R1=clamp(130/(1+ratio),24,108),R2=R1*ratio;
 const x1=219,x2=570,y=182,d=x2-x1,crossed=!!p.crossed,k=(crossed?R1+R2:R1-R2)/d,dy=Math.sqrt(Math.max(0,1-k*k)),phase=p.driveTurns*R1*2*PI;
 let b='';
 if(crossed){
  const a1=[x1+R1*k,y-R1*dy],a2=[x2-R2*k,y+R2*dy],b1=[x1+R1*k,y+R1*dy],b2=[x2-R2*k,y-R2*dy];
  b+=line(...a1,...a2,'#6ee2ce',8)+line(...b1,...b2,'#6ee2ce',8);
 }else{
  b+=line(x1+R1*k,y-R1*dy,x2+R2*k,y-R2*dy,'#6ee2ce',8);
  b+=line(x1+R1*k,y+R1*dy,x2+R2*k,y+R2*dy,'#6ee2ce',8);
 }
 b+=group(wheelBody(R1,R1*.23),p.driveTurns,x1,y,'driveTurns');
 b+=group(wheelBody(R2,R2*.23),r.outputTurns,x2,y,null);
 b+=label(u,crossed?'Çapraz kayış → ters yön':'Açık kayış → aynı yön');
 b+=u.text(48,64,'Sürücü: '+fmt(p.driveTurns)+' tur','#89ebce',18);
 b+=u.text(478,64,'Sürülen: '+fmt(r.outputTurns)+' tur','#f6d4aa',18);
 b+=u.text(50,306,'Kayış kaymıyor · kenar hızları eşit','#dbe6f0',17);
 return u.svg(b+hint(u),'Kasnakların birlikte hareketi açık kayışta aynı, çapraz kayışta ters yöndedir');
}
function design(p,r,u){
 const loadY=clamp(255-r.loadTravel*30,104,255),tipY=clamp(205+p.travel*12,206,295);
 let b=line(95,195,345,195,'#89c9db',10)+circle(215,195,11,'#f0d9b0');
 b+=circle(535,94,45,'#26506a')+line(535,138,535,loadY,'#70e1c8',6);
 b+='<rect x="484" y="'+loadY+'" width="102" height="44" rx="6" fill="#bd8252" stroke="#ffe4b4"/>';
 b+=line(335,195,455,tipY,'#6fe3c7',5)+handle(455,tipY,'travel');
 b+=label(u,'Kaldıraç + makara: iki aşamanın hareketi');
 b+=u.text(74,64,'El yolu '+fmt(p.travel)+' m → yük yolu '+fmt(r.loadTravel)+' m','#b9e9da',18);
 b+=u.text(75,309,'Verim: %'+fmt(r.eta*100)+' · kayıp iş '+fmt(r.loss)+' J','#f3d8b4',16);
 return u.svg(b+hint(u),'Kaldıraç ve makara birleşiminde çekme ve yükselme yolları farklıdır');
}
const scenes={lever,pulley,incline,wheel,screw,gears,belts:belt,design};
const motion={
 lever:{key:'travel',min:.25,max:3,speed:.6,step:.25},
 pulley:{key:'travel',min:.5,max:6,speed:1,step:.5},
 incline:{key:'progress',min:0,max:1,speed:.3,step:.1},
 wheel:{key:'turns',min:.05,max:4,speed:.6,step:.25},
 screw:{key:'turns',min:.1,max:10,speed:1,step:.5},
 gears:{key:'inputTurns',min:0,max:8,speed:.65,step:.25},
 belts:{key:'driveTurns',min:0,max:8,speed:.65,step:.25},
 design:{key:'travel',min:1,max:8,speed:1,step:.5}
};
w.BasitKinematik=Object.freeze({scenes,motion});
})(window);
