/* Render-only SVGs driven by the pure AtisMath model. No external assets. */
(function(w){
'use strict';
const M=w.AtisMath,P=w.HareketMath;if(!M||!P)return;
const H=P.escapeHtml,F=P.f;
function scene({models,mode,time,showVectors=true,showTrace=true,targetX=null,trial=null}){
 const maxX=Math.max(2,...models.map(m=>Math.abs(m.range)),targetX||0)*1.17;
 const maxY=Math.max(4,...models.map(m=>m.peakHeight),...models.map(m=>m.height))*1.2;
 const X=v=>70+760*v/maxX,Y=v=>455-375*v/maxY,ground=455;
 const compare=mode==='compare',target=mode==='target';
 const markers='<defs>'
  +'<marker id="pa" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="9" refY="5" orient="auto"><path fill="#56e6c1" d="M0 0L10 5L0 10Z"/></marker>'
  +'<marker id="pb" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="9" refY="5" orient="auto"><path fill="#f3c27d" d="M0 0L10 5L0 10Z"/></marker>'
  +'<marker id="pc" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="9" refY="5" orient="auto"><path fill="#edf9ff" d="M0 0L10 5L0 10Z"/></marker>'
  +'<marker id="pd" viewBox="0 0 10 10" markerWidth="6" markerHeight="6" refX="9" refY="5" orient="auto"><path fill="#e2a5ef" d="M0 0L10 5L0 10Z"/></marker>'
  +'</defs>';
 let body=markers+'<rect x="0" y="0" width="920" height="520" fill="#08192d"/>';
 for(let i=0;i<=5;i++){
  const x=70+760*i/5,y=ground-375*i/5;
  body+='<path class="gridline" d="M'+x+' 47V460 M70 '+y+'H864"/>';
  body+='<text class="minor-label" x="'+(x-6)+'" y="480" text-anchor="middle">'+H(F(maxX*i/5,'m',0))+'</text>';
  body+='<text class="minor-label" x="8" y="'+(y+4)+'">'+H(F(maxY*i/5,'m',0))+'</text>';
 }
 body+='<path class="groundline" d="M42 455H895"/><path class="arrow-axis" d="M70 466V49"/>'
  +'<text class="minor-label" x="857" y="503">+x →</text>'
  +'<text class="minor-label" x="73" y="38">+y ↑</text>';
 const colors=['#57e0c0','#ffb77a'];
 for(let i=0;i<models.length;i++){
  const m=models[i],p=M.at(m,time),flight=M.beforeImpactAt(m,time);
  if(mode!=='compare'&&i===0&&m.height>0){
   body+='<rect x="47" y="'+Y(m.height)+'" width="21" height="'+(ground-Y(m.height))+'" fill="#263f54" stroke="#577d8b"/>';
  }
  if(showTrace&&(!target||trial!==null)){
   const path=M.trajectory(m,70).map((v,j)=>(j?'L':'M')+X(v.x).toFixed(2)+' '+Y(v.y).toFixed(2)).join(' ');
   body+='<path class="'+(i===0?'path-main':'path-compare')+'" d="'+path+'"/>';
   if(m.peakTime>1e-6){
    const ax=X(m.vx*m.peakTime),ay=Y(m.peakHeight);
    body+='<circle cx="'+ax+'" cy="'+ay+'" r="5" fill="'+colors[i]+'"/>'
      +'<text class="minor-label" x="'+(ax+7)+'" y="'+(ay-8)+'">Tepe '+H(F(m.peakHeight,'m'))+'</text>';
   }
  }
  const xx=X(p.x),yy=Y(p.y);
  if(i===0)body+='<path class="projection" d="M'+xx+' '+yy+'V455 M70 '+yy+'H'+xx+'"/>';
  body+='<circle class="flightball" cx="'+xx+'" cy="'+yy+'" r="14" fill="'+colors[i]+'"/>'
   +'<text class="motion-label" x="'+(xx+17)+'" y="'+(yy-15)+'">'+(compare?(i===0?'A':'B'):'')+'</text>';
  if(!target||trial!==null)body+='<circle cx="'+X(m.range)+'" cy="455" r="6" fill="'+colors[i]+'" stroke="#eaf7ff" stroke-width="1.2"/>';
  if(showVectors&&!p.landed){
   const factor=Math.min(4,105/Math.max(1,m.launchSpeed,m.impactSpeed));
   const arrow=(vx,vy,color,marker,name)=>{
    if(Math.hypot(vx,vy)<.05)return '';
    const x2=xx+factor*vx,y2=yy-factor*vy;
    return '<path class="fbd-arrow" d="M'+xx+' '+yy+'L'+x2+' '+y2+'" stroke="'+color+'" fill="none" marker-end="url(#'+marker+')"/>'
     +'<text class="minor-label" x="'+(x2+6)+'" y="'+(y2-8)+'">'+H(name)+'</text>';
   };
   if(i===0){
    body+=arrow(flight.vx,0,'#56e6c1','pa','vₓ');
    body+=arrow(0,flight.vy,'#f3c27d','pb','vᵧ');
    body+=arrow(flight.vx,flight.vy,'#edf9ff','pc','v');
    body+=arrow(0,-Math.max(6,m.g*3),'#e2a5ef','pd','g');
   }else body+=arrow(flight.vx,flight.vy,'#f3c27d','pb','vB');
  }
 }
 if(target){
  const x=X(targetX),width=Math.max(5,2*760/maxX);
  body+='<rect class="targetzone" x="'+(x-width)+'" y="439" width="'+(width*2)+'" height="16" rx="3"/>'
   +'<circle cx="'+x+'" cy="436" r="12" fill="none" stroke="#f5d58d" stroke-width="2.5"/>'
   +'<circle cx="'+x+'" cy="436" r="4" fill="#f5d58d"/>'
   +'<text class="motion-label" x="'+(x+13)+'" y="418">Hedef</text>';
 }
 body+='<text class="motion-label" x="17" y="25">'+H(compare?'A: yeşil  B: turuncu · aynı ilk sürat':'Hava direnci yok: aₓ=0, aᵧ=−g')+'</text>';
 body+='<text class="minor-label" x="16" y="508">'+H('Zaman '+F(time,'s')+' • Gerçek metrik değerler; ölçek otomatik ayarlanır.')+'</text>';
 return '<svg viewBox="0 0 920 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="İki boyutlu atış yörüngesi ve hız okları">'+body+'</svg>';
}
function plot(model,key,title,meaning,color,time){
 const T=Math.max(model.impactTime,.1),series=Array.from({length:61},(_,i)=>M.beforeImpactAt(model,i*T/60));
 const val=p=>p[key];
 let min=Math.min(0,...series.map(val)),max=Math.max(0,...series.map(val));
 if(max-min<1e-7){min-=1;max+=1;}else{const e=(max-min)*.08;min-=e;max+=e;}
 const W=340,HH=202,L=48,R=10,U=18,D=31,x=t=>L+(W-L-R)*t/T,y=v=>U+(HH-U-D)*(max-v)/(max-min);
 const chosen=M.beforeImpactAt(model,Math.min(time,model.impactTime));
 let g='';
 for(let i=0;i<=4;i++){
  const v=max-i*(max-min)/4,xx=L+(W-L-R)*i/4,yy=U+(HH-U-D)*i/4;
  g+='<path class="projectile-grid" d="M'+L+' '+yy+'H'+(W-R)+'"/>'
   +'<text x="'+(L-4)+'" y="'+(yy+4)+'" text-anchor="end">'+H(F(v,'',1))+'</text>'
   +'<text x="'+xx+'" y="'+(HH-11)+'" text-anchor="middle">'+H(F(T*i/4,'',1))+'</text>';
 }
 const points=series.map(p=>x(p.t).toFixed(2)+','+y(val(p)).toFixed(2)).join(' ');
 g+='<path class="projectile-axis" d="M'+L+' '+U+'V'+(HH-D)+'H'+(W-R)+'"/>'
  +'<path d="M'+L+' '+y(0)+'H'+(W-R)+'" stroke="#698ba2" stroke-width="1.1"/>'
  +'<polyline fill="none" stroke="'+color+'" stroke-width="3.2" points="'+points+'"/>'
  +'<path class="crosshair" d="M'+x(chosen.t)+' '+U+'V'+(HH-D)+'"/>'
  +'<circle class="keypoint" cx="'+x(chosen.t)+'" cy="'+y(val(chosen))+'" r="5"/>'
  +'<text x="'+(W-R)+'" y="12" text-anchor="end">t (s)</text>';
 const unit=key==='x'||key==='y'?'m':'m/s';
 return '<div class="projectile-plot"><h4>'+H(title)+'</h4><svg viewBox="0 0 '+W+' '+HH+'" role="img" aria-label="'+H(title)+' grafiği">'+g+'</svg>'
  +'<p>'+H(meaning)+' • anlık '+H(F(val(chosen),unit))+'</p></div>';
}
function charts(model,time){
 return plot(model,'x','Yatay konum x – zaman','Eğim: vₓ (sabit)','#64bcff',time)
  +plot(model,'y','Düşey konum y – zaman','Eğim: vᵧ(t)','#f5c978',time)
  +plot(model,'vx','Yatay hız vₓ – zaman','Eğim: aₓ=0','#57e0c0',time)
  +plot(model,'vy','Düşey hız vᵧ – zaman','Eğim: aᵧ=−g','#d5a5ec',time);
}
root.AtisRender=Object.freeze({scene,charts});
})(window);