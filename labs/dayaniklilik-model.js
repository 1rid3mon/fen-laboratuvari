(function(root){'use strict';const V=typeof module==='object'&&module.exports?require('./hacim-olcum-model.js'):root.VolumeExperiment;
function calculate(shape,d,fraction=.5){if(!Number.isFinite(fraction)||fraction<0||fraction>1)throw RangeError('Kesit 0–1');const v=V.calculate(shape,d),reference=shape==='sphere'?Math.PI*d.r*d.r:v.base,section=shape==='sphere'?reference*(1-(2*fraction-1)**2):reference;return{...v,reference,section,ratio:reference/v.volume,fraction};}
function compare(a,b){const c=V.compare(a,b);if(!c.controlled)return c;return{...c,ratioFactor:b.ratio/a.ratio,areaFactor:b.reference/a.reference,volumeFactor:b.volume/a.volume};}
const api={calculate,compare};if(typeof module==='object'&&module.exports)module.exports=api;else root.StrengthRatio=api;
})(typeof globalThis==='undefined'?this:globalThis);
