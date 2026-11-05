'use strict';
// Kinematic infinite-stroke shear, not a finite stylus or force solver.
(function(root){
function finite(v){if(!Number.isFinite(v))throw new TypeError('Sonlu sayı gerekir');return v;}
function stroke(p,{axis,line,shift,width}){
 if(!['x','y'].includes(axis))throw new RangeError('Yön x/y');
 [p.x,p.y,line,shift,width].forEach(finite);if(width<=0)throw new RangeError('Genişlik pozitif');
 const d=shift*Math.exp(-Math.abs((axis==='x'?p.y:p.x)-line)/width);
 return axis==='x'?{x:p.x+d,y:p.y}:{x:p.x,y:p.y+d};
}
function seed(radius=65){finite(radius);if(radius<20||radius>90)throw new RangeError('Yarıçap 20–90');const a=[];for(let y=100;y<=300;y+=5)for(let x=200;x<=400;x+=5){const r=Math.hypot(x-300,y-200);if(r<=radius)a.push({x,y,color:r<radius/2?'#ffdc78':'#57cfe8'});}return a;}
function apply(points,s){return points.map(p=>({...stroke(p,s),color:p.color}));}
function displacement(before,after){if(!before.length||before.length!==after.length)throw new RangeError('Aynı izleyiciler gerekli');return before.reduce((v,p,i)=>v+Math.hypot(p.x-after[i].x,p.y-after[i].y),0)/before.length;}
const api={stroke,seed,apply,displacement};if(typeof module!=='undefined')module.exports=api;root.EbruModel=api;
})(typeof window==='undefined'?globalThis:window);
