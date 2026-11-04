'use strict';
// Real browser input tests. Desktop WebKit/touch emulation are not a real iPad.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.argv[2]||'chromium';
const server=http.createServer((req,res)=>{const name=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!name.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(name,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(data);});});
async function main(){await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(process.env.DENSITY_CHROMIUM&&engine==='chromium'?{executablePath:process.env.DENSITY_CHROMIUM}:{})});
try{const ctx=await browser.newContext({viewport:{width:1194,height:834},hasTouch:true,deviceScaleFactor:1});const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(`http://127.0.0.1:${server.address().port}/labs/ozkutle-olcum.html`);
const content=id=>page.locator('#'+id).textContent();const click=id=>page.locator('#'+id).click();
await click('measure-mass');assert.match(await content('feedback'),/terazi/);assert.equal(await page.locator('#records tr').count(),0);
await page.selectOption('#prediction','double');await click('predict');
// Drag the actual sample to the balance, rather than relying on placement buttons.
await page.locator('#scene').scrollIntoViewIfNeeded();let box=await page.locator('#scene').boundingBox();const pt=(x,y)=>({x:box.x+x*box.width/940,y:box.y+y*box.height/490});
async function mouseDrag(from,to){await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:18});await page.mouse.up();}
await mouseDrag(pt(160,315),pt(400,315));await click('measure-mass');assert.match(await content('measurements'),/162 g/);
await click('partial');await click('measure-volume');assert.match(await content('feedback'),/yalnız batmış/);await click('record');assert.equal(await page.locator('#records tr').count(),0);
await click('to-water');await click('measure-volume');assert.match(await content('measurements'),/60 cm³/);await click('record');assert.equal(await page.locator('#records tr').count(),1);
async function range(id,value){await page.locator('#'+id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);}
await range('volume',120);await click('to-balance');await click('measure-mass');await click('to-water');await click('measure-volume');await click('record');await click('compare');assert.match(await content('comparison'),/m oranı 2/);assert.match(await content('comparison'),/Tahminini düzelt/);assert.equal(await page.locator('#mass-graph circle').count(),2);assert.equal(await page.locator('#density-graph circle').count(),2);
await page.selectOption('#density-axis','mass');assert.match(await page.locator('#density-graph').textContent(),/m \(g\)/);
// Changed water invalidates the old volume reading; a different sample invalidates both.
await click('to-balance');await click('measure-mass');await range('water',100);await click('record');assert.match(await content('feedback'),/hem kütlesini/);
await range('volume',150);await click('to-water');await click('measure-volume');assert.match(await content('feedback'),/Kısmen batırmada/);await range('water',250);await click('to-water');await click('measure-volume');assert.match(await content('measurements'),/150 cm³/);
// A screen-space pointer cancellation must release capture and leave the lab usable.
await click('to-bench');await page.locator('#scene').scrollIntoViewIfNeeded();box=await page.locator('#scene').boundingBox();const start=pt(160,300);await page.mouse.move(start.x,start.y);await page.mouse.down();await page.locator('#scene').dispatchEvent('pointercancel',{pointerId:1,pointerType:'mouse'});await page.mouse.up();await click('to-balance');await click('measure-mass');assert.match(await content('measurements'),/405 g/);
if(engine==='chromium'){
 await click('to-bench');await range('volume',60);await page.locator('#scene').scrollIntoViewIfNeeded();box=await page.locator('#scene').boundingBox();const a=pt(160,315),b=pt(400,315),cdp=await ctx.newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:a.x,y:a.y}]});
 // Second touch must not steal the active sample or leave stale drag state.
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:a.x,y:a.y},{id:2,x:a.x+80,y:a.y+60}]});
 for(let k=1;k<=12;k++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:a.x+(b.x-a.x)*k/12,y:a.y},{id:2,x:a.x+80,y:a.y+60}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await click('measure-mass');assert.match(await content('measurements'),/162 g/);
}
await page.locator('input[name=quiz][value=b]').check();await click('quiz-check');assert.match(await content('quiz-feedback'),/Kütle doğru, özkütle yanlış/);await page.locator('input[name=quiz][value=a]').check();await click('quiz-check');assert.match(await content('quiz-feedback'),/Doğru/);
const downloadEvent=page.waitForEvent('download');await click('download');const download=await downloadEvent;assert.equal(download.suggestedFilename(),'ozkutle-deney-kaydi.csv');const stream=await download.createReadStream();let csv='';for await(const chunk of stream)csv+=chunk.toString();assert.match(csv,/Alüminyum,162,150,210,60,2.7/);
for(const viewport of [{width:1194,height:834},{width:834,height:1194}]){await page.setViewportSize(viewport);await page.evaluate(()=>scrollTo(0,0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.ok(await page.locator('#to-balance').evaluate(el=>el.getBoundingClientRect().height>=44));fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await page.screenshot({path:path.join(root,'test-results',engine+'-'+viewport.width+'.png'),fullPage:true});}
assert.deepEqual(errors,[]);await click('clear-records');assert.equal(await page.locator('#records tr').count(),0);console.log(engine+': drag, measurement guards, conservation, hypothesis comparison, graphs, quiz, CSV, pointer cancellation and orientation passed. Real iPad not tested.');await ctx.close();
}finally{await browser.close();}}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
